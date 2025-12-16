-- Add payment tracking fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS has_paid BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ;

-- Create index for faster payment status checks
CREATE INDEX IF NOT EXISTS idx_users_has_paid ON users(has_paid);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Update RLS policies (existing policies should still work)
-- No changes needed to RLS since payment fields are part of user's own data
