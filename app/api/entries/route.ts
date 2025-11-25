import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const metricId = searchParams.get('metricId')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  let query = supabase
    .from('entries')
    .select('*')
    .eq('user_id', user.id)

  if (metricId) {
    query = query.eq('metric_id', metricId)
  }

  if (startDate) {
    query = query.gte('date', startDate)
  }

  if (endDate) {
    query = query.lte('date', endDate)
  }

  const { data, error } = await query.order('date', { ascending: true })

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
  const { metric_id, date, value, type } = body

  const entryData: any = {
    user_id: user.id,
    metric_id,
    date,
  }

  if (type === 'boolean') {
    entryData.value_boolean = value
    entryData.value_numeric = null
  } else {
    entryData.value_numeric = value
    entryData.value_boolean = null
  }

  const { data, error } = await supabase
    .from('entries')
    .upsert(entryData, {
      onConflict: 'metric_id,date',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
