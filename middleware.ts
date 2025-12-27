import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow anonymous access to /onboarding (for draft mode)
  // But prevent authenticated users from creating drafts - redirect them to /home
  if (request.nextUrl.pathname.startsWith('/onboarding')) {
    if (user) {
      // Check if they've completed onboarding
      const { data: onboardingState } = await supabase
        .from('onboarding_state')
        .select('current_phase')
        .eq('user_id', user.id)
        .single()

      // If already completed, redirect to home (prevent draft creation)
      if (onboardingState?.current_phase === 'complete') {
        const url = request.nextUrl.clone()
        url.pathname = '/home'
        return NextResponse.redirect(url)
      }
    }
    // Allow anonymous users or users with incomplete onboarding to access
    return supabaseResponse
  }

  // Protect /home route - require authentication
  if (!user && request.nextUrl.pathname.startsWith('/home')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in, check onboarding and payment status
  if (user) {
    const { data: onboardingState } = await supabase
      .from('onboarding_state')
      .select('current_phase')
      .eq('user_id', user.id)
      .single()

    const { data: userData } = await supabase
      .from('users')
      .select('has_paid, trial_actions_count')
      .eq('id', user.id)
      .single()

    const hasCompletedOnboarding = onboardingState?.current_phase === 'complete'
    const hasPaid = userData?.has_paid === true
    const trialActionsCount = userData?.trial_actions_count || 0
    const trialExceeded = trialActionsCount >= 5

    // If trying to access root path but already logged in
    if (request.nextUrl.pathname === '/') {
      const url = request.nextUrl.clone()
      // Route based on onboarding status
      if (!hasCompletedOnboarding) {
        url.pathname = '/onboarding'
      } else {
        url.pathname = '/home'
      }
      return NextResponse.redirect(url)
    }

    // If trying to access /home
    if (request.nextUrl.pathname.startsWith('/home')) {
      const url = request.nextUrl.clone()

      // Must complete onboarding to access /home
      if (!hasCompletedOnboarding) {
        url.pathname = '/onboarding'
        return NextResponse.redirect(url)
      }

      // Allow access even if trial exceeded - payment modal will show in-app
    }

    // If trying to access /payment but haven't completed onboarding
    if (request.nextUrl.pathname.startsWith('/payment') && !hasCompletedOnboarding) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }

    // If trying to access /payment but already paid
    if (request.nextUrl.pathname.startsWith('/payment') && hasPaid) {
      const url = request.nextUrl.clone()
      url.pathname = '/home'
      return NextResponse.redirect(url)
    }

    // If trying to access /login but already logged in
    if (request.nextUrl.pathname === '/login') {
      const url = request.nextUrl.clone()
      // Route based on onboarding status
      if (!hasCompletedOnboarding) {
        url.pathname = '/onboarding'
      } else {
        url.pathname = '/home'
      }
      return NextResponse.redirect(url)
    }

    // Note: /onboarding access is now handled above to allow anonymous users
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
