# E2E Playwright

## Usage

Same environment variables as local Next.js development so the app can reach Convex and Better Auth:

- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL` deployment (appName.convext.site)
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000`
- `SITE_URL` on Convex deployment must match `NEXT_PUBLIC_SITE_URL`

Place them in `.env.local` (loaded automatically by `next dev`) or export them in your shell before running tests.

```bash
npx playwright install chromium
```

## Commands

```bash
npm run test:e2e      # headless
npm run test:e2e:ui   # interactive UI mode
```

`playwright.config.ts` starts `npm run dev`, ensure the app is already running and `PLAYWRIGHT_BASE_URL=http://localhost:3000`.

## Suites

- **smoke.spec.ts** — Home, blog page navbar, sign-in page (no auth).
- **post-detail.spec.ts**
- **search.spec.ts** — Desktop viewport; navbar search dropdown Convex.
- **create-journey.spec.ts** — Registers `e2e-<timestamp>@example.com`, creates a post --img needed to submit `fixtures/tiny.png`;
