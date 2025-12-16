# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Human Operations** is a personal productivity and habit tracking system - a "life operating system" that helps users track daily habits, measure metrics, manage goals, and organize their life around core "operations" (life areas/pillars).

Tech stack: Next.js 16 (App Router), TypeScript, Supabase (Auth + PostgreSQL), Anthropic Claude API, Radix UI, Tailwind CSS 4.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Architecture Overview

### App Router Structure

This project uses Next.js 16 App Router with a clear server/client component split:

- `/app/api/*` - RESTful API routes (all require authentication)
- `/app/home/*` - Main application (protected, requires completed onboarding)
- `/app/onboarding/*` - AI-powered setup flow using Claude
- `/app/login` - Google OAuth authentication
- `/app/auth/callback` - Supabase auth callback handler

### Authentication & Routing Flow

Middleware (`middleware.ts`) enforces this flow:
1. Unauthenticated users → `/login`
2. Authenticated but not onboarded (no `onboarding_state.current_phase = 'complete'`) → `/onboarding`
3. Completed onboarding but not paid → `/payment`
4. Paid users → `/home`

All API routes check `supabase.auth.getUser()` and return 401 if unauthenticated.

### Payment System

**One-time payment model**: $19 lifetime access (no free tier, no subscriptions)

**Stripe Integration**:
- Product: "Human Operations"
- Price: $19 one-time (configured via `STRIPE_PRICE_ID` env var)
- Uses Stripe Checkout for payment processing
- Webhook handler at `/api/stripe/webhook` updates user payment status

**Payment Flow**:
1. User completes onboarding → redirected to `/payment`
2. Click "Continue to Payment" → creates Stripe Checkout session
3. User pays via Stripe → webhook fires `checkout.session.completed`
4. Webhook updates `users.has_paid = true` → redirects to `/home`

See `PAYMENT_SETUP.md` for full setup instructions.

### Database Architecture (Supabase/PostgreSQL)

All tables use Row Level Security (RLS) with policies scoped to `auth.uid()`.

**Core Schema**:
- `users` - User profiles with wake/sleep hours, plan tier, payment status (`has_paid`, `stripe_customer_id`, `payment_date`)
- `operations` - Life areas/pillars (user creates 2-4 core focus areas)
- `metrics` - Both habits (boolean) and tracked metrics (numeric with targets)
- `entries` - Daily tracking data (unique constraint: metric_id + date)
- `goals` - Either metric-based (track progress to target) or subgoal-based (checklist)
- `subgoals` - Breakdown of subgoal-based goals
- `tasks` - Daily schedule/timetable items (recurring time blocks)
- `todos` - Task list with priority levels
- `categories` - Grouping for numeric metrics
- `operation_habits` - Many-to-many linking operations to habits
- `onboarding_state` - Tracks onboarding progress and stores conversation history

**Key Pattern**: Operations are the organizing principle - habits, metrics, and goals all link to operations to provide structure.

### Client State Management

No global state library - uses custom hooks pattern:

- `useHomeData()` - Central data hub, coordinates all data loading
- `useHabits()`, `useMetrics()`, `useGoals()`, `useOperations()`, `useTasks()`, `useTodos()` - Feature-specific hooks

**Phased Loading Strategy** (critical for UX):
```typescript
// Phase 1: Essential data (blocking) - dashboard can render
await Promise.all([loadHabits(), loadEntries()])
setLoading(false)

// Phase 2: Background data (non-blocking) - loads while user interacts
Promise.all([loadCategories(), loadTrackedMetrics(), loadGoals(), ...])
```

**Optimistic Updates**: UI updates immediately with temporary ID, API call happens in background, server response replaces temp data. Rollback on error.

### Component Organization

```
/app/home/components/
├── /dashboard     # Habits grid, today's metrics summary
├── /metrics       # Numeric metrics tracking with color-coded cells
├── /goals         # Goals + schedule in split view
├── /operations    # Operations management
├── /history       # Historical views (overlays)
├── /navigation    # Desktop grid chips + mobile tab bar
└── /shared        # Reusable components (dialogs, skeletons)
```

Types centralized in `/app/home/types.ts`.

### Navigation System

**Desktop**: 2D grid navigation (unique feature)
- T-shaped layout: 3 top pages (Metrics, Dashboard, Goals) + 1 bottom center (Operations)
- Arrow keys navigate between pages
- Visual chip navigation in bottom-right corner
- Uses CSS transforms for smooth transitions
- Lazy loads non-dashboard pages with React `lazy()` and `Suspense`

**Mobile**: Traditional tab bar with 4 sections.

### AI Onboarding Flow

Uses Claude Sonnet 4.5 via Anthropic SDK (`@anthropic-ai/sdk`).

**Multi-phase conversation**:
1. User inputs 2-4 main goals
2. Provides details for each goal (habits, metrics, schedule preferences)
3. Claude generates complete system using structured tool calls
4. User reviews and edits before finalizing

**Key files**:
- `/lib/anthropic/client.ts` - SDK initialization
- `/lib/anthropic/tools.ts` - Structured tool definitions for Claude
- `/lib/anthropic/prompts.ts` - System prompts for each phase
- `/app/api/onboarding/chat` - Streaming conversation endpoint
- `/app/api/onboarding/generate-simple` - Full system generation
- `/app/api/onboarding/finalize` - Writes to database

Uses prompt caching for efficiency. Stores conversation history in `onboarding_state.conversation_history` JSONB column.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
NEXT_PUBLIC_APP_URL=
```

## UI Patterns

**Design System**: Brutalist/minimalist aesthetic with corner brackets, grid patterns, monospace accents.

**Theme**: Dark/light mode via `next-themes`, CSS custom properties in `globals.css` using oklch color space.

**Shared Components** (`/components/ui/`): Based on shadcn/ui (Radix UI primitives) - avatar, button, card, checkbox, dialog, dropdown-menu, input, label, select, textarea. Styled with `cn()` utility (clsx + tailwind-merge).

**Metrics Color Coding**:
- Green: meets optimal target
- Yellow: meets minimum but not optimal (for at_least/at_most metrics)
- Red: below target
- Gray: no entry

**Habits Color Coding**:
- Green: completed
- Red: not completed
- Gray: future date or no entry

## Key Behaviors

- Dates are always stored as `YYYY-MM-DD` strings (use `formatDate()` utility)
- Users can only edit today or future dates (use `canEdit()` utility)
- All numeric metrics have operators: `at_least`, `at_most`, or `exactly`
- Drag-and-drop reordering uses `@dnd-kit` for habits, metrics, categories, operations
- When metric is deleted, associated entries are cascade deleted via RLS policy
- Schedule tasks can optionally link to habits (but habits are tracked separately in entries table)

## API Route Patterns

All routes follow RESTful conventions:

```
GET    /api/[resource]              # List/get
POST   /api/[resource]              # Create
PUT    /api/[resource]              # Update
DELETE /api/[resource]?id={id}      # Delete
```

**Standard auth check**:
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
```

**Query pattern for date ranges**:
```typescript
// Entries API uses startDate and endDate query params
const entries = await supabase
  .from('entries')
  .select('*')
  .eq('metric_id', metricId)
  .gte('date', startDate)
  .lte('date', endDate)
```

## Path Alias

TypeScript configured with `@/*` alias mapping to project root. Use `@/` for all imports instead of relative paths.
