import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Regex to validate license key format (DDGG-XXXX-XXXX-XXXX)
const LICENSE_KEY_REGEX = /^DDGG-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;

export default async function handler(req, res) {
  // CORS configuration
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://ddalggak-web.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Allow native applications (macOS/Android apps) that do not send an Origin header
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { license_key, device_fingerprint } = req.body || {};

    // 1. Validate license_key input
    if (!license_key || typeof license_key !== 'string') {
      return res.status(400).json({ 
        valid: false, 
        error: 'License key is required and must be a string' 
      });
    }

    const trimmedKey = license_key.trim().toUpperCase();
    if (!LICENSE_KEY_REGEX.test(trimmedKey)) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Invalid license key format' 
      });
    }

    // 2. Validate device_fingerprint input if provided
    let sanitizedFingerprint = null;
    if (device_fingerprint !== undefined && device_fingerprint !== null) {
      if (typeof device_fingerprint !== 'string') {
        return res.status(400).json({
          valid: false,
          error: 'Device fingerprint must be a string'
        });
      }
      sanitizedFingerprint = device_fingerprint.trim();
      if (sanitizedFingerprint.length === 0 || sanitizedFingerprint.length > 255) {
        return res.status(400).json({
          valid: false,
          error: 'Device fingerprint must be between 1 and 255 characters'
        });
      }
    }

    // Look up license in Supabase
    const { data: license, error } = await supabase
      .from('license_keys')
      .select('*')
      .eq('license_key', trimmedKey)
      .maybeSingle();

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ 
        valid: false, 
        error: 'Database query failed' 
      });
    }

    if (!license) {
      return res.status(200).json({ 
        valid: false, 
        error: 'Invalid license key' 
      });
    }

    // If license is not activated yet, activate it
    if (!license.activated) {
      const { error: updateError } = await supabase
        .from('license_keys')
        .update({
          activated: true,
          activated_at: new Date().toISOString(),
          device_fingerprint: sanitizedFingerprint,
          updated_at: new Date().toISOString(),
        })
        .eq('license_key', trimmedKey);

      if (updateError) {
        console.error('Failed to activate license:', updateError);
        return res.status(500).json({ 
          valid: false, 
          error: 'Activation failed' 
        });
      }

      return res.status(200).json({
        valid: true,
        activated: true,
        message: 'License activated successfully'
      });
    }

    // License already activated
    // If device_fingerprint matches, validate it
    if (sanitizedFingerprint && license.device_fingerprint === sanitizedFingerprint) {
      return res.status(200).json({
        valid: true,
        activated: true,
        message: 'License valid for this device'
      });
    }

    // If device_fingerprint does not match, return false or handle limit
    // Since this is a $1 lifetime app, we restrict to 1 active device at a time.
    // If they attempt to activate on a different device, we block it.
    if (sanitizedFingerprint && license.device_fingerprint && license.device_fingerprint !== sanitizedFingerprint) {
      return res.status(200).json({
        valid: false,
        error: 'License already activated on another device'
      });
    }

    // Fallback if no device fingerprint was passed or if device_fingerprint is null in DB
    return res.status(200).json({
      valid: true,
      activated: true,
      message: 'License valid'
    });

  } catch (error) {
    console.error('License verification error:', error);
    return res.status(500).json({ 
      valid: false, 
      error: 'Internal server error' 
    });
  }
}
