import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import { Metric, DailyEntry, MetricType } from '../types';

interface UseHabitsProps {
  habits: Metric[];
  setHabits: (habits: Metric[] | ((prev: Metric[]) => Metric[])) => void;
  entries: DailyEntry[];
  setEntries: (entries: DailyEntry[] | ((prev: DailyEntry[]) => DailyEntry[])) => void;
}

export function useHabits({ habits, setHabits, entries, setEntries }: UseHabitsProps) {
  const [habitName, setHabitName] = useState("");
  const [isAddHabitDialogOpen, setIsAddHabitDialogOpen] = useState(false);
  const [isEditHabitDialogOpen, setIsEditHabitDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);

  const handleHabitDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = habits.findIndex((m) => m.id === active.id);
      const newIndex = habits.findIndex((m) => m.id === over!.id);

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
      setHabits(prev => prev.filter(h => h.id !== tempHabit.id));
    }
  };

  const updateHabit = async () => {
    if (!editingMetric || !habitName.trim()) return;

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
      setHabits(previousHabits);
    }
  };

  const deleteMetric = async (id: string, isHabit: boolean) => {
    const previousHabits = habits;
    const previousEntries = entries;

    if (isHabit) {
      setHabits(habits.filter(h => h.id !== id));
      setIsEditHabitDialogOpen(false);
    }
    setEntries(entries.filter(e => e.metric_id !== id));

    const response = await fetch(`/api/metrics?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setHabits(previousHabits);
      setEntries(previousEntries);
    }
  };

  const openEditHabitDialog = (habit: Metric) => {
    setEditingMetric(habit);
    setHabitName(habit.name);
    setIsEditHabitDialogOpen(true);
  };

  return {
    habitName,
    setHabitName,
    isAddHabitDialogOpen,
    setIsAddHabitDialogOpen,
    isEditHabitDialogOpen,
    setIsEditHabitDialogOpen,
    editingMetric,
    handleHabitDragEnd,
    addHabit,
    updateHabit,
    deleteMetric,
    openEditHabitDialog,
  };
}
