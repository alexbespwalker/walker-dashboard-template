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
npm run typecheck    # TypeScript strict-check (CI Gates step)
npm run test:smoke   # Run Playwright smoke suite locally (requires QA_EMAIL + QA_PASSWORD in .env.local)
npx vercel --prod    # Deploy to Vercel
```

## Deep Prod Regression Testing (Walker-wide standard, codified 2026-05-11)

**Every dashboard built from this template MUST run L1+L2+L3 smoke tests on every Vercel deploy.** This is the Walker bar — "did the tool answer the stakeholder's question," not "did the page load." See workspace `CLAUDE.md` + `~/.claude/rules/behavioral/walker-engineering.md` for the full standard, and `~/.claude/projects/.../memory/project_walker_deep_prod_test_pattern.md` for the reference doc.

### What ships with this template

- `playwright.config.ts` — Playwright config, points at `PLAYWRIGHT_TEST_BASE_URL` from CI
- `tests/smoke/portal.spec.ts` — L1 starter (auth + page load + console errors). 3 tests, ready to run after the 3 TODO customizations.
- `tests/smoke/portal-deep.spec.ts.example` — L2+L3 starter template with TODOs. **Rename to `portal-deep.spec.ts`** and customize per project. Reference: `walker-brain-next/tests/smoke/portal-deep.spec.ts` (15 working tests).
- `.github/workflows/smoke-tests.yml` — fires on Vercel Production deploy
- `.github/workflows/preview-smoke.yml` — fires on Vercel preview deploy (non-blocking first week)

### Adoption checklist for a new project

1. `git clone` this template + customize (per "How to Create a New Dashboard" above).
2. **Customize `tests/smoke/portal.spec.ts`** — search 3 TODOs (PAGES array, DEFAULT_LANDING, login fields). ~5 min.
3. **`mv tests/smoke/portal-deep.spec.ts.example tests/smoke/portal-deep.spec.ts`** then customize the L2+L3 stubs to match your filters + decision-flow actions. ~30-60 min using `walker-brain-next/tests/smoke/portal-deep.spec.ts` as reference.
4. **Add CI secrets to your new repo:**
   - `QA_EMAIL` + `QA_PASSWORD` — required (Walker QA user creds)
   - `VERCEL_AUTOMATION_BYPASS_SECRET` — optional (only if Vercel deployment protection is on)
   - `SUPABASE_SERVICE_ROLE_KEY` — optional (only if your L2/L3 needs DB cross-checks)
5. **Update `playwright.config.ts`** — replace `https://your-dashboard.vercel.app` baseURL fallback with your prod URL after first Vercel deploy.
6. First deploy to Vercel triggers smoke tests automatically. Watch the run + iterate.

### Three-tier coverage (what each tier catches)

| Tier | What it catches | Min test count |
|---|---|---|
| **L1** | "Did deploy break basic loading" — auth + page render + console errors | 3-6 |
| **L2** | "Wrong-data, silent filter bugs" — filter narrowing + recency + sort | 5+ |
| **L3** | "Action didn't land in DB" — decision-flow paths with paired revert | 3+ |

### L3 paired-revert rule (NON-NEGOTIABLE)

Every L3 test that mutates DB MUST pair the mutation with an inverse action so the audit log stays balanced. Pattern: publish→dismiss, approve→reset-to-pending, create→delete. Prevents test pollution of stakeholder metrics. See walker-brain-next reference impl for the publish-then-dismiss pattern.

### Budget + cost

- GitHub Actions free tier = 2000 min/month → ~740 deploys/month with 3-min smoke suite. Walker projects push 10-30x/week — well within free tier.
- Stay under 10-min GH Actions timeout per workflow. walker-brain-next at 21 tests runs in ~3.2 min — room for 30+ more tests before timeout pressure.
