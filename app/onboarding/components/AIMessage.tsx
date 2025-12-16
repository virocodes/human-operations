"use client";

import { useEffect, useState } from "react";

interface AIMessageProps {
  children: React.ReactNode;
  delay?: number; // Delay before showing message in ms
}

export function AIMessage({ children, delay = 0 }: AIMessageProps) {
  const [isVisible, setIsVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!isVisible) return null;

  return (
    <div className="text-center space-y-8 animate-fadeIn">
      <div className="text-2xl md:text-3xl font-serif font-light leading-relaxed text-gray-900 dark:text-white max-w-3xl mx-auto tracking-tight">
        {children}
      </div>
    </div>
  );
}
