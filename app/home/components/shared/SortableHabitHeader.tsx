import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metric } from '../../types';

interface SortableHabitHeaderProps {
  metric: Metric;
  onEdit: () => void;
}

export function SortableHabitHeader({ metric, onEdit }: SortableHabitHeaderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: metric.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="px-4 py-3 flex items-center justify-center relative border-r border-border hover:bg-card hover:shadow-sm transition-all duration-150 group min-w-0"
    >
      <button
        {...listeners}
        {...attributes}
        className="absolute left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-110"
      >
        <GripVertical className="h-4 w-4 text-gray-400 dark:text-[#909090] hover:text-gray-600 dark:hover:text-[#a0a0a0]" />
      </button>
      <button
        onClick={onEdit}
        className="flex items-center justify-center flex-1 cursor-pointer group-hover:scale-[1.02] transition-transform duration-150 min-w-0"
      >
        <div className="text-xs font-mono tracking-wider text-foreground uppercase truncate w-full text-center">{metric.name}</div>
      </button>
    </div>
  );
}
