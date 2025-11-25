-- Migration script for redesigned metrics system
-- Run this script to update your database schema

-- Step 1: Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Step 2: Add new columns to metrics table
ALTER TABLE metrics
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS optimal_value NUMERIC,
  ADD COLUMN IF NOT EXISTS minimum_value NUMERIC,
  ADD COLUMN IF NOT EXISTS operator TEXT CHECK (operator IN ('at_least', 'at_most', 'exactly'));

-- Step 3: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(user_id, display_order);
CREATE INDEX IF NOT EXISTS idx_metrics_category_id ON metrics(category_id);
CREATE INDEX IF NOT EXISTS idx_metrics_type ON metrics(user_id, type);

-- Step 4: Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies for categories
CREATE POLICY "Users can view their own categories"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

-- Step 6: Create function to update updated_at timestamp for categories
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for categories updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- Migration complete!
-- Notes:
-- - Boolean metrics (habits) will have type='boolean' and category_id=NULL
-- - Numeric metrics will have type='numeric' and category_id pointing to a category
-- - optimal_value, minimum_value, and operator are optional for numeric metrics
