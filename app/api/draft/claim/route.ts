import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { draftId, operations, goals, habits, metrics, schedule } = await request.json();

    if (!draftId) {
      return NextResponse.json({ error: 'draftId is required' }, { status: 400 });
    }

    // Check if this draft has already been claimed (prevent double-claim)
    const { data: existingClaim } = await supabase
      .from('funnel_analytics')
      .select('id')
      .eq('draft_id', draftId)
      .eq('event_type', 'draft_claimed')
      .eq('event_data->>success', 'true')
      .single();

    if (existingClaim) {
      return NextResponse.json(
        { error: 'Draft has already been claimed' },
        { status: 400 }
      );
    }

    // ============================================================
    // REUSE FINALIZATION LOGIC FROM /api/onboarding/finalize
    // ============================================================

    // 1. Create operations
    const operationsToInsert = operations.map((op: any, index: number) => ({
      user_id: user.id,
      title: op.name,
      description: op.description,
      display_order: index
    }));

    const { data: createdOperations, error: opsError } = await supabase
      .from('operations')
      .insert(operationsToInsert)
      .select();

    if (opsError) {
      console.error('Failed to create operations:', opsError);
      throw new Error('Failed to create operations');
    }

    // Create a map of temp IDs to real IDs
    const operationIdMap = new Map();
    operations.forEach((op: any, index: number) => {
      operationIdMap.set(op.id, createdOperations![index].id);
    });

    // 2. Create numeric metrics first (so we can link goals to them)
    const metricIdMap = new Map(); // Map of metric names to real IDs

    if (metrics.length > 0) {
      const metricsToInsert = metrics.map((metric: any, index: number) => ({
        user_id: user.id,
        name: metric.name,
        type: 'numeric',
        unit: metric.unit,
        optimal_value: metric.optimal_value ?? null,
        minimum_value: metric.minimum_value ?? null,
        operator: metric.operator ?? null,
        display_order: index + habits.length // Continue order after habits
      }));

      const { data: createdMetrics, error: metricsError } = await supabase
        .from('metrics')
        .insert(metricsToInsert)
        .select();

      if (metricsError) {
        console.error('Failed to create metrics:', metricsError);
        throw new Error('Failed to create metrics');
      }

      // Create metric name to ID map
      metrics.forEach((metric: any, index: number) => {
        if (createdMetrics && createdMetrics[index]) {
          metricIdMap.set(metric.name, createdMetrics[index].id);
        }
      });

      // Link metrics to operations
      const metricLinks = metrics
        .map((metric: any, index: number) => {
          if (metric.linked_operation) {
            const operationId = operationIdMap.get(metric.linked_operation);
            if (operationId && createdMetrics && createdMetrics[index]) {
              return {
                operation_id: operationId,
                metric_id: createdMetrics[index].id
              };
            }
          }
          return null;
        })
        .filter(Boolean);

      // Link through the operations table's metric_id field
      for (const link of metricLinks) {
        if (link) {
          const { error: linkError } = await supabase
            .from('operations')
            .update({ metric_id: link.metric_id })
            .eq('id', link.operation_id);

          if (linkError) {
            console.error('Failed to link metric to operation:', linkError);
          }
        }
      }
    }

    // 3. Create goals and subgoals
    if (goals.length > 0) {
      for (const goal of goals) {
        const metricId = goal.linked_metric_name ? metricIdMap.get(goal.linked_metric_name) : null;

        const { data: createdGoal, error: goalError } = await supabase
          .from('goals')
          .insert({
            user_id: user.id,
            operation_id: operationIdMap.get(goal.operation_id),
            title: goal.title,
            goal_type: goal.goal_type,
            metric_id: metricId,
            target_value: goal.target_value || null,
            initial_value: goal.initial_value || null
          })
          .select()
          .single();

        if (goalError) {
          console.error('Failed to create goal:', goalError);
          throw new Error('Failed to create goals');
        }

        // Create subgoals if they exist
        if (goal.subgoals && goal.subgoals.length > 0) {
          const subgoalsToInsert = goal.subgoals.map((subgoal: string, index: number) => ({
            goal_id: createdGoal.id,
            title: subgoal,
            display_order: index
          }));

          const { error: subgoalsError } = await supabase
            .from('subgoals')
            .insert(subgoalsToInsert);

          if (subgoalsError) {
            console.error('Failed to create subgoals:', subgoalsError);
          }
        }
      }
    }

    // 4. Create boolean metrics (habits) and link to operations
    if (habits.length > 0) {
      const habitsToInsert = habits.map((habit: any, index: number) => ({
        user_id: user.id,
        name: habit.name,
        type: 'boolean',
        display_order: index
      }));

      const { data: createdHabits, error: habitsError } = await supabase
        .from('metrics')
        .insert(habitsToInsert)
        .select();

      if (habitsError) {
        console.error('Failed to create habits:', habitsError);
        throw new Error('Failed to create habits');
      }

      // Create operation_habits links
      const habitLinks = habits
        .map((habit: any, index: number) => {
          if (habit.linked_operation) {
            const operationId = operationIdMap.get(habit.linked_operation);
            if (operationId && createdHabits && createdHabits[index]) {
              return {
                operation_id: operationId,
                habit_id: createdHabits[index].id
              };
            }
          }
          return null;
        })
        .filter(Boolean);

      if (habitLinks.length > 0) {
        const { error: linksError } = await supabase
          .from('operation_habits')
          .insert(habitLinks);

        if (linksError) {
          console.error('Failed to link habits to operations:', linksError);
        }
      }
    }

    // 5. Update user's schedule hours (if provided)
    if (schedule) {
      const { error: scheduleError } = await supabase
        .from('users')
        .update({
          wake_hour: schedule.wakeHour,
          sleep_hour: schedule.sleepHour
        })
        .eq('id', user.id);

      if (scheduleError) {
        console.error('Failed to save schedule:', scheduleError);
      }
    }

    // 6. Mark onboarding as complete
    const { error: stateError } = await supabase
      .from('onboarding_state')
      .upsert({
        user_id: user.id,
        current_phase: 'complete',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (stateError) {
      console.error('Failed to update onboarding state:', stateError);
    }

    // 7. Record draft claim analytics
    await supabase.from('funnel_analytics').insert({
      user_id: user.id,
      draft_id: draftId,
      event_type: 'draft_claimed',
      event_data: {
        success: true,
        operations_count: operations.length,
        goals_count: goals.length,
        habits_count: habits.length,
        metrics_count: metrics.length
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Draft claim error:', error);

    // Record failed claim attempt
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const body = await request.json();

      if (user && body.draftId) {
        await supabase.from('funnel_analytics').insert({
          user_id: user.id,
          draft_id: body.draftId,
          event_type: 'draft_claimed',
          event_data: {
            success: false,
            error: error.message
          }
        });
      }
    } catch (analyticsError) {
      console.error('Failed to record analytics for failed claim:', analyticsError);
    }

    return NextResponse.json(
      { error: error.message || 'Failed to claim draft' },
      { status: 500 }
    );
  }
}
