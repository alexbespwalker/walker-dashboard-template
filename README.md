# Walker Dashboard Template

Next.js 16 dashboard template with glassmorphism dark theme, JWT auth, Supabase data, and Recharts visualization. Built for Walker Advertising's standardized dashboard workflow.

## Quick Start

```bash
# 1. Clone and rename
git clone https://github.com/alexbespwalker/walker-dashboard-template.git my-dashboard
cd my-dashboard

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Edit .env.local with your Supabase URL, anon key, password, auth secret

# 4. Customize
# Edit src/lib/constants.ts (project name, colors, schema)
# Edit src/components/dashboard/sidebar.tsx (nav items)
# Add pages in src/app/(dashboard)/

# 5. Build & verify
npm run build

# 6. Deploy
npx vercel --prod
```

## What's Included

- Glassmorphic dark theme with ambient glow
- JWT cookie auth with middleware guard
- Shared filter context (granularity + date range)
- Shimmer skeleton loading states
- Stagger entrance animations
- Metric cards, stacked/donut/gradient bar charts
- Sortable data tables with CSV export
- Error boundary with retry
- Scroll-triggered animations (IntersectionObserver hook)
- Collapsible mobile sidebar
- Data freshness indicator
- Supabase pagination for large datasets

## Deploy to Vercel

Set these environment variables in Vercel:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `DASHBOARD_PASSWORD` | Login password |
| `AUTH_SECRET` | Random 32+ character string |

## See CLAUDE.md for detailed customization instructions.
