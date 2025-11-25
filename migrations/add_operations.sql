-- Create operations table
CREATE TABLE IF NOT EXISTS operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    notes TEXT,
    metric_id UUID REFERENCES metrics(id) ON DELETE SET NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for operations and habits (many-to-many)
CREATE TABLE IF NOT EXISTS operation_habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_id UUID NOT NULL REFERENCES operations(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES metrics(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(operation_id, habit_id)
);

-- Add operation_id to goals table
ALTER TABLE goals ADD COLUMN IF NOT EXISTS operation_id UUID REFERENCES operations(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_operations_user_id ON operations(user_id);
CREATE INDEX IF NOT EXISTS idx_operations_metric_id ON operations(metric_id);
CREATE INDEX IF NOT EXISTS idx_operations_archived ON operations(is_archived);
CREATE INDEX IF NOT EXISTS idx_operation_habits_operation_id ON operation_habits(operation_id);
CREATE INDEX IF NOT EXISTS idx_operation_habits_habit_id ON operation_habits(habit_id);
CREATE INDEX IF NOT EXISTS idx_goals_operation_id ON goals(operation_id);

-- Enable Row Level Security
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE operation_habits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for operations
CREATE POLICY "Users can view their own operations"
    ON operations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own operations"
    ON operations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own operations"
    ON operations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own operations"
    ON operations FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for operation_habits
CREATE POLICY "Users can view operation_habits for their operations"
    ON operation_habits FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM operations
            WHERE operations.id = operation_habits.operation_id
            AND operations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert operation_habits for their operations"
    ON operation_habits FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM operations
            WHERE operations.id = operation_habits.operation_id
            AND operations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete operation_habits for their operations"
    ON operation_habits FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM operations
            WHERE operations.id = operation_habits.operation_id
            AND operations.user_id = auth.uid()
        )
    );
