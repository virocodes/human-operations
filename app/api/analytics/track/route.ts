import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { event_type, event_data, draft_id } = await request.json();

    if (!event_type) {
      return NextResponse.json(
        { error: 'event_type is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Try to get user if authenticated (but don't require it)
    const { data: { user } } = await supabase.auth.getUser();

    // Insert analytics event
    const { error } = await supabase.from('funnel_analytics').insert({
      user_id: user?.id || null, // NULL for anonymous events
      draft_id: draft_id || null,
      event_type,
      event_data: event_data || {},
    });

    if (error) {
      console.error('Analytics insert error:', error);
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
