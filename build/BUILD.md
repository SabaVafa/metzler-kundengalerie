# Build — how `kundenbilder.html` is generated

`kundenbilder.html` (repo root) is **generated**, not hand-edited. It is produced by
inlining the Metzler design-system chrome and embedding every image into a source
template, so the result is one self-contained file that runs offline.

## Regenerate the page

```bash
cd build
node assemble.mjs
```

That reads `template.html` + `vendor/*` + `data/*` and writes `../kundenbilder.html`.
**No network and no external folders are required** — everything is vendored here.
Requires Node 18+ (developed on Node 22).

To preview: just open `kundenbilder.html` in any browser (it's self-contained).

## Files

| Path | Role |
|------|------|
| `template.html` | **The editable source** — page markup, gallery CSS/JS, and placeholders (`/*__STYLESV2__*/`, `/*__CHROMECSS__*/`, `/*__CHROMEJS__*/`, `/*__IMGMAP__*/`, `/*__HEROIMG__*/`, `/*__WINNERSIMG__*/`) plus `<img src="…">` chrome-image paths that get swapped for data URIs. |
| `assemble.mjs` | Inlines vendor CSS/JS + embeds images → `../kundenbilder.html`. |
| `vendor/styles-v2.css` | PDP design-system chrome (topbar · header · nav · mobile-nav · footer · tokens · 1380px container). Copied verbatim from the Metzler PDP. |
| `vendor/chrome.css` | Mega-menu · quickbar · breadcrumb styles (from the PDP). |
| `vendor/chrome.js` | Header logic: mega-menu (hover/click/keyboard), mobile slide-in nav, scroll-shrink, quickbar toggle, responsive search (from the PDP). |
| `data/imgmap.json` | The 26 customer gallery photos as base64 data URIs (keyed by id). |
| `data/chromeimg-small.json` | Logo, icons, mega-menu products, posters and footer logos as data URIs (keyed by markup `src`). |
| `data/hero-carousel.json` | 5 curated hero-carousel photos as data URIs (keyed by name), exposed as `window.HEROIMG`. |
| `data/winners.json` | The 12 most-recent "Siegerbild des Monats" winner photos as data URIs (keyed by month, e.g. `w2025_07`), exposed as `window.WINNERS`. Winner month/name labels live in `template.html`'s winner-carousel `META` array. |

> **Image format:** every raster image is embedded as **WebP**; logos/UI icons stay **SVG**. The built page contains only WebP + SVG (no JPEG/PNG).

## To edit the page

1. Edit `template.html` (structure, gallery styles, copy).
2. Run `node assemble.mjs`.
3. Open the regenerated `../kundenbilder.html`.

## Regenerating the image data (only if assets change)

The `data/*.json` files are pre-generated and committed, so you normally don't need this.
The scripts in `scripts/` reproduce them but **require the original source assets**
(the live shop for customer photos, and a local copy of the Metzler PDP repo for the
chrome/footer images) and are provided for reference:

- `scripts/dl-gallery.mjs` — downloads the customer photos from `edelstahl-tuerklingel.de` → `data/imgmap.json` (needs network).
- `scripts/encode-chrome.mjs` — base64-encodes the header/mega-menu/poster images from the PDP folder.
- `scripts/resize-server.mjs` — downscales those chrome images in-browser (they only render ≤176–720px) to keep the file small → `data/chromeimg-small.json`.
- `scripts/encode-footer.mjs` — encodes the footer logo/badge/payment images from the PDP folder and merges them into `data/chromeimg-small.json`.

> These reference scripts use absolute paths to the local `PDP METZLER` folder; adjust the paths at the top of each script if you re-run them.
