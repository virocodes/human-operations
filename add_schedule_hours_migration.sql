-- Add wake_hour and sleep_hour to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS wake_hour INTEGER DEFAULT 6 CHECK (wake_hour >= 0 AND wake_hour < 24),
  ADD COLUMN IF NOT EXISTS sleep_hour INTEGER DEFAULT 23 CHECK (sleep_hour >= 0 AND sleep_hour < 24);
