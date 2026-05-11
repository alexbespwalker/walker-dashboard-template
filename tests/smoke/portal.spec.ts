/**
 * L1 Smoke Tests — auth + every page loads + zero console errors.
 *
 * Walker-wide standard: ship L1 minimum for every prod project. Reference
 * impl: walker-brain-next/tests/smoke/portal.spec.ts (the 6 tests below
 * mirror its structure).
 *
 * CUSTOMIZATION REQUIRED before first run (search "TODO:" comments):
 *   1. Update PAGES array with your project's nav items
 *   2. Confirm DEFAULT_LANDING matches your DEFAULT_ROUTE constant
 *   3. Confirm login fields match your /login form (#email, #password)
 *
 * CI secrets required: QA_EMAIL, QA_PASSWORD (per-project Walker QA user).
 */
import { test, expect, type Page, type ConsoleMessage } from "@playwright/test";

const QA_EMAIL = process.env.QA_EMAIL;
const QA_PASSWORD = process.env.QA_PASSWORD;
if (!QA_EMAIL || !QA_PASSWORD) {
  throw new Error(
    "QA_EMAIL and QA_PASSWORD env vars required. Set via CI secrets or .env.local."
  );
}

// TODO: replace with your project's nav items + their h1 text per page
const PAGES: [string, string][] = [
  ["/calls", "Call Explorer"],
  // ["/angles", "Angle Bank"],
  // ["/your-page", "Your Page Heading"],
];
const DEFAULT_LANDING = "/calls"; // TODO: match your DEFAULT_ROUTE constant

async function login(page: Page) {
  await page.goto("/login");
  await page.fill("#email", QA_EMAIL!);
  await page.fill("#password", QA_PASSWORD!);
  await page.getByRole("button", { name: "Sign In" }).last().click();
  await page.waitForURL(`**${DEFAULT_LANDING}`, { timeout: 15_000 });
  await expect(page.locator("nav, aside, [data-sidebar]").first()).toBeVisible();
}

const NOISE_PATTERNS = [
  /vercel/i,
  /vitals/i,
  /_next\/static/,
  /favicon/,
  /chunk load/i,
  /hydration/i,
  /third-party/i,
  /downloadable font/i,
  /ResizeObserver/i,
];

function isActionableError(msg: ConsoleMessage): boolean {
  if (msg.type() !== "error") return false;
  return !NOISE_PATTERNS.some((p) => p.test(msg.text()));
}

test.describe("L1 Smoke Tests — auth + page load + console errors", () => {
  test("1. Login flow lands on default route with sidebar visible", async ({ page }) => {
    await login(page);
    expect(page.url()).toContain(DEFAULT_LANDING);
  });

  test("2. All nav pages load without error boundary", async ({ page }) => {
    await login(page);
    for (const [path, heading] of PAGES) {
      await page.goto(path);
      await expect(page.locator("h1")).toContainText(heading, { timeout: 15_000 });
      await expect(page.getByText("Something went wrong")).not.toBeVisible();
    }
  });

  test("3. Zero actionable console errors across all pages", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (isActionableError(msg)) errors.push(`[${msg.type()}] ${msg.text()}`);
    });
    await login(page);
    for (const [path] of PAGES) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    if (errors.length > 0) console.log("Console errors found:", errors);
    expect(errors).toHaveLength(0);
  });
});
