Imported frontend: https://github.com/esforgary/market-analysis
Source commit: a37018d682484ba5e964148304a98937397d9246
Imported 2026-10-16 from the repository's existing static-app entry point.

The original Meridian interface is built separately with Vite (`vite.pages.config.ts`, relative base `./`) and served from `client/public/imported/market-analysis`. No server, database, credentials, authentication, or dependency is added to GearLabs.

Changes to the imported build:
- PushSettings is replaced with a short embedded-demo notice; no service worker or push API is included.
- Security charts read published JSON snapshots from the original GitHub Pages site.
- News reads the same public site, with the repository's dated news.json as a local fallback.
- Original Frankfurter public currency reads, source timestamps, stale-data notices, favorites, themes, filters and local notification history remain intact.
- The PWA manifest is omitted. Escape exits the host preview unless an inner dialog is open.

The cover is an illustration of the original dashboard; numeric values on it are decorative. Real preview data keeps its original dates and provider labels. External market data still requires a network connection.

Bundled icon attribution and license are in public/imported/market-analysis/icons.

The maintained frontend source is `client/demos/market-analysis`. To rebuild, run `npm ci` followed by `npm run build` there with Node.js >=22.13.0. Its isolated package lock is included; the output replaces only `client/public/imported/market-analysis`. The source directory README describes the retained files and adaptations. Backend collectors and unused source modules are omitted.
