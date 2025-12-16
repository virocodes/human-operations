import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const {
      phase_reached,
      time_spent_seconds,
      messages_exchanged,
      operations_created,
      goals_created,
      habits_created,
      metrics_created,
      completed
    } = await request.json();

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Insert or update analytics
    const { error } = await supabase
      .from('onboarding_analytics')
      .insert({
        user_id: user.id,
        phase_reached,
        time_spent_seconds,
        messages_exchanged,
        operations_created: operations_created || 0,
        goals_created: goals_created || 0,
        habits_created: habits_created || 0,
        metrics_created: metrics_created || 0,
        completed: completed || false,
        completed_at: completed ? new Date().toISOString() : null
      });

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
