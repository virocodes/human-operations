# Human Operations - System Redesign Summary

## Overview
The metrics tracking system has been completely redesigned to support scalable tracking of both daily habits and numeric metrics with categories and target values.

## Key Changes

### 1. **Separated Tracking Types**
- **Daily Habits**: Boolean checkboxes for daily recurring tasks (meditation, exercise, etc.)
- **Tracked Metrics**: Numeric values organized by categories with optional target values

### 2. **New Database Schema**

#### Categories Table
```sql
categories (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT,
  display_order INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### Updated Metrics Table
New fields added:
- `category_id UUID` - Links numeric metrics to categories (NULL for habits)
- `optimal_value NUMERIC` - Target value for "green" status
- `minimum_value NUMERIC` - Minimum acceptable value for "yellow" status
- `operator TEXT` - How to evaluate: 'at_least', 'at_most', or 'exactly'

### 3. **Color-Coded Targets**
Numeric metrics now support intelligent color coding:
- **Green**: Meets or exceeds optimal value
- **Yellow**: Meets minimum but below optimal
- **Red**: Below minimum threshold

Example: Calories metric with optimal=3000, minimum=2500, operator='at_least'
- 3000+ calories → Green
- 2500-2999 calories → Yellow
- <2500 calories → Red

### 4. **New API Routes**

#### `/api/categories`
- GET - List all categories for user
- POST - Create new category
- PUT - Update category name
- DELETE - Delete category

#### `/api/metrics` (Updated)
Now accepts additional fields:
- `category_id` - For numeric metrics
- `optimal_value` - Target value
- `minimum_value` - Minimum acceptable value
- `operator` - Comparison operator

### 5. **UI Redesign**

#### Welcome Section
- Progress ring now tracks **habits only** (not all metrics)
- Cleaner stats display: "X/Y Habits Complete"

#### Daily Habits Section
- Horizontal table layout (unchanged visually)
- Only shows boolean/checkbox metrics
- Drag-and-drop reordering
- Quick add with "+" button on hover

#### Tracked Metrics Section
- **Category-based organization**
- Tab/button selector to switch between categories
- Each metric displayed as a card with:
  - Metric name (clickable to edit)
  - Unit display
  - Target values shown (e.g., "Target: ≥ 3000 • Min: 2500")
  - 7-day grid for data entry
  - Color-coded cells based on target achievement
- Separate "New Category" and "New Metric" buttons

### 6. **Dialog Improvements**

#### New Habit Dialog
- Simplified: Only name field required

#### New Metric Dialog
- Name, Unit, Category selector
- **Optional Target Section**:
  - Operator selector (At Least, At Most, Exactly)
  - Optimal Value input
  - Minimum Value input

#### Edit Dialogs
- Separate dialogs for habits vs metrics
- Habits: Simple name editing
- Metrics: Full configuration including targets

## Migration Instructions

### 1. Run Database Migration
```bash
# In your Supabase SQL editor or psql:
psql -U your_user -d your_db -f migration.sql
```

Or manually run the SQL in your Supabase dashboard.

### 2. API Routes
New routes have been created:
- `app/api/categories/route.ts` (NEW)
- `app/api/metrics/route.ts` (UPDATED)

### 3. Frontend
The home page has been completely rewritten:
- Old version backed up as `app/home/page_old.tsx`
- New version now active as `app/home/page.tsx`

## Breaking Changes

### Data Compatibility
- **Existing boolean metrics**: Will appear in "Daily Habits" section ✅
- **Existing numeric metrics**: Will appear in "Uncategorized" ✅
- No data loss - all existing entries preserved
- New fields are optional and nullable

### Type Changes
The `Metric` interface now includes:
```typescript
interface Metric {
  id: string;
  name: string;
  type: MetricType;
  unit?: string | null;
  display_order: number;
  category_id?: string | null;      // NEW
  optimal_value?: number | null;     // NEW
  minimum_value?: number | null;     // NEW
  operator?: Operator | null;        // NEW
}
```

## Usage Examples

### Creating a Habit
1. Click "New Habit"
2. Enter name (e.g., "Morning Meditation")
3. Click Create
4. Appears in Daily Habits table

### Creating a Tracked Metric with Targets
1. (Optional) Create category: "Nutrition"
2. Click "New Metric"
3. Fill in:
   - Name: "Calories"
   - Unit: "kcal"
   - Category: "Nutrition"
   - Operator: "At Least (≥)"
   - Optimal Value: 3000
   - Minimum Value: 2500
4. Click Create
5. Metric appears in card format under "Nutrition" category
6. Data entry cells will be:
   - Green when value ≥ 3000
   - Yellow when 2500 ≤ value < 3000
   - Red when value < 2500

### Organizing Metrics
1. Create categories for different areas (Nutrition, Fitness, Work, etc.)
2. Assign metrics to categories during creation/editing
3. Switch between categories using the category buttons
4. View "Uncategorized" for metrics without a category

## Technical Details

### Color Calculation Logic
```typescript
// at_least operator
isOptimal = numValue >= optimal
isMinimum = numValue >= minimum && numValue < optimal

// at_most operator
isOptimal = numValue <= optimal
isMinimum = numValue <= minimum && numValue > optimal

// exactly operator (with 5% tolerance)
isOptimal = Math.abs(numValue - optimal) <= optimal * 0.05
isMinimum = Math.abs(numValue - minimum) <= minimum * 0.1
```

### State Management
- `habits` - Array of boolean metrics
- `trackedMetrics` - Array of numeric metrics
- `categories` - Array of category objects
- `selectedCategory` - Currently active category filter
- `entries` - All daily entries for the last 7 days

### Performance
- Parallel data loading (profile, categories, metrics, entries)
- Optimistic UI updates for instant feedback
- Debounced saves (500ms for numeric inputs)
- Efficient filtering with useMemo for stats

## Design Principles Maintained

1. **Technical/Analog Aesthetic**
   - Corner brackets on all major sections
   - Subtle grid backgrounds
   - Mono font for labels
   - Clean borders and spacing

2. **User Experience**
   - Drag-and-drop reordering
   - Hover states and transitions
   - Color-coded feedback
   - Responsive touch targets

3. **Data Integrity**
   - Type locking (can't change metric type after creation)
   - User-scoped RLS policies
   - Optimistic updates with rollback on error
   - Debounced saves to reduce API calls

## Future Enhancement Ideas

- Metric history/trends visualization
- Weekly/monthly summary views
- Category reordering with drag-and-drop
- Bulk metric import/export
- Custom color schemes for categories
- Notes/comments on daily entries
- Streak tracking for habits
- Goal setting and progress tracking

## Support

For issues or questions:
- Check the migration.sql file for database schema
- Review REDESIGN_SUMMARY.md (this file)
- Original code backed up in page_old.tsx
