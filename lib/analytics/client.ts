// Client-side analytics helper

export type FunnelEventType =
  | 'landing_cta_clicked'
  | 'onboarding_started'
  | 'onboarding_stage_completed'
  | 'system_generated_viewed'
  | 'auth_started'
  | 'auth_completed'
  | 'draft_claimed'
  | 'trial_step_completed'
  | 'paywall_shown'
  | 'purchase_completed';

interface EventData {
  [key: string]: any;
}

/**
 * Track a funnel analytics event
 * @param eventType - Type of event to track
 * @param eventData - Additional context data for the event
 * @param draftId - Optional draft ID to link anonymous events to eventual user
 */
export async function trackEvent(
  eventType: FunnelEventType,
  eventData?: EventData,
  draftId?: string
): Promise<void> {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventType,
        event_data: eventData || {},
        draft_id: draftId,
      }),
    });
  } catch (error) {
    // Silently fail analytics to not disrupt user experience
    console.error('Analytics tracking error:', error);
  }
}
