"use client";

import { useState } from "react";
import { Plus, Edit2, Check, X, Trash2 } from "lucide-react";

interface Operation {
  id: string;
  name: string;
  description: string;
  linked_goals?: string[];
}

interface Goal {
  id: string;
  title: string;
  operation_name?: string;
  operation_id?: string;
  goal_type: string;
}

interface Habit {
  id: string;
  name: string;
  linked_operation: string;
}

interface Metric {
  id: string;
  name: string;
  unit: string;
  optimal_value: number;
  minimum_value: number;
  operator: string;
  linked_operation: string;
}

interface Schedule {
  wakeHour: number;
  sleepHour: number;
}

interface ReviewPageProps {
  operations: Operation[];
  goals: Goal[];
  habits: Habit[];
  metrics: Metric[];
  schedule: Schedule | null;
  onUpdate: (data: {
    operations: Operation[];
    goals: Goal[];
    habits: Habit[];
    metrics: Metric[];
    schedule: Schedule | null;
  }) => void;
  onStartOver: () => void;
  onFinalize: () => void;
  isFinalizing?: boolean;
}

type EditingItem = {
  type: 'operation' | 'goal' | 'habit' | 'metric';
  id: string;
  field: string;
  value: string | number;
} | null;

export function ReviewPage({
  operations,
  goals,
  habits,
  metrics,
  schedule,
  onUpdate,
  onStartOver,
  onFinalize,
  isFinalizing = false
}: ReviewPageProps) {
  const [editing, setEditing] = useState<EditingItem>(null);
  const [showAddOperation, setShowAddOperation] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddMetric, setShowAddMetric] = useState(false);

  const startEdit = (type: 'operation' | 'goal' | 'habit' | 'metric', id: string, field: string, value: string | number) => {
    setEditing({ type, id, field, value });
  };

  const saveEdit = () => {
    if (!editing) return;

    const { type, id, field, value } = editing;

    if (type === 'operation') {
      const updated = operations.map(op =>
        op.id === id ? { ...op, [field]: value } : op
      );
      onUpdate({ operations: updated, goals, habits, metrics, schedule });
    } else if (type === 'goal') {
      const updated = goals.map(g =>
        g.id === id ? { ...g, [field]: value } : g
      );
      onUpdate({ operations, goals: updated, habits, metrics, schedule });
    } else if (type === 'habit') {
      const updated = habits.map(h =>
        h.id === id ? { ...h, [field]: value } : h
      );
      onUpdate({ operations, goals, habits: updated, metrics, schedule });
    } else if (type === 'metric') {
      const updated = metrics.map(m =>
        m.id === id ? { ...m, [field]: field === 'optimal_value' || field === 'minimum_value' ? Number(value) : value } : m
      );
      onUpdate({ operations, goals, habits, metrics: updated, schedule });
    }

    setEditing(null);
  };

  const deleteItem = (type: 'operation' | 'goal' | 'habit' | 'metric', id: string) => {
    if (type === 'operation') {
      onUpdate({ operations: operations.filter(op => op.id !== id), goals, habits, metrics, schedule });
    } else if (type === 'goal') {
      onUpdate({ operations, goals: goals.filter(g => g.id !== id), habits, metrics, schedule });
    } else if (type === 'habit') {
      onUpdate({ operations, goals, habits: habits.filter(h => h.id !== id), metrics, schedule });
    } else if (type === 'metric') {
      onUpdate({ operations, goals, habits, metrics: metrics.filter(m => m.id !== id), schedule });
    }
  };

  const addOperation = (name: string, description: string) => {
    const newOp: Operation = {
      id: `op-${Date.now()}`,
      name,
      description
    };
    onUpdate({ operations: [...operations, newOp], goals, habits, metrics, schedule });
    setShowAddOperation(false);
  };

  const addGoal = (title: string, operationName: string) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title,
      operation_name: operationName,
      goal_type: 'metric_based'
    };
    onUpdate({ operations, goals: [...goals, newGoal], habits, metrics, schedule });
    setShowAddGoal(false);
  };

  const addHabit = (name: string, linkedOperation: string) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      name,
      linked_operation: linkedOperation
    };
    onUpdate({ operations, goals, habits: [...habits, newHabit], metrics, schedule });
    setShowAddHabit(false);
  };

  const addMetric = (name: string, unit: string, optimal: number, minimum: number, operator: string, linkedOperation: string) => {
    const newMetric: Metric = {
      id: `metric-${Date.now()}`,
      name,
      unit,
      optimal_value: optimal,
      minimum_value: minimum,
      operator,
      linked_operation: linkedOperation
    };
    onUpdate({ operations, goals, habits, metrics: [...metrics, newMetric], schedule });
    setShowAddMetric(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-light text-gray-900 dark:text-white">
          Your System
        </h1>
        <p className="text-sm font-mono text-gray-600 dark:text-slate-400 uppercase tracking-wider">
          Review, edit, and customize
        </p>
      </div>

      {/* Operations - Full Width Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">
            Operations ({operations.length})
          </h2>
          <button
            onClick={() => setShowAddOperation(true)}
            className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>

        {operations.map((op) => (
          <div key={op.id} className="bg-card border-2 border-border p-6 relative group">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-white pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-white pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-white pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-white pointer-events-none"></div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                {/* Name */}
                {editing?.type === 'operation' && editing?.id === op.id && editing?.field === 'name' ? (
                  <input
                    type="text"
                    value={editing.value as string}
                    onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                    className="w-full px-2 py-1 bg-background border border-border text-2xl font-serif text-gray-900 dark:text-white"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-serif text-gray-900 dark:text-white">{op.name}</h3>
                    <button
                      onClick={() => startEdit('operation', op.id, 'name', op.name)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded transition-opacity cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                )}

                {/* Description */}
                {editing?.type === 'operation' && editing?.id === op.id && editing?.field === 'description' ? (
                  <textarea
                    value={editing.value as string}
                    onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                    className="w-full px-2 py-1 bg-background border border-border text-sm text-gray-600 dark:text-slate-400"
                    rows={2}
                    autoFocus
                  />
                ) : (
                  <div className="flex items-start gap-2">
                    <p className="text-sm text-gray-600 dark:text-slate-400 flex-1">{op.description}</p>
                    <button
                      onClick={() => startEdit('operation', op.id, 'description', op.description)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded transition-opacity cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                )}

                {/* Linked Items */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="text-xs font-mono text-gray-500 dark:text-slate-500">
                    {goals.filter(g => g.operation_name === op.name).length} goals
                  </div>
                  <div className="text-xs font-mono text-gray-500 dark:text-slate-500">
                    {habits.filter(h => h.linked_operation === op.name).length} habits
                  </div>
                  <div className="text-xs font-mono text-gray-500 dark:text-slate-500">
                    {metrics.filter(m => m.linked_operation === op.name).length} metrics
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {editing?.id === op.id && editing?.type === 'operation' && (
                  <button onClick={saveEdit} className="p-2 hover:bg-accent rounded cursor-pointer">
                    <Check className="h-4 w-4 text-green-600" />
                  </button>
                )}
                <button onClick={() => deleteItem('operation', op.id)} className="p-2 hover:bg-accent rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Nested Goals */}
            {goals.filter(g => g.operation_name === op.name).length > 0 && (
              <div className="mt-4 ml-4 space-y-2 border-l-2 border-gray-200 dark:border-slate-700 pl-4">
                {goals.filter(g => g.operation_name === op.name).map(goal => (
                  <div key={goal.id} className="flex items-center justify-between gap-4 group/item">
                    {editing?.type === 'goal' && editing?.id === goal.id && editing?.field === 'title' ? (
                      <input
                        type="text"
                        value={editing.value as string}
                        onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                        className="flex-1 px-2 py-1 bg-background border border-border text-sm font-serif text-gray-900 dark:text-white"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                      />
                    ) : (
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm font-serif text-gray-900 dark:text-white">{goal.title}</span>
                        <button
                          onClick={() => startEdit('goal', goal.id, 'title', goal.title)}
                          className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-accent rounded cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-1">
                      {editing?.id === goal.id && <button onClick={saveEdit} className="p-1 cursor-pointer"><Check className="h-3 w-3 text-green-600" /></button>}
                      <button onClick={() => deleteItem('goal', goal.id)} className="opacity-0 group-hover/item:opacity-100 p-1 cursor-pointer"><X className="h-3 w-3 text-red-600" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {showAddOperation && <AddOperationForm onAdd={addOperation} onCancel={() => setShowAddOperation(false)} />}
      </div>

      {/* Grid Layout for Habits and Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Habits */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">
              Daily Habits ({habits.length})
            </h2>
            <button
              onClick={() => setShowAddHabit(true)}
              className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>

          {habits.map(habit => (
            <div key={habit.id} className="bg-card border border-border p-4 group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1">
                  {editing?.type === 'habit' && editing?.id === habit.id && editing?.field === 'name' ? (
                    <input
                      type="text"
                      value={editing.value as string}
                      onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                      className="w-full px-2 py-1 bg-background border border-border text-sm font-serif"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-serif text-gray-900 dark:text-white">{habit.name}</p>
                      <button onClick={() => startEdit('habit', habit.id, 'name', habit.name)} className="opacity-0 group-hover:opacity-100 p-1 cursor-pointer">
                        <Edit2 className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs font-mono text-gray-500 dark:text-slate-500">→ {habit.linked_operation}</p>
                </div>
                <div className="flex gap-1">
                  {editing?.id === habit.id && <button onClick={saveEdit} className="p-1 cursor-pointer"><Check className="h-3 w-3 text-green-600" /></button>}
                  <button onClick={() => deleteItem('habit', habit.id)} className="opacity-0 group-hover:opacity-100 p-1 cursor-pointer"><Trash2 className="h-3 w-3 text-red-600" /></button>
                </div>
              </div>
            </div>
          ))}

          {showAddHabit && <AddHabitForm operations={operations} onAdd={addHabit} onCancel={() => setShowAddHabit(false)} />}
        </div>

        {/* Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">
              Metrics ({metrics.length})
            </h2>
            <button
              onClick={() => setShowAddMetric(true)}
              className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>

          {metrics.map(metric => (
            <div key={metric.id} className="bg-card border border-border p-4 group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1">
                  {editing?.type === 'metric' && editing?.id === metric.id && editing?.field === 'name' ? (
                    <input
                      type="text"
                      value={editing.value as string}
                      onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                      className="w-full px-2 py-1 bg-background border border-border text-sm font-serif"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-serif text-gray-900 dark:text-white">{metric.name}</p>
                      <button onClick={() => startEdit('metric', metric.id, 'name', metric.name)} className="opacity-0 group-hover:opacity-100 p-1 cursor-pointer">
                        <Edit2 className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-slate-500">
                    {metric.optimal_value !== null && metric.minimum_value !== null && metric.operator ? (
                      <>
                        {editing?.type === 'metric' && editing?.id === metric.id && editing?.field === 'optimal_value' ? (
                          <input
                            type="number"
                            value={editing.value as number}
                            onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                            className="w-16 px-1 py-0.5 bg-background border border-border"
                            autoFocus
                          />
                        ) : (
                          <span onClick={() => startEdit('metric', metric.id, 'optimal_value', metric.optimal_value)} className="cursor-pointer hover:text-gray-900 dark:hover:text-white">
                            {metric.optimal_value}
                          </span>
                        )}
                        <span>{metric.unit}</span>
                        <span>({metric.operator.replace('_', ' ')})</span>
                      </>
                    ) : (
                      <span>{metric.unit} (raw tracking)</span>
                    )}
                  </div>

                  <p className="text-xs font-mono text-gray-500 dark:text-slate-500">→ {metric.linked_operation}</p>
                </div>
                <div className="flex gap-1">
                  {editing?.id === metric.id && <button onClick={saveEdit} className="p-1 cursor-pointer"><Check className="h-3 w-3 text-green-600" /></button>}
                  <button onClick={() => deleteItem('metric', metric.id)} className="opacity-0 group-hover:opacity-100 p-1 cursor-pointer"><Trash2 className="h-3 w-3 text-red-600" /></button>
                </div>
              </div>
            </div>
          ))}

          {showAddMetric && <AddMetricForm operations={operations} onAdd={addMetric} onCancel={() => setShowAddMetric(false)} />}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 pt-8">
        <button
          onClick={onStartOver}
          disabled={isFinalizing}
          className="px-8 py-3 border border-gray-900 dark:border-white text-gray-900 dark:text-white font-mono text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-900 dark:disabled:hover:bg-transparent dark:disabled:hover:text-white"
        >
          Start Over
        </button>
        <button
          onClick={onFinalize}
          disabled={isFinalizing}
          className="px-12 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono text-xs uppercase tracking-widest hover:scale-[1.02] transition-all duration-150 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isFinalizing ? 'Finalizing...' : 'Finalize System'}
        </button>
      </div>
    </div>
  );
}

// Add Operation Form
function AddOperationForm({ onAdd, onCancel }: { onAdd: (name: string, desc: string) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="bg-card border-2 border-dashed border-border p-6 space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Operation name"
        className="w-full px-3 py-2 bg-background border border-border text-gray-900 dark:text-white font-serif"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full px-3 py-2 bg-background border border-border text-gray-900 dark:text-white font-serif"
        rows={2}
      />
      <div className="flex gap-2">
        <button onClick={() => onAdd(name, description)} className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-mono uppercase cursor-pointer">Add</button>
        <button onClick={onCancel} className="px-4 py-2 border border-border text-xs font-mono uppercase cursor-pointer">Cancel</button>
      </div>
    </div>
  );
}

// Add Habit Form
function AddHabitForm({ operations, onAdd, onCancel }: { operations: Operation[]; onAdd: (name: string, linkedOp: string) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [linkedOp, setLinkedOp] = useState(operations[0]?.name || '');

  return (
    <div className="bg-card border-2 border-dashed border-border p-4 space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Habit name (daily, yes/no)"
        className="w-full px-3 py-2 bg-background border border-border text-sm"
      />
      <select value={linkedOp} onChange={(e) => setLinkedOp(e.target.value)} className="w-full px-3 py-2 bg-background border border-border text-sm">
        {operations.map(op => <option key={op.id} value={op.name}>{op.name}</option>)}
      </select>
      <div className="flex gap-2">
        <button onClick={() => onAdd(name, linkedOp)} className="px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-mono uppercase cursor-pointer">Add</button>
        <button onClick={onCancel} className="px-4 py-1.5 border border-border text-xs font-mono uppercase cursor-pointer">Cancel</button>
      </div>
    </div>
  );
}

// Add Metric Form
function AddMetricForm({ operations, onAdd, onCancel }: { operations: Operation[]; onAdd: (name: string, unit: string, optimal: number, minimum: number, operator: string, linkedOp: string) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [optimal, setOptimal] = useState(0);
  const [minimum, setMinimum] = useState(0);
  const [operator, setOperator] = useState('at_least');
  const [linkedOp, setLinkedOp] = useState(operations[0]?.name || '');

  return (
    <div className="bg-card border-2 border-dashed border-border p-4 space-y-3">
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Metric name" className="w-full px-3 py-2 bg-background border border-border text-sm" />
      <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit (hours, steps, etc)" className="w-full px-3 py-2 bg-background border border-border text-sm" />
      <div className="grid grid-cols-2 gap-2">
        <input type="number" value={optimal} onChange={(e) => setOptimal(Number(e.target.value))} placeholder="Optimal" className="px-3 py-2 bg-background border border-border text-sm" />
        <input type="number" value={minimum} onChange={(e) => setMinimum(Number(e.target.value))} placeholder="Minimum" className="px-3 py-2 bg-background border border-border text-sm" />
      </div>
      <select value={operator} onChange={(e) => setOperator(e.target.value)} className="w-full px-3 py-2 bg-background border border-border text-sm">
        <option value="at_least">At Least</option>
        <option value="at_most">At Most</option>
        <option value="exactly">Exactly</option>
      </select>
      <select value={linkedOp} onChange={(e) => setLinkedOp(e.target.value)} className="w-full px-3 py-2 bg-background border border-border text-sm">
        {operations.map(op => <option key={op.id} value={op.name}>{op.name}</option>)}
      </select>
      <div className="flex gap-2">
        <button onClick={() => onAdd(name, unit, optimal, minimum, operator, linkedOp)} className="px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-mono uppercase cursor-pointer">Add</button>
        <button onClick={onCancel} className="px-4 py-1.5 border border-border text-xs font-mono uppercase cursor-pointer">Cancel</button>
      </div>
    </div>
  );
}

// Add Goal Form
function AddGoalForm({ operations, onAdd, onCancel }: { operations: Operation[]; onAdd: (title: string, opName: string) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [opName, setOpName] = useState(operations[0]?.name || '');

  return (
    <div className="bg-card border-2 border-dashed border-border p-4 space-y-3 ml-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Goal title"
        className="w-full px-3 py-2 bg-background border border-border text-sm"
      />
      <select value={opName} onChange={(e) => setOpName(e.target.value)} className="w-full px-3 py-2 bg-background border border-border text-sm">
        {operations.map(op => <option key={op.id} value={op.name}>{op.name}</option>)}
      </select>
      <div className="flex gap-2">
        <button onClick={() => onAdd(title, opName)} className="px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-mono uppercase cursor-pointer">Add</button>
        <button onClick={onCancel} className="px-4 py-1.5 border border-border text-xs font-mono uppercase cursor-pointer">Cancel</button>
      </div>
    </div>
  );
}
