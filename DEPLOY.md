# Deploying Accord ESM (accord.talonbabb.com)

Hosting: GitHub Pages (repo `TalTheMotorSnoop/accord-esm`, branch `main`, root) behind Cloudflare (proxied, SSL mode **Flexible**).

## Every deploy
1. Bump the version in **three places** (keep them identical):
   - `HONDAESM.HTML` → `var ESM_VER='x.y.z'` (stamps `?v=` on every lazy-loaded script)
   - the five `fonts/fonts.css?v=x.y.z` links (HONDAESM.HTML, welcome, service, trims, guides)
   - `sw.js` → `var SW_VER='esm-x.y.z'`
2. Commit and `git push`.
3. Wait for the Pages build (repo → Actions → *pages build and deployment*, ~1–3 min).
4. Cloudflare → Caching → Configuration → **Purge Everything**. Cloudflare edge-caches `.js`/`.png` for 4 hours; without the purge, visitors can get a new launcher with old scripts (or vice-versa) for hours.
5. Open https://accord.talonbabb.com in a private window and check: disclaimer → search → open a page → highlights.

## Rules that keep the site up
- **Never tick "Enforce HTTPS" on GitHub Pages.** With Cloudflare on Flexible it causes an infinite redirect loop. Use Cloudflare *Always Use HTTPS* instead.
- **Do not enable** Cloudflare Rocket Loader, Auto Minify, Email Obfuscation, Mirage/Polish, or Bot Fight Mode. The app relies on script order and loads content in iframes; challenge pages cannot render inside an iframe.
- Keep the bridge protocol (`mk7/en/js/fallback.js`, `mk8/en/js/esm-bridge.js`, hub in HONDAESM.HTML) backward-compatible: the 19,835 mk8 pages reference the bridge without a version, so old and new copies overlap during cache expiry.
- Avoid mass-rewriting the Honda content files: each rewrite adds ~160 MB of git history (repo soft limit 1 GB). Launcher-only commits are tiny.
- Storage keys (`esm_*` in localStorage) are user data now. Renaming one requires a migration, not a fresh start.

## Rebuild scripts (only if Honda content or indexes change)
- Content index: `build_cidx.js` (scratchpad) → regenerates `mk7/en/treedata/CIDX.js` and `mk8/...`
- mk8 bridge tags: `build_bridge_mk8.js`; mk7 figure popups: `bridge_mk7_popups.js`
