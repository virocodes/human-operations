"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Metric, DailyEntry } from "../types";
import { formatDate } from "../utils/formatters";

export default function HabitsHistoryPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Metric[]>([]);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [metricsRes, entriesRes] = await Promise.all([
        fetch('/api/metrics'),
        fetch('/api/entries'),
      ]);

      if (metricsRes.ok && entriesRes.ok) {
        const metricsData = await metricsRes.json();
        const entriesData = await entriesRes.json();

        setHabits(metricsData.filter((m: Metric) => m.type === 'boolean'));
        setEntries(entriesData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all days in the current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysArray = [];
    const current = new Date(firstDay);

    while (current <= lastDay) {
      daysArray.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return daysArray;
  };

  const daysInMonth = getDaysInMonth(currentMonth);

  const getEntry = (metricId: string, date: Date) => {
    return entries.find(e => e.metric_id === metricId && e.date === formatDate(date));
  };

  const getCellColor = (entry: DailyEntry | undefined) => {
    if (!entry) return "bg-red-300 dark:bg-red-800 hover:bg-red-400 dark:hover:bg-red-700";
    return entry.value_boolean === true
      ? "bg-green-300 dark:bg-green-800 hover:bg-green-400 dark:hover:bg-green-700"
      : "bg-red-300 dark:bg-red-800 hover:bg-red-400 dark:hover:bg-red-700";
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    const today = new Date();
    // Don't go past current month
    if (next <= today) {
      setCurrentMonth(next);
    }
  };

  const canGoNext = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    const today = new Date();
    return next <= today;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm font-mono text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-y-auto custom-scrollbar bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/home')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-serif font-medium text-foreground">Habits History</h1>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousMonth}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextMonth}
              disabled={!canGoNext()}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm font-mono text-muted-foreground">No habits tracked yet</p>
          </div>
        ) : (
          <div className="bg-card border border-border shadow-sm relative">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

            {/* Habits Table */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse table-fixed">
                <colgroup>
                  <col style={{ width: '140px' }} />
                  {habits.map((habit) => (
                    <col key={habit.id} style={{ width: `${100 / habits.length}%` }} />
                  ))}
                </colgroup>
                <thead className="sticky top-0 bg-card z-10">
                  <tr className="border-b-2 border-border">
                    <th className="text-left px-4 py-1.5 font-mono text-xs tracking-wider uppercase text-muted-foreground border-r-2 border-border bg-card">
                      Date
                    </th>
                    {habits.map((habit) => (
                      <th
                        key={habit.id}
                        className="px-2 py-1.5 font-mono text-xs tracking-wider uppercase text-muted-foreground text-center border-r border-border bg-card"
                      >
                        {habit.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {daysInMonth.map((day) => (
                    <tr key={day.toISOString()} className="border-b border-border">
                      <td className="px-4 py-0 font-mono text-xs text-muted-foreground border-r-2 border-border bg-card h-[32px] sticky left-0 z-[5]">
                        {day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </td>
                      {habits.map((habit) => {
                        const entry = getEntry(habit.id, day);
                        return (
                          <td key={habit.id} className="p-0 border-r border-border">
                            <div
                              className={`w-full h-[32px] cursor-pointer transition-colors ${getCellColor(entry)}`}
                              title={`${habit.name} - ${formatDate(day)}`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
