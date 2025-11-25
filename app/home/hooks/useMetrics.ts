import { useState } from 'react';
import { Metric, Category, DailyEntry, MetricType, Operator } from '../types';

interface UseMetricsProps {
  trackedMetrics: Metric[];
  setTrackedMetrics: (metrics: Metric[] | ((prev: Metric[]) => Metric[])) => void;
  categories: Category[];
  setCategories: (categories: Category[] | ((prev: Category[]) => Category[])) => void;
  entries: DailyEntry[];
  setEntries: (entries: DailyEntry[] | ((prev: DailyEntry[]) => DailyEntry[])) => void;
}

export function useMetrics({
  trackedMetrics,
  setTrackedMetrics,
  categories,
  setCategories,
  entries,
  setEntries
}: UseMetricsProps) {
  const [metricName, setMetricName] = useState("");
  const [metricUnit, setMetricUnit] = useState("");
  const [metricCategoryId, setMetricCategoryId] = useState<string>("");
  const [metricOptimalValue, setMetricOptimalValue] = useState("");
  const [metricMinimumValue, setMetricMinimumValue] = useState("");
  const [metricOperator, setMetricOperator] = useState<Operator>("at_least");
  const [isAddMetricDialogOpen, setIsAddMetricDialogOpen] = useState(false);
  const [isEditMetricDialogOpen, setIsEditMetricDialogOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null | 'all'>('all');

  const addMetric = async () => {
    if (!metricName.trim()) return;

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

  const updateMetric = async () => {
    if (!editingMetric || !metricName.trim()) return;

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
      setTrackedMetrics(previousMetrics);
    }
  };

  const deleteMetric = async (id: string) => {
    const previousMetrics = trackedMetrics;
    const previousEntries = entries;

    setTrackedMetrics(trackedMetrics.filter(m => m.id !== id));
    setIsEditMetricDialogOpen(false);
    setEntries(entries.filter(e => e.metric_id !== id));

    const response = await fetch(`/api/metrics?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setTrackedMetrics(previousMetrics);
      setEntries(previousEntries);
    }
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

  const filteredTrackedMetrics = trackedMetrics.filter(metric => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === null) return metric.category_id === null;
    return metric.category_id === selectedCategory;
  });

  return {
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
  };
}
