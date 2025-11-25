import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const includeArchived = searchParams.get('include_archived') === 'true'

  let query = supabase
    .from('goals')
    .select(`
      *,
      subgoals (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (!includeArchived) {
    query = query.eq('is_archived', false)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, goal_type, target_date, metric_id, target_value, initial_value, operation_id, subgoals } = body

  // Create the goal
  const { data: goal, error: goalError } = await supabase
    .from('goals')
    .insert([
      {
        user_id: user.id,
        title,
        description,
        goal_type,
        target_date,
        metric_id: goal_type === 'metric_based' ? metric_id : null,
        target_value: goal_type === 'metric_based' ? target_value : null,
        initial_value: goal_type === 'metric_based' ? initial_value : null,
        operation_id: operation_id || null,
      },
    ])
    .select()
    .single()

  if (goalError) {
    return NextResponse.json({ error: goalError.message }, { status: 500 })
  }

  // If subgoal-based, create subgoals
  if (goal_type === 'subgoal_based' && subgoals && subgoals.length > 0) {
    const subgoalData = subgoals.map((title: string, index: number) => ({
      goal_id: goal.id,
      title,
      display_order: index,
    }))

    const { error: subgoalError } = await supabase
      .from('subgoals')
      .insert(subgoalData)

    if (subgoalError) {
      return NextResponse.json({ error: subgoalError.message }, { status: 500 })
    }
  }

  // Fetch the complete goal with subgoals
  const { data: completeGoal, error: fetchError } = await supabase
    .from('goals')
    .select(`
      *,
      subgoals (*)
    `)
    .eq('id', goal.id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json(completeGoal)
}

export async function PUT(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, title, description, target_date, metric_id, target_value, initial_value, operation_id, is_archived } = body

  const { data, error } = await supabase
    .from('goals')
    .update({
      title,
      description,
      target_date,
      metric_id,
      target_value,
      initial_value,
      operation_id,
      is_archived,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select(`
      *,
      subgoals (*)
    `)
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

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
