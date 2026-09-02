# Deploying Accord ESM (accord.talonbabb.com)

Hosting: GitHub Pages (repo `TalTheMotorSnoop/accord-esm`, branch `main`, root) behind Cloudflare (proxied, SSL mode **Flexible**).

## How caching really works (measured, not assumed)
- **HTML** (`HONDAESM.HTML`, custom pages, Honda pages, manifest): `max-age=600`, never edge-cached (`cf-cache-status: DYNAMIC`). Browsers hold them ≤10 min.
- **JS / CSS / PNG / woff2**: Cloudflare edge ≈10 min, but the **browser** caches them for **4 hours** (`max-age=14400`). "Purge Everything" only clears the edge; it cannot touch a visitor's browser cache.
- Therefore: everything the launcher loads lazily carries `?v=ESM_VER` (title lists, tree data, CIDX, SieListFunc, fonts.css) and is safe. The **unversioned** assets are `sw.js`, `mk8/en/js/esm-bridge.js`, `mk7/en/js/fallback.js` (referenced by 40,800 Honda pages) and the four custom pages loaded as iframe `src`. After a deploy those can be **stale for up to 4 h** in returning browsers — the hub↔bridge protocol MUST stay backward-compatible, and the private-window smoke test cannot see this skew (test in a profile that visited before the deploy).

## Every deploy
1. Bump the version in **three places** (keep them identical):
   - `HONDAESM.HTML` → `var ESM_VER='x.y.z'`
   - the five `fonts/fonts.css?v=x.y.z` links (HONDAESM.HTML, welcome, service, trims, guides)
   - `sw.js` → `var SW_VER='esm-x.y.z'`
2. `git fetch && git rebase origin/main` (GitHub commits `CNAME` edits itself when the custom domain is changed), then commit and `git push`.
3. Wait for the Pages build (repo → Actions → *pages build and deployment*, ~1–3 min).
4. Cloudflare → Caching → Configuration → **Purge Everything** (edge only; see above).
5. Open https://accord.talonbabb.com in a private window and check: disclaimer → search → open a page → highlights → Back → dashboard.

## Cloudflare settings that must be ON / OFF
- **ON**: *Always Use HTTPS* (SSL/TLS → Edge Certificates). Without it plain `http://` serves the full app as a *separate* localStorage silo and visitors can lose their notes when they arrive over https.
- **ON**: a Response Header Transform rule adding `X-Frame-Options: DENY` (or `Content-Security-Policy: frame-ancestors 'none'`) and `X-Robots-Tag: noindex, nofollow` to every response. The first stops third-party pages embedding the launcher; the second is the only noindex mechanism that works while `robots.txt` blocks crawling.
- **Recommended**: a Cache Rule for `/mk7/*` and `/mk8/*` *.html* — Cache Everything, long edge TTL (Honda pages are immutable). GitHub's origin occasionally answers 503 "Unicorn!"; edge-cached pages never hit it.
- **NEVER** tick GitHub Pages' "Enforce HTTPS" (Flexible SSL → infinite redirect loop).
- **Do not enable** Rocket Loader, Auto Minify, Email Obfuscation, Mirage/Polish, or Bot Fight Mode. The app relies on script order and loads content in iframes; challenge pages cannot render inside an iframe.

## Rules that keep the site up
- Keep the bridge protocol (`fallback.js`, `esm-bridge.js`, hub in HONDAESM.HTML) backward-compatible — old and new copies overlap for up to 4 h.
- Avoid mass-rewriting the Honda content files: each rewrite adds ~160 MB of git history (repo soft limit 1 GB). Launcher-only commits are tiny.
- Storage keys (`esm_*` in localStorage) are user data now. Renaming one requires a migration, not a fresh start.
- Rollback = push the previous launcher; the service worker is network-first and does not pin a shell.

## Rebuild scripts (only if Honda content or indexes change; they live in the build scratchpad, not the repo)
- Content index: `build_cidx.js` → regenerates `mk7/en/treedata/CIDX.js` and `mk8/...`
- mk8 bridge tags: `build_bridge_mk8.js`; mk7 figure popups: `bridge_mk7_popups.js`
