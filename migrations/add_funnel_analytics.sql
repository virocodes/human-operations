-- Migration: Add funnel_analytics table for conversion tracking
-- Run this in Supabase SQL Editor

CREATE TABLE funnel_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for anonymous events
  draft_id UUID, -- Links draft events to eventual user
  event_type TEXT NOT NULL CHECK (event_type IN (
    'landing_cta_clicked',
    'onboarding_started',
    'onboarding_stage_completed',
    'system_generated_viewed',
    'auth_started',
    'auth_completed',
    'draft_claimed',
    'trial_step_completed',
    'paywall_shown',
    'purchase_completed'
  )),
  event_data JSONB, -- Additional context (stage_name, source, trigger_reason, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX idx_funnel_analytics_user_id ON funnel_analytics(user_id);
CREATE INDEX idx_funnel_analytics_draft_id ON funnel_analytics(draft_id);
CREATE INDEX idx_funnel_analytics_event_type ON funnel_analytics(event_type);
CREATE INDEX idx_funnel_analytics_created_at ON funnel_analytics(created_at);

-- No RLS needed - analytics table accessible to admin only
