# Meridian frontend

Original project: https://github.com/esforgary/market-analysis
Source commit: `a37018d682484ba5e964148304a98937397d9246`.

This directory retains only the original static frontend's dependency graph, required styles, assets and a dated news fallback. Server routes, RSS collectors, push service, database, framework templates and unused UI components are omitted. `lib/news.ts` retains only the two frontend data types.

## Rebuild

Use Node.js 22.13 or later. From this directory:

```sh
npm ci
npm run build
```

The isolated lockfile pins dependencies independently of GearLabs. Vite replaces only `client/public/imported/market-analysis/`; the root site's dependencies and build configuration are unchanged. Do not commit this directory's `node_modules`.

For standalone development run `npm run dev` and open http://127.0.0.1:5174/.

## Embedded adaptations

- Relative Vite asset URLs support the parent site's deployment base path.
- Published security/news snapshots are read from `https://esforgary.github.io/market-analysis/`; news falls back to the local snapshot if the public request fails.
- Currency requests retain the original public Frankfurter API. Chart/source timestamps and stale warnings are preserved. Offline currency/security data is not fabricated.
- Push settings show a demo notice; no service worker, registration, backend, database or credentials are included.
- The PWA manifest is omitted; Escape closes the parent preview only when no inner dialog is open.
- Favorites, theme and notification history use the original `meridian-*` browser storage keys.

Icon attribution is preserved in `public/icons/`; the vendored stylesheet's license is in `vendor/`.
