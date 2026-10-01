# Upgrade plan

## Current state

Score: 6/10 (was 4/10) — the atlas can now record the viewer's own (time-zone) visit alongside simulated ones, with validated storage and tests; still single-browser.

## Backlog

- P1: Optional shared counter behind a privacy-safe backend (country-level only) if the product wants real aggregate visits.
- P1: Add more cities / a lat-lon based projection so time-zone snapping is less coarse.
- P2: Playwright smoke test for mark / simulate / clear.

## Done in this pass

- CI (`.github/workflows/ci.yml`): `npm ci`, lint, typecheck, vitest, `next build` on every push and PR.
- `/api/mcp` uses a typed JSON-RPC handler (`lib/mcp.ts`, tested) with proper error codes and an honest `get_app_info` tool; this fixed the template's lint errors.
- `/more-projects` renders from `lib/related-projects.ts` (was ~980 lines of unrolled links plus an unused data copy) and no longer links to itself; removed the stale `app/page.tsx.backup`.
- Visit logic moved to `lib/visits.ts` (tested): time-zone → city mapping, capped log, per-city counts, and storage parsing that re-derives marker coordinates (tampered x/y in localStorage can no longer move dots).
- New "Mark my visit" action (time zone only), announced status line, `aria-pressed` city rows; hydration via `lib/use-stored-state.ts` fixes the set-state-in-effect lint error and a save-before-load race.

## Done in this pass (pass 2)

- Canonical host is config-driven: `lib/site.ts` resolves `NEXT_PUBLIC_SITE_URL` (validated, clear error on a non-http(s) value) and feeds `metadataBase`, generated `app/sitemap.ts` / `app/robots.ts` and the MCP `get_app_info` URL; removed the stale template `public/sitemap.xml` / `robots.txt` (they pointed at `bookchaowalit.com` and a `*.vercel.app` name that differs from the project URL). Tested in `lib/site.test.ts`.

## Done in this pass (pass 3)
- Edge-case pass on `lib/visits.ts` (regression tests in `lib/visits.test.ts`):
  - `cityForTimeZone` returned null for legacy link names browsers can still
    report (`Singapore`, `Hongkong`, `PRC`, `ROC`, `ROK`), so the "add my
    visit" action did nothing; they now map to Bangkok / Tokyo.
  - `Atlantic/Bermuda`, `Atlantic/Stanley`, `Atlantic/South_Georgia` were
    placed in Berlin; they now map to the Americas marker.
  - `simulatedHit(NaN)` produced a hit with no city/coordinates; it now falls
    back to the first city.
  - `parseHits` kept stored hits with repeated ids (duplicate SVG keys); only
    the first is kept.
- Security deps: `next` 16.1.6 -> 16.3.8 (and `eslint-config-next`) clears critical GHSA-2xp9-vwfh-vxw4 (Image Optimization RCE) plus bundled postcss/sharp highs; lockfile regenerated with same-major `npm audit fix`. `npm audit --omit=dev`: C1/H3/M1/L0 [nanoid:h,next:c,postcss:h,sharp:h] -> C0/H0/M0/L0.
