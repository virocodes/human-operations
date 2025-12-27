import { NextRequest } from 'next/server';
import { anthropic, MODEL } from '@/lib/anthropic/client';

export async function POST(request: NextRequest) {
  try {
    // No auth check - allow anonymous users to generate systems for draft mode
    const { goalDetails } = await request.json();

    if (!goalDetails || !Array.isArray(goalDetails) || goalDetails.length === 0) {
      return Response.json({ error: 'Invalid goal details' }, { status: 400 });
    }

    // System prompt
    const systemPrompt = `Generate a complete personal operating system based on user goals.

Return ONLY valid JSON in this exact format (no markdown, no explanation, just JSON):
{
  "operations": [
    {
      "name": "string",
      "description": "string"
    }
  ],
  "goals": [
    {
      "title": "string",
      "operation_name": "string (MUST match an operation name exactly)",
      "linked_metric_name": "string (MUST match a metric name exactly) - the primary metric to track progress for this goal",
      "target_value": number (optional - the target value for the metric),
      "initial_value": number (optional - the starting value for the metric)
    }
  ],
  "habits": [
    {
      "name": "string (MUST be something done daily, yes/no, like 'Morning Workout' not 'Workout 4x per week')",
      "linked_operation": "string (MUST match an operation name exactly)"
    }
  ],
  "metrics": [
    {
      "name": "string",
      "unit": "string (e.g., 'hours', 'minutes', 'lbs', 'kg', 'steps', 'glasses', 'dollars')",
      "optimal_value": number | null,
      "minimum_value": number | null,
      "operator": "at_least" | "at_most" | "exactly" | null,
      "linked_operation": "string (MUST match an operation name exactly)"
    }
  ],
  "schedule": {
    "wakeHour": number,
    "sleepHour": number
  }
}

CRITICAL Rules:
- 2-4 operations (life areas like 'Physical Health', 'Career Growth', etc)
- For EACH user goal, create 1-2 specific goals - KEEP THE USER'S EXACT NUMBERS/TARGETS (e.g., if user says "make $3k/month", goal should be "Make $3,000/month online", NOT vague like "online income generation")
- EVERY goal MUST have a linked_metric_name that tracks progress toward that goal
- 3-8 habits - MUST be DAILY trackable actions (yes/no), NOT weekly (e.g., 'Morning Workout' YES, 'Workout 4x per week' NO)
- 2-6 metrics - MUST be things you can input EVERY SINGLE DAY (e.g., 'Sleep Hours', 'Water Intake', 'Calories Eaten', 'Revenue Today')
- NEVER create metrics like "Monthly Income" or "Weekly Progress" - everything must be daily
- Create metrics that directly measure daily progress toward goals

METRIC OPERATOR RULES (VERY IMPORTANT):
There are TWO types of metrics:

1. DAILY TARGET METRICS - metrics with daily goals that give red/green feedback
   - Use when there's a daily target to hit (calories, water, sleep hours, workout minutes)
   - Set optimal_value, minimum_value, and operator (at_least/at_most/exactly)
   - Example: "Calories Eaten" → optimal_value: 2500, minimum_value: 2000, operator: "at_least"
   - Example: "Sleep Hours" → optimal_value: 8, minimum_value: 7, operator: "at_least"

2. RAW TRACKING METRICS - metrics that just track without daily judgment (for long-term progress)
   - Use for progressive metrics like body weight, daily revenue, etc.
   - Set optimal_value: null, minimum_value: null, operator: null
   - Example: "Body Weight" → optimal_value: null, minimum_value: null, operator: null, unit: "lbs"
   - Example: "Revenue Today" → optimal_value: null, minimum_value: null, operator: null, unit: "dollars"
   - These metrics are tracked daily but don't show red/green - just the raw number

- ALL linked_operation fields MUST exactly match an operation name
- ALL goals must have operation_name that exactly matches an operation name
- ALL goals must have linked_metric_name that exactly matches a metric name
- Habits and metrics should support the goals
- Infer wake/sleep times from goals (24-hour format)
- Return ONLY the JSON object`;

    // Build user prompt with goal details
    const goalsText = goalDetails.map((gd: any, i: number) =>
      `${i + 1}. Goal: ${gd.goal}\n   How to achieve: ${gd.details}`
    ).join('\n\n');

    // Call Claude API with Haiku (faster, cheaper)
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Generate a complete life operating system for these goals. Use the "How to achieve" information to create relevant habits and metrics.

IMPORTANT: Keep the user's exact numbers and targets in the goals (e.g., if they say "$3k/month" or "150 lbs", include those exact numbers in the goal title). Create metrics that can be tracked DAILY (not monthly or weekly).

${goalsText}

Return ONLY valid JSON.`
      }]
    });

    // Extract text from response
    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    // Parse JSON from response
    let jsonText = textContent.text.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    const systemData = JSON.parse(jsonText);

    // Validate structure
    if (!systemData.operations || !systemData.habits || !systemData.metrics || !systemData.schedule || !systemData.goals) {
      throw new Error('Invalid system data structure');
    }

    // Add IDs to all items
    systemData.operations = systemData.operations.map((op: any, i: number) => ({
      ...op,
      id: `op-${i}`
    }));

    systemData.goals = systemData.goals.map((g: any, i: number) => ({
      ...g,
      id: `goal-${i}`,
      goal_type: 'metric_based'
    }));

    systemData.habits = systemData.habits.map((h: any, i: number) => ({
      ...h,
      id: `habit-${i}`
    }));

    systemData.metrics = systemData.metrics.map((m: any, i: number) => ({
      ...m,
      id: `metric-${i}`
    }));

    return Response.json({
      operations: systemData.operations,
      goals: systemData.goals,
      habits: systemData.habits,
      metrics: systemData.metrics,
      schedule: systemData.schedule
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    return Response.json({
      error: error.message || 'Generation failed'
    }, { status: 500 });
  }
}
