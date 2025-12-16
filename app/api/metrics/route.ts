import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Support filtering by type (e.g., ?type=boolean for habits only)
  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get('type');

  let query = supabase
    .from('metrics')
    .select('*')
    .eq('user_id', user.id);

  if (typeFilter) {
    query = query.eq('type', typeFilter);
  }

  const { data, error } = await query.order('display_order', { ascending: true });

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
  const { name, type, unit, display_order, category_id, optimal_value, minimum_value, operator } = body

  // If display_order not provided, get the max and add 1
  let order = display_order
  if (order == null) {
    const { data: existingMetrics } = await supabase
      .from('metrics')
      .select('display_order')
      .eq('user_id', user.id)
      .order('display_order', { ascending: false })
      .limit(1)

    order = existingMetrics && existingMetrics.length > 0 ? existingMetrics[0].display_order + 1 : 0
  }

  const { data, error } = await supabase
    .from('metrics')
    .insert([
      {
        user_id: user.id,
        name,
        type,
        unit: type === 'numeric' ? unit : null,
        display_order: order,
        category_id: type === 'numeric' ? category_id : null,
        optimal_value: type === 'numeric' ? optimal_value : null,
        minimum_value: type === 'numeric' ? minimum_value : null,
        operator: type === 'numeric' ? operator : null,
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
  const { id, name, unit, category_id, optimal_value, minimum_value, operator } = body

  // Note: type is intentionally excluded - it cannot be changed after creation
  const { data, error } = await supabase
    .from('metrics')
    .update({
      name,
      unit,
      category_id,
      optimal_value,
      minimum_value,
      operator,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
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

  const { error } = await supabase
    .from('metrics')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
