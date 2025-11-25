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
    .from('operations')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order', { ascending: true })

  if (!includeArchived) {
    query = query.eq('is_archived', false)
  }

  const { data: operations, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Fetch operation_habits for each operation
  const operationsWithHabits = await Promise.all(
    operations.map(async (operation) => {
      const { data: habitLinks } = await supabase
        .from('operation_habits')
        .select('habit_id')
        .eq('operation_id', operation.id)

      return {
        ...operation,
        habit_ids: habitLinks ? habitLinks.map(link => link.habit_id) : []
      }
    })
  )

  return NextResponse.json(operationsWithHabits)
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, notes, metric_id, habit_ids } = body

  // Get the highest display_order
  const { data: maxOrderOp } = await supabase
    .from('operations')
    .select('display_order')
    .eq('user_id', user.id)
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const newDisplayOrder = maxOrderOp ? maxOrderOp.display_order + 1 : 0

  // Create the operation
  const { data: operation, error: operationError } = await supabase
    .from('operations')
    .insert([
      {
        user_id: user.id,
        title,
        description,
        notes,
        metric_id: metric_id || null,
        display_order: newDisplayOrder,
      },
    ])
    .select()
    .single()

  if (operationError) {
    return NextResponse.json({ error: operationError.message }, { status: 500 })
  }

  // Create operation_habits links
  if (habit_ids && habit_ids.length > 0) {
    const habitLinks = habit_ids.map((habit_id: string) => ({
      operation_id: operation.id,
      habit_id,
    }))

    const { error: habitError } = await supabase
      .from('operation_habits')
      .insert(habitLinks)

    if (habitError) {
      return NextResponse.json({ error: habitError.message }, { status: 500 })
    }
  }

  // Fetch complete operation with habit_ids
  const { data: habitLinks } = await supabase
    .from('operation_habits')
    .select('habit_id')
    .eq('operation_id', operation.id)

  const completeOperation = {
    ...operation,
    habit_ids: habitLinks ? habitLinks.map(link => link.habit_id) : []
  }

  return NextResponse.json(completeOperation)
}

export async function PUT(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, title, description, notes, metric_id, habit_ids, is_archived } = body

  // Update the operation
  const { data: operation, error: operationError } = await supabase
    .from('operations')
    .update({
      title,
      description,
      notes,
      metric_id: metric_id || null,
      is_archived,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (operationError) {
    return NextResponse.json({ error: operationError.message }, { status: 500 })
  }

  // Update operation_habits links
  // Delete existing links
  await supabase
    .from('operation_habits')
    .delete()
    .eq('operation_id', id)

  // Create new links
  if (habit_ids && habit_ids.length > 0) {
    const habitLinks = habit_ids.map((habit_id: string) => ({
      operation_id: id,
      habit_id,
    }))

    const { error: habitError } = await supabase
      .from('operation_habits')
      .insert(habitLinks)

    if (habitError) {
      return NextResponse.json({ error: habitError.message }, { status: 500 })
    }
  }

  // Fetch complete operation with habit_ids
  const { data: habitLinks } = await supabase
    .from('operation_habits')
    .select('habit_id')
    .eq('operation_id', id)

  const completeOperation = {
    ...operation,
    habit_ids: habitLinks ? habitLinks.map(link => link.habit_id) : []
  }

  return NextResponse.json(completeOperation)
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

  // Delete will cascade to operation_habits due to ON DELETE CASCADE
  const { error } = await supabase
    .from('operations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
