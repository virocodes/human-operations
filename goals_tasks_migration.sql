-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('metric_based', 'subgoal_based')),
  target_date DATE,

  -- For metric-based goals
  metric_id UUID REFERENCES metrics(id) ON DELETE SET NULL,
  target_value NUMERIC,
  initial_value NUMERIC,

  -- Status
  is_archived BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Subgoals table (for subgoal-based goals)
CREATE TABLE IF NOT EXISTS subgoals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tasks table (for timetable)
-- Tasks are recurring daily time blocks, not tied to a specific date
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  -- Optional link to a habit
  habit_id UUID REFERENCES metrics(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- RLS Policies for goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for subgoals
ALTER TABLE subgoals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view subgoals of their goals"
  ON subgoals FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = subgoals.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert subgoals for their goals"
  ON subgoals FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = subgoals.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can update subgoals of their goals"
  ON subgoals FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = subgoals.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete subgoals of their goals"
  ON subgoals FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = subgoals.goal_id
    AND goals.user_id = auth.uid()
  ));

-- RLS Policies for tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_metric_id ON goals(metric_id);
CREATE INDEX idx_goals_archived ON goals(is_archived);
CREATE INDEX idx_subgoals_goal_id ON subgoals(goal_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_habit_id ON tasks(habit_id);
