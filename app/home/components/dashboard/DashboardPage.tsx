"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
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
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableHabitHeader } from '../shared/SortableHabitHeader';
import { Metric, DailyEntry, MetricType } from '../../types';
import { formatDate, formatDayHeader, isToday, canEdit } from '../../utils/formatters';

interface User {
  email?: string;
}

interface Profile {
  username?: string;
}

interface TodayStats {
  completed: number;
  total: number;
}

interface HabitsHook {
  addHabit: () => Promise<void>;
  updateHabit: () => Promise<void>;
  deleteMetric: (id: string, isHabit: boolean) => Promise<void>;
  openEditHabitDialog: (habit: Metric) => void;
  handleHabitDragEnd: (event: DragEndEvent) => Promise<void>;
  isAddHabitDialogOpen: boolean;
  setIsAddHabitDialogOpen: (open: boolean) => void;
  isEditHabitDialogOpen: boolean;
  setIsEditHabitDialogOpen: (open: boolean) => void;
  habitName: string;
  setHabitName: (name: string) => void;
  editingMetric: Metric | null;
}

interface DashboardPageProps {
  user: User;
  profile: Profile | null;
  habits: Metric[];
  entries: DailyEntry[];
  currentTime: Date;
  todayStats: TodayStats;
  days: Date[];
  showAddHabitColumn: boolean;
  setShowAddHabitColumn: (show: boolean) => void;
  habitsHook: HabitsHook;
  updateEntry: (metricId: string, date: Date, value: boolean | number, type: MetricType) => Promise<void>;
}

export function DashboardPage({
  user,
  profile,
  habits,
  entries,
  currentTime,
  todayStats,
  days,
  showAddHabitColumn,
  setShowAddHabitColumn,
  habitsHook,
  updateEntry,
}: DashboardPageProps) {
  const router = useRouter();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper functions
  const getEntry = (metricId: string, date: Date) => {
    return entries.find(e => e.metric_id === metricId && e.date === formatDate(date));
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

  return (
    <>
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
            <div className="flex items-center gap-2">
              <Button
                onClick={() => router.push('/home/habits-history')}
                variant="outline"
                className="font-mono text-xs tracking-widest uppercase rounded-sm"
              >
                View History
              </Button>
              <Button
                onClick={() => habitsHook.setIsAddHabitDialogOpen(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Habit
              </Button>
            </div>
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
              onDragEnd={habitsHook.handleHabitDragEnd}
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
                        onEdit={() => habitsHook.openEditHabitDialog(habit)}
                      />
                    ))}
                  </SortableContext>
                  <button
                    onClick={() => habitsHook.setIsAddHabitDialogOpen(true)}
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

      {/* Add Habit Dialog */}
      <Dialog open={habitsHook.isAddHabitDialogOpen} onOpenChange={habitsHook.setIsAddHabitDialogOpen}>
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
                value={habitsHook.habitName}
                onChange={(e) => habitsHook.setHabitName(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={habitsHook.addHabit} className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Habit Dialog */}
      <Dialog open={habitsHook.isEditHabitDialogOpen} onOpenChange={habitsHook.setIsEditHabitDialogOpen}>
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
                value={habitsHook.habitName}
                onChange={(e) => habitsHook.setHabitName(e.target.value)}
                className="rounded-sm border-border bg-card"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center">
            <Button
              onClick={() => habitsHook.editingMetric && habitsHook.deleteMetric(habitsHook.editingMetric.id, true)}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02]"
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Delete
            </Button>
            <Button onClick={habitsHook.updateHabit} className="bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:shadow-md">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
