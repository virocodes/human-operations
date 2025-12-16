import { NextRequest } from 'next/server';
import { anthropic, MODEL, MAX_TOKENS } from '@/lib/anthropic/client';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const goalsParam = searchParams.get('goals');

  if (!goalsParam) {
    return new Response('Missing goals parameter', { status: 400 });
  }

  let goals: string[];
  try {
    goals = JSON.parse(goalsParam);
  } catch {
    return new Response('Invalid goals format', { status: 400 });
  }

  // Verify user is authenticated
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // System prompt for generation
        const systemPrompt = `You are a life system architect. You will receive user goals and must use the generate_full_system tool to create their complete personal operating system.

CRITICAL: You MUST use the generate_full_system tool. Your response will ONLY be the tool call - no text output.

Your task: Analyze their goals and generate a complete system:
1. **Operations** (2-4 life areas) - Core pillars these goals fall into
2. **Habits** (3-8 daily practices) - Actions that support the goals
3. **Metrics** (2-6 measurements) - Numbers that track progress
4. **Schedule** (wake/sleep times) - Inferred from goals and habits

Analysis approach:
- Group related goals under operations
- Identify what operations are needed to achieve all goals
- Determine daily habits that make progress inevitable
- Define metrics that show you're on track
- Infer optimal daily schedule based on habits

Output requirements:
- Use generate_full_system tool with ALL fields populated
- Link habits and metrics to operations by name
- Provide reasoning for each habit, metric, and schedule choice
- Make operation descriptions and reasoning mystical and intentional
- Use words like: emerge, manifest, anchor, pillar, foundation`;

        // Tool definition
        const tool = {
          name: "generate_full_system",
          description: "Generate complete life operating system from user's main goals",
          input_schema: {
            type: "object" as const,
            properties: {
              operations: {
                type: "array",
                description: "2-4 core life areas/pillars",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "Operation name (e.g., 'Physical Health')" },
                    description: { type: "string", description: "Brief description" },
                    linked_goals: {
                      type: "array",
                      items: { type: "string" },
                      description: "Which of the user's goals this operation addresses"
                    }
                  },
                  required: ["name", "description", "linked_goals"]
                }
              },
              habits: {
                type: "array",
                description: "3-8 daily boolean habits that support the goals",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "Habit name (e.g., 'Morning Workout')" },
                    linked_operation: { type: "string", description: "Which operation this habit supports" },
                    reasoning: { type: "string", description: "Why this habit matters for the goals" }
                  },
                  required: ["name", "linked_operation", "reasoning"]
                }
              },
              metrics: {
                type: "array",
                description: "2-6 numeric measurements to track progress",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    unit: { type: "string" },
                    optimal_value: { type: "number" },
                    minimum_value: { type: "number" },
                    operator: { type: "string", enum: ["at_least", "at_most", "exactly"] },
                    linked_operation: { type: "string" },
                    reasoning: { type: "string", description: "Why tracking this matters" }
                  },
                  required: ["name", "unit", "optimal_value", "minimum_value", "operator", "linked_operation", "reasoning"]
                }
              },
              schedule: {
                type: "object",
                description: "Recommended wake and sleep times",
                properties: {
                  wakeHour: { type: "number", minimum: 0, maximum: 23 },
                  sleepHour: { type: "number", minimum: 0, maximum: 23 },
                  reasoning: { type: "string", description: "Why these times support the goals" }
                },
                required: ["wakeHour", "sleepHour", "reasoning"]
              }
            },
            required: ["operations", "habits", "metrics", "schedule"]
          }
        };

        // Call Claude API with streaming
        const response = await anthropic.messages.create({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          stream: true,
          system: systemPrompt,
          messages: [{
            role: 'user',
            content: `My main goals are:\n${goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}\n\nPlease analyze these goals and use the generate_full_system tool to create my complete life operating system.`
          }],
          tools: [tool],
          tool_choice: { type: "any" }
        });

        let toolInput: any = null;
        let currentBlockIndex = -1;

        for await (const chunk of response) {
          console.log('Chunk type:', chunk.type);

          if (chunk.type === 'content_block_start') {
            currentBlockIndex++;
            if (chunk.content_block?.type === 'tool_use') {
              console.log('Tool use block started:', chunk.content_block.name);
              toolInput = '';
            }
          } else if (chunk.type === 'content_block_delta') {
            if (chunk.delta.type === 'text_delta') {
              // Stream thinking text
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({
                  type: 'thinking',
                  content: chunk.delta.text
                })}\n\n`
              ));
            } else if (chunk.delta.type === 'input_json_delta') {
              // Accumulate tool input
              if (toolInput !== null) {
                toolInput += chunk.delta.partial_json;
                console.log('Accumulated tool input length:', toolInput.length);
              }
            }
          } else if (chunk.type === 'content_block_stop') {
            // Tool use complete, parse and send
            if (toolInput !== null && toolInput.length > 0) {
              try {
                console.log('Parsing tool input, length:', toolInput.length);
                const parsedTool = JSON.parse(toolInput);
                console.log('Parsed tool successfully:', Object.keys(parsedTool));

                // Send operations
                if (parsedTool.operations) {
                  console.log('Sending', parsedTool.operations.length, 'operations');
                  for (const op of parsedTool.operations) {
                    controller.enqueue(encoder.encode(
                      `data: ${JSON.stringify({
                        type: 'operation',
                        data: {
                          id: `op-${Date.now()}-${Math.random()}`,
                          ...op
                        }
                      })}\n\n`
                    ));
                  }
                }

                // Send habits
                if (parsedTool.habits) {
                  console.log('Sending', parsedTool.habits.length, 'habits');
                  for (const habit of parsedTool.habits) {
                    controller.enqueue(encoder.encode(
                      `data: ${JSON.stringify({
                        type: 'habit',
                        data: {
                          id: `habit-${Date.now()}-${Math.random()}`,
                          ...habit
                        }
                      })}\n\n`
                    ));
                  }
                }

                // Send metrics
                if (parsedTool.metrics) {
                  console.log('Sending', parsedTool.metrics.length, 'metrics');
                  for (const metric of parsedTool.metrics) {
                    controller.enqueue(encoder.encode(
                      `data: ${JSON.stringify({
                        type: 'metric',
                        data: {
                          id: `metric-${Date.now()}-${Math.random()}`,
                          ...metric
                        }
                      })}\n\n`
                    ));
                  }
                }

                // Send schedule
                if (parsedTool.schedule) {
                  console.log('Sending schedule');
                  controller.enqueue(encoder.encode(
                    `data: ${JSON.stringify({
                      type: 'schedule',
                      data: parsedTool.schedule
                    })}\n\n`
                  ));
                }

                // Reset for next tool use
                toolInput = null;
              } catch (parseError) {
                console.error('Failed to parse tool input:', parseError);
                console.error('Tool input was:', toolInput);
              }
            }
          }
        }

        // Send completion
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'complete' })}\n\n`
        ));

        controller.close();
      } catch (error: any) {
        console.error('Generation error:', error);
        try {
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({
              type: 'error',
              message: error.message || 'Generation failed'
            })}\n\n`
          ));
        } catch (e) {
          console.error('Failed to send error message, controller likely closed:', e);
        }
        try {
          controller.close();
        } catch (e) {
          console.error('Failed to close controller:', e);
        }
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  });
}
