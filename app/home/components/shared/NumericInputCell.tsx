import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

interface NumericInputCellProps {
  initialValue: number | null;
  onUpdate: (value: number) => void;
  disabled: boolean;
}

export function NumericInputCell({ initialValue, onUpdate, disabled }: NumericInputCellProps) {
  const [localValue, setLocalValue] = useState(initialValue?.toString() || "");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalValue(initialValue?.toString() || "");
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const numValue = parseFloat(newValue) || 0;
      onUpdate(numValue);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Clear timeout and update immediately
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      const numValue = parseFloat(localValue) || 0;
      onUpdate(numValue);

      // Blur the input to remove focus
      e.currentTarget.blur();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Input
      type="number"
      value={localValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="—"
      disabled={disabled}
      className="w-full h-full text-center text-sm font-mono font-medium border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-white bg-transparent rounded-none p-0"
    />
  );
}
