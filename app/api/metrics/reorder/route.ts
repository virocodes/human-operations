import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { metrics } = body

  if (!Array.isArray(metrics)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Update display_order for each metric
  const updatePromises = metrics.map(({ id, display_order }) =>
    supabase
      .from('metrics')
      .update({ display_order, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
  )

  const results = await Promise.all(updatePromises)

  // Check if any updates failed
  const errors = results.filter(r => r.error)
  if (errors.length > 0) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
