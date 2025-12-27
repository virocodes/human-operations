'use client'

import { TourStep } from '../../hooks/useTourState';
import { Button } from '@/components/ui/button';

interface TourOverlayProps {
  isOpen: boolean;
  currentStep: number;
  steps: TourStep[];
  onNext: () => void;
  onComplete: () => void;
}

export function TourOverlay({ isOpen, currentStep, steps, onNext, onComplete }: TourOverlayProps) {
  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md" />

      {/* Tour card */}
      <div className="relative max-w-2xl w-full mx-6 animate-fadeIn">
        <div className="bg-card border-2 border-border shadow-2xl p-8 relative overflow-hidden">
          {/* Corner brackets - brutalist signature */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] pointer-events-none z-10"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] pointer-events-none z-10"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] pointer-events-none z-10"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] pointer-events-none z-10"></div>

          {/* Grid pattern background */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '10px 10px'
          }}></div>

          {/* Content */}
          <div className="relative space-y-6">
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`transition-all ${
                    idx === currentStep
                      ? 'w-3 h-3 bg-gray-900 dark:bg-white'
                      : 'w-2 h-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Step title */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-serif font-medium text-foreground tracking-tight">
                {step.title}
              </h2>
              {step.callout && (
                <p className="text-xs font-mono tracking-wider text-muted-foreground uppercase">
                  {step.callout}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border my-6"></div>

            {/* Step description */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Last step features */}
            {isLastStep && (
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3 text-sm">
                  <span className="font-mono text-muted-foreground mt-0.5">[✓]</span>
                  <div>
                    <div className="font-medium text-foreground">Unlimited Operations</div>
                    <div className="text-xs text-muted-foreground font-light">Track habits, metrics, and goals</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="font-mono text-muted-foreground mt-0.5">[✓]</span>
                  <div>
                    <div className="font-medium text-foreground">AI-Generated System</div>
                    <div className="text-xs text-muted-foreground font-light">Personalized to your ambitions</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="font-mono text-muted-foreground mt-0.5">[✓]</span>
                  <div>
                    <div className="font-medium text-foreground">Lifetime Access</div>
                    <div className="text-xs text-muted-foreground font-light">Pay once, optimize forever</div>
                  </div>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-border my-6"></div>

            {/* Navigation button */}
            <div className="flex justify-center">
              <Button
                onClick={handleNext}
                className="px-12 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono text-xs uppercase tracking-widest hover:scale-[1.02] transition-all duration-150 shadow-lg cursor-pointer"
              >
                {isLastStep ? 'Continue to Payment' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
