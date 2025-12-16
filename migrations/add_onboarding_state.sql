-- Onboarding state table to track user progress through onboarding
CREATE TABLE IF NOT EXISTS onboarding_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_phase TEXT NOT NULL,
  extracted_data JSONB,
  user_goals TEXT[],
  conversation_history JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- If table already exists, add user_goals column
ALTER TABLE onboarding_state
  ADD COLUMN IF NOT EXISTS user_goals TEXT[];

-- RLS Policies for onboarding_state
ALTER TABLE onboarding_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own onboarding state"
  ON onboarding_state FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own onboarding state"
  ON onboarding_state FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own onboarding state"
  ON onboarding_state FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own onboarding state"
  ON onboarding_state FOR DELETE
  USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_onboarding_state_user_id ON onboarding_state(user_id);
