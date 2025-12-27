// LocalStorage management for draft onboarding system

import { DraftSystem, Stage, GoalDetail, Operation, Goal, Habit, Metric } from './types';

const DRAFT_KEY = 'humanops_draft_system';
const DRAFT_EXPIRY_HOURS = 24;

/**
 * Generate a simple UUID (client-side only, good enough for draft tracking)
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create a new draft with UUID and expiration
 */
export function createDraft(): DraftSystem {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + DRAFT_EXPIRY_HOURS * 60 * 60 * 1000);

  const draft: DraftSystem = {
    draftId: generateUUID(),
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    stage: 'input',
    goals: ['', ''],
    goalDetails: [],
    operations: [],
    generatedGoals: [],
    habits: [],
    metrics: [],
    schedule: null,
  };

  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  return draft;
}

/**
 * Retrieve draft from localStorage
 */
export function getDraft(): DraftSystem | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return null;

    const draft = JSON.parse(stored) as DraftSystem;
    return draft;
  } catch (error) {
    console.error('Error reading draft from localStorage:', error);
    return null;
  }
}

/**
 * Update draft data (partial update)
 */
export function updateDraft(updates: Partial<Omit<DraftSystem, 'draftId' | 'createdAt' | 'expiresAt'>>): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const existing = getDraft();
    if (!existing) {
      console.error('No existing draft to update');
      return;
    }

    const updated: DraftSystem = {
      ...existing,
      ...updates,
    };

    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating draft in localStorage:', error);
  }
}

/**
 * Clear draft from localStorage
 */
export function clearDraft(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DRAFT_KEY);
  }
}

/**
 * Check if draft is older than 24 hours
 */
export function isDraftExpired(draft: DraftSystem): boolean {
  const now = new Date().getTime();
  const expires = new Date(draft.expiresAt).getTime();
  return now > expires;
}

/**
 * Check if there's a valid (non-expired) draft
 */
export function hasActiveDraft(): boolean {
  const draft = getDraft();
  if (!draft) return false;
  return !isDraftExpired(draft);
}
