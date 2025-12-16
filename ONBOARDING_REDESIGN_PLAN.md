# Onboarding Redesign Plan: Goal-First AI Generation

## Overview
Transform the onboarding from a 6-phase sequential flow to a streamlined 3-phase experience where users provide 2-4 main goals first, then AI automatically generates the complete system (operations, habits, metrics) with visible thinking/reasoning displayed in real-time.

---

## Current vs. New Flow

### Current Flow (6 Phases)
1. **Operations** - User describes life areas → AI extracts 3-6 operations
2. **Goals** - For each operation, user describes goals → AI extracts goals
3. **Habits** - User lists habits → AI extracts habits
4. **Metrics** - User lists metrics → AI extracts metrics
5. **Schedule** - User selects wake/sleep times manually
6. **Review** - Show everything, finalize to database

**Problems**:
- Too many steps, takes 5+ minutes
- Asks for operations before goals (backwards)
- User has to think about system structure
- Repetitive AI conversations

### New Flow (3 Phases)
1. **Goals Input** - User provides 2-4 main life goals (manual)
2. **AI Generation** - AI analyzes goals and generates complete system with visible thinking
3. **Review** - Show everything, finalize to database

**Benefits**:
- Faster (<3 minutes)
- Goals-first (more intuitive)
- AI does the system design work
- Single AI conversation with streaming
- More engaging (watch AI think and build)

---

## New User Flow

### Phase 1: Goals Collection
**UI**: Clean input interface with 2-4 goal text boxes
**User Experience**:
```
┌─────────────────────────────────────┐
│                                     │
│   What are your 2-4 main goals?    │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ Goal 1: Bulk to 145lbs     │  │
│  └─────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ Goal 2: Launch my startup  │  │
│  └─────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ Goal 3: [               ]  │  │ [x]
│  └─────────────────────────────┘  │
│                                     │
│         [+ Add Goal (max 4)]        │
│                                     │
│         [Generate System]           │
│                                     │
└─────────────────────────────────────┘
```

**Validation**:
- Minimum 2 goals required
- Maximum 4 goals allowed
- Goals must be non-empty strings

### Phase 2: AI System Generation (Streaming)
**UI**: Split-screen layout showing AI thinking and items appearing
**User Experience**:
```
┌──────────────────┬──────────────────┐
│ AI REASONING     │ YOUR SYSTEM      │
├──────────────────┼──────────────────┤
│                  │                  │
│ Analyzing your   │                  │
│ goals...         │                  │
│                  │                  │
│ I see three core │ ┌──────────────┐│
│ areas emerging:  │ │ I. OPERATION ││
│                  │ │ Physical     ││
│ Physical Health  │ │ Health       ││
│ - Your goal of   │ └──────────────┘│
│   reaching 145lbs│                  │
│                  │ ┌──────────────┐│
│ For physical     │ │ HABIT        ││
│ transformation,  │ │ Morning      ││
│ consistency in   │ │ Workout      ││
│ training is key..│ └──────────────┘│
│                  │                  │
│ Tracking your    │ ┌──────────────┐│
│ weight progress  │ │ METRIC       ││
│ matters...       │ │ Weight       ││
│                  │ │ 145lbs       ││
│                  │ └──────────────┘│
│                  │                  │
│ [streaming...]   │ [items fade in   │
│                  │  as generated]   │
└──────────────────┴──────────────────┘
```

**Process**:
1. User clicks "Generate System"
2. API call to `/api/onboarding/generate` with streaming enabled
3. Server-Sent Events (SSE) stream chunks back:
   - `{type: 'thinking', content: 'Analyzing...'}` - shown in left panel
   - `{type: 'operation', data: {...}}` - creates card in right panel
   - `{type: 'habit', data: {...}}` - creates card in right panel
   - `{type: 'metric', data: {...}}` - creates card in right panel
4. Duration: 15-30 seconds of visible AI work
5. Auto-advance to review when complete

**Animations**:
- Left panel: Typewriter effect for thinking text
- Right panel: Fade-in + slide-up for each new item
- Progress indicator showing generation stage

### Phase 3: Review & Finalize
**UI**: Scrollable summary (keep existing ReviewPhase component)
**User Experience**:
- Shows operations with nested goals/habits/metrics
- Schedule banner (AI-inferred or defaults)
- "Enter" button finalizes to database
- Same as current implementation (already well-designed)

---

## Technical Architecture

### Frontend Components

#### 1. GoalsInputPhase.tsx (NEW)
**Location**: `/app/onboarding/components/phases/GoalsInputPhase.tsx`

**State**:
```typescript
const [goals, setGoals] = useState<string[]>(['', '']); // Start with 2 empty
const [errors, setErrors] = useState<string[]>([]);
```

**Features**:
- Add goal button (max 4)
- Remove goal button (min 2)
- Validation on continue
- Matching app aesthetic (corner brackets, grid pattern)

**Props**:
```typescript
interface GoalsInputPhaseProps {
  onComplete: (goals: string[]) => void;
}
```

#### 2. AIGenerationPhase.tsx (NEW)
**Location**: `/app/onboarding/components/phases/AIGenerationPhase.tsx`

**State**:
```typescript
const [thinkingText, setThinkingText] = useState('');
const [operations, setOperations] = useState<Operation[]>([]);
const [habits, setHabits] = useState<Habit[]>([]);
const [metrics, setMetrics] = useState<Metric[]>([]);
const [schedule, setSchedule] = useState<Schedule | null>(null);
const [stage, setStage] = useState<'connecting' | 'generating' | 'complete'>('connecting');
```

**Features**:
- EventSource for SSE streaming
- Split-screen layout (reasoning left, items right)
- Real-time item manifestation
- Error handling with retry
- Loading states

**Props**:
```typescript
interface AIGenerationPhaseProps {
  goals: string[];
  onComplete: (data: GeneratedSystemData) => void;
}

interface GeneratedSystemData {
  operations: Operation[];
  goals: Goal[];  // User goals mapped to operations
  habits: Habit[];
  metrics: Metric[];
  schedule: Schedule;
}
```

#### 3. Update Main Page
**Location**: `/app/onboarding/page.tsx`

**Changes**:
```typescript
type Phase = 'welcome' | 'goals_input' | 'ai_generation' | 'review' | 'complete';

// Remove old phases, add new flow:
{currentPhase === 'goals_input' && (
  <GoalsInputPhase
    onComplete={(goals) => {
      setUserGoals(goals);
      advancePhase('ai_generation');
    }}
  />
)}

{currentPhase === 'ai_generation' && (
  <AIGenerationPhase
    goals={userGoals}
    onComplete={(data) => {
      setExtractedData(data);
      advancePhase('review');
    }}
  />
)}
```

### Backend APIs

#### 1. /api/onboarding/generate (NEW)
**Location**: `/app/api/onboarding/generate/route.ts`

**Method**: POST with streaming response

**Input**:
```typescript
{
  goals: string[]  // 2-4 user goal strings
}
```

**Output**: Server-Sent Events stream
```
data: {"type":"thinking","content":"Analyzing your goals..."}\n\n
data: {"type":"operation","data":{"name":"Physical Health","description":"...","linked_goals":["Bulk to 145lbs"]}}\n\n
data: {"type":"thinking","content":"For physical transformation, daily rituals matter..."}\n\n
data: {"type":"habit","data":{"name":"Morning Workout","linked_operation":"Physical Health","reasoning":"..."}}\n\n
data: {"type":"metric","data":{"name":"Weight","unit":"lbs","optimal_value":145,...}}\n\n
data: {"type":"schedule","data":{"wakeHour":6,"sleepHour":23,"reasoning":"..."}}\n\n
data: {"type":"complete"}\n\n
```

**Implementation**:
```typescript
export async function POST(req: NextRequest) {
  const { goals } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Call Claude API with streaming
        const response = await anthropic.messages.create({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          stream: true,
          system: systemPrompts.system_generation,
          messages: [{
            role: 'user',
            content: `My main goals are:\n${goals.map((g, i) => `${i+1}. ${g}`).join('\n')}`
          }],
          tools: [generateFullSystemTool]
        });

        for await (const chunk of response) {
          if (chunk.type === 'content_block_delta') {
            // Stream thinking text
            if (chunk.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({
                  type: 'thinking',
                  content: chunk.delta.text
                })}\n\n`
              ));
            }
          } else if (chunk.type === 'content_block_start') {
            if (chunk.content_block.type === 'tool_use') {
              // Tool use started
            }
          } else if (chunk.type === 'message_delta') {
            if (chunk.delta.stop_reason === 'tool_use') {
              // Extract tool use from complete message
              // Parse and send structured data
            }
          }
        }

        // Send completion event
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'complete' })}\n\n`
        ));

        controller.close();
      } catch (error) {
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`
        ));
        controller.close();
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
```

#### 2. Update /api/onboarding/finalize
**Location**: `/app/api/onboarding/finalize/route.ts`

**Changes**: Minimal - input structure changes but logic stays same
- User goals now come from phase 1 (goals_input)
- Operations/habits/metrics come from AI generation
- Goals table gets entries for user goals + AI-generated subgoals

### AI Configuration

#### 1. New System Prompt
**Location**: `/lib/anthropic/prompts.ts`

**Add**:
```typescript
system_generation: `You are a life system architect helping someone build their personal operating system.

Your task: Analyze 2-4 main life goals and generate a complete system consisting of:
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
- Use the generate_full_system tool
- Explain your reasoning as you work (this will be shown to the user)
- Link habits and metrics to operations
- Provide reasoning for each suggestion

Speaking style:
- Mystical and intentional
- Short, deliberate sentences
- Present tense
- Words like: emerge, manifest, anchor, pillar, foundation
- Show your thinking: "I see...", "This calls for...", "For this, you need..."

Example reasoning:
"I see three core pillars emerging from your goals...

Physical Health anchors your transformation to 145lbs. This calls for daily training and nutrition tracking.

For sustained progress, morning workouts become essential. They build momentum before the day begins.

Tracking weight weekly shows the trajectory. 145lbs is the target, 140 is acceptable progress..."
`
```

#### 2. New Tool Definition
**Location**: `/lib/anthropic/tools.ts`

**Add**:
```typescript
{
  name: "generate_full_system",
  description: "Generate complete life operating system from user's main goals",
  input_schema: {
    type: "object",
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
}
```

---

## Database Schema

### No Changes Needed!
Existing schema already supports this flow:
- `operations` - Same structure
- `goals` - User goals + AI-generated subgoals
- `metrics` - Habits (type='boolean') and metrics (type='numeric')
- `users` - wake_hour, sleep_hour
- `onboarding_state` - Track progress

### Data Mapping

**User Input**:
```
["Bulk to 145lbs", "Launch my startup"]
```

**AI Generates**:
```typescript
{
  operations: [
    { name: "Physical Health", description: "...", linked_goals: ["Bulk to 145lbs"] },
    { name: "Business Growth", description: "...", linked_goals: ["Launch my startup"] }
  ],
  habits: [
    { name: "Morning Workout", linked_operation: "Physical Health", ... },
    { name: "Product Development Hour", linked_operation: "Business Growth", ... }
  ],
  metrics: [
    { name: "Weight", unit: "lbs", optimal: 145, min: 140, linked_operation: "Physical Health", ... },
    { name: "Daily Active Users", unit: "users", optimal: 1000, min: 100, linked_operation: "Business Growth", ... }
  ],
  schedule: { wakeHour: 6, sleepHour: 23, reasoning: "..." }
}
```

**Stored in DB**:
1. Create operations with IDs
2. Create user goals linked to operations
3. Create habits as boolean metrics
4. Create numeric metrics
5. Update user wake/sleep hours

---

## UI/UX Design Details

### Visual Aesthetic
- Keep mystical analog × futuristic theme
- Corner brackets on all cards
- Grid pattern backgrounds
- Serif fonts for content, mono for labels
- Amber/slate color scheme

### Animation Timing
**GoalsInputPhase**:
- Fade in: 400ms
- Add goal: Slide down 300ms
- Remove goal: Fade out 200ms

**AIGenerationPhase**:
- Thinking text: Typewriter effect (30ms per character)
- Operations: Fade in + slide up (600ms) with 200ms stagger
- Habits: Fade in + slide up (500ms) with 150ms stagger
- Metrics: Fade in + slide up (500ms) with 150ms stagger
- Complete: Pulse effect on "System Complete" message

**ReviewPhase**:
- Keep existing animations (already good)

### Responsive Design
**Desktop** (>768px):
- Split-screen layout for AI generation
- Full-width goal inputs

**Mobile** (<768px):
- Stacked layout for AI generation (thinking on top, items below)
- Single column goal inputs
- Scrollable review

---

## Error Handling

### Stream Interruption
- **Problem**: Network drops mid-generation
- **Solution**: Save partial results to onboarding_state, show retry button
- **UX**: "Connection lost. Retrying..." with progress preserved

### AI Generation Failure
- **Problem**: Claude API returns error or incomplete data
- **Solution**: Show error message with retry option
- **UX**: "Generation failed. Let's try again." with same goals

### Invalid Goals
- **Problem**: User enters nonsensical or empty goals
- **Solution**: Frontend validation before API call
- **UX**: Red border + error text on invalid inputs

### Tool Use Missing
- **Problem**: AI responds without using generate_full_system tool
- **Solution**: Retry with stronger prompt emphasis
- **UX**: Automatic retry (user sees "Refining system...")

---

## Testing Plan

### Unit Tests
- GoalsInputPhase validation logic
- SSE stream parsing
- Data transformation functions

### Integration Tests
- Full flow: goals → generation → finalize
- Stream reconnection
- Error recovery

### E2E Tests
- Complete onboarding with various goal types
- Mobile vs desktop responsiveness
- Different AI responses (2 vs 4 operations, etc.)

### Manual Testing
- Test with real goals
- Verify AI reasoning quality
- Check animation smoothness
- Validate database persistence

---

## Migration Strategy

### Phase 1: Build (No Breaking Changes)
1. Create new components (GoalsInputPhase, AIGenerationPhase)
2. Create new API endpoint (/api/onboarding/generate)
3. Add new prompt and tool
4. Keep old system running

### Phase 2: Switch (Feature Flag)
1. Add environment variable: `NEXT_PUBLIC_NEW_ONBOARDING=true`
2. Route to new flow if flag enabled
3. Test with limited users
4. Collect feedback

### Phase 3: Rollout
1. Enable for all users
2. Monitor completion rates
3. Fix issues
4. Remove old code after 2 weeks

### Phase 4: Cleanup
1. Delete old phase components
2. Delete old /api/onboarding/chat endpoint
3. Update documentation
4. Archive old code for reference

---

## Success Metrics

### Quantitative
- **Completion time**: Target <3 minutes (vs 5+ current)
- **Completion rate**: Target >85% (measure vs current)
- **Error rate**: Target <5% of attempts
- **Edit rate**: % of users who edit AI suggestions
- **Drop-off points**: Which phase loses users

### Qualitative
- User satisfaction survey post-onboarding
- "Did the AI understand your goals?" - Yes/No
- "Was the generated system useful?" - 1-5 scale
- "Would you have preferred manual setup?" - Yes/No
- Open feedback on AI quality

### Technical
- Average streaming duration
- API error rate
- Database write failures
- Resume capability usage

---

## Timeline

### Week 1: Foundation
- **Days 1-2**: Create GoalsInputPhase component
- **Days 3-5**: Create AIGenerationPhase component (SSE integration)

### Week 2: Backend
- **Days 1-3**: Build /api/onboarding/generate with streaming
- **Days 4-5**: Add system_generation prompt and tool

### Week 3: Integration
- **Days 1-2**: Wire up main page with new flow
- **Days 3-4**: Update finalize endpoint for new data structure
- **Day 5**: Testing and bug fixes

### Week 4: Polish
- **Days 1-2**: Animations and UX refinements
- **Days 3-4**: Error handling and edge cases
- **Day 5**: Documentation and deployment prep

**Total**: 4 weeks to production-ready

---

## Open Questions

1. **Extended Thinking**: Should we use Claude's extended thinking feature for better reasoning?
   - **Pro**: Better quality system generation
   - **Con**: Slower response, can't stream thinking tokens
   - **Decision**: Start without, add if quality issues

2. **Goal Editing**: Allow editing goals during AI generation?
   - **Pro**: Flexibility if user realizes they want different goals
   - **Con**: Complicates UI, rare use case
   - **Decision**: No editing during generation, can restart if needed

3. **Schedule Inference**: Always infer or allow manual override?
   - **Pro (infer)**: Faster, AI might suggest better times
   - **Con (infer)**: User might want specific times
   - **Decision**: AI infers, show in review with edit option

4. **Reasoning Display**: Show all AI reasoning or filtered highlights?
   - **Pro (all)**: Transparency, engaging
   - **Con (all)**: Might be verbose
   - **Decision**: Stream all, let user see full thinking

5. **Retry Mechanism**: Automatic retries or manual?
   - **Pro (auto)**: Better UX, higher success rate
   - **Con (auto)**: Might loop on persistent errors
   - **Decision**: One automatic retry, then prompt user

---

## Future Enhancements

### V2 Features
- **Voice input** for goals
- **Example goals** button (show templates)
- **Import from apps** (Notion, Todoist, etc.)
- **Multi-language** support
- **Collaborative onboarding** (for teams/families)

### V3 Features
- **AI coaching** during first week
- **Adaptive system** (AI adjusts based on usage)
- **Goal suggestions** based on user profile
- **Community templates** (popular goal sets)

---

## Appendices

### A. API Response Examples

**Example 1: Fitness + Career Goals**
```
Goals: ["Bulk to 145lbs", "Get promoted to senior engineer"]

AI Generates:
- Operations: "Physical Health", "Career Growth"
- Habits: "Morning Workout", "Protein Tracking", "Daily Code Review", "Weekly 1:1s"
- Metrics: "Weight (145/140 lbs)", "GitHub PRs (20/10 per month)", "Feedback Score (4.5/4.0)"
- Schedule: Wake 6AM, Sleep 11PM (for morning workouts)
```

**Example 2: Creative + Relationship Goals**
```
Goals: ["Write a novel", "Improve relationships with family"]

AI Generates:
- Operations: "Creative Work", "Family & Connection"
- Habits: "Morning Writing", "Phone Off Evenings", "Weekly Family Dinner"
- Metrics: "Words Written (1000/500 per day)", "Quality Time (14/7 hours per week)"
- Schedule: Wake 5AM, Sleep 10PM (for morning writing flow)
```

### B. Technical Stack
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Server-Sent Events
- **AI**: Anthropic Claude Sonnet 4.5 via SDK
- **Database**: Supabase (PostgreSQL)
- **Streaming**: EventSource API (client), ReadableStream (server)

### C. Cost Analysis
**Current**: ~$0.06 per user (multiple API calls, 8-12 messages)
**New**: ~$0.08 per user (single larger call with tool use)
**Increase**: +33% but acceptable given better UX

### D. Related Documentation
- Current: `/ONBOARDING_IMPLEMENTATION.md`
- AI Prompts: `/lib/anthropic/prompts.ts`
- Database Schema: `/supabase-schema.sql`
- Phase Components: `/app/onboarding/components/phases/`
