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

  // Protect /home route - require authentication
  if (!user && request.nextUrl.pathname.startsWith('/home')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in, check onboarding status
  if (user) {
    const { data: onboardingState } = await supabase
      .from('onboarding_state')
      .select('current_phase')
      .eq('user_id', user.id)
      .single()

    const hasCompletedOnboarding = onboardingState?.current_phase === 'complete'

    // If trying to access root path but already logged in
    if (request.nextUrl.pathname === '/') {
      const url = request.nextUrl.clone()
      // Send to onboarding if not complete, otherwise to home
      url.pathname = hasCompletedOnboarding ? '/home' : '/onboarding'
      return NextResponse.redirect(url)
    }

    // If trying to access /home but haven't completed onboarding
    if (!hasCompletedOnboarding && request.nextUrl.pathname.startsWith('/home')) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }

    // If trying to access /login but already logged in
    if (request.nextUrl.pathname === '/login') {
      const url = request.nextUrl.clone()
      // Send to onboarding if not complete, otherwise to home
      url.pathname = hasCompletedOnboarding ? '/home' : '/onboarding'
      return NextResponse.redirect(url)
    }

    // If trying to access /onboarding but already completed
    if (hasCompletedOnboarding && request.nextUrl.pathname.startsWith('/onboarding')) {
      const url = request.nextUrl.clone()
      url.pathname = '/home'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
