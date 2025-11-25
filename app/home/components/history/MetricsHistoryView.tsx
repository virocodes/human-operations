"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Metric, DailyEntry } from "../../types";
import { formatDate } from "../../utils/formatters";

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

interface MetricsHistoryViewProps {
  metrics: Metric[];
  entries: DailyEntry[];
  onClose: () => void;
}

export function MetricsHistoryView({ metrics, entries, onClose }: MetricsHistoryViewProps) {
  const [timeRanges, setTimeRanges] = useState<Record<string, TimeRange>>({});
  const [hoveredPoint, setHoveredPoint] = useState<{ metricId: string; index: number } | null>(null);

  // Initialize time ranges to '30d' for each metric
  const numericMetrics = metrics.filter((m: Metric) => m.type === 'numeric');
  if (Object.keys(timeRanges).length === 0 && numericMetrics.length > 0) {
    const initialRanges: Record<string, TimeRange> = {};
    numericMetrics.forEach((m: Metric) => {
      initialRanges[m.id] = '30d';
    });
    setTimeRanges(initialRanges);
  }

  const getDaysForRange = (range: TimeRange) => {
    const daysArray = [];
    let numDays: number;

    switch (range) {
      case '7d':
        numDays = 7;
        break;
      case '30d':
        numDays = 30;
        break;
      case '90d':
        numDays = 90;
        break;
      case '1y':
        numDays = 365;
        break;
      case 'all':
        numDays = 1000; // Large number to get all data
        break;
      default:
        numDays = 30;
    }

    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      daysArray.push(date);
    }
    return daysArray;
  };

  const setMetricTimeRange = (metricId: string, range: TimeRange) => {
    setTimeRanges(prev => ({ ...prev, [metricId]: range }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-serif font-medium text-foreground">Metrics History</h1>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Historical Data</p>
              </div>
            </div>
          </div>

          {/* Metrics List */}
          <div className="space-y-6">
            {numericMetrics.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm font-mono text-muted-foreground">No metrics tracked yet</p>
              </div>
            ) : (
              numericMetrics.map(metric => {
                const timeRange = timeRanges[metric.id] || '30d';
                const days = getDaysForRange(timeRange);

                const metricEntries = days.map(day => {
                  const dateStr = formatDate(day);
                  const entry = entries.find(e => e.metric_id === metric.id && e.date === dateStr);
                  return { date: day, value: entry?.value_numeric };
                });

                const validValues = metricEntries.filter(e => e.value !== undefined && e.value !== null).map(e => e.value!);
                const average = validValues.length > 0 ? validValues.reduce((sum, v) => sum + v, 0) / validValues.length : 0;
                const max = validValues.length > 0 ? Math.max(...validValues) : 0;
                const min = validValues.length > 0 ? Math.min(...validValues) : 0;

                // Calculate chart dimensions
                const chartHeight = 240;
                const padding = { top: 30, right: 5, bottom: 40, left: 25 };
                // Use a wider aspect ratio to fill the container
                const aspectRatio = 4.6; // width:height ratio
                const chartWidth = chartHeight * aspectRatio;
                const innerWidth = chartWidth - padding.left - padding.right;
                const innerHeight = chartHeight - padding.top - padding.bottom;

                // Scale functions
                const valueRange = max - min || 1;
                const xScale = (index: number) => (index / Math.max(metricEntries.length - 1, 1)) * innerWidth;
                const yScale = (value: number) => innerHeight - ((value - min) / valueRange) * innerHeight;

                // Calculate x-axis labels based on time range
                let labelIndices: number[] = [];
                if (timeRange === '7d') {
                  // Show all 7 days
                  labelIndices = Array.from({ length: metricEntries.length }, (_, i) => i);
                } else if (timeRange === '30d') {
                  // Show every ~5 days (about 6-7 labels)
                  const step = Math.floor(metricEntries.length / 6);
                  labelIndices = Array.from({ length: 7 }, (_, i) => Math.min(i * step, metricEntries.length - 1));
                  // Remove duplicates
                  labelIndices = [...new Set(labelIndices)];
                } else if (timeRange === '90d') {
                  // Show every ~15 days (about 6 labels)
                  const step = Math.floor(metricEntries.length / 6);
                  labelIndices = Array.from({ length: 7 }, (_, i) => Math.min(i * step, metricEntries.length - 1));
                  labelIndices = [...new Set(labelIndices)];
                } else if (timeRange === '1y') {
                  // Show every ~2 months (about 6 labels)
                  const step = Math.floor(metricEntries.length / 6);
                  labelIndices = Array.from({ length: 7 }, (_, i) => Math.min(i * step, metricEntries.length - 1));
                  labelIndices = [...new Set(labelIndices)];
                } else {
                  // 'all' - show about 6-8 evenly spaced labels
                  const step = Math.floor(metricEntries.length / 6);
                  labelIndices = Array.from({ length: 7 }, (_, i) => Math.min(i * step, metricEntries.length - 1));
                  labelIndices = [...new Set(labelIndices)];
                }

                // Generate line path
                const validPoints = metricEntries
                  .map((e, i) => ({
                    x: xScale(i),
                    y: e.value !== undefined && e.value !== null ? yScale(e.value) : null,
                    value: e.value,
                    date: e.date,
                    originalIndex: i
                  }))
                  .filter(p => p.y !== null) as { x: number; y: number; value: number | undefined; date: Date; originalIndex: number }[];

                const linePath = validPoints.length > 0
                  ? validPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
                  : '';

                return (
                  <div
                    key={metric.id}
                    className="bg-card border border-border shadow-sm p-6 relative overflow-hidden"
                  >
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-mono uppercase tracking-wider text-foreground">{metric.name}</h3>
                        <p className="text-xs font-mono text-muted-foreground mt-1">Unit: {metric.unit}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <div>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">Avg</span>
                          <span className="text-sm font-mono font-bold text-foreground ml-2">{average.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">Range</span>
                          <span className="text-xs font-mono text-foreground ml-2">{min.toFixed(0)}-{max.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Time Range Selector */}
                    <div className="mb-4 flex gap-2">
                      {(['7d', '30d', '90d', '1y', 'all'] as TimeRange[]).map(range => (
                        <Button
                          key={range}
                          variant={timeRange === range ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setMetricTimeRange(metric.id, range)}
                          className="h-7 text-xs font-mono uppercase cursor-pointer"
                        >
                          {range === '7d' ? '1W' : range === '30d' ? '1M' : range === '90d' ? '3M' : range === '1y' ? '1Y' : 'All'}
                        </Button>
                      ))}
                    </div>

                    {/* Chart */}
                    <div className="border border-border overflow-hidden bg-muted/20 relative">
                      <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
                        <g transform={`translate(${padding.left}, ${padding.top})`}>
                          {/* Grid lines */}
                          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
                            <line
                              key={ratio}
                              x1={0}
                              y1={ratio * innerHeight}
                              x2={innerWidth}
                              y2={ratio * innerHeight}
                              stroke="currentColor"
                              strokeWidth="0.5"
                              className="text-border opacity-50"
                            />
                          ))}

                          {/* Y-axis labels */}
                          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                            const value = max - ratio * valueRange;
                            return (
                              <text
                                key={ratio}
                                x={-10}
                                y={ratio * innerHeight + 4}
                                textAnchor="end"
                                className="text-[10px] font-mono fill-muted-foreground"
                              >
                                {value.toFixed(0)}
                              </text>
                            );
                          })}

                          {/* X-axis labels */}
                          {labelIndices.map(idx => {
                            const entry = metricEntries[idx];
                            if (!entry) return null;
                            return (
                              <text
                                key={idx}
                                x={xScale(idx)}
                                y={innerHeight + 20}
                                textAnchor="middle"
                                className="text-[10px] font-mono fill-muted-foreground"
                              >
                                {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </text>
                            );
                          })}

                          {/* Line */}
                          {linePath && (
                            <path
                              d={linePath}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-primary"
                            />
                          )}

                          {/* Points */}
                          {validPoints.map((point, i) => {
                            const isHovered = hoveredPoint?.metricId === metric.id && hoveredPoint?.index === point.originalIndex;
                            // Position tooltip below if point is in top 40% of chart
                            const showBelow = point.y < innerHeight * 0.4;
                            const tooltipY = showBelow ? point.y + 15 : point.y - 45;
                            const textY1 = showBelow ? point.y + 28 : point.y - 28;
                            const textY2 = showBelow ? point.y + 41 : point.y - 15;

                            return (
                              <g key={i}>
                                <circle
                                  cx={point.x}
                                  cy={point.y}
                                  r={isHovered ? "5" : "3"}
                                  fill="currentColor"
                                  className="text-primary cursor-pointer transition-all"
                                  onMouseEnter={() => setHoveredPoint({ metricId: metric.id, index: point.originalIndex })}
                                  onMouseLeave={() => setHoveredPoint(null)}
                                />
                                {isHovered && (
                                  <g>
                                    <rect
                                      x={point.x - 60}
                                      y={tooltipY}
                                      width="120"
                                      height="35"
                                      stroke="currentColor"
                                      strokeWidth="1"
                                      className="stroke-border fill-card"
                                      rx="4"
                                    />
                                    <text
                                      x={point.x}
                                      y={textY1}
                                      textAnchor="middle"
                                      className="text-[10px] font-mono fill-muted-foreground"
                                    >
                                      {point.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </text>
                                    <text
                                      x={point.x}
                                      y={textY2}
                                      textAnchor="middle"
                                      className="text-xs font-mono fill-foreground font-bold"
                                    >
                                      {point.value?.toFixed(1)} {metric.unit}
                                    </text>
                                  </g>
                                )}
                              </g>
                            );
                          })}
                        </g>
                      </svg>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
