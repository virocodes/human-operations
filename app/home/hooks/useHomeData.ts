import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Category, Metric, DailyEntry, Goal, Task, Todo, Profile, Operation } from '../types';
import { formatDate, getLast7Days } from '../utils/formatters';

export function useHomeData() {
  const supabase = createClient();

  // User & Profile
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [habits, setHabits] = useState<Metric[]>([]);
  const [trackedMetrics, setTrackedMetrics] = useState<Metric[]>([]);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);

  // Wake/Sleep hours
  const [wakeHour, setWakeHour] = useState(6);
  const [sleepHour, setSleepHour] = useState(23);

  // Current time and date tracking
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());

  // Generate last 7 days - recalculate when date changes
  const days = useMemo(() => getLast7Days(), [currentDate]);

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

  // Load functions
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
    const response = await fetch('/api/goals');
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
      setTodos(data);
    }
  };

  const loadOperations = async () => {
    const response = await fetch('/api/operations');
    if (response.ok) {
      const data = await response.json();
      setOperations(data);
    }
  };

  // Load user and data
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const profileData = await fetch('/api/profile').then(res => res.ok ? res.json() : null);
        if (profileData) {
          setProfile(profileData);
          setWakeHour(profileData.wake_hour ?? 6);
          setSleepHour(profileData.sleep_hour ?? 23);
        }
        await Promise.all([
          loadCategories(),
          loadMetrics(),
          loadEntries(),
          loadGoals(),
          loadTasks(),
          loadTodos(),
          loadOperations()
        ]);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Update wake/sleep hours
  const updateWakeHour = async (hour: number) => {
    setWakeHour(hour);
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wake_hour: hour }),
    });
  };

  const updateSleepHour = async (hour: number) => {
    setSleepHour(hour);
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sleep_hour: hour }),
    });
  };

  // Update entry (for habits and metrics)
  const updateEntry = async (metricId: string, date: Date, value: boolean | number, type: 'boolean' | 'numeric') => {
    const dateStr = formatDate(date);

    // Optimistic update
    const tempEntry: DailyEntry = {
      id: `temp-${Date.now()}`,
      date: dateStr,
      metric_id: metricId,
      value_boolean: type === 'boolean' ? (value as boolean) : null,
      value_numeric: type === 'numeric' ? (value as number) : null,
    };

    setEntries((prevEntries: DailyEntry[]) => {
      const existingIndex = prevEntries.findIndex(e => e.metric_id === metricId && e.date === dateStr);
      if (existingIndex >= 0) {
        const updated = [...prevEntries];
        updated[existingIndex] = tempEntry;
        return updated;
      } else {
        return [...prevEntries, tempEntry];
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
      setEntries((prevEntries: DailyEntry[]) => {
        const existingIndex = prevEntries.findIndex(e => e.metric_id === metricId && e.date === dateStr);
        if (existingIndex >= 0) {
          const updated = [...prevEntries];
          updated[existingIndex] = newEntry;
          return updated;
        } else {
          return [...prevEntries, newEntry];
        }
      });
    } else {
      // Rollback on error
      loadEntries();
    }
  };

  return {
    // Auth & Profile
    user,
    profile,
    loading,
    supabase,

    // Data
    categories,
    setCategories,
    habits,
    setHabits,
    trackedMetrics,
    setTrackedMetrics,
    entries,
    setEntries,
    goals,
    setGoals,
    tasks,
    setTasks,
    todos,
    setTodos,
    operations,
    setOperations,

    // Time
    currentTime,
    currentDate,
    days,
    todayStats,
    wakeHour,
    sleepHour,
    updateWakeHour,
    updateSleepHour,

    // Load functions
    loadCategories,
    loadMetrics,
    loadEntries,
    loadGoals,
    loadTasks,
    loadTodos,
    loadOperations,

    // Update
    updateEntry,
  };
}
