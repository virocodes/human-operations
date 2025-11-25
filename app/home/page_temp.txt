"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash2, User, LogOut, UserCircle, GripVertical, ChevronDown, FolderPlus, ChevronLeft, ChevronRight, Home, CheckSquare, BarChart3, Target, Calendar, Moon, Sun, Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LoadingScreen from '@/components/LoadingScreen';
import { useTheme } from 'next-themes';

type MetricType = "boolean" | "numeric";
type Operator = "at_least" | "at_most" | "exactly";
type GoalType = "metric_based" | "subgoal_based";

interface Category {
  id: string;
  name: string;
  display_order: number;
}

interface Metric {
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

interface DailyEntry {
  id: string;
  date: string;
  metric_id: string;
  value_boolean: boolean | null;
  value_numeric: number | null;
}

interface Subgoal {
  id: string;
  goal_id: string;
  title: string;
  is_completed: boolean;
  display_order: number;
}

interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  goal_type: GoalType;
  target_date?: string | null;
  metric_id?: string | null;
  target_value?: number | null;
  initial_value?: number | null;
  is_archived: boolean;
  subgoals?: Subgoal[];
}

interface Task {
  id: string;
  user_id: string;
  title: string;
  start_time: string;
  end_time: string;
  habit_id?: string | null;
}

function NumericInputCell({
  initialValue,
  onUpdate,
  disabled
}: {
  initialValue: number | null;
  onUpdate: (value: number) => void;
  disabled: boolean;
}) {
  const [localValue, setLocalValue] = useState(initialValue?.toString() || "");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Update local value if external value changes (from server)
    setLocalValue(initialValue?.toString() || "");
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to update after user stops typing
    timeoutRef.current = setTimeout(() => {
      const numValue = parseFloat(newValue) || 0;
      onUpdate(numValue);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Input
      type="number"
      value={localValue}
      onChange={handleChange}
      placeholder="—"
      disabled={disabled}
      className="w-full h-full text-center text-sm font-mono font-medium border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-white bg-transparent rounded-none p-0"
    />
  );
}

function SortableHabitHeader({ metric, onEdit }: { metric: Metric; onEdit: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: metric.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="px-4 py-3 flex items-center justify-center relative border-r border-border hover:bg-card hover:shadow-sm transition-all duration-150 group"
    >
      <button
        {...listeners}
        {...attributes}
        className="absolute left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-110"
      >
        <GripVertical className="h-4 w-4 text-gray-400 dark:text-[#909090] hover:text-gray-600 dark:hover:text-[#a0a0a0]" />
      </button>
      <button
        onClick={onEdit}
        className="flex items-center justify-center flex-1 cursor-pointer group-hover:scale-[1.02] transition-transform duration-150"
      >
        <div className="text-xs font-mono tracking-wider text-foreground uppercase truncate w-full text-center">{metric.name}</div>
      </button>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [habits, setHabits] = useState<Metric[]>([]);
  const [trackedMetrics, setTrackedMetrics] = useState<Metric[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [isAddHabitDialogOpen, setIsAddHabitDialogOpen] = useState(false);
  const [isAddMetricDialogOpen, setIsAddMetricDialogOpen] = useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditHabitDialogOpen, setIsEditHabitDialogOpen] = useState(false);
  const [isEditMetricDialogOpen, setIsEditMetricDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddHabitColumn, setShowAddHabitColumn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());
  const [currentPageX, setCurrentPageX] = useState(1); // Start on Dashboard (X: 1)
  const [currentPageY, setCurrentPageY] = useState(0); // Start on top row (Y: 0)

  // Goals & Tasks state
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false);
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isArchivedGoalsDialogOpen, setIsArchivedGoalsDialogOpen] = useState(false);

  // Todos state
  const [todos, setTodos] = useState<any[]>([]);
  const [isAddTodoDialogOpen, setIsAddTodoDialogOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Timetable hours (default 6am to 11pm)
  const [wakeHour, setWakeHour] = useState(6);
  const [sleepHour, setSleepHour] = useState(23);

  // 2D page grid structure: pageGrid[y][x]
  // Row 0: Goals, Dashboard, Metrics
  // Row 1: null, Bottom Page, null
  const pageGrid = [
    [
      { id: 'goals', label: 'Goals', icon: Target },
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    ],
    [
      null,
      { id: 'operations', label: 'Operations', icon: Calendar },
      null,
    ]
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Form state for habits
  const [habitName, setHabitName] = useState("");

  // Form state for tracked metrics
  const [metricName, setMetricName] = useState("");
  const [metricUnit, setMetricUnit] = useState("");
  const [metricCategoryId, setMetricCategoryId] = useState<string>("");
  const [metricOptimalValue, setMetricOptimalValue] = useState("");
  const [metricMinimumValue, setMetricMinimumValue] = useState("");
  const [metricOperator, setMetricOperator] = useState<Operator>("at_least");

  // Form state for categories
  const [categoryName, setCategoryName] = useState("");

  // Form state for goals
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalType, setGoalType] = useState<GoalType>("metric_based");
  const [goalTargetDate, setGoalTargetDate] = useState("");
  const [goalMetricId, setGoalMetricId] = useState("");
  const [goalTargetValue, setGoalTargetValue] = useState("");
  const [goalInitialValue, setGoalInitialValue] = useState("");
  const [goalSubgoals, setGoalSubgoals] = useState<string[]>([""]);

  // Form state for tasks
  const [taskTitle, setTaskTitle] = useState("");
  const [taskStartTime, setTaskStartTime] = useState("");
  const [taskEndTime, setTaskEndTime] = useState("");

  // Drag selection state for creating tasks
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragCurrentY, setDragCurrentY] = useState<number | null>(null);
  const [taskHabitId, setTaskHabitId] = useState("");

  // Generate last 7 days - recalculate when date changes
  const days = useMemo(() => {
    const daysArray = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      daysArray.push(date);
    }
    return daysArray;
  }, [currentDate]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDayHeader = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (formatDate(date) === formatDate(today)) return "Today";
    if (formatDate(date) === formatDate(yesterday)) return "Yesterday";

    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    return `${weekday}, ${month} ${day}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const isYesterday = (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDate(date) === formatDate(yesterday);
  };

  const canEdit = (date: Date) => {
    return isToday(date) || isYesterday(date);
  };

  // Update clock every second and check for date changes
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const newDateStr = now.toDateString();
      if (newDateStr !== currentDate) {
        setCurrentDate(newDateStr);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentDate]);

  // Keyboard navigation (2D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigatePage('left');
      } else if (e.key === 'ArrowRight') {
        navigatePage('right');
      } else if (e.key === 'ArrowUp') {
        navigatePage('up');
      } else if (e.key === 'ArrowDown') {
        navigatePage('down');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageX, currentPageY]);

  // Calculate today's stats for habits only
  const todayStats = useMemo(() => {
    const today = new Date();
    const todayStr = formatDate(today);
    const todayEntries = entries.filter(e => e.date === todayStr);

    let completed = 0;
    habits.forEach(habit => {
      const entry = todayEntries.find(e => e.metric_id === habit.id);
      if (entry?.value_boolean === true) {
        completed++;
      }
    });

    return {
      completed,
      total: habits.length
    };
  }, [entries, habits, currentDate]);

  // Load user and data
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const profileData = await fetch('/api/profile').then(res => res.ok ? res.json() : null);
        if (profileData) {
          setProfile(profileData);
          // Set wake/sleep hours from profile, default to 6am and 11pm if not set
          setWakeHour(profileData.wake_hour ?? 6);
          setSleepHour(profileData.sleep_hour ?? 23);
        }
        await Promise.all([
          loadCategories(),
          loadMetrics(),
          loadEntries(),
          loadGoals(),
          loadTasks(),
          loadTodos()
        ]);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const loadCategories = async () => {
    const response = await fetch('/api/categories');
    if (response.ok) {
      const data = await response.json();
      setCategories(data);
    }
  };

  const loadMetrics = async () => {
    const response = await fetch('/api/metrics');
    if (response.ok) {
      const data = await response.json();
      const booleanMetrics = data.filter((m: Metric) => m.type === 'boolean');
      const numericMetrics = data.filter((m: Metric) => m.type === 'numeric');
      setHabits(booleanMetrics);
      setTrackedMetrics(numericMetrics);
    }
  };

  const loadEntries = async () => {
    const startDate = formatDate(days[0]);
    const endDate = formatDate(days[days.length - 1]);
    const response = await fetch(`/api/entries?startDate=${startDate}&endDate=${endDate}`);
    if (response.ok) {
      const data = await response.json();
      setEntries(data);
    }
  };

  const loadGoals = async () => {
    const response = await fetch(`/api/goals?include_archived=true`);
    if (response.ok) {
      const data = await response.json();
      setGoals(data);
    }
  };

  const loadTasks = async () => {
    const response = await fetch('/api/tasks');
    if (response.ok) {
      const data = await response.json();
      setTasks(data);
    }
  };

  const loadTodos = async () => {
    const response = await fetch('/api/todos');
    if (response.ok) {
      const data = await response.json();
      // Sort by priority: high -> medium -> low
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const sorted = data.sort((a: any, b: any) => {
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3;
        return aPriority - bPriority;
      });
      setTodos(sorted);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;

    // Optimistic UI: Create temporary todo with a temporary ID
    const tempTodo = {
      id: `temp-${Date.now()}`,
      title: newTodoTitle,
      description: newTodoDescription,
      priority: newTodoPriority,
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to state immediately
    setTodos(prev => [tempTodo, ...prev]);

    // Clear form and close dialog
    const title = newTodoTitle;
    const description = newTodoDescription;
    const priority = newTodoPriority;
    setNewTodoTitle('');
    setNewTodoDescription('');
    setNewTodoPriority('medium');
    setIsAddTodoDialogOpen(false);

    // Make API call
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        priority,
      }),
    });

    if (response.ok) {
      // Replace temp todo with real one from server
      loadTodos();
    } else {
      // Rollback on error
      setTodos(prev => prev.filter(t => t.id !== tempTodo.id));
    }
  };

  const handleToggleTodo = async (todoId: string, isCompleted: boolean) => {
    // Optimistic UI: Update state immediately
    setTodos(prev => prev.map(todo =>
      todo.id === todoId
        ? { ...todo, is_completed: !isCompleted }
        : todo
    ));

    // Make API call
    const response = await fetch('/api/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: todoId,
        is_completed: !isCompleted,
      }),
    });

    if (!response.ok) {
      // Rollback on error
      setTodos(prev => prev.map(todo =>
        todo.id === todoId
          ? { ...todo, is_completed: isCompleted }
          : todo
      ));
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    // Optimistic UI: Remove from state immediately
    const previousTodos = todos;
    setTodos(prev => prev.filter(t => t.id !== todoId));

    // Make API call
    const response = await fetch(`/api/todos?id=${todoId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      // Rollback on error
      setTodos(previousTodos);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(t => t.is_completed);
    if (completedTodos.length === 0) return;

    // Optimistic UI: Remove all completed todos
    const previousTodos = todos;
    setTodos(prev => prev.filter(t => !t.is_completed));

    // Make API calls to delete each completed todo
    const deletePromises = completedTodos.map(todo =>
      fetch(`/api/todos?id=${todo.id}`, { method: 'DELETE' })
    );

    const results = await Promise.all(deletePromises);
    const allSucceeded = results.every(r => r.ok);

    if (!allSucceeded) {
      // Rollback on error
      setTodos(previousTodos);
    }
  };

  const handleHabitDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = habits.findIndex((m) => m.id === active.id);
      const newIndex = habits.findIndex((m) => m.id === over.id);

      const newHabits = arrayMove(habits, oldIndex, newIndex);
      const updatedHabits = newHabits.map((habit, index) => ({
        ...habit,
        display_order: index,
      }));

      setHabits(updatedHabits);

      await fetch('/api/metrics/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: updatedHabits.map((m, index) => ({
            id: m.id,
            display_order: index,
          })),
        }),
      });
    }
  };

  const addHabit = async () => {
    if (!habitName.trim()) return;

    // Optimistic UI: Create temporary habit
    const tempHabit = {
      id: `temp-${Date.now()}`,
      name: habitName.trim(),
      type: 'boolean' as MetricType,
      display_order: habits.length,
      unit: null,
      category_id: null,
      optimal_value: null,
      minimum_value: null,
      operator: null,
    };

    setHabits([...habits, tempHabit]);
    const name = habitName.trim();
    setHabitName("");
    setIsAddHabitDialogOpen(false);

    const response = await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        type: 'boolean',
        display_order: habits.length,
      }),
    });

    if (response.ok) {
      const newHabit = await response.json();
      setHabits(prev => prev.map(h => h.id === tempHabit.id ? newHabit : h));
    } else {
      // Rollback on error
      setHabits(prev => prev.filter(h => h.id !== tempHabit.id));
    }
  };

  const addMetric = async () => {
    if (!metricName.trim()) return;

    // Optimistic UI: Create temporary metric
    const tempMetric = {
      id: `temp-${Date.now()}`,
      name: metricName.trim(),
      type: 'numeric' as MetricType,
      unit: metricUnit.trim() || null,
      category_id: metricCategoryId || null,
      optimal_value: metricOptimalValue ? parseFloat(metricOptimalValue) : null,
      minimum_value: metricMinimumValue ? parseFloat(metricMinimumValue) : null,
      operator: metricOperator,
      display_order: trackedMetrics.length,
    };

    setTrackedMetrics([...trackedMetrics, tempMetric]);
    const data = {
      name: metricName.trim(),
      unit: metricUnit.trim() || null,
      categoryId: metricCategoryId || null,
      optimalValue: metricOptimalValue ? parseFloat(metricOptimalValue) : null,
      minimumValue: metricMinimumValue ? parseFloat(metricMinimumValue) : null,
      operator: metricOperator,
    };
    setMetricName("");
    setMetricUnit("");
    setMetricCategoryId("");
    setMetricOptimalValue("");
    setMetricMinimumValue("");
    setMetricOperator("at_least");
    setIsAddMetricDialogOpen(false);

    const response = await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        type: 'numeric',
        unit: data.unit,
        category_id: data.categoryId,
        optimal_value: data.optimalValue,
        minimum_value: data.minimumValue,
        operator: data.operator,
        display_order: trackedMetrics.length,
      }),
    });

    if (response.ok) {
      const newMetric = await response.json();
      setTrackedMetrics(prev => prev.map(m => m.id === tempMetric.id ? newMetric : m));
    } else {
      // Rollback on error
      setTrackedMetrics(prev => prev.filter(m => m.id !== tempMetric.id));
    }
  };

  const addCategory = async () => {
    if (!categoryName.trim()) return;

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: categoryName.trim(),
        display_order: categories.length,
      }),
    });

    if (response.ok) {
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setCategoryName("");
      setIsAddCategoryDialogOpen(false);
    }
  };

  const updateHabit = async () => {
    if (!editingMetric || !habitName.trim()) return;

    // Optimistic UI
    const previousHabits = habits;
    const updatedHabit = { ...editingMetric, name: habitName.trim() };
    setHabits(habits.map(h => h.id === editingMetric.id ? updatedHabit : h));
    setHabitName("");
    setEditingMetric(null);
    setIsEditHabitDialogOpen(false);

    const response = await fetch('/api/metrics', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingMetric.id,
        name: habitName.trim(),
      }),
    });

    if (!response.ok) {
      // Rollback on error
      setHabits(previousHabits);
    }
  };

  const updateMetric = async () => {
    if (!editingMetric || !metricName.trim()) return;

    // Optimistic UI
    const previousMetrics = trackedMetrics;
    const updatedMetric = {
      ...editingMetric,
      name: metricName.trim(),
      unit: metricUnit.trim() || null,
      category_id: metricCategoryId || null,
      optimal_value: metricOptimalValue ? parseFloat(metricOptimalValue) : null,
      minimum_value: metricMinimumValue ? parseFloat(metricMinimumValue) : null,
      operator: metricOperator,
    };
    setTrackedMetrics(trackedMetrics.map(m => m.id === editingMetric.id ? updatedMetric : m));
    setMetricName("");
    setMetricUnit("");
    setMetricCategoryId("");
    setMetricOptimalValue("");
    setMetricMinimumValue("");
    setMetricOperator("at_least");
    setEditingMetric(null);
    setIsEditMetricDialogOpen(false);

    const response = await fetch('/api/metrics', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingMetric.id,
        name: metricName.trim(),
        unit: metricUnit.trim() || null,
        category_id: metricCategoryId || null,
        optimal_value: metricOptimalValue ? parseFloat(metricOptimalValue) : null,
        minimum_value: metricMinimumValue ? parseFloat(metricMinimumValue) : null,
        operator: metricOperator,
      }),
    });

    if (!response.ok) {
      // Rollback on error
      setTrackedMetrics(previousMetrics);
    }
  };

  const deleteMetric = async (id: string, isHabit: boolean) => {
    // Optimistic UI
    const previousHabits = habits;
    const previousMetrics = trackedMetrics;
    const previousEntries = entries;

    if (isHabit) {
      setHabits(habits.filter(h => h.id !== id));
      setIsEditHabitDialogOpen(false);
    } else {
      setTrackedMetrics(trackedMetrics.filter(m => m.id !== id));
      setIsEditMetricDialogOpen(false);
    }
    setEntries(entries.filter(e => e.metric_id !== id));

    const response = await fetch(`/api/metrics?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      // Rollback on error
      setHabits(previousHabits);
      setTrackedMetrics(previousMetrics);
      setEntries(previousEntries);
    }
  };

  const openEditHabitDialog = (habit: Metric) => {
    setEditingMetric(habit);
    setHabitName(habit.name);
    setIsEditHabitDialogOpen(true);
  };

  const openEditMetricDialog = (metric: Metric) => {
    setEditingMetric(metric);
    setMetricName(metric.name);
    setMetricUnit(metric.unit || "");
    setMetricCategoryId(metric.category_id || "");
    setMetricOptimalValue(metric.optimal_value?.toString() || "");
    setMetricMinimumValue(metric.minimum_value?.toString() || "");
    setMetricOperator(metric.operator || "at_least");
    setIsEditMetricDialogOpen(true);
  };

  // Goal CRUD operations
  const addGoal = async () => {
    if (!goalTitle.trim()) return;

    const subgoalsToCreate = goalType === 'subgoal_based'
      ? goalSubgoals.filter(s => s.trim()).map(s => s.trim())
      : undefined;

    // Optimistic UI
    const tempGoal = {
      id: `temp-${Date.now()}`,
      user_id: '',
      title: goalTitle.trim(),
      description: goalDescription.trim() || null,
      goal_type: goalType,
      target_date: goalTargetDate || null,
      metric_id: goalType === 'metric_based' ? goalMetricId : null,
      target_value: goalType === 'metric_based' && goalTargetValue ? parseFloat(goalTargetValue) : null,
      initial_value: goalType === 'metric_based' && goalInitialValue ? parseFloat(goalInitialValue) : null,
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
        subgoals: subgoalsToCreate,
      }),
    });

    if (response.ok) {
      const newGoal = await response.json();
      setGoals(prev => prev.map(g => g.id === tempGoal.id ? newGoal : g));
    } else {
      // Rollback on error
      setGoals(prev => prev.filter(g => g.id !== tempGoal.id));
    }
  };

  const updateGoal = async () => {
    if (!editingGoal || !goalTitle.trim()) return;

    // Optimistic UI
    const previousGoals = goals;
    const updatedGoal = {
      ...editingGoal,
      title: goalTitle.trim(),
      description: goalDescription.trim() || null,
      target_date: goalTargetDate || null,
      metric_id: goalType === 'metric_based' ? goalMetricId : null,
      target_value: goalType === 'metric_based' && goalTargetValue ? parseFloat(goalTargetValue) : null,
      initial_value: goalType === 'metric_based' && goalInitialValue ? parseFloat(goalInitialValue) : null,
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
      }),
    });

    if (response.ok) {
      const updated = await response.json();
      setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
    } else {
      // Rollback on error
      setGoals(previousGoals);
    }
  };

  const toggleArchiveGoal = async (goalId: string, isArchived: boolean) => {
    // Optimistic UI
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
      setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
    } else {
      // Rollback on error
      setGoals(previousGoals);
    }
  };

  const deleteGoal = async (goalId: string) => {
    // Optimistic UI
    const previousGoals = goals;
    setGoals(goals.filter(g => g.id !== goalId));
    setIsEditGoalDialogOpen(false);

    const response = await fetch(`/api/goals?id=${goalId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      // Rollback on error
      setGoals(previousGoals);
    }
  };

  const toggleSubgoal = async (subgoalId: string, isCompleted: boolean) => {
    // Optimistic UI
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
      // Rollback on error
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
    setIsEditGoalDialogOpen(true);
  };

  const resetGoalForm = () => {
    setGoalTitle("");
    setGoalDescription("");
    setGoalType("metric_based");
    setGoalTargetDate("");
    setGoalMetricId("");
    setGoalTargetValue("");
    setGoalInitialValue("");
    setGoalSubgoals([""]);
  };

  // Task CRUD operations
  const addTask = async () => {
    if (!taskTitle.trim() || !taskStartTime || !taskEndTime) return;

    // Optimistic UI
    const tempTask = {
      id: `temp-${Date.now()}`,
      title: taskTitle.trim(),
      start_time: taskStartTime,
      end_time: taskEndTime,
      habit_id: taskHabitId || null,
      user_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks([...tasks, tempTask]);
    const title = taskTitle.trim();
    const startTime = taskStartTime;
    const endTime = taskEndTime;
    const habitId = taskHabitId || null;
    resetTaskForm();
    setIsAddTaskDialogOpen(false);

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        start_time: startTime,
        end_time: endTime,
        habit_id: habitId,
      }),
    });

    if (response.ok) {
      const newTask = await response.json();
      setTasks(prev => prev.map(t => t.id === tempTask.id ? newTask : t));
    } else {
      // Rollback on error
      setTasks(prev => prev.filter(t => t.id !== tempTask.id));
    }
  };

  const updateTask = async () => {
    if (!editingTask || !taskTitle.trim()) return;

    // Optimistic UI
    const previousTasks = tasks;
    const updatedTask = {
      ...editingTask,
      title: taskTitle.trim(),
      start_time: taskStartTime,
      end_time: taskEndTime,
      habit_id: taskHabitId || null,
      updated_at: new Date().toISOString(),
    };
    setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
    resetTaskForm();
    setEditingTask(null);
    setIsEditTaskDialogOpen(false);

    const response = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingTask.id,
        title: taskTitle.trim(),
        start_time: taskStartTime,
        end_time: taskEndTime,
        habit_id: taskHabitId || null,
      }),
    });

    if (response.ok) {
      const updated = await response.json();
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } else {
      // Rollback on error
      setTasks(previousTasks);
    }
  };

  const deleteTask = async (taskId: string) => {
    // Optimistic UI
    const previousTasks = tasks;
    setTasks(tasks.filter(t => t.id !== taskId));
    setIsEditTaskDialogOpen(false);

    const response = await fetch(`/api/tasks?id=${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      // Rollback on error
      setTasks(previousTasks);
    }
  };

  const openEditTaskDialog = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskStartTime(task.start_time);
    setTaskEndTime(task.end_time);
    setTaskHabitId(task.habit_id || "");
    setIsEditTaskDialogOpen(true);
  };

  const resetTaskForm = () => {
    setTaskTitle("");
    setTaskStartTime("");
    setTaskEndTime("");
    setTaskHabitId("");
  };

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

  // Save wake/sleep hours to profile
  const updateWakeHour = async (newHour: number) => {
    setWakeHour(newHour);
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wake_hour: newHour }),
    });
  };

  const updateSleepHour = async (newHour: number) => {
    setSleepHour(newHour);
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sleep_hour: newHour }),
    });
  };

  // Helper function to get current value for metric-based goal
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

  const getEntry = (metricId: string, date: Date) => {
    return entries.find(e => e.metric_id === metricId && e.date === formatDate(date));
  };

  const updateEntry = async (metricId: string, date: Date, value: boolean | number, type: MetricType) => {
    const dateStr = formatDate(date);

    // Optimistic update
    const tempEntry: DailyEntry = {
      id: `temp-${Date.now()}`,
      date: dateStr,
      metric_id: metricId,
      value_boolean: type === 'boolean' ? (value as boolean) : null,
      value_numeric: type === 'numeric' ? (value as number) : null,
    };

    setEntries(entries => {
      const existingIndex = entries.findIndex(e => e.metric_id === metricId && e.date === dateStr);
      if (existingIndex >= 0) {
        const updated = [...entries];
        updated[existingIndex] = tempEntry;
        return updated;
      } else {
        return [...entries, tempEntry];
      }
    });

    // Make API call
    const response = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric_id: metricId,
        date: dateStr,
        value,
        type,
      }),
    });

    if (response.ok) {
      const newEntry = await response.json();
      setEntries(entries => {
        const existingIndex = entries.findIndex(e => e.metric_id === metricId && e.date === dateStr);
        if (existingIndex >= 0) {
          const updated = [...entries];
          updated[existingIndex] = newEntry;
          return updated;
        } else {
          return [...entries, newEntry];
        }
      });
    } else {
      // Rollback on error
      loadEntries();
    }
  };

  const getCellColor = (entry: DailyEntry | undefined, metric?: Metric) => {
    if (!entry) return "bg-red-300 dark:bg-red-800 hover:bg-red-400 dark:hover:bg-red-700";

    if (!metric || metric.type === "boolean") {
      return entry.value_boolean === true
        ? "bg-green-300 dark:bg-green-800 hover:bg-green-400 dark:hover:bg-green-700"
        : "bg-red-300 dark:bg-red-800 hover:bg-red-400 dark:hover:bg-red-700";
    }

    // For numeric metrics with optimal/minimum values
    const numValue = entry.value_numeric ?? 0;
    if (!metric.optimal_value || !metric.minimum_value || !metric.operator) {
      // No targets set, just check if > 0
      return numValue > 0
        ? "bg-green-300 dark:bg-green-800 hover:bg-green-400 dark:hover:bg-green-700"
        : "bg-red-300 dark:bg-red-800 hover:bg-red-400 dark:hover:bg-red-700";
    }

    const optimal = metric.optimal_value;
    const minimum = metric.minimum_value;
    const operator = metric.operator;

    let isOptimal = false;
    let isMinimum = false;

    if (operator === "at_least") {
      isOptimal = numValue >= optimal;
      isMinimum = numValue >= minimum && numValue < optimal;
    } else if (operator === "at_most") {
      isOptimal = numValue <= optimal;
      isMinimum = numValue <= minimum && numValue > optimal;
    } else if (operator === "exactly") {
      isOptimal = Math.abs(numValue - optimal) <= optimal * 0.05; // Within 5%
      isMinimum = Math.abs(numValue - minimum) <= minimum * 0.1; // Within 10%
    }

    if (isOptimal) return "bg-green-300 dark:bg-green-800 hover:bg-green-400 dark:hover:bg-green-700";
    if (isMinimum) return "bg-yellow-300 dark:bg-yellow-700 hover:bg-yellow-400 dark:hover:bg-yellow-600";
    return "bg-red-300 dark:bg-red-800 hover:bg-red-400 dark:hover:bg-red-700";
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navigatePage = (direction: 'left' | 'right' | 'up' | 'down') => {
    let newX = currentPageX;
    let newY = currentPageY;

    if (direction === 'left') newX = currentPageX - 1;
    else if (direction === 'right') newX = currentPageX + 1;
    else if (direction === 'up') newY = currentPageY - 1;
    else if (direction === 'down') newY = currentPageY + 1;

    // Check bounds and if page exists
    if (newY >= 0 && newY < pageGrid.length && newX >= 0 && newX < pageGrid[newY].length) {
      if (pageGrid[newY][newX] !== null) {
        setCurrentPageX(newX);
        setCurrentPageY(newY);
      }
    }
  };

  const goToPage = (x: number, y: number) => {
    if (y >= 0 && y < pageGrid.length && x >= 0 && x < pageGrid[y].length && pageGrid[y][x] !== null) {
      setCurrentPageX(x);
      setCurrentPageY(y);
    }
  };

  const filteredTrackedMetrics = selectedCategory === 'all'
    ? trackedMetrics
    : selectedCategory
    ? trackedMetrics.filter(m => m.category_id === selectedCategory)
    : trackedMetrics.filter(m => !m.category_id);

  if (loading) {
    return <LoadingScreen />;
  }

  const gridTransform = `translate(-${currentPageX * 100}vw, -${currentPageY * 100}vh)`;
  const gridHeight = `${pageGrid.length * 100}vh`;

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-medium text-foreground tracking-tight">
                Human <span className="italic font-light">Operations</span>
              </h1>
              <p className="text-xs font-mono tracking-wider text-muted-foreground mt-1 uppercase">Daily Operations Log</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-10 w-10 rounded-full hover:bg-accent transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-foreground" />
                ) : (
                  <Moon className="h-5 w-5 text-foreground" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={profile?.username || 'User'} />
                      <AvatarFallback className="bg-gray-200 dark:bg-[#2d2d2d]">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-sm border-border bg-card">
                  <Link href="/profile">
                    <DropdownMenuItem className="font-mono text-xs cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={handleSignOut} className="font-mono text-xs cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 2D Paging */}
      <div className="relative overflow-hidden" style={{ height: 'calc(100vh - 89px)' }}>
        {/* Pages Container - 2D Grid */}
        <div
          className="transition-transform duration-500 ease-out"
          style={{
            transform: gridTransform,
            height: gridHeight,
            width: '300vw'
          }}
        >
          {/* Row 0, Col 0: Goals & Schedule */}
          <div className="absolute h-full overflow-y-auto" style={{ width: '100vw', height: 'calc(100vh - 89px)', left: '0', top: '0' }}>
            <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
              <div className="grid grid-cols-2 gap-8 h-full">
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
                        New Goal
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
                      <div className="space-y-4 mt-6">
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
            </div>
          </div>

          {/* Row 0, Col 1: Dashboard (Welcome + Habits) */}
          <div className="absolute h-full overflow-y-auto" style={{ width: '100vw', height: 'calc(100vh - 89px)', left: '100vw', top: '0' }}>
            <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
        {/* Welcome Section */}
        <div className="mb-8 bg-card border border-border shadow-sm relative overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>

          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-3xl font-serif font-medium text-foreground mb-2 tracking-tight">
                  Welcome, <span className="italic">{profile?.username || user?.email?.split('@')[0] || 'User'}</span>
                </h2>
                <div className="text-sm text-muted-foreground font-light mb-6 tracking-wide">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>

                {todayStats.total > 0 && (
                  <div className="flex items-center gap-6">
                    <div className="flex items-baseline gap-2">
                      <div className="text-6xl font-serif font-medium text-foreground tabular-nums">
                        {todayStats.completed}
                      </div>
                      <div className="text-3xl font-serif text-gray-400 dark:text-[#909090]">/</div>
                      <div className="text-4xl font-serif text-muted-foreground tabular-nums">
                        {todayStats.total}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-sm font-mono text-foreground uppercase tracking-widest">
                        Habits Complete
                      </div>
                      <div className="text-xs font-mono text-muted-foreground tracking-wider">
                        {Math.round((todayStats.completed / todayStats.total) * 100)}% Operational
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Ring */}
              <div className="flex flex-col items-center ml-8">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    {[...Array(12)].map((_, i) => (
                      <line
                        key={i}
                        x1="80"
                        y1="8"
                        x2="80"
                        y2="14"
                        stroke="#d1d5db"
                        strokeWidth="1"
                        transform={`rotate(${i * 30} 80 80)`}
                      />
                    ))}
                    <circle cx="80" cy="80" r="72" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                    <circle
                      cx="80"
                      cy="80"
                      r="72"
                      stroke={(() => {
                        const percentage = todayStats.total > 0 ? (todayStats.completed / todayStats.total) * 100 : 0;
                        if (percentage === 0) return "#ef4444";
                        if (percentage < 25) return "#f87171";
                        if (percentage < 40) return "#fb923c";
                        if (percentage < 60) return "#fbbf24";
                        if (percentage < 75) return "#facc15";
                        if (percentage < 90) return "#a3e635";
                        if (percentage < 100) return "#86efac";
                        return "#4ade80";
                      })()}
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 72}`}
                      strokeDashoffset={`${2 * Math.PI * 72 * (1 - (todayStats.total > 0 ? todayStats.completed / todayStats.total : 0))}`}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-serif font-medium text-foreground mb-1 tabular-nums">
                      {todayStats.total > 0 ? Math.round((todayStats.completed / todayStats.total) * 100) : 0}%
                    </div>
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">
                      {todayStats.completed === todayStats.total && todayStats.total > 0 ? 'Complete' : 'Active'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Habits Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-serif font-medium text-foreground">Daily Habits</h3>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Checkbox Tracking</p>
            </div>
            <Button
              onClick={() => setIsAddHabitDialogOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Habit
            </Button>
          </div>

          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-card border border-border shadow-sm">
              <div className="w-12 h-12 bg-gray-100 dark:bg-[#2d2d2d] border border-border flex items-center justify-center mb-3">
                <Plus className="h-6 w-6 text-gray-400 dark:text-[#909090]" />
              </div>
              <p className="text-sm text-muted-foreground font-light">No habits defined yet</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleHabitDragEnd}
            >
              <div className="bg-card border border-border shadow-sm overflow-hidden relative">
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

                {/* Header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `120px repeat(${habits.length}, 1fr) ${showAddHabitColumn ? '60px' : '0px'}`,
                    transition: 'grid-template-columns 200ms ease-in-out'
                  }}
                  className="border-b border-border bg-background relative"
                  onMouseEnter={() => setShowAddHabitColumn(true)}
                  onMouseLeave={() => setShowAddHabitColumn(false)}
                >
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '10px 10px'
                  }}></div>
                  <div className="px-4 py-3 flex items-center border-r border-border">
                    <div className="text-xs font-mono tracking-wider text-foreground uppercase">Date</div>
                  </div>
                  <SortableContext
                    items={habits.map(h => h.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {habits.map((habit) => (
                      <SortableHabitHeader
                        key={habit.id}
                        metric={habit}
                        onEdit={() => openEditHabitDialog(habit)}
                      />
                    ))}
                  </SortableContext>
                  <button
                    onClick={() => setIsAddHabitDialogOpen(true)}
                    className="px-4 py-3 text-center flex items-center justify-center transition-all duration-200 overflow-hidden hover:bg-card hover:shadow-sm text-muted-foreground hover:text-foreground text-2xl font-light leading-none cursor-pointer hover:scale-110"
                    style={{ opacity: showAddHabitColumn ? 1 : 0 }}
                  >
                    +
                  </button>
                </div>

                {/* Body */}
                {days.map((day, dayIndex) => {
                  const isTodayRow = isToday(day);
                  return (
                    <div
                      key={dayIndex}
                      style={{
                        display: "grid",
                        gridTemplateColumns: `120px repeat(${habits.length}, 1fr) ${showAddHabitColumn ? '60px' : '0px'}`,
                        transition: 'grid-template-columns 200ms ease-in-out'
                      }}
                      className={`${dayIndex !== days.length - 1 ? "border-b border-border" : ""}`}
                    >
                      <div className={`px-4 py-3 border-r border-border flex items-center ${
                        isTodayRow ? "bg-gray-900 text-white" : "bg-background"
                      }`}>
                        <div className={`text-xs font-mono ${isTodayRow ? "font-semibold tracking-wide" : ""}`}>
                          {formatDayHeader(day)}
                        </div>
                      </div>

                      {habits.map((habit) => {
                        const entry = getEntry(habit.id, day);
                        const isEditable = canEdit(day);
                        const cellColor = getCellColor(entry);

                        return (
                          <div
                            key={habit.id}
                            className={`flex items-center justify-center transition-all duration-150 ${cellColor} ${
                              !isEditable ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:brightness-95"
                            } border-r border-border relative`}
                          >
                            <button
                              onClick={() => isEditable && updateEntry(habit.id, day, !(entry?.value_boolean === true), 'boolean')}
                              disabled={!isEditable}
                              className="w-full h-full py-4 min-h-[48px] transition-transform duration-150 hover:scale-[1.02]"
                            />
                          </div>
                        );
                      })}

                      <div
                        className="bg-background overflow-hidden transition-opacity duration-200"
                        style={{ opacity: showAddHabitColumn ? 1 : 0 }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </DndContext>
          )}
        </div>

            </div>
          </div>

          {/* Row 0, Col 2: Tracked Metrics */}
          <div className="absolute h-full overflow-hidden" style={{ width: '100vw', height: 'calc(100vh - 89px)', left: '200vw', top: '0' }}>
            <div className="max-w-7xl mx-auto px-6 py-8 h-full flex flex-col">
        {/* Tracked Metrics Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-serif font-medium text-foreground">Tracked Metrics</h3>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Numeric Values by Category</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsAddCategoryDialogOpen(true)}
                variant="outline"
                className="border-border font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02]"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Category
              </Button>
              <Button
                onClick={() => setIsAddMetricDialogOpen(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Metric
              </Button>
            </div>
          </div>

          {/* Category Selector */}
          {(categories.length > 0 || trackedMetrics.length > 0) && (
            <div className="mb-4 flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? "default" : "outline"}
                onClick={() => setSelectedCategory('all')}
                className="font-mono text-xs tracking-wide uppercase rounded-sm"
              >
                All Metrics
              </Button>
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="font-mono text-xs tracking-wide uppercase rounded-sm"
              >
                Uncategorized
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="font-mono text-xs tracking-wide uppercase rounded-sm"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          )}

          {filteredTrackedMetrics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-card border border-border shadow-sm">
              <div className="w-12 h-12 bg-gray-100 dark:bg-[#2d2d2d] border border-border flex items-center justify-center mb-3">
                <Plus className="h-6 w-6 text-gray-400 dark:text-[#909090]" />
              </div>
              <p className="text-sm text-muted-foreground font-light">No metrics in this category</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto pr-2 pb-20 flex-1 custom-scrollbar">
              {filteredTrackedMetrics.map(metric => (
                <div key={metric.id} className="bg-card border border-border shadow-sm p-6 relative overflow-hidden">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-base font-mono uppercase tracking-wider text-foreground cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" onClick={() => openEditMetricDialog(metric)}>
                        {metric.name}
                      </h4>
                      {metric.unit && <p className="text-xs font-mono text-muted-foreground">Unit: {metric.unit}</p>}
                      {metric.optimal_value && metric.minimum_value && (
                        <p className="text-xs font-mono text-muted-foreground">
                          Target: {metric.operator === 'at_least' ? '≥' : metric.operator === 'at_most' ? '≤' : '='} {metric.optimal_value} • Min: {metric.minimum_value}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => {
                      const entry = getEntry(metric.id, day);
                      const isEditable = canEdit(day);
                      const cellColor = getCellColor(entry, metric);

                      return (
                        <div key={formatDate(day)} className="flex flex-col">
                          <div className="text-xs font-mono text-muted-foreground text-center mb-1">{formatDayHeader(day)}</div>
                          <div className={`${cellColor} transition-all duration-150 ${isEditable ? 'cursor-pointer hover:brightness-95' : 'opacity-50'} border border-border p-2 flex items-center justify-center min-h-[60px]`}>
                            <NumericInputCell
                              initialValue={entry?.value_numeric ?? null}
                              onUpdate={(value) => updateEntry(metric.id, day, value, 'numeric')}
                              disabled={!isEditable}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
            </div>
          </div>

          {/* Row 1, Col 1: Operations Page */}
          <div className="absolute h-full overflow-y-auto" style={{ width: '100vw', height: 'calc(100vh - 89px)', left: '100vw', top: 'calc(100vh - 89px)' }}>
            <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
              <div className="grid grid-cols-2 gap-8">
                {/* Left: To Do List Section */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-serif font-medium text-foreground">To Do List</h3>
                      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Tasks & Priorities</p>
                    </div>
                    <Button
                      onClick={() => setIsAddTodoDialogOpen(true)}
                      className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md"
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

                {/* Right: Operations Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-serif font-medium text-foreground">Operations</h3>
                      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">System Management</p>
                    </div>
                  </div>
                  <div className="bg-card border border-border shadow-sm p-6 min-h-[400px]">
                    <p className="text-sm text-muted-foreground font-mono">Coming soon...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Left Arrow */}
        {currentPageX > 0 && (
          <button
            onClick={() => navigatePage('left')}
            className="fixed left-4 z-10 bg-card/90 hover:bg-card border border-border rounded-sm p-3 shadow-lg transition-all duration-150 hover:scale-110"
            style={{ top: '50vh', transform: 'translateY(-50%)' }}
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>
        )}

        {/* Right Arrow */}
        {currentPageX < pageGrid[0].length - 1 && (
          <button
            onClick={() => navigatePage('right')}
            className="fixed right-4 z-10 bg-card/90 hover:bg-card border border-border rounded-sm p-3 shadow-lg transition-all duration-150 hover:scale-110"
            style={{ top: '50vh', transform: 'translateY(-50%)' }}
          >
            <ChevronRight className="h-6 w-6 text-foreground" />
          </button>
        )}
        </div>
      </div>

      {/* Bottom Chip Navigation - T-shaped Grid */}
      <div className="fixed bottom-6 right-6 z-20 flex flex-col items-center">
        {/* Top row - all 3 pages */}
        <div className="flex items-center gap-2 bg-card border-2 border-border shadow-lg p-1">
          {pageGrid[0].map((page, colIndex) => {
            if (!page) return null;
            const Icon = page.icon;
            const isActive = currentPageX === colIndex && currentPageY === 0;
            return (
              <button
                key={page.id}
                onClick={() => goToPage(colIndex, 0)}
                className={`
                  p-2.5 transition-all duration-200
                  ${isActive
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground'}
                `}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
        {/* Bottom row - only center button */}
        {pageGrid[1][1] && (() => {
          const page = pageGrid[1][1];
          const Icon = page.icon;
          const isActive = currentPageX === 1 && currentPageY === 1;
          return (
            <div className="bg-card border-2 border-t-0 border-border shadow-lg p-1 -mt-0.5">
              <button
                key={page.id}
                onClick={() => goToPage(1, 1)}
                className={`
                  p-2.5 transition-all duration-200
                  ${isActive
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground'}
                `}
              >
                <Icon className="h-4 w-4" />
              </button>
            </div>
          );
        })()}
      </div>

      {/* Add Habit Dialog */}
      <Dialog open={isAddHabitDialogOpen} onOpenChange={setIsAddHabitDialogOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">New Habit</DialogTitle>
            <DialogDescription className="text-sm font-light">
              Define a new daily habit to track.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="habit-name" className="text-xs font-mono tracking-wider uppercase text-foreground">Habit Name</Label>
              <Input
                id="habit-name"
                placeholder="e.g., Morning Exercise, Meditation"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addHabit} className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Habit Dialog */}
      <Dialog open={isEditHabitDialogOpen} onOpenChange={setIsEditHabitDialogOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Edit Habit</DialogTitle>
            <DialogDescription className="text-sm font-light">
              Modify habit parameters.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-habit-name" className="text-xs font-mono tracking-wider uppercase text-foreground">Habit Name</Label>
              <Input
                id="edit-habit-name"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center">
            <Button
              onClick={() => editingMetric && deleteMetric(editingMetric.id, true)}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02]"
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Delete
            </Button>
            <Button onClick={updateHabit} className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Metric Dialog */}
      <Dialog open={isAddMetricDialogOpen} onOpenChange={setIsAddMetricDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">New Tracked Metric</DialogTitle>
            <DialogDescription className="text-sm font-light">
              Define a new numeric metric with optional targets.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="metric-name" className="text-xs font-mono tracking-wider uppercase text-foreground">Metric Name</Label>
              <Input
                id="metric-name"
                placeholder="e.g., Calories, Steps, Water"
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metric-unit" className="text-xs font-mono tracking-wider uppercase text-foreground">Unit</Label>
              <Input
                id="metric-unit"
                placeholder="e.g., kcal, steps, oz"
                value={metricUnit}
                onChange={(e) => setMetricUnit(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metric-category" className="text-xs font-mono tracking-wider uppercase text-foreground">Category</Label>
              <Select value={metricCategoryId || "none"} onValueChange={(val) => setMetricCategoryId(val === "none" ? "" : val)}>
                <SelectTrigger id="metric-category" className="rounded-sm border-border bg-card">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Uncategorized</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border-t border-gray-200 dark:border-[#383838] pt-4 mt-4">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-3">Optional Target Values</p>

              <div className="space-y-2 mb-3">
                <Label htmlFor="metric-operator" className="text-xs font-mono tracking-wider uppercase text-foreground">Operator</Label>
                <Select value={metricOperator} onValueChange={(val) => setMetricOperator(val as Operator)}>
                  <SelectTrigger id="metric-operator" className="rounded-sm border-border bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="at_least">At Least (≥)</SelectItem>
                    <SelectItem value="at_most">At Most (≤)</SelectItem>
                    <SelectItem value="exactly">Exactly (=)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="metric-optimal" className="text-xs font-mono tracking-wider uppercase text-foreground">Optimal Value</Label>
                  <Input
                    id="metric-optimal"
                    type="number"
                    placeholder="e.g., 3000"
                    value={metricOptimalValue}
                    onChange={(e) => setMetricOptimalValue(e.target.value)}
                    className="rounded-sm border-border bg-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metric-minimum" className="text-xs font-mono tracking-wider uppercase text-foreground">Minimum Value</Label>
                  <Input
                    id="metric-minimum"
                    type="number"
                    placeholder="e.g., 2500"
                    value={metricMinimumValue}
                    onChange={(e) => setMetricMinimumValue(e.target.value)}
                    className="rounded-sm border-border bg-card"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addMetric} className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Metric Dialog */}
      <Dialog open={isEditMetricDialogOpen} onOpenChange={setIsEditMetricDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Edit Metric</DialogTitle>
            <DialogDescription className="text-sm font-light">
              Modify metric parameters.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="edit-metric-name" className="text-xs font-mono tracking-wider uppercase text-foreground">Metric Name</Label>
              <Input
                id="edit-metric-name"
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-metric-unit" className="text-xs font-mono tracking-wider uppercase text-foreground">Unit</Label>
              <Input
                id="edit-metric-unit"
                value={metricUnit}
                onChange={(e) => setMetricUnit(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-metric-category" className="text-xs font-mono tracking-wider uppercase text-foreground">Category</Label>
              <Select value={metricCategoryId || "none"} onValueChange={(val) => setMetricCategoryId(val === "none" ? "" : val)}>
                <SelectTrigger id="edit-metric-category" className="rounded-sm border-border bg-card">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Uncategorized</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border-t border-gray-200 dark:border-[#383838] pt-4 mt-4">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-3">Target Values</p>

              <div className="space-y-2 mb-3">
                <Label htmlFor="edit-metric-operator" className="text-xs font-mono tracking-wider uppercase text-foreground">Operator</Label>
                <Select value={metricOperator} onValueChange={(val) => setMetricOperator(val as Operator)}>
                  <SelectTrigger id="edit-metric-operator" className="rounded-sm border-border bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="at_least">At Least (≥)</SelectItem>
                    <SelectItem value="at_most">At Most (≤)</SelectItem>
                    <SelectItem value="exactly">Exactly (=)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-metric-optimal" className="text-xs font-mono tracking-wider uppercase text-foreground">Optimal Value</Label>
                  <Input
                    id="edit-metric-optimal"
                    type="number"
                    value={metricOptimalValue}
                    onChange={(e) => setMetricOptimalValue(e.target.value)}
                    className="rounded-sm border-border bg-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-metric-minimum" className="text-xs font-mono tracking-wider uppercase text-foreground">Minimum Value</Label>
                  <Input
                    id="edit-metric-minimum"
                    type="number"
                    value={metricMinimumValue}
                    onChange={(e) => setMetricMinimumValue(e.target.value)}
                    className="rounded-sm border-border bg-card"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center">
            <Button
              onClick={() => editingMetric && deleteMetric(editingMetric.id, false)}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02]"
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Delete
            </Button>
            <Button onClick={updateMetric} className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">New Category</DialogTitle>
            <DialogDescription className="text-sm font-light">
              Create a new category to organize your tracked metrics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name" className="text-xs font-mono tracking-wider uppercase text-foreground">Category Name</Label>
              <Input
                id="category-name"
                placeholder="e.g., Nutrition, Fitness, Work"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addCategory} className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md">
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
            <div className="space-y-2">
              <Label className="text-xs font-mono tracking-wider uppercase text-foreground">Link to Habit (Optional)</Label>
              <Select value={taskHabitId || "none"} onValueChange={(val) => setTaskHabitId(val === "none" ? "" : val)}>
                <SelectTrigger className="rounded-sm border-border bg-card">
                  <SelectValue placeholder="Select a habit" />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-border bg-card">
                  <SelectItem value="none">No Habit</SelectItem>
                  {habits.map(habit => (
                    <SelectItem key={habit.id} value={habit.id}>
                      {habit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
    </div>
  );
}
