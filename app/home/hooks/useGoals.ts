import { useState } from 'react';
import { Goal, GoalType } from '../types';

interface UseGoalsProps {
  goals: Goal[];
  setGoals: (goals: Goal[] | ((prev: Goal[]) => Goal[])) => void;
}

export function useGoals({ goals, setGoals }: UseGoalsProps) {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalType, setGoalType] = useState<GoalType>("metric_based");
  const [goalTargetDate, setGoalTargetDate] = useState("");
  const [goalMetricId, setGoalMetricId] = useState("");
  const [goalTargetValue, setGoalTargetValue] = useState("");
  const [goalInitialValue, setGoalInitialValue] = useState("");
  const [goalOperationId, setGoalOperationId] = useState("");
  const [goalSubgoals, setGoalSubgoals] = useState<string[]>([""]);
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false);
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isArchivedGoalsDialogOpen, setIsArchivedGoalsDialogOpen] = useState(false);

  const resetGoalForm = () => {
    setGoalTitle("");
    setGoalDescription("");
    setGoalType("metric_based");
    setGoalTargetDate("");
    setGoalMetricId("");
    setGoalTargetValue("");
    setGoalInitialValue("");
    setGoalOperationId("");
    setGoalSubgoals([""]);
  };

  const addGoal = async () => {
    if (!goalTitle.trim()) return;

    const subgoalsToCreate = goalType === 'subgoal_based'
      ? goalSubgoals.filter(s => s.trim()).map(s => s.trim())
      : undefined;

    const tempGoal: Goal = {
      id: `temp-${Date.now()}`,
      user_id: '',
      title: goalTitle.trim(),
      description: goalDescription.trim() || undefined,
      goal_type: goalType,
      target_date: goalTargetDate || undefined,
      metric_id: goalType === 'metric_based' ? goalMetricId : undefined,
      target_value: goalType === 'metric_based' && goalTargetValue ? parseFloat(goalTargetValue) : undefined,
      initial_value: goalType === 'metric_based' && goalInitialValue ? parseFloat(goalInitialValue) : undefined,
      operation_id: goalOperationId || undefined,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subgoals: subgoalsToCreate?.map((text, idx) => ({
        id: `temp-subgoal-${idx}`,
        goal_id: `temp-${Date.now()}`,
        title: text,
        is_completed: false,
        display_order: idx,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })) || [],
    };

    setGoals([tempGoal, ...goals]);
    const title = goalTitle.trim();
    const description = goalDescription.trim() || null;
    const type = goalType;
    const targetDate = goalTargetDate || null;
    const metricId = goalType === 'metric_based' ? goalMetricId : null;
    const targetValue = goalType === 'metric_based' && goalTargetValue ? parseFloat(goalTargetValue) : null;
    const initialValue = goalType === 'metric_based' && goalInitialValue ? parseFloat(goalInitialValue) : null;
    const operationId = goalOperationId || null;
    resetGoalForm();
    setIsAddGoalDialogOpen(false);

    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        goal_type: type,
        target_date: targetDate,
        metric_id: metricId,
        target_value: targetValue,
        initial_value: initialValue,
        operation_id: operationId,
        subgoals: subgoalsToCreate,
      }),
    });

    if (response.ok) {
      const newGoal = await response.json();
      setGoals((prev: Goal[]) => prev.map(g => g.id === tempGoal.id ? newGoal : g));
    } else {
      setGoals((prev: Goal[]) => prev.filter(g => g.id !== tempGoal.id));
    }
  };

  const updateGoal = async () => {
    if (!editingGoal || !goalTitle.trim()) return;

    const subgoalsToUpdate = goalType === 'subgoal_based'
      ? goalSubgoals.filter(s => s.trim()).map(s => s.trim())
      : undefined;

    const previousGoals = goals;
    const updatedGoal: Goal = {
      ...editingGoal,
      title: goalTitle.trim(),
      description: goalDescription.trim() || undefined,
      target_date: goalTargetDate || undefined,
      metric_id: goalType === 'metric_based' ? goalMetricId : undefined,
      target_value: goalType === 'metric_based' && goalTargetValue ? parseFloat(goalTargetValue) : undefined,
      initial_value: goalType === 'metric_based' && goalInitialValue ? parseFloat(goalInitialValue) : undefined,
      operation_id: goalOperationId || undefined,
      updated_at: new Date().toISOString(),
    };
    setGoals(goals.map(g => g.id === editingGoal.id ? updatedGoal : g));
    resetGoalForm();
    setEditingGoal(null);
    setIsEditGoalDialogOpen(false);

    const response = await fetch('/api/goals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingGoal.id,
        title: goalTitle.trim(),
        description: goalDescription.trim() || null,
        target_date: goalTargetDate || null,
        metric_id: goalType === 'metric_based' ? goalMetricId : null,
        target_value: goalType === 'metric_based' && goalTargetValue ? parseFloat(goalTargetValue) : null,
        initial_value: goalType === 'metric_based' && goalInitialValue ? parseFloat(goalInitialValue) : null,
        operation_id: goalOperationId || null,
        subgoals: subgoalsToUpdate,
      }),
    });

    if (response.ok) {
      const updated = await response.json();
      setGoals((prev: Goal[]) => prev.map(g => g.id === updated.id ? updated : g));
    } else {
      setGoals(previousGoals);
    }
  };

  const toggleArchiveGoal = async (goalId: string, isArchived: boolean) => {
    const previousGoals = goals;
    setGoals(goals.map(g => g.id === goalId ? { ...g, is_archived: !isArchived } : g));

    const response = await fetch('/api/goals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: goalId,
        is_archived: !isArchived,
      }),
    });

    if (response.ok) {
      const updated = await response.json();
      setGoals((prev: Goal[]) => prev.map(g => g.id === updated.id ? updated : g));
    } else {
      setGoals(previousGoals);
    }
  };

  const deleteGoal = async (goalId: string) => {
    const previousGoals = goals;
    setGoals(goals.filter(g => g.id !== goalId));
    setIsEditGoalDialogOpen(false);

    const response = await fetch(`/api/goals?id=${goalId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setGoals(previousGoals);
    }
  };

  const toggleSubgoal = async (subgoalId: string, isCompleted: boolean) => {
    const previousGoals = goals;
    setGoals(goals.map(goal => {
      if (goal.subgoals?.some(s => s.id === subgoalId)) {
        return {
          ...goal,
          subgoals: goal.subgoals.map(s => s.id === subgoalId ? { ...s, is_completed: !isCompleted } : s),
        };
      }
      return goal;
    }));

    const response = await fetch('/api/subgoals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: subgoalId,
        is_completed: !isCompleted,
      }),
    });

    if (!response.ok) {
      setGoals(previousGoals);
    }
  };

  const openEditGoalDialog = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalDescription(goal.description || "");
    setGoalType(goal.goal_type);
    setGoalTargetDate(goal.target_date || "");
    setGoalMetricId(goal.metric_id || "");
    setGoalTargetValue(goal.target_value?.toString() || "");
    setGoalInitialValue(goal.initial_value?.toString() || "");
    setGoalOperationId(goal.operation_id || "");
    // Populate subgoals if it's a subgoal-based goal
    if (goal.goal_type === 'subgoal_based' && goal.subgoals && goal.subgoals.length > 0) {
      setGoalSubgoals(goal.subgoals.map(s => s.title));
    } else {
      setGoalSubgoals([""]);
    }
    setIsEditGoalDialogOpen(true);
  };

  return {
    goalTitle,
    setGoalTitle,
    goalDescription,
    setGoalDescription,
    goalType,
    setGoalType,
    goalTargetDate,
    setGoalTargetDate,
    goalMetricId,
    setGoalMetricId,
    goalTargetValue,
    setGoalTargetValue,
    goalInitialValue,
    setGoalInitialValue,
    goalOperationId,
    setGoalOperationId,
    goalSubgoals,
    setGoalSubgoals,
    isAddGoalDialogOpen,
    setIsAddGoalDialogOpen,
    isEditGoalDialogOpen,
    setIsEditGoalDialogOpen,
    editingGoal,
    isArchivedGoalsDialogOpen,
    setIsArchivedGoalsDialogOpen,
    resetGoalForm,
    addGoal,
    updateGoal,
    toggleArchiveGoal,
    deleteGoal,
    toggleSubgoal,
    openEditGoalDialog,
  };
}
