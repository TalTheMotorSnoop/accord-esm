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
- **ON**: a Response Header Transform rule adding `X-Frame-Options: SAMEORIGIN` (or `Content-Security-Policy: frame-ancestors 'self'`) — never `DENY`, which also blocks the launcher's own iframes and blanks the whole site and `X-Robots-Tag: noindex, nofollow` to every response. The first stops third-party pages embedding the launcher; the second is the only noindex mechanism that works while `robots.txt` blocks crawling.
- **Recommended**: a Cache Rule for `/mk7/*` and `/mk8/*` *.html* — Cache Everything, long edge TTL (Honda pages are immutable). GitHub's origin occasionally answers 503 "Unicorn!"; edge-cached pages never hit it.
- **NEVER** tick GitHub Pages' "Enforce HTTPS" (Flexible SSL → infinite redirect loop).
- **Do not enable** Rocket Loader, Auto Minify, Email Obfuscation, Mirage/Polish, or Bot Fight Mode. The app relies on script order and loads content in iframes; challenge pages cannot render inside an iframe.

## Rules that keep the site up
- Keep the bridge protocol (`fallback.js`, `esm-bridge.js`, hub in HONDAESM.HTML) backward-compatible — old and new copies overlap for up to 4 h.
- Avoid mass-rewriting the Honda content files: each rewrite adds ~160 MB of git history (repo soft limit 1 GB). Launcher-only commits are tiny.
- Storage keys (`esm_*` in localStorage) are user data now. Renaming one requires a migration, not a fresh start.
- Rollback = push the previous launcher; the service worker is network-first and does not pin a shell.

## Usage stats (v2.2+)
- The launcher posts anonymous events to `/api/t` **only** when served from `accord.talonbabb.com` (never on file:// or localhost). A Cloudflare Worker (`Desktop/Accord ESM Telemetry`, its own folder — NOT in this repo) answers that route and writes to the Workers Analytics Engine dataset `esm_events`. See its README for deploy + reports.
- The Worker is independent of this site: deploying the launcher never requires redeploying the Worker and vice versa. If the Worker is missing, beacons 404 harmlessly.
- Quick check after either deploy: `https://accord.talonbabb.com/api/health` → `ok`; open the site, then `node report.js --days 1` in the Worker folder.
- Opt-out is the sidebar checkbox (localStorage `esm_tstats=off`). Never add note text, job cards, bookmarks or pins to an event — the disclaimer and Welcome page promise it.
- Batches leave the browser with `fetch(..., {keepalive:true})` first and the beacon API only as a fallback (v2.2.1). Keep it that way: ClearURLs, uBlock Origin and similar block beacon-API requests outright as "ping tracking", which made every such visitor invisible in v2.2.0.
- The data store lags a minute or two behind the beacon; do not judge a deploy by an immediate dashboard refresh.

## Rebuild scripts (only if Honda content or indexes change; they live in the build scratchpad, not the repo)
- Content index: `build_cidx.js` → regenerates `mk7/en/treedata/CIDX.js` and `mk8/...`
- mk8 bridge tags: `build_bridge_mk8.js`; mk7 figure popups: `bridge_mk7_popups.js`

## Translated manuals (v2.3+) — NOT in this repo
- The site is at GitHub Pages' 1 GB limit (mk7 352 MB + mk8 625 MB). The six translated 7th-gen sets (hu, cs, pl, nl, fr, ru — about 490 MB and 60,000 files each) live in the Cloudflare R2 bucket `accord-esm-content` and are served on this origin at `/mk7x/<lang>/…` by the Worker in `Desktop/Accord ESM Content Worker`. Same origin is deliberate: the launcher talks to pages inside frames and notes/bookmarks live in this origin's storage.
- Source: `Downloads/Accord 7gen.iso` (Honda Europe disc, 2008-03). Pipeline: `Desktop/Accord ESM Tests/pipeline` — `build_lang.mjs <lang>` (pages + bridge tag, title lists, trees, CIDX, XMAP), `r2_upload.mjs <lang|all>` (sends only changed files; credentials in `Accord ESM Tests/r2.env`), `build_xmap_en.mjs` (English page map, this repo: `mk7/en/treedata/XMAP.js`).
- In the launcher a content set is `mk7` | `mk8` | `mk7-<lang>`; `gp(set)` is the only place that turns a set into a path. Never hard-code `/en/` again.
- `esm-bridge.js` exists once in this repo (`mk8/en/js`) and as a copy in every translated set. After changing it: re-copy into `out/mk7x/*/js` and re-run the upload, or the translated sets keep the old bridge.
- The search tokenizer (`foldText`/`qTokens` here, `cidx.mjs` in the pipeline) must stay identical, or translated search silently finds nothing.
- Smoke test after a deploy: `node live_check.mjs <version>` and `node probe_lang.mjs chromium hu https://accord.talonbabb.com/` in `Desktop/Accord ESM Tests`.
- Rollback: `npx wrangler delete` in the Worker folder removes `/mk7x/*`; push a launcher whose `_langsOK()` returns false to hide the picker.

## Interface translations (v2.4+)
- `i18n/<lang>.js` holds the launcher's own text for hu, cs, pl, nl, fr, ru: `{s:{English:translation}, r:[[regex, template]]}`. English is the source; the launcher translates what it renders through a MutationObserver (`_i18nTr`, `_i18nWalk`), exact matches only, so manual titles, notes and job names are never touched.
- Sources and build live outside the repo in `Desktop/Accord ESM Tests/i18n`: `keys.json` (numbered English strings), `<lang>.txt` (`id|translation`), `build_i18n.cjs` (validates ids, placeholders and symbols, then writes `i18n/<lang>.js` here).
- Adding or changing an English string in the launcher: add it to `make_keys.cjs` extras (or re-run `collect_ui_strings.mjs`), translate it in the six `.txt` files, rebuild. An untranslated string simply stays English — nothing breaks.
- Not translated: Welcome, Service, Trims and Guides pages, the glossary definitions, the DTC family descriptions.
- Tests: `probe_ui_i18n.mjs <engine> <lang> [baseURL]` and `probe_ui_fit.mjs [width]` (labels that no longer fit their control).

## Page translations (v2.5+)
- Welcome, Common Jobs and the Service dashboard include `i18n/pages.js`, which applies `i18n/pages.<lang>.js` (`h` whole blocks of HTML, `s` texts, `r` rules with `$m1` month names, `g` Common Jobs search phrases). English stays the source inside the page. The Trim Level Guide is UK-market data and stays English.
- Common Jobs link titles and search phrases are NOT hand-translated: `build_pages_i18n.cjs` looks up the same procedure in the target language through the Honda document code (needs `Accord ESM Tests/out/mk7x/<lang>` and `work/<lang>/info`).
- Version bump now touches the `?v=` of `i18n/pages.js` in welcome/guides/service as well as `fonts.css`.
- Changing English text on those pages: re-run `pipeline/collect_page_strings.mjs`, `i18n/make_page_keys.cjs`, fix the ids in `pages_<lang>.txt`, rebuild. Unmatched text simply stays English.
