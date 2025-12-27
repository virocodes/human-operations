-- Migration: Add tour completion tracking
-- Run this in Supabase SQL Editor

-- Add tour_completed field
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS tour_completed BOOLEAN DEFAULT FALSE;

-- Index for efficient querying
CREATE INDEX IF NOT EXISTS idx_users_tour_completed ON users(tour_completed);

-- Mark existing paid users as having completed tour
UPDATE users
SET tour_completed = TRUE
WHERE has_paid = TRUE;

-- Optional: Mark users who exceeded trial as tour completed (for migration)
UPDATE users
SET tour_completed = TRUE
WHERE trial_actions_count >= 5;
