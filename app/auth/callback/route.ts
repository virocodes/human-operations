import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // If there's a specific next URL, use it
      if (next) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      // Check if user has completed onboarding
      const { data: { user } } = await supabase.auth.getUser()
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
