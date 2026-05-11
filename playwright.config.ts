/**
 * Playwright config — Walker dashboard smoke test pattern.
 *
 * Walker-wide standard (codified 2026-05-11): every prod project with
 * stakeholders runs L1+L2+L3 smoke tests on every Vercel deploy.
 * See `~/.claude/projects/.../memory/project_walker_deep_prod_test_pattern.md`.
 *
 * Reference implementation: walker-brain-next/tests/smoke/{portal.spec.ts,
 * portal-deep.spec.ts}. Same patterns; per-project customization required.
 */
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/smoke",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html"]] : [["html"]],
  use: {
    baseURL:
      process.env.PLAYWRIGHT_TEST_BASE_URL ||
      // TODO: replace with your project's prod URL after first Vercel deploy
      "https://your-dashboard.vercel.app",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Optional: set VERCEL_AUTOMATION_BYPASS_SECRET in CI if your project has
    // Vercel deployment protection enabled. Most Walker stakeholder
    // dashboards do not — bypass is a no-op when unset.
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? {
          "x-vercel-protection-bypass":
            process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
        }
      : {},
  },
});
