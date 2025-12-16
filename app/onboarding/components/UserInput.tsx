"use client";

import { useState, useRef, useEffect } from "react";

interface UserInputProps {
  onSubmit: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function UserInput({ onSubmit, placeholder = "Speak freely...", disabled = false }: UserInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (but allow Shift+Enter for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeIn space-y-6">
      {/* Input area with corner brackets */}
      <div className="relative bg-card border border-border shadow-sm">
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '10px 10px'
        }}></div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={3}
          className="relative w-full px-6 py-5 bg-transparent border-0 focus:outline-none focus:ring-0 resize-none text-lg font-serif text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 placeholder:font-light"
        />
      </div>

      {/* Submit button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono text-xs uppercase tracking-widest hover:scale-[1.02] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer shadow-sm"
        >
          Continue
        </button>
      </div>

      {/* Helper text */}
      <p className="text-center text-xs font-mono text-gray-500 dark:text-slate-600 uppercase tracking-widest">
        Press Enter ↵
      </p>
    </div>
  );
}
