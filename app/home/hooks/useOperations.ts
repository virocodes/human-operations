import { useState } from 'react';
import { Operation } from '../types';

interface UseOperationsProps {
  operations: Operation[];
  setOperations: (operations: Operation[] | ((prev: Operation[]) => Operation[])) => void;
}

export function useOperations({ operations, setOperations }: UseOperationsProps) {
  const [operationTitle, setOperationTitle] = useState("");
  const [operationDescription, setOperationDescription] = useState("");
  const [operationNotes, setOperationNotes] = useState("");
  const [operationMetricId, setOperationMetricId] = useState("");
  const [operationHabitIds, setOperationHabitIds] = useState<string[]>([]);
  const [isAddOperationDialogOpen, setIsAddOperationDialogOpen] = useState(false);
  const [isEditOperationDialogOpen, setIsEditOperationDialogOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);

  const resetOperationForm = () => {
    setOperationTitle("");
    setOperationDescription("");
    setOperationNotes("");
    setOperationMetricId("");
    setOperationHabitIds([]);
    setEditingOperation(null);
  };

  const addOperation = async () => {
    if (!operationTitle.trim()) return;

    const tempOperation: Operation = {
      id: `temp-${Date.now()}`,
      user_id: '',
      title: operationTitle.trim(),
      description: operationDescription.trim() || undefined,
      notes: operationNotes.trim() || undefined,
      metric_id: operationMetricId || undefined,
      habit_ids: operationHabitIds,
      is_archived: false,
      display_order: operations.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setOperations([...operations, tempOperation]);

    const title = operationTitle.trim();
    const description = operationDescription.trim() || null;
    const notes = operationNotes.trim() || null;
    const metricId = operationMetricId || null;
    const habitIds = operationHabitIds.length > 0 ? operationHabitIds : null;

    resetOperationForm();
    setIsAddOperationDialogOpen(false);

    const response = await fetch('/api/operations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        notes,
        metric_id: metricId,
        habit_ids: habitIds,
      }),
    });

    if (response.ok) {
      const newOperation = await response.json();
      setOperations((prev: Operation[]) => prev.map(o => o.id === tempOperation.id ? newOperation : o));
    } else {
      setOperations((prev: Operation[]) => prev.filter(o => o.id !== tempOperation.id));
    }
  };

  const updateOperation = async () => {
    if (!editingOperation || !operationTitle.trim()) return;

    const previousOperations = operations;
    const updatedOperation: Operation = {
      ...editingOperation,
      title: operationTitle.trim(),
      description: operationDescription.trim() || undefined,
      notes: operationNotes.trim() || undefined,
      metric_id: operationMetricId || undefined,
      habit_ids: operationHabitIds,
      updated_at: new Date().toISOString(),
    };

    setOperations(operations.map(o => o.id === editingOperation.id ? updatedOperation : o));
    resetOperationForm();
    setEditingOperation(null);
    setIsEditOperationDialogOpen(false);

    const response = await fetch('/api/operations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingOperation.id,
        title: operationTitle.trim(),
        description: operationDescription.trim() || null,
        notes: operationNotes.trim() || null,
        metric_id: operationMetricId || null,
        habit_ids: operationHabitIds.length > 0 ? operationHabitIds : null,
        is_archived: editingOperation.is_archived,
      }),
    });

    if (response.ok) {
      const updated = await response.json();
      setOperations((prev: Operation[]) => prev.map(o => o.id === updated.id ? updated : o));
    } else {
      setOperations(previousOperations);
    }
  };

  const toggleArchiveOperation = async (operationId: string, isArchived: boolean) => {
    const previousOperations = operations;
    setOperations(operations.map(o => o.id === operationId ? { ...o, is_archived: !isArchived } : o));

    const response = await fetch('/api/operations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: operationId,
        is_archived: !isArchived,
      }),
    });

    if (response.ok) {
      const updated = await response.json();
      setOperations((prev: Operation[]) => prev.map(o => o.id === updated.id ? updated : o));
    } else {
      setOperations(previousOperations);
    }
  };

  const deleteOperation = async (operationId: string) => {
    const previousOperations = operations;
    setOperations(operations.filter(o => o.id !== operationId));
    setIsEditOperationDialogOpen(false);

    const response = await fetch(`/api/operations?id=${operationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setOperations(previousOperations);
    }
  };

  const openEditOperationDialog = (operation: Operation) => {
    setEditingOperation(operation);
    setOperationTitle(operation.title);
    setOperationDescription(operation.description || "");
    setOperationNotes(operation.notes || "");
    setOperationMetricId(operation.metric_id || "");
    setOperationHabitIds(operation.habit_ids || []);
    setIsEditOperationDialogOpen(true);
  };

  const toggleNotes = (operationId: string) => {
    setExpandedNotes(expandedNotes === operationId ? null : operationId);
  };

  return {
    operationTitle,
    setOperationTitle,
    operationDescription,
    setOperationDescription,
    operationNotes,
    setOperationNotes,
    operationMetricId,
    setOperationMetricId,
    operationHabitIds,
    setOperationHabitIds,
    isAddOperationDialogOpen,
    setIsAddOperationDialogOpen,
    isEditOperationDialogOpen,
    setIsEditOperationDialogOpen,
    editingOperation,
    expandedNotes,
    resetOperationForm,
    addOperation,
    updateOperation,
    toggleArchiveOperation,
    deleteOperation,
    openEditOperationDialog,
    toggleNotes,
  };
}
