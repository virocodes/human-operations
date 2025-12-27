// Draft mode type definitions

export interface GoalDetail {
  goal: string;
  details: string;
}

export interface Operation {
  id: string;
  name: string;
  description: string;
  linked_goals?: string[];
}

export interface Habit {
  id: string;
  name: string;
  linked_operation: string;
  reasoning?: string;
}

export interface Metric {
  id: string;
  name: string;
  unit: string;
  optimal_value: number | null;
  minimum_value: number | null;
  operator: string | null;
  linked_operation: string;
  reasoning?: string;
}

export interface Goal {
  id: string;
  operation_name?: string;
  operation_id?: string;
  title: string;
  goal_type: string;
  linked_metric_name?: string;
  target_value?: number;
  initial_value?: number;
  subgoals?: string[];
}

export interface DraftSystem {
  draftId: string; // UUID
  createdAt: string; // ISO timestamp
  expiresAt: string; // ISO timestamp (createdAt + 24 hours)
  stage: 'input' | 'goal-details' | 'loading' | 'review'; // current onboarding stage

  // Stage 1-2 data
  goals: string[];
  goalDetails: GoalDetail[];

  // Stage 3-4 data (after AI generation)
  operations: Operation[];
  generatedGoals: Goal[];
  habits: Habit[];
  metrics: Metric[];
  schedule: { wakeHour: number; sleepHour: number } | null;
}

export type Stage = 'input' | 'goal-details' | 'loading' | 'review';
