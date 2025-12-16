import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const startTime = performance.now();

  const clientStart = performance.now();
  const supabase = await createClient();
  console.log(`[Profile API] createClient: ${(performance.now() - clientStart).toFixed(2)}ms`);

  const authStart = performance.now();
  const { data: { user } } = await supabase.auth.getUser();
  console.log(`[Profile API] getUser: ${(performance.now() - authStart).toFixed(2)}ms`);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbStart = performance.now();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  console.log(`[Profile API] DB query: ${(performance.now() - dbStart).toFixed(2)}ms`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const totalTime = (performance.now() - startTime).toFixed(2);
  console.log(`[Profile API] TOTAL: ${totalTime}ms`);

  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { username, bio, avatar_url, wake_hour, sleep_hour } = body

  console.log('Profile update request:', { username, bio, avatar_url, wake_hour, sleep_hour, userId: user.id })

  const updateData: any = {
    updated_at: new Date().toISOString(),
  }

  if (username !== undefined) updateData.username = username
  if (bio !== undefined) updateData.bio = bio
  if (avatar_url !== undefined) updateData.avatar_url = avatar_url
  if (wake_hour !== undefined) updateData.wake_hour = wake_hour
  if (sleep_hour !== undefined) updateData.sleep_hour = sleep_hour

  console.log('Update data:', updateData)

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log('Profile updated successfully:', data)

  return NextResponse.json(data)
}
