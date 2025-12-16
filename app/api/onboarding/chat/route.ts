import { NextRequest, NextResponse } from 'next/server';
import { anthropic, MODEL, MAX_TOKENS } from '@/lib/anthropic/client';
import { systemPrompts } from '@/lib/anthropic/prompts';
import { tools } from '@/lib/anthropic/tools';
import { createClient } from '@/lib/supabase/server';

type Phase = 'operations' | 'goals' | 'habits' | 'metrics' | 'schedule';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ExtractedData {
  operations?: Array<{ id: string; name: string; description: string }>;
  goals?: Array<{ id: string; operation_id: string; title: string; goal_type: string; subgoals?: string[] }>;
  habits?: Array<{ id: string; name: string; linked_operation?: string }>;
  metrics?: Array<{ id: string; name: string; unit: string; optimal_value: number; minimum_value: number; operator: string; linked_operation?: string }>;
  schedule?: { wakeHour: number; sleepHour: number };
}

export async function POST(request: NextRequest) {
  try {
    const { message, phase, context } = await request.json();
    const { conversationHistory, extractedData, currentOperation } = context;

    // Verify user is authenticated
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Build conversation history for Claude
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Get system prompt for current phase
    let systemPrompt = systemPrompts[phase as Phase];

    // Add context for goals phase
    if (phase === 'goals' && currentOperation) {
      systemPrompt = `${systemPrompt}

IMPORTANT CONTEXT:
You are currently asking about goals for the operation: "${currentOperation}"

When you extract goals, you MUST use the create_goals tool with:
- operation_name: "${currentOperation}"
- goals: array of goals the user mentioned

Even if the user mentions just ONE goal (like "bulk to 145lbs"), you MUST still use the create_goals tool with that single goal in the array.

ALWAYS use the create_goals tool when the user provides ANY goal, even if it's just one goal or seems vague.`;
    }

    // Call Claude API with prompt caching
    // Note: For goals phase with dynamic context, we can't cache the full prompt
    const systemConfig = phase === 'goals' && currentOperation
      ? [{ type: 'text' as const, text: systemPrompt }] // No caching for dynamic prompts
      : [{ type: 'text' as const, text: systemPrompt, cache_control: { type: 'ephemeral' as const } }];

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemConfig,
      messages,
      tools,
    });

    // Extract AI message
    let aiMessage = response.content.find(block => block.type === 'text')?.text || '';

    // Extract structured data from tool use
    let newExtractedData: Partial<ExtractedData> = {};
    const toolUse = response.content.find(block => block.type === 'tool_use');

    // If no AI message and no tool use, something went wrong
    if (!aiMessage && !toolUse) {
      aiMessage = "I didn't quite catch that. Could you tell me more?";
    }

    if (toolUse && toolUse.type === 'tool_use') {
      const toolName = toolUse.name;
      const toolInput = toolUse.input as any;

      switch (toolName) {
        case 'create_operations':
          // Validate and limit operations (3-6 max)
          const operations = toolInput.operations || [];
          if (operations.length > 6) {
            operations.splice(6); // Keep only first 6
          }
          if (operations.length < 1) {
            // If no operations extracted, don't include in response
            break;
          }

          newExtractedData.operations = operations.map((op: any, index: number) => ({
            id: `op-${Date.now()}-${index}`,
            name: op.name || 'Unnamed Operation',
            description: op.description || ''
          }));
          break;

        case 'create_goals':
          const operationId = extractedData.operations?.find(
            (op: any) => op.name === toolInput.operation_name
          )?.id || 'unknown';

          newExtractedData.goals = toolInput.goals.map((goal: any, index: number) => ({
            id: `goal-${Date.now()}-${index}`,
            operation_id: operationId,
            title: goal.title,
            goal_type: goal.goal_type,
            subgoals: goal.subgoals || []
          }));
          break;

        case 'create_habits':
          newExtractedData.habits = toolInput.habits.map((habit: any, index: number) => ({
            id: `habit-${Date.now()}-${index}`,
            name: habit.name,
            linked_operation: habit.linked_operation
          }));
          break;

        case 'create_metrics':
          newExtractedData.metrics = toolInput.metrics.map((metric: any, index: number) => ({
            id: `metric-${Date.now()}-${index}`,
            name: metric.name,
            unit: metric.unit,
            optimal_value: metric.optimal_value,
            minimum_value: metric.minimum_value,
            operator: metric.operator,
            linked_operation: metric.linked_operation
          }));
          break;
      }
    }

    // Save to onboarding_state
    await supabase
      .from('onboarding_state')
      .upsert({
        user_id: user.id,
        current_phase: phase,
        conversation_history: JSON.stringify([...messages, { role: 'assistant', content: aiMessage }]),
        extracted_data: JSON.stringify({ ...extractedData, ...newExtractedData }),
        updated_at: new Date().toISOString()
      });

    return NextResponse.json({
      aiMessage,
      extractedData: newExtractedData,
      shouldAdvance: !!toolUse // Advance to next phase if data was extracted
    });

  } catch (error: any) {
    console.error('Onboarding chat error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
