import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Generate license key in format: DDGG-XXXX-XXXX-XXXX
function generateLicenseKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0,O,1,I)
  const segments = [];
  
  for (let i = 0; i < 3; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  
  return `DDGG-${segments.join('-')}`;
}

// Verify Paddle webhook signature
function verifyPaddleSignature(body, signature, secret) {
  if (!secret) return true; // Skip verification if no secret set
  
  const pairs = signature.split(';');
  const signatureMap = {};
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    signatureMap[key] = value;
  });
  
  const ts = signatureMap['ts'];
  const v1 = signatureMap['v1'];
  
  if (!ts || !v1) return false;
  
  const signedPayload = `${ts}:${body}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(signedPayload);
  const expectedSignature = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(v1, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['paddle-signature'];
    
    // Verify webhook signature if secret is set
    if (process.env.PADDLE_WEBHOOK_SECRET && signature) {
      const isValid = verifyPaddleSignature(rawBody, signature, process.env.PADDLE_WEBHOOK_SECRET);
      if (!isValid) {
        console.error('Invalid Paddle signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const event = req.body;
    
    // Log event for debugging
    console.log('Paddle webhook event:', event.event_type);

    // Handle transaction.completed event
    if (event.event_type === 'transaction.completed') {
      const transaction = event.data;
      const email = transaction.customer?.email || transaction.checkout?.email;
      const orderId = transaction.id;
      const productId = transaction.items?.[0]?.price?.product_id;
      
      if (!email) {
        console.error('No email in transaction');
        return res.status(400).json({ error: 'No email found' });
      }

      // Check if license already exists for this order
      const { data: existingLicense } = await supabase
        .from('license_keys')
        .select('license_key')
        .eq('paddle_order_id', orderId)
        .single();

      if (existingLicense) {
        console.log('License already exists for order:', orderId);
        return res.status(200).json({ 
          success: true, 
          license_key: existingLicense.license_key 
        });
      }

      // Generate unique license key
      let licenseKey;
      let isUnique = false;
      let attempts = 0;
      
      while (!isUnique && attempts < 10) {
        licenseKey = generateLicenseKey();
        const { data } = await supabase
          .from('license_keys')
          .select('id')
          .eq('license_key', licenseKey)
          .single();
        
        if (!data) isUnique = true;
        attempts++;
      }

      if (!isUnique) {
        console.error('Failed to generate unique license key');
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

      console.log('License created:', licenseKey, 'for email:', email);

      // TODO: Send email with license key
      // For now, Paddle will send receipt email
      // You can add Resend/SendGrid integration here

      return res.status(200).json({ 
        success: true, 
        license_key: licenseKey 
      });
    }

    // Handle other events
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
