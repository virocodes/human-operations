import { useState } from 'react';
import { Task } from '../types';

interface UseTasksProps {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  wakeHour: number;
  sleepHour: number;
}

export function useTasks({ tasks, setTasks, wakeHour, sleepHour }: UseTasksProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskStartTime, setTaskStartTime] = useState("");
  const [taskEndTime, setTaskEndTime] = useState("");
  const [taskHabitId, setTaskHabitId] = useState("");
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Drag selection state for creating tasks
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragCurrentY, setDragCurrentY] = useState<number | null>(null);

  const resetTaskForm = () => {
    setTaskTitle("");
    setTaskStartTime("");
    setTaskEndTime("");
    setTaskHabitId("");
  };

  const addTask = async () => {
    if (!taskTitle.trim() || !taskStartTime || !taskEndTime) return;

    const tempTask: Task = {
      id: `temp-${Date.now()}`,
      title: taskTitle.trim(),
      start_time: taskStartTime,
      end_time: taskEndTime,
      habit_id: taskHabitId || undefined,
      user_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks([...tasks, tempTask]);
    const title = taskTitle.trim();
    const startTime = taskStartTime;
    const endTime = taskEndTime;
    const habitId = taskHabitId || null;
    resetTaskForm();
    setIsAddTaskDialogOpen(false);

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        start_time: startTime,
        end_time: endTime,
        habit_id: habitId,
      }),
    });

    if (response.ok) {
      const newTask = await response.json();
      setTasks(prev => prev.map(t => t.id === tempTask.id ? newTask : t));
    } else {
      setTasks(prev => prev.filter(t => t.id !== tempTask.id));
    }
  };

  const updateTask = async () => {
    if (!editingTask || !taskTitle.trim()) return;

    const previousTasks = tasks;
    const updatedTask: Task = {
      ...editingTask,
      title: taskTitle.trim(),
      start_time: taskStartTime,
      end_time: taskEndTime,
      habit_id: taskHabitId || undefined,
      updated_at: new Date().toISOString(),
    };
    setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
    resetTaskForm();
    setEditingTask(null);
    setIsEditTaskDialogOpen(false);

    const response = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingTask.id,
        title: taskTitle.trim(),
        start_time: taskStartTime,
        end_time: taskEndTime,
        habit_id: taskHabitId || null,
      }),
    });

    if (response.ok) {
      const updated = await response.json();
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } else {
      setTasks(previousTasks);
    }
  };

  const deleteTask = async (taskId: string) => {
    const previousTasks = tasks;
    setTasks(tasks.filter(t => t.id !== taskId));
    setIsEditTaskDialogOpen(false);

    const response = await fetch(`/api/tasks?id=${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setTasks(previousTasks);
    }
  };

  const openEditTaskDialog = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskStartTime(task.start_time);
    setTaskEndTime(task.end_time);
    setTaskHabitId(task.habit_id || "");
    setIsEditTaskDialogOpen(true);
  };

  // Drag selection handlers for creating tasks
  const snapToInterval = (y: number) => {
    const startHourRange = wakeHour;
    const endHourRange = sleepHour >= wakeHour ? sleepHour : sleepHour + 24;
    const numHours = endHourRange - startHourRange;
    const hourHeight = 600 / numHours;

    const minutesFromWake = (y / hourHeight) * 60;
    const roundedMinutes = Math.round(minutesFromWake / 15) * 15;
    const snappedY = (roundedMinutes / 60) * hourHeight;

    return snappedY;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const snappedY = snapToInterval(y);
    setIsDragging(true);
    setDragStartY(snappedY);
    setDragCurrentY(snappedY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartY === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const snappedY = snapToInterval(y);
    setDragCurrentY(snappedY);
  };

  const handleMouseUp = () => {
    if (!isDragging || dragStartY === null || dragCurrentY === null) {
      setIsDragging(false);
      setDragStartY(null);
      setDragCurrentY(null);
      return;
    }

    const startHourRange = wakeHour;
    const endHourRange = sleepHour >= wakeHour ? sleepHour : sleepHour + 24;
    const numHours = endHourRange - startHourRange;
    const hourHeight = 600 / numHours;

    const minY = Math.min(dragStartY, dragCurrentY);
    const maxY = Math.max(dragStartY, dragCurrentY);

    const startMinutesFromWake = (minY / hourHeight) * 60;
    const endMinutesFromWake = (maxY / hourHeight) * 60;

    const roundedStartMinutes = Math.round(startMinutesFromWake / 15) * 15;
    const roundedEndMinutes = Math.round(endMinutesFromWake / 15) * 15;

    const startHourActual = Math.floor(roundedStartMinutes / 60) + wakeHour;
    const startMinActual = roundedStartMinutes % 60;
    const endHourActual = Math.floor(roundedEndMinutes / 60) + wakeHour;
    const endMinActual = roundedEndMinutes % 60;

    const startTime = `${String(startHourActual % 24).padStart(2, '0')}:${String(startMinActual).padStart(2, '0')}`;
    const endTime = `${String(endHourActual % 24).padStart(2, '0')}:${String(endMinActual).padStart(2, '0')}`;

    setTaskStartTime(startTime);
    setTaskEndTime(endTime);
    setIsAddTaskDialogOpen(true);

    setIsDragging(false);
    setDragStartY(null);
    setDragCurrentY(null);
  };

  return {
    taskTitle,
    setTaskTitle,
    taskStartTime,
    setTaskStartTime,
    taskEndTime,
    setTaskEndTime,
    taskHabitId,
    setTaskHabitId,
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    isEditTaskDialogOpen,
    setIsEditTaskDialogOpen,
    editingTask,
    isDragging,
    dragStartY,
    dragCurrentY,
    resetTaskForm,
    addTask,
    updateTask,
    deleteTask,
    openEditTaskDialog,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
