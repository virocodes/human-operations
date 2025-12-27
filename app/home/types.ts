export type MetricType = "boolean" | "numeric";
export type Operator = "at_least" | "at_most" | "exactly";
export type GoalType = "metric_based" | "subgoal_based";

export interface Category {
  id: string;
  name: string;
  display_order: number;
}

export interface Metric {
  id: string;
  name: string;
  type: MetricType;
  unit?: string | null;
  display_order: number;
  category_id?: string | null;
  optimal_value?: number | null;
  minimum_value?: number | null;
  operator?: Operator | null;
}

export interface DailyEntry {
  id: string;
  date: string;
  metric_id: string;
  value_boolean: boolean | null;
  value_numeric: number | null;
}

export interface Subgoal {
  id: string;
  goal_id: string;
  title: string;
  is_completed: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  goal_type: GoalType;
  target_date?: string | null;
  metric_id?: string | null;
  target_value?: number | null;
  initial_value?: number | null;
  operation_id?: string | null;
  is_archived: boolean;
  created_at?: string;
  updated_at?: string;
  subgoals?: Subgoal[];
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  start_time: string;
  end_time: string;
  habit_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
  wake_hour?: number;
  sleep_hour?: number;
  stripe_customer_id?: string;
  has_paid?: boolean;
  payment_date?: string;
  tour_completed?: boolean;
  trial_actions_count?: number;
  trial_completed_at?: string;
  first_dashboard_visit_date?: string;
}

export interface Operation {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  notes?: string | null;
  metric_id?: string | null;
  is_archived: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  habit_ids?: string[];
}

export interface OperationHabit {
  id: string;
  operation_id: string;
  habit_id: string;
  created_at?: string;
}
