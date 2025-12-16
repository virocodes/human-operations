"use client";

import { Metric, DailyEntry, MetricType } from "../../types";
import { formatDate, formatDayHeader, canEdit } from "../../utils/formatters";
import { NumericInputCell } from "../shared/NumericInputCell";

interface MetricCardProps {
  metric: Metric;
  days: Date[];
  entries: DailyEntry[];
  updateEntry: (metricId: string, date: Date, value: boolean | number, type: MetricType) => Promise<void>;
  getCellColor: (entry: DailyEntry | undefined, metric?: Metric) => string;
  onEdit: () => void;
}

export function MetricCard({
  metric,
  days,
  entries,
  updateEntry,
  getCellColor,
  onEdit,
}: MetricCardProps) {
  const getEntry = (metricId: string, date: Date) => {
    return entries.find(e => e.metric_id === metricId && e.date === formatDate(date));
  };

  const getTargetDisplay = () => {
    if (!metric.optimal_value || !metric.minimum_value || !metric.operator) {
      return `${metric.unit} (raw tracking)`;
    }

    const operatorText = metric.operator.replace(/_/g, ' ');
    return `${metric.optimal_value} ${metric.unit} (${operatorText})`;
  };

  return (
    <div className="bg-card border border-border shadow-sm p-4 md:p-6 relative overflow-hidden">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 md:w-3 md:h-3 border-t md:border-t-2 border-l md:border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
      <div className="absolute top-0 right-0 w-2 h-2 md:w-3 md:h-3 border-t md:border-t-2 border-r md:border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 md:w-3 md:h-3 border-b md:border-b-2 border-l md:border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 border-b md:border-b-2 border-r md:border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1">
          <h4
            className="text-sm md:text-base font-mono uppercase tracking-wider cursor-pointer text-foreground hover:text-foreground/80 transition-colors"
            onClick={onEdit}
          >
            {metric.name}
          </h4>
          {metric.unit && (
            <p className="text-xs font-mono text-muted-foreground mt-1">
              {getTargetDisplay()}
            </p>
          )}
        </div>
      </div>

      {/* Desktop: Horizontal 7-day grid */}
      <div className="hidden md:grid md:grid-cols-7 gap-2">
        {days.map(day => {
          const entry = getEntry(metric.id, day);
          const cellColor = getCellColor(entry, metric);
          const isEditable = canEdit(day);

          return (
            <div key={formatDate(day)}>
              <div className="text-xs font-mono text-center text-muted-foreground mb-1">
                {formatDayHeader(day).split(' ')[0]}
              </div>
              <div className={`${cellColor} border border-border p-3 min-h-[60px] flex items-center justify-center`}>
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

      {/* Mobile: Vertical day list */}
      <div className="block md:hidden space-y-2">
        {days.map(day => {
          const entry = getEntry(metric.id, day);
          const cellColor = getCellColor(entry, metric);
          const isEditable = canEdit(day);

          return (
            <div key={formatDate(day)} className="flex items-center gap-3">
              <div className="w-20 flex-shrink-0">
                <div className="text-xs font-mono text-muted-foreground">
                  {formatDayHeader(day)}
                </div>
              </div>
              <div className={`flex-1 ${cellColor} border border-border p-3`}>
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
  );
}
