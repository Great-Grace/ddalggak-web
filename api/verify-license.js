import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { license_key, device_fingerprint } = req.body;

    if (!license_key) {
      return res.status(400).json({ 
        valid: false, 
        error: 'License key required' 
      });
    }

    // Look up license
    const { data: license, error } = await supabase
      .from('license_keys')
      .select('*')
      .eq('license_key', license_key)
      .single();

    if (error || !license) {
      return res.status(200).json({ 
        valid: false, 
        error: 'Invalid license key' 
      });
    }

    // If license not activated yet, activate it
    if (!license.activated) {
      const { error: updateError } = await supabase
        .from('license_keys')
        .update({
          activated: true,
          activated_at: new Date().toISOString(),
          device_fingerprint: device_fingerprint || null,
        })
        .eq('license_key', license_key);

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
    // Check if same device (optional - allows reactivation on same device)
    if (device_fingerprint && license.device_fingerprint === device_fingerprint) {
      return res.status(200).json({
        valid: true,
        activated: true,
        message: 'License valid for this device'
      });
    }

    // License activated on different device
    // Allow it (you can add device limit logic here if needed)
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
