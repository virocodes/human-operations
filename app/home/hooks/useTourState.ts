import { useState, useCallback } from 'react';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  callout?: string;
  highlight?: { selector: string };
  allowedInteractions?: string[];
}

export function useTourState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [tourActive, setTourActive] = useState(false);

  const steps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Your Operating System',
      description: 'Human Operations helps you track habits, measure metrics, and achieve goals. This quick tour shows you the essentials.',
      callout: '2 minutes · 5 steps',
    },
    {
      id: 'habits',
      title: 'Track Daily Habits',
      description: 'Check off habits as you complete them. Green = done, Red = incomplete. Your habits were generated based on your goals.',
      callout: 'Try it: You can click a habit checkbox to see how it works',
      highlight: { selector: '.habit-grid' },
      allowedInteractions: ['habit-checkbox'],
    },
    {
      id: 'navigation',
      title: 'Navigate Your System',
      description: 'Use arrow keys or click these chips to navigate between Dashboard, Metrics, Goals, and Operations pages.',
      callout: 'Try it: Press → to see your Metrics page',
      highlight: { selector: '.navigation-chips' },
      allowedInteractions: ['keyboard-nav', 'navigation-chips'],
    },
    {
      id: 'metrics',
      title: 'Measure What Matters',
      description: 'Track numeric metrics (sleep, workouts, etc.) and monitor progress toward your goals. Everything is customized to your ambitions.',
      callout: 'You can explore metrics and goals after unlocking full access',
    },
    {
      id: 'payment',
      title: 'Your System is Ready',
      description: 'You\'ve seen the basics. Now unlock full access to start optimizing your operations.',
      callout: 'Unlock lifetime access — $19 one-time payment',
    },
  ];

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  const completeTour = useCallback(async () => {
    try {
      await fetch('/api/tour/complete', { method: 'POST' });
      setTourActive(false);
    } catch (error) {
      console.error('Failed to complete tour:', error);
    }
  }, []);

  return {
    tourActive,
    setTourActive,
    currentStep,
    setCurrentStep,
    nextStep,
    steps,
    completeTour,
  };
}
