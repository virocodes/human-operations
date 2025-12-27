import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mark tour as completed
    const { error } = await supabase
      .from('users')
      .update({ tour_completed: true })
      .eq('id', user.id);

    if (error) {
      console.error('Error completing tour:', error);
      return NextResponse.json({ error: 'Failed to complete tour' }, { status: 500 });
    }

    // Track analytics
    await supabase.from('funnel_analytics').insert({
      user_id: user.id,
      event_type: 'tour_completed',
      event_data: { completed_at: new Date().toISOString() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tour completion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
