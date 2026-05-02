# End-to-end tests (Playwright)

## Prerequisites

Use the same environment variables as local Next.js development so the app can reach Convex and Better Auth:

- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL` (must end in **`.convex.site`**, not `.convex.cloud`)
- `NEXT_PUBLIC_SITE_URL` — your Next app origin (e.g. `http://localhost:3000`); should match what you type in the browser
- **`SITE_URL` on your Convex deployment** (Dashboard → Settings → Environment Variables, or `npx convex env set SITE_URL ...`) — **must match `NEXT_PUBLIC_SITE_URL` exactly** (including `localhost` vs `127.0.0.1`). Sign-in can 500 if Convex `SITE_URL` is missing or wrong.

Place them in `.env.local` (loaded automatically by `next dev`) or export them in your shell before running tests.

Install browsers once (match your CPU architecture; use `--force` after switching machines or if Playwright reports a missing executable):

```bash
npx playwright install chromium
```

## Commands

```bash
npm run test:e2e      # headless
npm run test:e2e:ui   # interactive UI mode
```

`playwright.config.ts` starts `npm run dev` unless `CI` is set; with `CI`, ensure the app is already running and matches `PLAYWRIGHT_BASE_URL` (default `http://localhost:3000`).

## Optional env toggles

| Variable | Purpose |
|----------|---------|
| `E2E_POST_ID` | Convex `posts` document id. When set, `post-detail.spec.ts` opens `/blog/<id>` and asserts the post renders (not “No post found”). |
| `E2E_SKIP_CREATE_JOURNEY` | When set (any value), skips `create-journey.spec.ts` (sign-up + create post), e.g. for smoke-only runs. |
| `PLAYWRIGHT_BASE_URL` | Override dev server URL used by tests and `webServer.url`. |

 Seed a post manually in the Convex dashboard or via your app, then copy its id into `E2E_POST_ID` for stable post-detail coverage.

## Auth: “failed to decrypt private key” (`/api/auth/convex/token`)

Better Auth encrypts Convex JWT signing keys (`jwks` table) with **`BETTER_AUTH_SECRET`** (Convex dashboard env). That error means existing keys were encrypted with a **different** secret than the one Convex is using now.

1. Prefer: set **`BETTER_AUTH_SECRET`** back to the value that created the stored keys **or**
2. Set a Convex env **`AUTH_JWKS_MAINTENANCE_TOKEN`** and run **`npx convex run authJwksMaintenance:clearAllJwtSigningKeys '{"maintenanceToken":"…"}'`** (see [`convex/authJwksMaintenance.ts`](../../convex/authJwksMaintenance.ts)) so new keys can be minted after you **settle** on one secret. Existing sessions may need to sign in again.

## Suites

- **smoke.spec.ts** — Home, blog index, navbar, sign-in page (no auth).
- **post-detail.spec.ts** — Requires `E2E_POST_ID`; skipped when unset.
- **search.spec.ts** — Desktop viewport; navbar search dropdown (Convex-backed).
- **create-journey.spec.ts** — Registers `e2e-<timestamp>@example.com`, creates a post with `fixtures/tiny.png`; skip with `E2E_SKIP_CREATE_JOURNEY` if Convex/auth is unavailable.

## Auth storage (future)

If you add saved sessions, ignore `playwright/.auth/` (already in `.gitignore`).
