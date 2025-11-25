"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, FolderPlus } from "lucide-react";
import { NumericInputCell } from '../shared/NumericInputCell';
import { Metric, DailyEntry, MetricType, Operator } from '../../types';
import { formatDate, formatDayHeader, isToday, isYesterday } from '../../utils/formatters';

interface MetricsPageProps {
  days: Date[];
  metricsHook: {
    metricName: string;
    setMetricName: (name: string) => void;
    metricUnit: string;
    setMetricUnit: (unit: string) => void;
    metricCategoryId: string;
    setMetricCategoryId: (id: string) => void;
    metricOptimalValue: string;
    setMetricOptimalValue: (value: string) => void;
    metricMinimumValue: string;
    setMetricMinimumValue: (value: string) => void;
    metricOperator: Operator;
    setMetricOperator: (operator: Operator) => void;
    isAddMetricDialogOpen: boolean;
    setIsAddMetricDialogOpen: (open: boolean) => void;
    isEditMetricDialogOpen: boolean;
    setIsEditMetricDialogOpen: (open: boolean) => void;
    editingMetric: Metric | null;
    isAddCategoryDialogOpen: boolean;
    setIsAddCategoryDialogOpen: (open: boolean) => void;
    categoryName: string;
    setCategoryName: (name: string) => void;
    selectedCategory: string | null | 'all';
    setSelectedCategory: (category: string | null | 'all') => void;
    filteredTrackedMetrics: Metric[];
    addMetric: () => Promise<void>;
    addCategory: () => Promise<void>;
    updateMetric: () => Promise<void>;
    deleteMetric: (id: string) => Promise<void>;
    openEditMetricDialog: (metric: Metric) => void;
  };
  entries: DailyEntry[];
  setEntries: (entries: DailyEntry[] | ((prev: DailyEntry[]) => DailyEntry[])) => void;
  categories: Array<{ id: string; name: string; display_order: number }>;
  loadEntries: () => Promise<void>;
}

export function MetricsPage({ days, metricsHook, entries, setEntries, categories, loadEntries }: MetricsPageProps) {
  const {
    metricName,
    setMetricName,
    metricUnit,
    setMetricUnit,
    metricCategoryId,
    setMetricCategoryId,
    metricOptimalValue,
    setMetricOptimalValue,
    metricMinimumValue,
    setMetricMinimumValue,
    metricOperator,
    setMetricOperator,
    isAddMetricDialogOpen,
    setIsAddMetricDialogOpen,
    isEditMetricDialogOpen,
    setIsEditMetricDialogOpen,
    editingMetric,
    isAddCategoryDialogOpen,
    setIsAddCategoryDialogOpen,
    categoryName,
    setCategoryName,
    selectedCategory,
    setSelectedCategory,
    filteredTrackedMetrics,
    addMetric,
    addCategory,
    updateMetric,
    deleteMetric,
    openEditMetricDialog,
  } = metricsHook;

  const router = useRouter();

  // Helper functions
  const getEntry = (metricId: string, date: Date) => {
    return entries.find(e => e.metric_id === metricId && e.date === formatDate(date));
  };

  const canEdit = (date: Date) => {
    return isToday(date) || isYesterday(date);
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

  return (
    <>
      {/* Tracked Metrics Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-serif font-medium text-foreground">Tracked Metrics</h3>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Numeric Values by Category</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push('/home/metrics-history')}
              variant="outline"
              className="font-mono text-xs tracking-widest uppercase rounded-sm"
            >
              View History
            </Button>
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
        {(categories.length > 0 || filteredTrackedMetrics.length > 0) && (
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
              onClick={() => editingMetric && deleteMetric(editingMetric.id)}
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
    </>
  );
}
