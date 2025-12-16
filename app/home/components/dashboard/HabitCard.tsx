"use client";

import { Edit2 } from "lucide-react";
import { Metric, DailyEntry, MetricType } from "../../types";
import { formatDate, formatDayHeader, canEdit } from "../../utils/formatters";

interface HabitCardProps {
  habit: Metric;
  days: Date[];
  entries: DailyEntry[];
  updateEntry: (metricId: string, date: Date, value: boolean | number, type: MetricType) => Promise<void>;
  getCellColor: (entry: DailyEntry | undefined, metric?: Metric) => string;
  onEdit: () => void;
}

export function HabitCard({
  habit,
  days,
  entries,
  updateEntry,
  getCellColor,
  onEdit,
}: HabitCardProps) {
  const getEntry = (metricId: string, date: Date) => {
    return entries.find(e => e.metric_id === metricId && e.date === formatDate(date));
  };

  const formatDayShort = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'narrow' });
  };

  return (
    <div className="bg-card border border-border shadow-sm p-4 relative overflow-hidden">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-900 dark:border-[#e5e5e5]"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-900 dark:border-[#e5e5e5]"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-900 dark:border-[#e5e5e5]"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-900 dark:border-[#e5e5e5]"></div>

      {/* Header: name + edit button */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-mono text-sm uppercase tracking-wider text-foreground">
          {habit.name}
        </h4>
        <button
          onClick={onEdit}
          className="p-1.5 hover:bg-accent rounded-sm transition-colors"
        >
          <Edit2 className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* 7-day horizontal grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map(day => {
          const entry = getEntry(habit.id, day);
          const cellColor = getCellColor(entry, habit);
          const isEditable = canEdit(day);

          return (
            <div key={formatDate(day)}>
              <div className="text-[10px] font-mono text-center text-muted-foreground mb-1">
                {formatDayShort(day)}
              </div>
              <button
                onClick={() => {
                  if (isEditable) {
                    updateEntry(habit.id, day, !entry?.value_boolean, 'boolean');
                  }
                }}
                className={`w-full aspect-square ${cellColor} border border-border transition-colors ${
                  isEditable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
                disabled={!isEditable}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
