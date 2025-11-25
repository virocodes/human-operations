import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { goal_id, title, display_order } = body

  // Verify the goal belongs to the user
  const { data: goal } = await supabase
    .from('goals')
    .select('id')
    .eq('id', goal_id)
    .eq('user_id', user.id)
    .single()

  if (!goal) {
    return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
  }

  // If display_order not provided, get the max and add 1
  let order = display_order
  if (order == null) {
    const { data: existingSubgoals } = await supabase
      .from('subgoals')
      .select('display_order')
      .eq('goal_id', goal_id)
      .order('display_order', { ascending: false })
      .limit(1)

    order = existingSubgoals && existingSubgoals.length > 0 ? existingSubgoals[0].display_order + 1 : 0
  }

  const { data, error } = await supabase
    .from('subgoals')
    .insert([
      {
        goal_id,
        title,
        display_order: order,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, title, is_completed } = body

  // Verify the subgoal belongs to a goal owned by the user
  const { data: subgoal } = await supabase
    .from('subgoals')
    .select(`
      id,
      goal_id,
      goals!inner (user_id)
    `)
    .eq('id', id)
    .single()

  if (!subgoal || (subgoal.goals as any).user_id !== user.id) {
    return NextResponse.json({ error: 'Subgoal not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('subgoals')
    .update({
      title,
      is_completed,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  // Verify the subgoal belongs to a goal owned by the user
  const { data: subgoal } = await supabase
    .from('subgoals')
    .select(`
      id,
      goal_id,
      goals!inner (user_id)
    `)
    .eq('id', id)
    .single()

  if (!subgoal || (subgoal.goals as any).user_id !== user.id) {
    return NextResponse.json({ error: 'Subgoal not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('subgoals')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
