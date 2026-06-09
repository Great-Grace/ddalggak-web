import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Disable Vercel's default body parser so we can access the exact raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Allowed product IDs (prevent fake product injection)
const ALLOWED_PRODUCT_IDS = [
  'pro_01ktn7wrb9r278s64e2r2vnqac',
];

// Generate license key in format: DDGG-XXXX-XXXX-XXXX (cryptographically secure)
function generateLicenseKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = [];

  for (let i = 0; i < 3; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(crypto.randomInt(chars.length));
    }
    segments.push(segment);
  }

  return `DDGG-${segments.join('-')}`;
}

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Verify Paddle webhook signature (MANDATORY)
function verifyPaddleSignature(rawBody, signature, secret) {
  if (!secret) {
    console.error('PADDLE_WEBHOOK_SECRET is not configured');
    return false;
  }

  if (!signature) {
    console.error('Missing paddle-signature header');
    return false;
  }

  const pairs = signature.split(';');
  const signatureMap = {};

  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key && value) signatureMap[key] = value;
  });

  const ts = signatureMap['ts'];
  const v1 = signatureMap['h1'];

  if (!ts || !v1) {
    console.error('Invalid signature format: missing ts or h1');
    return false;
  }

  // Reject requests older than 5 minutes (replay protection)
  const timestampAge = Math.abs(Date.now() / 1000 - parseInt(ts, 10));
  if (timestampAge > 300) {
    console.error('Webhook timestamp too old:', timestampAge, 'seconds');
    return false;
  }

  const signedPayload = `${ts}:${rawBody}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(signedPayload);
  const expectedSignature = hmac.digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(v1, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (err) {
    console.error('Signature comparison error:', err.message);
    return false;
  }
}

// Read raw body stream from Vercel request
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['paddle-signature'];

    // MANDATORY signature verification
    const isValid = verifyPaddleSignature(
      rawBody,
      signature,
      process.env.PADDLE_WEBHOOK_SECRET
    );

    if (!isValid) {
      console.error('Webhook signature verification failed');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch (e) {
      console.error('Failed to parse webhook JSON body:', e.message);
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    // Log event for debugging
    console.log('Paddle webhook event:', event.event_type, 'id:', event.event_id);

    // Handle transaction.completed event
    if (event.event_type === 'transaction.completed') {
      const transaction = event.data;
      const email = transaction.customer?.email || transaction.checkout?.email;
      const orderId = transaction.id;
      const productId = transaction.items?.[0]?.price?.product_id;

      // Validate product ID
      if (!ALLOWED_PRODUCT_IDS.includes(productId)) {
        console.error('Unknown product ID:', productId);
        return res.status(400).json({ error: 'Unknown product' });
      }

      // Validate email
      if (!email || !isValidEmail(email)) {
        console.error('Invalid or missing email:', email);
        return res.status(400).json({ error: 'Invalid email' });
      }

      // Validate order ID format
      if (!orderId || typeof orderId !== 'string' || orderId.length < 5) {
        console.error('Invalid order ID:', orderId);
        return res.status(400).json({ error: 'Invalid order ID' });
      }

      // Check if license already exists for this order (idempotency)
      const { data: existingLicense } = await supabase
        .from('license_keys')
        .select('license_key')
        .eq('paddle_order_id', orderId)
        .maybeSingle();

      if (existingLicense) {
        console.log('License already exists for order:', orderId);
        return res.status(200).json({
          success: true,
          license_key: existingLicense.license_key
        });
      }

      // Generate unique license key (cryptographically secure)
      let licenseKey;
      let isUnique = false;
      let attempts = 0;

      while (!isUnique && attempts < 10) {
        licenseKey = generateLicenseKey();
        const { data } = await supabase
          .from('license_keys')
          .select('id')
          .eq('license_key', licenseKey)
          .maybeSingle();

        if (!data) isUnique = true;
        attempts++;
      }

      if (!isUnique) {
        console.error('Failed to generate unique license key after', attempts, 'attempts');
        return res.status(500).json({ error: 'Failed to generate license key' });
      }

      // Save license to database
      const { error: insertError } = await supabase
        .from('license_keys')
        .insert({
          license_key: licenseKey,
          email: email,
          paddle_order_id: orderId,
          paddle_product_id: productId,
          paddle_price_id: transaction.items?.[0]?.price?.id,
        });

      if (insertError) {
        console.error('Failed to save license:', insertError);
        return res.status(500).json({ error: 'Failed to save license' });
      }

      console.log('License created:', licenseKey, 'for email:', email, 'order:', orderId);

      return res.status(200).json({
        success: true,
        license_key: licenseKey
      });
    }

    // Handle other events (acknowledge receipt)
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
