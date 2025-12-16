import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get onboarding state
    const { data: state, error } = await supabase
      .from('onboarding_state')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw error;
    }

    // If no state found, return defaults
    if (!state) {
      return NextResponse.json({
        currentPhase: 'welcome',
        extractedData: {},
        conversationHistory: []
      });
    }

    return NextResponse.json({
      currentPhase: state.current_phase,
      extractedData: JSON.parse(state.extracted_data),
      conversationHistory: JSON.parse(state.conversation_history)
    });

  } catch (error: any) {
    console.error('Get onboarding state error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
