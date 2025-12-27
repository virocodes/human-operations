import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  const draftId = searchParams.get('draftId')
  const source = searchParams.get('source')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Get user
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Track analytics: auth_completed with draft_id
        if (draftId) {
          try {
            await supabase.from('funnel_analytics').insert({
              user_id: user.id,
              draft_id: draftId,
              event_type: 'auth_completed',
              event_data: { source: source || 'unknown' }
            });
          } catch (err) {
            console.error('Failed to track auth_completed:', err);
          }
        }

        // Set first_dashboard_visit_date for new users (for day-2 paywall)
        try {
          await supabase
            .from('users')
            .update({ first_dashboard_visit_date: new Date().toISOString().split('T')[0] })
            .eq('id', user.id)
            .is('first_dashboard_visit_date', null);
        } catch (err) {
          console.error('Failed to set first_dashboard_visit_date:', err);
        }

        // If coming from onboarding, redirect back to onboarding to trigger claim flow
        if (source === 'onboarding' && draftId) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      // If there's a specific next URL, use it
      if (next) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      // Check if user has completed onboarding
      if (user) {
        const { data: onboardingState } = await supabase
          .from('onboarding_state')
          .select('current_phase')
          .eq('user_id', user.id)
          .single()

        // If no onboarding state or not complete, redirect to onboarding
        if (!onboardingState || onboardingState.current_phase !== 'complete') {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }

      // Otherwise, go to home
      return NextResponse.redirect(`${origin}/home`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login`)
}
