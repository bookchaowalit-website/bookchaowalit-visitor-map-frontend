# Visitor Map

A local visitor atlas: mark your own visit (snapped to a fixed city from your browser time zone) or simulate visitors.

## Features
- "Mark my visit" uses only `Intl` time zone, no IP lookup or geolocation prompt
- Simulated visitors for demoing the map
- City register with counts (yours vs simulated), last 40 marks kept in localStorage

## Limitations
- Five fixed cities on an abstract projection; not real geography or analytics
- Marks are per-browser, not shared across visitors

## Run
```bash
npm install
npm run dev
```

## Honesty
Portfolio demo. Not multi-tenant SaaS. Prefer local-only state over fake production claims.

## Checks

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs the same checks on every push (`.github/workflows/ci.yml`).
