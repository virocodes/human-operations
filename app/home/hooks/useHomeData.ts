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

  // Track which data sets have loaded
  const [dataLoaded, setDataLoaded] = useState({
    habits: false,
    entries: false,
    categories: false,
    trackedMetrics: false,
    goals: false,
    tasks: false,
    todos: false,
    operations: false,
  });

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

  // Load functions with timing logs
  const loadCategories = async () => {
    const startTime = performance.now();
    console.log('🔄 [LOAD] Starting: Categories');
    const response = await fetch('/api/categories');
    if (response.ok) {
      const data = await response.json();
      setCategories(data);
      setDataLoaded(prev => ({ ...prev, categories: true }));
      const duration = (performance.now() - startTime).toFixed(2);
      console.log(`✅ [LOAD] Completed: Categories (${duration}ms, ${data.length} items)`);
    } else {
      console.log('❌ [LOAD] Failed: Categories');
    }
  };

  const loadHabits = async () => {
    const startTime = performance.now();
    console.log('🔄 [LOAD] Starting: Habits (boolean metrics only)');
    const response = await fetch('/api/metrics?type=boolean');
    if (response.ok) {
      const data = await response.json();
      setHabits(data);
      setDataLoaded(prev => ({ ...prev, habits: true }));
      const duration = (performance.now() - startTime).toFixed(2);
      console.log(`✅ [LOAD] Completed: Habits (${duration}ms, ${data.length} habits)`);
    } else {
      console.log('❌ [LOAD] Failed: Habits');
    }
  };

  const loadTrackedMetrics = async () => {
    const startTime = performance.now();
    console.log('🔄 [LOAD] Starting: Tracked Metrics (numeric only)');
    const response = await fetch('/api/metrics?type=numeric');
    if (response.ok) {
      const data = await response.json();
      setTrackedMetrics(data);
      setDataLoaded(prev => ({ ...prev, trackedMetrics: true }));
      const duration = (performance.now() - startTime).toFixed(2);
      console.log(`✅ [LOAD] Completed: Tracked Metrics (${duration}ms, ${data.length} metrics)`);
    } else {
      console.log('❌ [LOAD] Failed: Tracked Metrics');
    }
  };

  const loadMetrics = async () => {
    // Load all metrics (used when both are needed)
    await Promise.all([loadHabits(), loadTrackedMetrics()]);
  };

  const loadEntries = async () => {
    const startTime = performance.now();
    const startDate = formatDate(days[0]);
    const endDate = formatDate(days[days.length - 1]);
    console.log(`🔄 [LOAD] Starting: Entries (${startDate} to ${endDate})`);
    const response = await fetch(`/api/entries?startDate=${startDate}&endDate=${endDate}`);
    if (response.ok) {
      const data = await response.json();
      setEntries(data);
      setDataLoaded(prev => ({ ...prev, entries: true }));
      const duration = (performance.now() - startTime).toFixed(2);
      console.log(`✅ [LOAD] Completed: Entries (${duration}ms, ${data.length} items)`);
    } else {
      console.log('❌ [LOAD] Failed: Entries');
    }
  };

  const loadGoals = async () => {
    const startTime = performance.now();
    console.log('🔄 [LOAD] Starting: Goals');
    const response = await fetch('/api/goals');
    if (response.ok) {
      const data = await response.json();
      setGoals(data);
      setDataLoaded(prev => ({ ...prev, goals: true }));
      const duration = (performance.now() - startTime).toFixed(2);
      console.log(`✅ [LOAD] Completed: Goals (${duration}ms, ${data.length} items)`);
    } else {
      console.log('❌ [LOAD] Failed: Goals');
    }
  };

  const loadTasks = async () => {
    const startTime = performance.now();
    console.log('🔄 [LOAD] Starting: Tasks');
    const response = await fetch('/api/tasks');
    if (response.ok) {
      const data = await response.json();
      setTasks(data);
      setDataLoaded(prev => ({ ...prev, tasks: true }));
      const duration = (performance.now() - startTime).toFixed(2);
      console.log(`✅ [LOAD] Completed: Tasks (${duration}ms, ${data.length} items)`);
    } else {
      console.log('❌ [LOAD] Failed: Tasks');
    }
  };

  const loadTodos = async () => {
    const startTime = performance.now();
    console.log('🔄 [LOAD] Starting: Todos');
    const response = await fetch('/api/todos');
    if (response.ok) {
      const data = await response.json();
      setTodos(data);
      setDataLoaded(prev => ({ ...prev, todos: true }));
      const duration = (performance.now() - startTime).toFixed(2);
      console.log(`✅ [LOAD] Completed: Todos (${duration}ms, ${data.length} items)`);
    } else {
      console.log('❌ [LOAD] Failed: Todos');
    }
  };

  const loadOperations = async () => {
    const startTime = performance.now();
    console.log('🔄 [LOAD] Starting: Operations');
    const response = await fetch('/api/operations');
    if (response.ok) {
      const data = await response.json();
      setOperations(data);
      setDataLoaded(prev => ({ ...prev, operations: true }));
      const duration = (performance.now() - startTime).toFixed(2);
      console.log(`✅ [LOAD] Completed: Operations (${duration}ms, ${data.length} items)`);
    } else {
      console.log('❌ [LOAD] Failed: Operations');
    }
  };

  // Load user and data
  useEffect(() => {
    const loadUser = async () => {
      const pageLoadStart = performance.now();
      console.log('🚀 [INIT] Page load started');

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const profileStart = performance.now();
        console.log('🔄 [LOAD] Starting: Profile (direct DB query)');

        // Fetch profile directly from Supabase instead of API call
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          setWakeHour(profileData.wake_hour ?? 6);
          setSleepHour(profileData.sleep_hour ?? 23);
          const profileDuration = (performance.now() - profileStart).toFixed(2);
          console.log(`✅ [LOAD] Completed: Profile (${profileDuration}ms)`);
        }

        const essentialStart = performance.now();
        console.log('📊 [PHASE 1] Loading essential Dashboard data...');

        // Load essential Dashboard data in parallel (both needed for Dashboard)
        await Promise.all([
          loadHabits(), // Only boolean metrics needed for Dashboard
          loadEntries()
        ]);

        const essentialDuration = (performance.now() - essentialStart).toFixed(2);
        const totalToRender = (performance.now() - pageLoadStart).toFixed(2);
        console.log(`✅ [PHASE 1] Essential data loaded (${essentialDuration}ms)`);
        console.log(`🎨 [RENDER] Dashboard ready to render! Total time: ${totalToRender}ms`);

        // Set loading to false - Dashboard can now render
        setLoading(false);

        // Load remaining data in background (non-blocking)
        const backgroundStart = performance.now();
        console.log('📦 [PHASE 2] Starting background data load...');
        Promise.all([
          loadCategories(),
          loadTrackedMetrics(), // Load numeric metrics for Metrics page
          loadGoals(),
          loadTasks(),
          loadTodos(),
          loadOperations()
        ]).then(() => {
          const backgroundDuration = (performance.now() - backgroundStart).toFixed(2);
          const totalDuration = (performance.now() - pageLoadStart).toFixed(2);
          console.log(`✅ [PHASE 2] Background data loaded (${backgroundDuration}ms)`);
          console.log(`🏁 [COMPLETE] All data loaded! Total time: ${totalDuration}ms`);
        }).catch(err => {
          console.error('❌ [PHASE 2] Background data loading failed:', err);
        });
      } else {
        setLoading(false);
        console.log('⚠️ [AUTH] No user found');
      }
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

    // Data Loading Status
    dataLoaded,

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
