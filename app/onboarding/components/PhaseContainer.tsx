interface PhaseContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PhaseContainer({ children, className = '' }: PhaseContainerProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto px-6 ${className}`}>
      <div className="animate-fadeIn">
        {children}
      </div>
    </div>
  );
}
