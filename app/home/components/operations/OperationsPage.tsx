"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, CheckSquare, X, Edit2, Archive, Target } from "lucide-react";
import { Task, Todo, Metric, Operation, DailyEntry, Goal, GoalType } from "../../types";
import { formatDate, getLast7Days } from "../../utils/formatters";

interface OperationsPageProps {
  goals: Goal[];
  trackedMetrics: Metric[];
  entries: DailyEntry[];
  operations: Operation[];
  setOperations: (operations: Operation[] | ((prev: Operation[]) => Operation[])) => void;
  goalsHook: {
    goalTitle: string;
    setGoalTitle: (value: string) => void;
    goalDescription: string;
    setGoalDescription: (value: string) => void;
    goalType: GoalType;
    setGoalType: (value: GoalType) => void;
    goalTargetDate: string;
    setGoalTargetDate: (value: string) => void;
    goalMetricId: string;
    setGoalMetricId: (value: string) => void;
    goalTargetValue: string;
    setGoalTargetValue: (value: string) => void;
    goalInitialValue: string;
    setGoalInitialValue: (value: string) => void;
    goalOperationId: string;
    setGoalOperationId: (value: string) => void;
    goalSubgoals: string[];
    setGoalSubgoals: (value: string[]) => void;
    isAddGoalDialogOpen: boolean;
    setIsAddGoalDialogOpen: (value: boolean) => void;
    isEditGoalDialogOpen: boolean;
    setIsEditGoalDialogOpen: (value: boolean) => void;
    editingGoal: Goal | null;
    isArchivedGoalsDialogOpen: boolean;
    setIsArchivedGoalsDialogOpen: (value: boolean) => void;
    addGoal: () => void;
    updateGoal: () => void;
    toggleArchiveGoal: (goalId: string, isArchived: boolean) => void;
    deleteGoal: (goalId: string) => void;
    toggleSubgoal: (subgoalId: string, isCompleted: boolean) => void;
    openEditGoalDialog: (goal: Goal) => void;
  };
  operationsHook: {
    operationTitle: string;
    setOperationTitle: (title: string) => void;
    operationDescription: string;
    setOperationDescription: (description: string) => void;
    operationNotes: string;
    setOperationNotes: (notes: string) => void;
    operationMetricId: string;
    setOperationMetricId: (id: string) => void;
    operationHabitIds: string[];
    setOperationHabitIds: (ids: string[]) => void;
    isAddOperationDialogOpen: boolean;
    setIsAddOperationDialogOpen: (open: boolean) => void;
    isEditOperationDialogOpen: boolean;
    setIsEditOperationDialogOpen: (open: boolean) => void;
    editingOperation: Operation | null;
    expandedNotes: string | null;
    resetOperationForm: () => void;
    addOperation: () => Promise<void>;
    updateOperation: () => Promise<void>;
    toggleArchiveOperation: (id: string, isArchived: boolean) => Promise<void>;
    deleteOperation: (id: string) => Promise<void>;
    openEditOperationDialog: (operation: Operation) => void;
    toggleNotes: (id: string) => void;
  };
  habits: Metric[];
}

export function OperationsPage({
  goals,
  trackedMetrics,
  entries,
  operations,
  setOperations,
  goalsHook,
  operationsHook,
  habits,
}: OperationsPageProps) {
  const {
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
    addGoal,
    updateGoal,
    toggleArchiveGoal,
    deleteGoal,
    toggleSubgoal,
    openEditGoalDialog,
  } = goalsHook;
  const {
    operationTitle,
    setOperationTitle,
    operationDescription,
    setOperationDescription,
    operationNotes,
    setOperationNotes,
    operationMetricId,
    setOperationMetricId,
    operationHabitIds,
    setOperationHabitIds,
    isAddOperationDialogOpen,
    setIsAddOperationDialogOpen,
    isEditOperationDialogOpen,
    setIsEditOperationDialogOpen,
    editingOperation,
    expandedNotes,
    resetOperationForm,
    addOperation,
    updateOperation,
    deleteOperation,
    openEditOperationDialog,
    toggleNotes,
  } = operationsHook;

  // Operation viewing state
  const [viewingOperation, setViewingOperation] = useState<Operation | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingMetric, setIsEditingMetric] = useState(false);
  const [isEditingHabits, setIsEditingHabits] = useState(false);

  // Auto-save timer for notes
  const notesAutoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  // Save operation from viewing context
  const saveViewingOperation = useCallback(async (updateViewingOp: boolean = true) => {
    if (!viewingOperation) return;

    const response = await fetch('/api/operations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: viewingOperation.id,
        title: operationTitle.trim(),
        description: operationDescription.trim() || null,
        notes: operationNotes.trim() || null,
        metric_id: operationMetricId || null,
        habit_ids: operationHabitIds.length > 0 ? operationHabitIds : null,
        is_archived: viewingOperation.is_archived,
      }),
    });

    if (response.ok) {
      const updated = await response.json();
      setOperations((prev: Operation[]) => prev.map(o => o.id === updated.id ? updated : o));
      // Only update viewingOperation if requested
      if (updateViewingOp) {
        setViewingOperation(updated);
      }
    }
  }, [viewingOperation, operationTitle, operationDescription, operationNotes, operationMetricId, operationHabitIds, setOperations]);

  // Auto-save notes after user stops typing
  useEffect(() => {
    if (viewingOperation && operationNotes !== (viewingOperation.notes || "")) {
      // Clear existing timer
      if (notesAutoSaveTimer.current) {
        clearTimeout(notesAutoSaveTimer.current);
      }

      // Set new timer to save after 1 second of no typing
      notesAutoSaveTimer.current = setTimeout(async () => {
        await saveViewingOperation();
      }, 1000);
    }

    // Cleanup on unmount
    return () => {
      if (notesAutoSaveTimer.current) {
        clearTimeout(notesAutoSaveTimer.current);
      }
    };
  }, [operationNotes, viewingOperation, saveViewingOperation]);

  // Operation handlers
  const handleAddOperation = async () => {
    await addOperation();
  };

  const handleUpdateOperation = async () => {
    await updateOperation();
  };

  const handleSaveViewingOperation = async () => {
    await saveViewingOperation();
  };

  const handleToggleHabit = (habitId: string) => {
    if (operationHabitIds.includes(habitId)) {
      setOperationHabitIds(operationHabitIds.filter(id => id !== habitId));
    } else {
      setOperationHabitIds([...operationHabitIds, habitId]);
    }
  };

  // Helper function to get current value for a metric-based goal
  const getCurrentGoalValue = (goal: Goal): number | null => {
    if (goal.goal_type !== 'metric_based' || !goal.metric_id) return null;

    const metricEntries = entries
      .filter(e => e.metric_id === goal.metric_id && e.value_numeric !== null)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (metricEntries.length > 0) {
      return metricEntries[0].value_numeric;
    }

    return goal.initial_value ?? null;
  };

  // Helper function to calculate goal progress
  const calculateGoalProgress = (goal: Goal) => {
    if (goal.goal_type === 'subgoal_based' && goal.subgoals) {
      const completed = goal.subgoals.filter(s => s.is_completed).length;
      const total = goal.subgoals.length;
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    } else if (goal.goal_type === 'metric_based' && goal.metric_id && goal.target_value !== null && goal.target_value !== undefined && goal.initial_value !== null && goal.initial_value !== undefined) {
      const metricEntries = entries
        .filter(e => e.metric_id === goal.metric_id && e.value_numeric !== null)
        .sort((a, b) => b.date.localeCompare(a.date));

      if (metricEntries.length > 0) {
        const currentValue = metricEntries[0].value_numeric ?? goal.initial_value;
        const totalChange = goal.target_value - goal.initial_value;
        const currentChange = currentValue - goal.initial_value;

        if (totalChange === 0) return 100;

        const progress = Math.round((currentChange / totalChange) * 100);
        return Math.max(0, Math.min(progress, 100));
      }

      return 0;
    }
    return 0;
  };

  // Helper to get most recent value for a metric
  const getMostRecentMetricValue = (metricId: string): string | null => {
    const metricEntries = entries
      .filter(e => e.metric_id === metricId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (metricEntries.length === 0) return null;

    const latestEntry = metricEntries[0];
    const metric = trackedMetrics.find(m => m.id === metricId);

    if (!metric) return null;

    if (metric.type === 'boolean') {
      return latestEntry.value_boolean ? 'Yes' : 'No';
    } else {
      const value = latestEntry.value_numeric;
      if (value === null) return null;
      return metric.unit ? `${value} ${metric.unit}` : `${value}`;
    }
  };

  // Helper to get habit completion count for past week
  const getHabitWeeklyCount = (habitId: string): number => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const weeklyEntries = entries.filter(e => {
      if (e.metric_id !== habitId) return false;
      const entryDate = new Date(e.date);
      return entryDate >= weekAgo && entryDate <= today && e.value_boolean === true;
    });

    return weeklyEntries.length;
  };

  const activeOperations = operations.filter(op => !op.is_archived);

  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        {/* Left: Goals Section */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-serif font-medium text-foreground">Goals</h3>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide mt-1">Track Your Objectives</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsArchivedGoalsDialogOpen(true)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Archive className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsAddGoalDialogOpen(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
          </div>

          {(() => {
            const visibleGoals = goals.filter(g => !g.is_archived);

            if (visibleGoals.length === 0) {
              return (
                <div className="bg-card border border-border shadow-sm p-6 relative overflow-hidden mt-6">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                  <p className="text-sm text-muted-foreground font-light text-center py-12">No goals yet. Create your first goal to get started.</p>
                </div>
              );
            }

            return (
              <div className="space-y-4 mt-6 max-h-[600px] overflow-y-auto pr-2">
                {visibleGoals.map(goal => {
                  const progress = calculateGoalProgress(goal);
                  const metric = goal.metric_id ? trackedMetrics.find(m => m.id === goal.metric_id) : null;
                  const currentValue = getCurrentGoalValue(goal);

                  return (
                    <div key={goal.id} className="bg-card border border-border shadow-sm p-6 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-150" onClick={() => openEditGoalDialog(goal)}>
                      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>

                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-base font-mono uppercase tracking-wider text-foreground">{goal.title}</h4>
                          {goal.description && <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>}
                          {goal.target_date && (
                            <p className="text-xs font-mono text-muted-foreground mt-1">Target: {new Date(goal.target_date).toLocaleDateString()}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-mono font-bold text-foreground">{progress}%</div>
                          <div className="text-xs font-mono text-muted-foreground uppercase">Complete</div>
                        </div>
                      </div>

                      {goal.goal_type === 'metric_based' && metric && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs font-mono text-muted-foreground">
                            Metric: {metric.name} • Current: {currentValue !== null ? `${currentValue} ${metric.unit}` : 'No data'} • Target: {goal.target_value} {metric.unit}
                          </p>
                        </div>
                      )}

                      {goal.goal_type === 'subgoal_based' && goal.subgoals && goal.subgoals.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border space-y-2" onClick={(e) => e.stopPropagation()}>
                          {goal.subgoals.map(subgoal => (
                            <div key={subgoal.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={subgoal.is_completed}
                                onChange={() => toggleSubgoal(subgoal.id, subgoal.is_completed)}
                                className="h-4 w-4 rounded border-border text-gray-900 dark:text-[#e5e5e5] focus:ring-gray-900 cursor-pointer"
                              />
                              <span className={`text-sm ${subgoal.is_completed ? 'line-through text-gray-400 dark:text-[#909090]' : 'text-foreground'}`}>
                                {subgoal.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground uppercase">{goal.goal_type === 'metric_based' ? 'Metric-Based' : 'Subgoal-Based'}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleArchiveGoal(goal.id, goal.is_archived);
                          }}
                          className="font-mono text-xs"
                        >
                          {goal.is_archived ? 'Unarchive' : 'Archive'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Right: Operations Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-serif font-medium text-foreground">Operations</h3>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">System Management</p>
            </div>
            <Button
              onClick={() => setIsAddOperationDialogOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {activeOperations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Archive className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <p className="text-sm text-muted-foreground font-mono">No operations yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Click "New" to create your first operation</p>
              </div>
            ) : (
              activeOperations.map((operation) => {
                const metric = trackedMetrics.find(m => m.id === operation.metric_id);
                const linkedHabits = habits.filter(h => operation.habit_ids?.includes(h.id));
                const linkedGoals = goals.filter(g => g.operation_id === operation.id && !g.is_archived);
                const last7Days = getLast7Days();

                return (
                  <div
                    key={operation.id}
                    className="bg-card border border-border shadow-sm p-6 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-150"
                    onClick={() => {
                      setViewingOperation(operation);
                      setOperationTitle(operation.title);
                      setOperationDescription(operation.description || "");
                      setOperationNotes(operation.notes || "");
                      setOperationMetricId(operation.metric_id || "");
                      setOperationHabitIds(operation.habit_ids || []);
                    }}
                  >
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>

                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-base font-mono uppercase tracking-wider text-foreground">{operation.title}</h4>
                        {operation.description && <p className="text-sm text-muted-foreground mt-1">{operation.description}</p>}
                      </div>
                    </div>

                    {/* Metric Section */}
                    {metric && (
                      <div className="mb-3 pb-3 border-b border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                            {metric.name}
                          </span>
                          <span className="text-sm font-mono font-bold text-foreground">
                            {(() => {
                              const recentValue = getMostRecentMetricValue(metric.id);
                              return recentValue || 'No data';
                            })()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Habits Section with Mini Charts */}
                    {linkedHabits.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {linkedHabits.map(habit => {
                          const habitEntries = last7Days.map(day => {
                            const dateStr = formatDate(day);
                            const entry = entries.find(e => e.metric_id === habit.id && e.date === dateStr);
                            return entry?.value_boolean === true;
                          });
                          const completedCount = habitEntries.filter(Boolean).length;

                          return (
                            <div key={habit.id} className="flex items-center justify-between gap-3">
                              <span className="text-xs font-mono text-muted-foreground flex-shrink-0">
                                {habit.name}
                              </span>
                              <div className="flex items-center gap-1">
                                {habitEntries.map((completed, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-5 h-5 border border-border transition-colors ${
                                      completed
                                        ? 'bg-gray-900 dark:bg-white'
                                        : 'bg-transparent'
                                    }`}
                                    title={formatDate(last7Days[idx])}
                                  />
                                ))}
                                <span className="text-xs font-mono text-muted-foreground ml-2 flex-shrink-0">
                                  {completedCount}/7
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Linked Goals Section */}
                    {linkedGoals.length > 0 && (
                      <div className={`space-y-2 ${linkedHabits.length > 0 ? 'pt-3 border-t border-border' : ''}`}>
                        {linkedGoals.map(goal => {
                          const progress = calculateGoalProgress(goal);
                          const goalMetric = goal.metric_id ? trackedMetrics.find(m => m.id === goal.metric_id) : null;
                          const currentValue = getCurrentGoalValue(goal);

                          return (
                            <div
                              key={goal.id}
                              className="bg-muted/50 border border-border p-3 relative overflow-hidden hover:bg-muted transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditGoalDialog(goal);
                              }}
                            >
                              {/* Mini corner brackets */}
                              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-900 dark:border-[#e5e5e5]"></div>
                              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-900 dark:border-[#e5e5e5]"></div>
                              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-900 dark:border-[#e5e5e5]"></div>
                              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-900 dark:border-[#e5e5e5]"></div>

                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <Target className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                    <h5 className="text-xs font-mono text-foreground truncate">
                                      {goal.title}
                                    </h5>
                                  </div>
                                  {goal.target_date && (
                                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5 ml-5">
                                      Target: {new Date(goal.target_date).toLocaleDateString()}
                                    </p>
                                  )}
                                  {goal.goal_type === 'metric_based' && goalMetric && (
                                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5 ml-5">
                                      {currentValue !== null ? `${currentValue}` : 'No data'} → {goal.target_value} {goalMetric.unit}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="text-lg font-mono font-bold text-foreground">{progress}%</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={isAddGoalDialogOpen} onOpenChange={setIsAddGoalDialogOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">New Goal</DialogTitle>
            <DialogDescription className="text-sm font-light">
              Create a new goal to track your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title" className="text-xs font-mono tracking-wider uppercase text-foreground">Title</Label>
              <Input
                id="goal-title"
                placeholder="e.g., Launch Website, Read 12 Books"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-description" className="text-xs font-mono tracking-wider uppercase text-foreground">Description (Optional)</Label>
              <Input
                id="goal-description"
                placeholder="Brief description"
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-mono tracking-wider uppercase text-foreground">Goal Type</Label>
              <Select value={goalType} onValueChange={(val: GoalType) => setGoalType(val)}>
                <SelectTrigger className="rounded-sm border-border bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-border bg-card">
                  <SelectItem value="metric_based">Metric-Based (Track a metric value)</SelectItem>
                  <SelectItem value="subgoal_based">Subgoal-Based (Complete sub-tasks)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-target-date" className="text-xs font-mono tracking-wider uppercase text-foreground">Target Date (Optional)</Label>
              <Input
                id="goal-target-date"
                type="date"
                value={goalTargetDate}
                onChange={(e) => setGoalTargetDate(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-mono tracking-wider uppercase text-foreground">Linked Operation (Optional)</Label>
              <Select value={goalOperationId || "none"} onValueChange={(val) => setGoalOperationId(val === "none" ? "" : val)}>
                <SelectTrigger className="rounded-sm border-border bg-card">
                  <SelectValue placeholder="Select an operation" />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-border bg-card">
                  <SelectItem value="none">None</SelectItem>
                  {operations.filter(op => !op.is_archived).map(operation => (
                    <SelectItem key={operation.id} value={operation.id}>{operation.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {goalType === 'metric_based' ? (
              <>
                <div className="space-y-2">
                  <Label className="text-xs font-mono tracking-wider uppercase text-foreground">Metric</Label>
                  <Select value={goalMetricId} onValueChange={setGoalMetricId}>
                    <SelectTrigger className="rounded-sm border-border bg-card">
                      <SelectValue placeholder="Select a metric" />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm border-border bg-card">
                      {trackedMetrics.map(metric => (
                        <SelectItem key={metric.id} value={metric.id}>
                          {metric.name} {metric.unit && `(${metric.unit})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-target-value" className="text-xs font-mono tracking-wider uppercase text-foreground">Target Value</Label>
                  <Input
                    id="goal-target-value"
                    type="number"
                    placeholder="e.g., 3500"
                    value={goalTargetValue}
                    onChange={(e) => setGoalTargetValue(e.target.value)}
                    className="rounded-sm border-border bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-initial-value" className="text-xs font-mono tracking-wider uppercase text-foreground">Starting Value</Label>
                  <Input
                    id="goal-initial-value"
                    type="number"
                    placeholder="e.g., 2800"
                    value={goalInitialValue}
                    onChange={(e) => setGoalInitialValue(e.target.value)}
                    className="rounded-sm border-border bg-card"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label className="text-xs font-mono tracking-wider uppercase text-foreground">Subgoals</Label>
                {goalSubgoals.map((subgoal, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Subgoal ${index + 1}`}
                      value={subgoal}
                      onChange={(e) => {
                        const updated = [...goalSubgoals];
                        updated[index] = e.target.value;
                        setGoalSubgoals(updated);
                      }}
                      className="rounded-sm border-border bg-card"
                    />
                    {index === goalSubgoals.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setGoalSubgoals([...goalSubgoals, ""])}
                        className="rounded-sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={addGoal} className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditGoalDialogOpen} onOpenChange={setIsEditGoalDialogOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Edit Goal</DialogTitle>
            <DialogDescription className="text-sm font-light">
              Update goal details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-goal-title" className="text-xs font-mono tracking-wider uppercase text-foreground">Title</Label>
              <Input
                id="edit-goal-title"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-goal-description" className="text-xs font-mono tracking-wider uppercase text-foreground">Description</Label>
              <Input
                id="edit-goal-description"
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-goal-target-date" className="text-xs font-mono tracking-wider uppercase text-foreground">Target Date</Label>
              <Input
                id="edit-goal-target-date"
                type="date"
                value={goalTargetDate}
                onChange={(e) => setGoalTargetDate(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-mono tracking-wider uppercase text-foreground">Linked Operation (Optional)</Label>
              <Select value={goalOperationId || "none"} onValueChange={(val) => setGoalOperationId(val === "none" ? "" : val)}>
                <SelectTrigger className="rounded-sm border-border bg-card">
                  <SelectValue placeholder="Select an operation" />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-border bg-card">
                  <SelectItem value="none">None</SelectItem>
                  {operations.filter(op => !op.is_archived).map(operation => (
                    <SelectItem key={operation.id} value={operation.id}>{operation.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {goalType === 'metric_based' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-goal-target-value" className="text-xs font-mono tracking-wider uppercase text-foreground">Target Value</Label>
                  <Input
                    id="edit-goal-target-value"
                    type="number"
                    value={goalTargetValue}
                    onChange={(e) => setGoalTargetValue(e.target.value)}
                    className="rounded-sm border-border bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-goal-initial-value" className="text-xs font-mono tracking-wider uppercase text-foreground">Starting Value</Label>
                  <Input
                    id="edit-goal-initial-value"
                    type="number"
                    value={goalInitialValue}
                    onChange={(e) => setGoalInitialValue(e.target.value)}
                    className="rounded-sm border-border bg-card"
                  />
                </div>
              </>
            )}
            {goalType === 'subgoal_based' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-mono tracking-wider uppercase text-foreground">Subgoals</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setGoalSubgoals([...goalSubgoals, ""])}
                    className="h-7 text-xs font-mono"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {goalSubgoals.map((subgoal, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={subgoal}
                        onChange={(e) => {
                          const newSubgoals = [...goalSubgoals];
                          newSubgoals[index] = e.target.value;
                          setGoalSubgoals(newSubgoals);
                        }}
                        placeholder={`Subgoal ${index + 1}`}
                        className="rounded-sm border-border bg-card flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newSubgoals = goalSubgoals.filter((_, i) => i !== index);
                          setGoalSubgoals(newSubgoals);
                        }}
                        className="h-10 w-10 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {goalSubgoals.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No subgoals yet. Click "Add" to create one.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between items-center">
            <Button
              onClick={() => editingGoal && deleteGoal(editingGoal.id)}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02]"
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Delete
            </Button>
            <Button onClick={updateGoal} className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archived Goals Dialog */}
      <Dialog open={isArchivedGoalsDialogOpen} onOpenChange={setIsArchivedGoalsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-sm bg-card border-border max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Archived Goals</DialogTitle>
            <DialogDescription className="text-sm font-light">
              View and manage your archived goals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {goals.filter(g => g.is_archived).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No archived goals.</p>
            ) : (
              goals.filter(g => g.is_archived).map(goal => {
                const progress = calculateGoalProgress(goal);
                const metric = goal.metric_id ? trackedMetrics.find(m => m.id === goal.metric_id) : null;
                const currentValue = getCurrentGoalValue(goal);

                return (
                  <div key={goal.id} className="bg-card border border-border shadow-sm p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-900 dark:border-[#e5e5e5]"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-900 dark:border-[#e5e5e5]"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-900 dark:border-[#e5e5e5]"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-900 dark:border-[#e5e5e5]"></div>

                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-mono uppercase tracking-wider text-foreground">{goal.title}</h4>
                        {goal.description && <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>}
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-mono font-bold text-foreground">{progress}%</div>
                        <div className="text-[10px] font-mono text-muted-foreground uppercase">Complete</div>
                      </div>
                    </div>

                    {goal.goal_type === 'metric_based' && metric && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <p className="text-xs font-mono text-muted-foreground">
                          Metric: {metric.name} • Current: {currentValue !== null ? `${currentValue} ${metric.unit}` : 'No data'} • Target: {goal.target_value} {metric.unit}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 flex gap-2">
                      <Button
                        onClick={() => {
                          toggleArchiveGoal(goal.id, goal.is_archived);
                          setIsArchivedGoalsDialogOpen(false);
                        }}
                        variant="outline"
                        size="sm"
                        className="font-mono text-xs"
                      >
                        Unarchive
                      </Button>
                      <Button
                        onClick={() => {
                          deleteGoal(goal.id);
                        }}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 font-mono text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Operation Dialog */}
      <Dialog
        open={isAddOperationDialogOpen || isEditOperationDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetOperationForm();
          }
          if (isEditOperationDialogOpen) {
            setIsEditOperationDialogOpen(open);
          } else {
            setIsAddOperationDialogOpen(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-[540px] rounded-none bg-card border-2 border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingOperation ? 'Edit Operation' : 'New Operation'}
            </DialogTitle>
            <DialogDescription className="text-sm font-light">
              {editingOperation ? 'Update operation details' : 'Create a new operation to manage'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="operation-title" className="text-xs font-mono tracking-wider uppercase text-foreground">
                Title
              </Label>
              <Input
                id="operation-title"
                placeholder="e.g., Morning Routine"
                value={operationTitle}
                onChange={(e) => setOperationTitle(e.target.value)}
                className="rounded-none border-2 border-border bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operation-description" className="text-xs font-mono tracking-wider uppercase text-foreground">
                Description (Optional)
              </Label>
              <Input
                id="operation-description"
                placeholder="Brief description..."
                value={operationDescription}
                onChange={(e) => setOperationDescription(e.target.value)}
                className="rounded-none border-2 border-border bg-background"
              />
            </div>
            {editingOperation && (
              <div className="space-y-2">
                <Label htmlFor="operation-notes" className="text-xs font-mono tracking-wider uppercase text-foreground">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="operation-notes"
                  placeholder="Detailed notes about this operation..."
                  value={operationNotes}
                  onChange={(e) => setOperationNotes(e.target.value)}
                  rows={4}
                  className="rounded-none border-2 border-border bg-background resize-none"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="operation-metric" className="text-xs font-mono tracking-wider uppercase text-foreground">
                Linked Metric (Optional)
              </Label>
              <Select value={operationMetricId || "none"} onValueChange={(val) => setOperationMetricId(val === "none" ? "" : val)}>
                <SelectTrigger className="rounded-none border-2 border-border bg-background">
                  <SelectValue placeholder="Select a metric" />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-border bg-card">
                  <SelectItem value="none">None</SelectItem>
                  {trackedMetrics.map(metric => (
                    <SelectItem key={metric.id} value={metric.id}>{metric.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-mono tracking-wider uppercase text-foreground">
                Linked Habits (Optional)
              </Label>
              <div className="border-2 border-border p-3 space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar bg-background">
                {habits.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No habits available</p>
                ) : (
                  habits.map(habit => (
                    <label key={habit.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 transition-colors">
                      <input
                        type="checkbox"
                        checked={operationHabitIds.includes(habit.id)}
                        onChange={() => handleToggleHabit(habit.id)}
                        className="rounded-none border-border"
                      />
                      <span className="text-sm font-mono text-foreground">{habit.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {editingOperation && (
              <Button
                onClick={() => {
                  deleteOperation(editingOperation.id);
                }}
                variant="outline"
                className="sm:mr-auto border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02]"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Delete
              </Button>
            )}
            <Button
              onClick={editingOperation ? handleUpdateOperation : handleAddOperation}
              className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md"
            >
              {editingOperation ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Operation Detail View Dialog - REDESIGNED FROM SCRATCH */}
      {viewingOperation && (
        <Dialog open={!!viewingOperation} onOpenChange={(open) => {
          if (!open) {
            if (notesAutoSaveTimer.current) {
              clearTimeout(notesAutoSaveTimer.current);
              notesAutoSaveTimer.current = null;
            }

            if (operationNotes !== (viewingOperation.notes || "")) {
              fetch('/api/operations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: viewingOperation.id,
                  title: operationTitle.trim(),
                  description: operationDescription.trim() || null,
                  notes: operationNotes.trim() || null,
                  metric_id: operationMetricId || null,
                  habit_ids: operationHabitIds.length > 0 ? operationHabitIds : null,
                  is_archived: viewingOperation.is_archived,
                }),
              }).then(response => response.ok ? response.json() : null)
                .then(updated => {
                  if (updated) setOperations((prev: Operation[]) => prev.map(o => o.id === updated.id ? updated : o));
                });
            }

            setViewingOperation(null);
            setIsEditingTitle(false);
            setIsEditingDescription(false);
            setIsEditingMetric(false);
            setIsEditingHabits(false);
          }
        }}>
          <DialogContent className="sm:max-w-[800px] h-[85vh] rounded-none bg-card border border-border shadow-sm p-0 overflow-hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>Operation</DialogTitle>
            </DialogHeader>

            <div className="relative h-full flex flex-col">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

              {/* Header - Title & Description */}
              <div className="px-6 py-4 border-b border-border flex-shrink-0">
                {isEditingTitle ? (
                  <Input
                    value={operationTitle}
                    onChange={(e) => setOperationTitle(e.target.value)}
                    onBlur={() => { handleSaveViewingOperation(); setIsEditingTitle(false); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { handleSaveViewingOperation(); setIsEditingTitle(false); }}}
                    className="text-base font-mono uppercase tracking-wider border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 mb-2"
                    autoFocus
                  />
                ) : (
                  <h2
                    className="text-base font-mono uppercase tracking-wider text-foreground cursor-pointer hover:text-foreground/70 mb-2"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    {operationTitle}
                  </h2>
                )}
                {isEditingDescription ? (
                  <Input
                    value={operationDescription}
                    onChange={(e) => setOperationDescription(e.target.value)}
                    onBlur={() => { handleSaveViewingOperation(); setIsEditingDescription(false); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { handleSaveViewingOperation(); setIsEditingDescription(false); }}}
                    className="text-sm border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0"
                    placeholder="Add description..."
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-sm text-muted-foreground cursor-pointer hover:text-muted-foreground/70"
                    onClick={() => setIsEditingDescription(true)}
                  >
                    {operationDescription || "Add description..."}
                  </p>
                )}
              </div>

              {/* Main Content - 2 Column Layout */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Metadata */}
                <div className="w-64 border-r border-border p-4 space-y-4 overflow-y-auto flex-shrink-0">
                  {/* Metric */}
                  {(() => {
                    const metric = trackedMetrics.find(m => m.id === operationMetricId);
                    const last7Days = getLast7Days();
                    const linkedHabits = habits.filter(h => operationHabitIds.includes(h.id));
                    const linkedGoals = goals.filter(g => g.operation_id === viewingOperation.id && !g.is_archived);

                    return (
                      <>
                        {metric && (
                          <div className="pb-3 border-b border-border">
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Metric</div>
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-mono text-foreground">{metric.name}</span>
                              <span className="text-sm font-mono font-bold text-foreground">{getMostRecentMetricValue(metric.id) || '-'}</span>
                            </div>
                          </div>
                        )}

                        {linkedHabits.length > 0 && (
                          <div className="pb-3 border-b border-border">
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Habits</div>
                            <div className="space-y-3">
                              {linkedHabits.map(habit => {
                                const habitEntries = last7Days.map(day => {
                                  const dateStr = formatDate(day);
                                  const entry = entries.find(e => e.metric_id === habit.id && e.date === dateStr);
                                  return entry?.value_boolean === true;
                                });
                                const completedCount = habitEntries.filter(Boolean).length;

                                return (
                                  <div key={habit.id}>
                                    <div className="text-xs font-mono text-foreground mb-1.5">{habit.name}</div>
                                    <div className="flex items-center gap-1">
                                      {habitEntries.map((completed, idx) => (
                                        <div
                                          key={idx}
                                          className={`w-5 h-5 border border-border ${completed ? 'bg-gray-900 dark:bg-white' : 'bg-transparent'}`}
                                        />
                                      ))}
                                      <span className="text-xs font-mono text-muted-foreground ml-1.5">{completedCount}/7</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {linkedGoals.length > 0 && (
                          <div>
                            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Goals</div>
                            <div className="space-y-1.5">
                              {linkedGoals.map(goal => {
                                const progress = calculateGoalProgress(goal);
                                return (
                                  <div
                                    key={goal.id}
                                    className="flex items-center justify-between gap-2 p-1.5 hover:bg-muted rounded cursor-pointer transition-colors"
                                    onClick={() => openEditGoalDialog(goal)}
                                  >
                                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                      <Target className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                      <span className="text-xs font-mono text-foreground truncate">{goal.title}</span>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-foreground">{progress}%</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {!metric && linkedHabits.length === 0 && linkedGoals.length === 0 && (
                          <div className="text-xs font-mono text-muted-foreground text-center py-8">
                            No linked data
                          </div>
                        )}

                        <div className="pt-4 space-y-2 border-t border-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              openEditOperationDialog(viewingOperation);
                              setViewingOperation(null);
                            }}
                            className="w-full font-mono text-xs"
                          >
                            Edit Links
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm('Delete this operation?')) {
                                deleteOperation(viewingOperation.id);
                                setViewingOperation(null);
                              }
                            }}
                            className="w-full font-mono text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3 mr-1.5" />
                            Delete Operation
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Right - Notes */}
                <div className="flex-1 flex flex-col p-6 overflow-hidden">
                  <Label htmlFor="notes" className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Notes</Label>
                  <Textarea
                    id="notes"
                    value={operationNotes}
                    onChange={(e) => setOperationNotes(e.target.value)}
                    placeholder="Write your notes here..."
                    className="flex-1 rounded-sm border-border bg-background resize-none font-mono text-sm leading-relaxed focus-visible:ring-1"
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
