import { useState } from 'react';
import { Todo } from '../types';

interface UseTodosProps {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((prev: Todo[]) => Todo[])) => void;
  loadTodos: () => Promise<void>;
}

export function useTodos({ todos, setTodos, loadTodos }: UseTodosProps) {
  const handleAddTodo = async (title: string, description: string, priority: 'low' | 'medium' | 'high') => {
    if (!title.trim()) return;

    const tempTodo = {
      id: `temp-${Date.now()}`,
      user_id: '',
      title: title,
      description: description,
      priority: priority,
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistic update
    setTodos([tempTodo, ...todos]);

    // Make API call in background
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        description: description,
        priority: priority,
      }),
    });

    if (response.ok) {
      loadTodos();
    } else {
      setTodos(prev => prev.filter(t => t.id !== tempTodo.id));
    }
  };

  const handleToggleTodo = async (todoId: string, isCompleted: boolean) => {
    setTodos(prev => prev.map(todo =>
      todo.id === todoId
        ? { ...todo, is_completed: !isCompleted }
        : todo
    ));

    const response = await fetch('/api/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: todoId,
        is_completed: !isCompleted,
      }),
    });

    if (!response.ok) {
      setTodos(prev => prev.map(todo =>
        todo.id === todoId
          ? { ...todo, is_completed: isCompleted }
          : todo
      ));
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    const previousTodos = todos;
    setTodos(prev => prev.filter(t => t.id !== todoId));

    const response = await fetch(`/api/todos?id=${todoId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setTodos(previousTodos);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(t => t.is_completed);
    if (completedTodos.length === 0) return;

    const previousTodos = todos;
    setTodos(prev => prev.filter(t => !t.is_completed));

    const deletePromises = completedTodos.map(todo =>
      fetch(`/api/todos?id=${todo.id}`, { method: 'DELETE' })
    );

    const results = await Promise.all(deletePromises);
    const allSucceeded = results.every(r => r.ok);

    if (!allSucceeded) {
      setTodos(previousTodos);
    }
  };

  // Sort todos by priority
  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3;
    return aPriority - bPriority;
  });

  return {
    todos: sortedTodos,
    addTodo: handleAddTodo,
    toggleTodo: handleToggleTodo,
    deleteTodo: handleDeleteTodo,
    clearCompleted: handleClearCompleted,
  };
}
