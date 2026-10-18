# Thailand Fieldnotes

An activity registry for a December 2026 trip to Bangkok and Chiang Mai, built with Next.js 16 and React 19.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. Search by name, neighbourhood or interest; filter by city/category; save favourites; compare up to three activities; add private browser-local notes; export a Markdown shortlist.

## Content

- `data/activities.json`: all 349 catalogue entries from the supplied reports (177 Bangkok, 172 Chiang Mai). IDs remain stable even when a name is corrected.
- `data/research/<id>.json`: independently researched activity briefs. Each is produced by a dedicated activity subagent, with source links, outstanding uncertainties and photo provenance.
- `data/types.ts`: shared content schema.
- `data/research-progress.json`: the research coordinator's task ledger.
- `data/image-cache.json`: original photo URLs mapped to locally cached, resized assets. Attribution and license remain in each brief.

Original report claims are visibly distinguished from independently researched facts. A `partial` status means some practical facts remain unconfirmed. Even verified briefs include uncertainties; event years, access rules, prices and availability should be checked before booking. Historical and representative images are labelled in their alt text.

The two reports contain overlapping venues, timing variants and cautionary entries. These remain separate to preserve the full source catalogue.

## Checks and build

```sh
node scripts/validate-data.mjs
node scripts/validate-data.mjs --complete # also require all 349 briefs
npx tsc --noEmit
npm run build
```

The production build exports static files to `out/`. No server, database, account or API key is required. Shortlists and notes are stored only in the current browser.

Browser checks use Playwright and Chrome:

```sh
node scripts/check-browser.mjs
```

Set `CHROME_PATH` for a different Chrome executable and `TEST_URL` to test a different server. The checks exercise filters, persistence, notes, export, comparison, mobile overflow and dialogs. Screenshots go to `/tmp/`.

To refresh local copies of sourced reference photos, run `node scripts/cache-images.mjs` on macOS (requires curl and sips). The script preserves source credits and declared reuse terms, and falls back to online references when a download fails. A reference image is not a grant of reuse rights.
