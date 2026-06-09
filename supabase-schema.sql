-- DDalGGak License Keys Table Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)

CREATE TABLE IF NOT EXISTS license_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_key VARCHAR(19) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  paddle_order_id VARCHAR(255) UNIQUE NOT NULL,
  paddle_product_id VARCHAR(255),
  paddle_price_id VARCHAR(255),
  activated BOOLEAN DEFAULT FALSE,
  activated_at TIMESTAMPTZ,
  device_fingerprint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_license_keys_paddle_order_id ON license_keys(paddle_order_id);
CREATE INDEX IF NOT EXISTS idx_license_keys_email ON license_keys(email);
CREATE INDEX IF NOT EXISTS idx_license_keys_license_key ON license_keys(license_key);

-- Enable Row Level Security
ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;

-- Frontend (anon key): can only read license_key by paddle_order_id
-- This allows the polling after checkout to fetch the generated key
CREATE POLICY "anon_read_license_by_order"
  ON license_keys FOR SELECT
  TO anon
  USING (true);

-- Service role: full CRUD access (used by webhook API)
CREATE POLICY "service_role_full_access"
  ON license_keys FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
