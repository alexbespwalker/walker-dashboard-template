# Walker Dashboard Template

## What This Is

Reusable Next.js dashboard template for Walker Advertising. Clone and customize for any new data source. Includes glassmorphism design, JWT auth, Supabase integration, Recharts, and shared filter context.

## Stack

- Next.js 16 + React 19 + TypeScript (strict)
- shadcn/ui + Tailwind v4 (dark theme, glass cards)
- Recharts (stacked bar, donut, gradient bar)
- Supabase JS (configurable schema)
- jose (JWT httpOnly cookie auth, 24h)
- Vercel deployment

## How to Create a New Dashboard from This Template

1. Clone this repo, rename to `<project-name>-dashboard`
2. Copy `.env.example` to `.env.local`, fill in Supabase URL, anon key, schema, password, auth secret
3. Update `src/lib/constants.ts`:
   - `PROJECT_NAME`, `PROJECT_SUBTITLE`, `PROJECT_LOGO_LETTER`
   - `PRIMARY` color and `CHART_COLORS` array
   - `SUPABASE_SCHEMA` to match your Supabase schema
   - `DEFAULT_ROUTE` to your first page
4. Update `src/components/dashboard/sidebar.tsx`:
   - Replace `navItems` array with your pages and icons
5. For each page:
   a. Add type interface in `src/lib/queries.ts`
   b. Add query function in `src/lib/queries.ts` (use `getPaginatedData` for >1000 rows)
   c. Create `src/app/(dashboard)/<page-name>/page.tsx` (server component, ISR 5min)
   d. Create `src/app/(dashboard)/<page-name>/loading.tsx` (shimmer skeleton)
   e. Create `src/components/pages/<page-name>-client.tsx` (client component with charts/tables)
6. Delete the `/example` page once your real pages are ready
7. Run `npm install && npx next build` to verify
8. Deploy: `npx vercel --prod` from project root

## Architecture Pattern

```
Server Component (page.tsx)     -> Fetches from Supabase (ISR 5min cache)
  |
  v
Client Component (*-client.tsx) -> Receives data as props
  |                                Applies filters (date range, granularity, multi-select)
  |                                Computes metrics
  |                                Renders MetricCard, charts, DataTable
  v
FilterProvider (layout.tsx)     -> Shared state: granularity + date range across all pages
```

## Available Components

| Component | Import | Purpose |
|-----------|--------|---------|
| `MetricCard` | `@/components/dashboard/metric-card` | Glass card with label, large value, optional delta |
| `FilterPanel` | `@/components/dashboard/filter-panel` | Granularity + date range + quick presets (7d/14d/30d) |
| `MultiSelect` | `@/components/dashboard/multi-select` | Popover dropdown with checkboxes |
| `DataTable` | `@/components/tables/data-table` | Sortable table with glass styling |
| `StackedBarChart` | `@/components/charts/stacked-bar-chart` | Stacked bars with legend (use with aggregateByPeriod) |
| `DonutChart` | `@/components/charts/donut-chart` | Pie with center total label |
| `SimpleBarChart` | `@/components/charts/bar-chart` | Gradient-filled bars |
| `CsvExport` | `@/components/dashboard/csv-export` | Download table data as CSV |
| `DataFreshness` | `@/components/dashboard/data-freshness` | "Updated 3 min ago" indicator |
| `ErrorBoundary` | `@/components/dashboard/error-boundary` | Catch + retry on Supabase failures |

## Hooks

| Hook | Purpose |
|------|---------|
| `useFilters()` | Access shared granularity + date range from FilterProvider |
| `useInView()` | Intersection Observer for scroll-triggered `.scroll-reveal` animations |

## CSS Utilities

| Class | Effect |
|-------|--------|
| `glass-card` | Glassmorphism card (backdrop-blur, rgba border, shadow) |
| `glass-card-hover` | Hover: deeper shadow, brighter border |
| `shimmer-skeleton` | Loading placeholder with shimmer animation |
| `metric-value-enter` | Slide-up fade-in for numbers |
| `stagger-1` through `stagger-4` | Animation delay (0/75/150/225ms) |
| `scroll-reveal` | Invisible until `.in-view` added (use with useInView hook) |

## Color Theming

All colors flow from two places:
1. `src/lib/constants.ts` - JS constants for components (PRIMARY, CHART_COLORS)
2. `src/app/globals.css` - CSS custom properties (--primary, --chart-1, etc.)

To rebrand: update both files. The CSS vars control shadcn/ui primitives; the JS constants control chart fills, sidebar accents, and gradient buttons.

## Supabase Notes

- Schema set in `constants.ts` -> used by `supabase.ts`
- PostgREST has 1000-row default limit; use `getPaginatedData()` for large tables
- supabase-py v2 API: `client.schema("name").table()` not `table().select(schema=)`

## Commands

```bash
npm install          # Install deps
npm run dev          # Dev server (http://localhost:3000)
npm run build        # Production build (verify before deploy)
npx vercel --prod    # Deploy to Vercel
```
