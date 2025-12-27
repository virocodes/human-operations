-- Migration: Add trial tracking fields to users table
-- Run this in Supabase SQL Editor

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS trial_actions_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS trial_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS first_dashboard_visit_date DATE;

-- Indexes for efficient querying
CREATE INDEX idx_users_trial_actions ON users(trial_actions_count);
CREATE INDEX idx_users_first_visit ON users(first_dashboard_visit_date);

-- Update existing users to have trial_actions_count = 0 if NULL
UPDATE users SET trial_actions_count = 0 WHERE trial_actions_count IS NULL;
