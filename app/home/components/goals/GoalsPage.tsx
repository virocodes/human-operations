"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Archive, CheckSquare } from "lucide-react";
import { Goal, Metric, DailyEntry, GoalType, Task, Operation, Todo } from "../../types";
import { formatDate } from "../../utils/formatters";

interface GoalsPageProps {
  goals: Goal[];
  trackedMetrics: Metric[];
  entries: DailyEntry[];
  tasks: Task[];
  currentTime: Date;
  wakeHour: number;
  sleepHour: number;
  operations: Operation[];
  todosHook: {
    todos: Todo[];
    addTodo: (title: string, description: string, priority: 'low' | 'medium' | 'high') => Promise<void>;
    toggleTodo: (todoId: string, isCompleted: boolean) => Promise<void>;
    deleteTodo: (todoId: string) => Promise<void>;
    clearCompleted: () => Promise<void>;
  };
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
  tasksHook: {
    taskTitle: string;
    setTaskTitle: (value: string) => void;
    taskStartTime: string;
    setTaskStartTime: (value: string) => void;
    taskEndTime: string;
    setTaskEndTime: (value: string) => void;
    taskHabitId: string;
    setTaskHabitId: (value: string) => void;
    isAddTaskDialogOpen: boolean;
    setIsAddTaskDialogOpen: (value: boolean) => void;
    isEditTaskDialogOpen: boolean;
    setIsEditTaskDialogOpen: (value: boolean) => void;
    editingTask: Task | null;
    addTask: () => void;
    updateTask: () => void;
    deleteTask: (taskId: string) => void;
    openEditTaskDialog: (task: Task) => void;
  };
  updateWakeHour: (hour: number) => void;
  updateSleepHour: (hour: number) => void;
}

// Helper function to get current value for a metric-based goal
const getCurrentGoalValue = (goal: Goal, entries: DailyEntry[]): number | null => {
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
const calculateGoalProgress = (goal: Goal, entries: DailyEntry[]) => {
  if (goal.goal_type === 'subgoal_based' && goal.subgoals) {
    const completed = goal.subgoals.filter(s => s.is_completed).length;
    const total = goal.subgoals.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  } else if (goal.goal_type === 'metric_based' && goal.metric_id && goal.target_value !== null && goal.target_value !== undefined && goal.initial_value !== null && goal.initial_value !== undefined) {
    // Find the most recent entry for this metric
    const metricEntries = entries
      .filter(e => e.metric_id === goal.metric_id && e.value_numeric !== null)
      .sort((a, b) => b.date.localeCompare(a.date)); // Sort by date descending

    if (metricEntries.length > 0) {
      const currentValue = metricEntries[0].value_numeric ?? goal.initial_value;
      const totalChange = goal.target_value - goal.initial_value;
      const currentChange = currentValue - goal.initial_value;

      if (totalChange === 0) return 100; // Already at target

      const progress = Math.round((currentChange / totalChange) * 100);
      return Math.max(0, Math.min(progress, 100)); // Clamp between 0 and 100
    }

    // No entries yet, progress is 0
    return 0;
  }
  return 0;
};

export function GoalsPage({ goals, trackedMetrics, entries, tasks, currentTime, wakeHour, sleepHour, operations, todosHook, goalsHook, tasksHook, updateWakeHour, updateSleepHour }: GoalsPageProps) {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = todosHook;

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
    taskTitle,
    setTaskTitle,
    taskStartTime,
    setTaskStartTime,
    taskEndTime,
    setTaskEndTime,
    taskHabitId,
    setTaskHabitId,
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    isEditTaskDialogOpen,
    setIsEditTaskDialogOpen,
    editingTask,
    addTask,
    updateTask,
    deleteTask,
    openEditTaskDialog,
  } = tasksHook;

  // Todo dialog state
  const [isAddTodoDialogOpen, setIsAddTodoDialogOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Drag selection state for creating tasks
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragCurrentY, setDragCurrentY] = useState<number | null>(null);

  // Helper function to format hour in AM/PM
  const formatHourAMPM = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  // Helper function to format time string in AM/PM
  const formatTimeAMPM = (time: string) => {
    const [hourStr, min] = time.split(':');
    const hour = parseInt(hourStr);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${min} ${period}`;
  };

  // Todo handlers
  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;

    const title = newTodoTitle;
    const description = newTodoDescription;
    const priority = newTodoPriority;

    setNewTodoTitle('');
    setNewTodoDescription('');
    setNewTodoPriority('medium');
    setIsAddTodoDialogOpen(false);

    await addTodo(title, description, priority);
  };

  const handleToggleTodo = async (todoId: string, isCompleted: boolean) => {
    await toggleTodo(todoId, isCompleted);
  };

  const handleDeleteTodo = async (todoId: string) => {
    await deleteTodo(todoId);
  };

  const handleClearCompleted = async () => {
    await clearCompleted();
  };

  // Drag selection handlers for creating tasks
  const snapToInterval = (y: number) => {
    const startHourRange = wakeHour;
    const endHourRange = sleepHour >= wakeHour ? sleepHour : sleepHour + 24;
    const numHours = endHourRange - startHourRange;
    const hourHeight = 600 / numHours;

    // Convert Y to minutes from wake
    const minutesFromWake = (y / hourHeight) * 60;

    // Round to nearest 15 minutes
    const roundedMinutes = Math.round(minutesFromWake / 15) * 15;

    // Convert back to Y position
    const snappedY = (roundedMinutes / 60) * hourHeight;

    return snappedY;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const snappedY = snapToInterval(y);
    setIsDragging(true);
    setDragStartY(snappedY);
    setDragCurrentY(snappedY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartY === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const snappedY = snapToInterval(y);
    setDragCurrentY(snappedY);
  };

  const handleMouseUp = () => {
    if (!isDragging || dragStartY === null || dragCurrentY === null) {
      setIsDragging(false);
      setDragStartY(null);
      setDragCurrentY(null);
      return;
    }

    const startHourRange = wakeHour;
    const endHourRange = sleepHour >= wakeHour ? sleepHour : sleepHour + 24;
    const numHours = endHourRange - startHourRange;
    const hourHeight = 600 / numHours;

    const minY = Math.min(dragStartY, dragCurrentY);
    const maxY = Math.max(dragStartY, dragCurrentY);

    // Convert Y positions to hours and minutes
    const startMinutesFromWake = (minY / hourHeight) * 60;
    const endMinutesFromWake = (maxY / hourHeight) * 60;

    // Round to nearest 15 minutes
    const roundedStartMinutes = Math.round(startMinutesFromWake / 15) * 15;
    const roundedEndMinutes = Math.round(endMinutesFromWake / 15) * 15;

    // Convert back to actual hours
    const startHourActual = Math.floor(roundedStartMinutes / 60) + wakeHour;
    const startMinActual = roundedStartMinutes % 60;
    const endHourActual = Math.floor(roundedEndMinutes / 60) + wakeHour;
    const endMinActual = roundedEndMinutes % 60;

    // Format as HH:MM
    const startTime = `${String(startHourActual % 24).padStart(2, '0')}:${String(startMinActual).padStart(2, '0')}`;
    const endTime = `${String(endHourActual % 24).padStart(2, '0')}:${String(endMinActual).padStart(2, '0')}`;

    // Set the times and open dialog
    setTaskStartTime(startTime);
    setTaskEndTime(endTime);
    setIsAddTaskDialogOpen(true);

    // Reset drag state
    setIsDragging(false);
    setDragStartY(null);
    setDragCurrentY(null);
  };

  return (
    <>
          <div className="grid grid-cols-2 gap-8 h-full">
            {/* Left: To Do List Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-serif font-medium text-foreground">To Do List</h3>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Tasks & Priorities</p>
                </div>
                <Button
                  onClick={() => setIsAddTodoDialogOpen(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New
                </Button>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {todos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <CheckSquare className="h-12 w-12 text-muted-foreground/40 mb-4" />
                    <p className="text-sm text-muted-foreground font-mono">No tasks yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Click "New" to create your first todo</p>
                  </div>
                ) : (
                  <>
                    {todos.filter(t => !t.is_completed).length > 0 && (
                      <div className="space-y-2">
                        {todos.filter(t => !t.is_completed).map((todo) => (
                          <div
                            key={todo.id}
                            className="group bg-card border border-border hover:border-foreground/20 transition-all duration-200 hover:shadow-sm relative overflow-hidden"
                          >
                            {/* Corner brackets */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                            <div className="flex items-center gap-3 p-4">
                              <button
                                onClick={() => handleToggleTodo(todo.id, todo.is_completed)}
                                className="flex-shrink-0"
                              >
                                <div className="h-5 w-5 rounded-sm border-2 border-muted-foreground/40 hover:border-foreground transition-colors flex items-center justify-center">
                                </div>
                              </button>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-mono text-sm text-foreground">
                                  {todo.title}
                                </h4>
                                {todo.description && (
                                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                    {todo.description}
                                  </p>
                                )}
                              </div>
                              {todo.priority && (
                                <div
                                  className={`flex-shrink-0 h-2 w-2 rounded-full ${
                                    todo.priority === 'high'
                                      ? 'bg-red-500'
                                      : todo.priority === 'medium'
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                                  }`}
                                  title={`${todo.priority} priority`}
                                />
                              )}
                              <button
                                onClick={() => handleDeleteTodo(todo.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {todos.filter(t => t.is_completed).length > 0 && (
                      <div className="mt-6 pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-3 px-1">
                          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                            Completed ({todos.filter(t => t.is_completed).length})
                          </p>
                          <button
                            onClick={handleClearCompleted}
                            className="text-xs font-mono text-muted-foreground hover:text-destructive transition-colors uppercase tracking-wider"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="space-y-2">
                          {todos.filter(t => t.is_completed).map((todo) => (
                            <div
                              key={todo.id}
                              className="group bg-muted/30 border border-border/50 hover:border-border transition-all duration-200 relative overflow-hidden"
                            >
                              {/* Corner brackets */}
                              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                              <div className="flex items-center gap-3 p-4">
                                <button
                                  onClick={() => handleToggleTodo(todo.id, todo.is_completed)}
                                  className="flex-shrink-0"
                                >
                                  <div className="h-5 w-5 rounded-sm bg-gray-900 dark:bg-white flex items-center justify-center">
                                    <CheckSquare className="h-4 w-4 text-white dark:text-gray-900" />
                                  </div>
                                </button>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-mono text-sm text-muted-foreground line-through">
                                    {todo.title}
                                  </h4>
                                  {todo.description && (
                                    <p className="text-xs text-muted-foreground/60 mt-2 line-through leading-relaxed">
                                      {todo.description}
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleDeleteTodo(todo.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

              {/* Right: Timetable Section */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-serif font-medium text-foreground">Today's Schedule</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Wake:</span>
                        <select
                          value={wakeHour}
                          onChange={(e) => updateWakeHour(Number(e.target.value))}
                          className="text-xs font-mono border border-border rounded px-1 py-0.5 bg-card"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>{formatHourAMPM(i)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Sleep:</span>
                        <select
                          value={sleepHour}
                          onChange={(e) => updateSleepHour(Number(e.target.value))}
                          className="text-xs font-mono border border-border rounded px-1 py-0.5 bg-card"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>{formatHourAMPM(i)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsAddTaskDialogOpen(true)}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </div>

                <div className="bg-card border border-border shadow-sm relative overflow-hidden">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

                  {/* Timetable */}
                  <div
                    className="relative h-full cursor-crosshair select-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => {
                      if (isDragging) {
                        handleMouseUp();
                      }
                    }}
                  >
                    {/* Hour rows */}
                    {(() => {
                      const startHour = wakeHour;
                      const endHour = sleepHour >= wakeHour ? sleepHour : sleepHour + 24;
                      const hours = [];
                      for (let i = startHour; i < endHour; i++) {
                        hours.push(i % 24);
                      }
                      const numHours = hours.length;
                      const hourHeight = 600 / numHours;

                      return hours.map((hour, index) => (
                        <div key={hour} className="relative border-b border-border" style={{ height: `${hourHeight}px` }}>
                          {/* Hour label */}
                          <div className="absolute left-0 top-0 px-2 py-0.5 text-xs font-mono text-muted-foreground bg-background border-r border-border" style={{ width: '55px' }}>
                            {formatHourAMPM(hour)}
                          </div>
                        </div>
                      ));
                    })()}

                    {/* Tasks */}
                    {(() => {
                      const startHourRange = wakeHour;
                      const endHourRange = sleepHour >= wakeHour ? sleepHour : sleepHour + 24;
                      const numHours = endHourRange - startHourRange;
                      const hourHeight = 600 / numHours;

                      return tasks.map(task => {
                        const [startHour, startMin] = task.start_time.split(':').map(Number);
                        const [endHour, endMin] = task.end_time.split(':').map(Number);

                        // Calculate position relative to wake hour
                        const startHourAdjusted = startHour >= wakeHour ? startHour - wakeHour : (24 - wakeHour) + startHour;
                        const endHourAdjusted = endHour >= wakeHour ? endHour - wakeHour : (24 - wakeHour) + endHour;

                        const startMinutesFromWake = startHourAdjusted * 60 + startMin;
                        const endMinutesFromWake = endHourAdjusted * 60 + endMin;

                        const top = (startMinutesFromWake / 60) * hourHeight;
                        const height = ((endMinutesFromWake - startMinutesFromWake) / 60) * hourHeight;

                        const durationMinutes = endMinutesFromWake - startMinutesFromWake;

                        return (
                          <div
                            key={task.id}
                            className="absolute bg-blue-100 dark:bg-blue-800 border-l-4 border-blue-500 dark:border-blue-400 border-t border-b border-r border-border px-1.5 py-0.5 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors duration-150 z-20 overflow-hidden"
                            style={{
                              top: `${top + 1}px`,
                              left: '55px',
                              right: '1px',
                              height: `${height - 2}px`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditTaskDialog(task);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <div className="text-[11px] font-mono font-bold text-gray-900 dark:text-white truncate leading-none">{task.title}</div>
                            {durationMinutes >= 45 && (
                              <div className="text-[9px] font-mono text-gray-600 dark:text-gray-300 leading-none truncate mt-0.5">
                                {formatTimeAMPM(task.start_time)} - {formatTimeAMPM(task.end_time)}
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}

                    {/* Current time indicator */}
                    {(() => {
                      const currentHour = currentTime.getHours();
                      const currentMin = currentTime.getMinutes();

                      // Only show if current time is within wake/sleep range (before sleep hour)
                      const isInRange = (sleepHour >= wakeHour)
                        ? (currentHour >= wakeHour && currentHour < sleepHour)
                        : (currentHour >= wakeHour || currentHour < sleepHour);

                      if (!isInRange) return null;

                      const startHourRange = wakeHour;
                      const endHourRange = sleepHour >= wakeHour ? sleepHour : sleepHour + 24;
                      const numHours = endHourRange - startHourRange;
                      const hourHeight = 600 / numHours;

                      const hourAdjusted = currentHour >= wakeHour ? currentHour - wakeHour : (24 - wakeHour) + currentHour;
                      const minutesFromWake = hourAdjusted * 60 + currentMin;
                      const top = (minutesFromWake / 60) * hourHeight;

                      return (
                        <div
                          className="absolute left-0 right-0 border-t-2 border-red-500 z-30"
                          style={{ top: `${top}px` }}
                        >
                          <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                      );
                    })()}

                    {/* Drag selection overlay */}
                    {isDragging && dragStartY !== null && dragCurrentY !== null && (() => {
                      const minY = Math.min(dragStartY, dragCurrentY);
                      const maxY = Math.max(dragStartY, dragCurrentY);
                      const height = maxY - minY;

                      return (
                        <div
                          className="absolute left-0 right-0 bg-blue-500 opacity-20 border-l-4 border-blue-600 z-25 pointer-events-none"
                          style={{
                            top: `${minY}px`,
                            height: `${height}px`,
                          }}
                        />
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

      {/* Add Todo Dialog */}
      <Dialog open={isAddTodoDialogOpen} onOpenChange={setIsAddTodoDialogOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">New Todo</DialogTitle>
            <DialogDescription className="text-sm font-light">
              Add a new task to your todo list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="todo-title" className="text-xs font-mono tracking-wider uppercase text-foreground">
                Title
              </Label>
              <Input
                id="todo-title"
                placeholder="e.g., Finish project report"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="todo-description" className="text-xs font-mono tracking-wider uppercase text-foreground">
                Description (Optional)
              </Label>
              <Input
                id="todo-description"
                placeholder="Add details about this task..."
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="todo-priority" className="text-xs font-mono tracking-wider uppercase text-foreground">
                Priority
              </Label>
              <Select value={newTodoPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTodoPriority(value)}>
                <SelectTrigger className="rounded-sm border-border bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-border bg-card">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddTodo}
              className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">New Task</DialogTitle>
            <DialogDescription className="text-sm font-light">
              Add a task to today's schedule.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title" className="text-xs font-mono tracking-wider uppercase text-foreground">Task Title</Label>
              <Input
                id="task-title"
                placeholder="e.g., Team Meeting, Workout"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-start-time" className="text-xs font-mono tracking-wider uppercase text-foreground">Start Time</Label>
                <Input
                  id="task-start-time"
                  type="time"
                  value={taskStartTime}
                  onChange={(e) => setTaskStartTime(e.target.value)}
                  className="rounded-sm border-border bg-card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-end-time" className="text-xs font-mono tracking-wider uppercase text-foreground">End Time</Label>
                <Input
                  id="task-end-time"
                  type="time"
                  value={taskEndTime}
                  onChange={(e) => setTaskEndTime(e.target.value)}
                  className="rounded-sm border-border bg-card"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addTask} className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditTaskDialogOpen} onOpenChange={setIsEditTaskDialogOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Edit Task</DialogTitle>
            <DialogDescription className="text-sm font-light">
              Update task details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-task-title" className="text-xs font-mono tracking-wider uppercase text-foreground">Task Title</Label>
              <Input
                id="edit-task-title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-task-start-time" className="text-xs font-mono tracking-wider uppercase text-foreground">Start Time</Label>
                <Input
                  id="edit-task-start-time"
                  type="time"
                  value={taskStartTime}
                  onChange={(e) => setTaskStartTime(e.target.value)}
                  className="rounded-sm border-border bg-card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-task-end-time" className="text-xs font-mono tracking-wider uppercase text-foreground">End Time</Label>
                <Input
                  id="edit-task-end-time"
                  type="time"
                  value={taskEndTime}
                  onChange={(e) => setTaskEndTime(e.target.value)}
                  className="rounded-sm border-border bg-card"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center">
            <Button
              onClick={() => editingTask && deleteTask(editingTask.id)}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02]"
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Delete
            </Button>
            <Button onClick={updateTask} className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md">
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
                const progress = calculateGoalProgress(goal, entries);
                const metric = goal.metric_id ? trackedMetrics.find(m => m.id === goal.metric_id) : null;
                const currentValue = getCurrentGoalValue(goal, entries);

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
    </>
  );
}
