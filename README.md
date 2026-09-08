# Metzler Kundengalerie — Prototype

A high‑fidelity, self‑contained prototype of the **Kundengalerie** (customer‑photo
gallery) page for [edelstahl‑tuerklingel.de](https://edelstahl-tuerklingel.de).
It reimagines the current photo archive as a conversion‑driving proof asset:
a branded hero carousel, a trust band, a sticky/accessible category filter, a
shoppable masonry gallery, a "Siegerbild des Monats" winner carousel, and a
Fotowettbewerb entry form — all in the Metzler design system.

Reference for the current live page: <https://edelstahl-tuerklingel.de/tuerklingel-galerie>

---

## View it

`kundenbilder.html` is a **single, self‑contained file** — every image, style and
script is inlined, so it runs offline with no build step and no assets folder.

- Open `kundenbilder.html` (or `index.html`, which redirects to it) in any modern browser.
- Nothing to install to *view* it.

## Rebuild it

The page is **generated**, not hand‑edited. Edit the source in `build/` and regenerate:

```bash
cd build
node assemble.mjs      # writes ../kundenbilder.html
```

Requires **Node 18+** (developed on Node 22). No network or external folders needed —
everything is vendored under `build/`. Full details in [`build/BUILD.md`](build/BUILD.md).

---

## Project structure

```
.
├── kundenbilder.html          # ← the deliverable: self-contained prototype (generated)
├── index.html                 # tiny redirect → kundenbilder.html (for a clean root URL)
├── README.md                  # this file
├── build/                     # source + build pipeline (edit here, then run assemble.mjs)
│   ├── template.html          # THE editable source: markup, gallery CSS/JS, placeholders
│   ├── assemble.mjs           # inlines vendor CSS/JS + embeds images → ../kundenbilder.html
│   ├── BUILD.md               # how the build works + how to edit
│   ├── vendor/                # Metzler design-system chrome, copied verbatim from the PDP
│   │   ├── styles-v2.css      #   topbar · header · nav · mobile-nav · footer · tokens · container
│   │   ├── chrome.css         #   mega-menu · quickbar · breadcrumb
│   │   └── chrome.js          #   header logic (mega-menu, mobile nav, scroll-shrink, search)
│   ├── data/                  # pre-generated, committed image data (base64, WebP)
│   │   ├── imgmap.json        #   26 customer gallery photos
│   │   ├── chromeimg-small.json #  logo, icons, mega-menu products, footer logos
│   │   ├── hero-carousel.json #   5 curated hero carousel photos
│   │   └── winners.json       #   12 most-recent "Siegerbild des Monats" winner photos
│   └── scripts/               # one-off asset-generation scripts (reference only; see BUILD.md)
└── design-system/             # Metzler design-system reference docs
    ├── metzler-tokens.css     #   canonical design tokens (colors, radius, shadows)
    ├── metzler-design-brief.md #  tokens, primitives, header/footer, page scaffolding rules
    ├── metzler-design-system.md # design-system overview
    └── SECTIONS.md            #   catalog of ready-made page sections
```

> A local `Carousel Images/` folder (hero source photos) is intentionally **git‑ignored** —
> those images are already downscaled and embedded in `build/data/hero-carousel.json`,
> so the source folder is not required to build or view the page.

---

## Implementation notes

- **Self‑contained & CSP‑safe.** All images are inlined as base64 `data:` URIs; no
  external requests. Fonts use the system stack (no web‑font import).
- **All raster images are WebP.** Logos/UI icons remain SVG (vector). The built page
  contains only WebP + SVG — no JPEG/PNG.
- **Design‑system accurate.** Header, footer, mega‑menu, breadcrumb, buttons, modal and
  tokens are taken from the live Metzler PDP (`build/vendor/*`) so the page matches the
  rest of the shop 1:1.
- **Responsive.** Mobile‑first breakpoints throughout; verified from 360px to ultrawide.
- **Accessible.** Keyboard‑operable filters (`aria-pressed`), live result count
  (`role="status"`), focus styles, `prefers-reduced-motion` handling, alt text.
- **Key sections**
  - *Hero* — auto‑advancing single‑photo carousel; each slide opens a lightbox.
  - *Filter toolbar* — sticky under the header, category chips with live counts,
    scroll‑to‑results, horizontally scrollable on mobile.
  - *Gallery* — masonry grid; each photo links to its product page (PDP) and opens a
    PDP‑style lightbox.
  - *Siegerbild des Monats* — carousel of the 12 most‑recent monthly winners with a
    thumbnail navigator (grid on desktop, chevron scroll‑strip on mobile).
  - *Fotowettbewerb* — contest entry form (order number, uploads, consent).

## Data sources

- **Gallery photos** — customer installations from `edelstahl-tuerklingel.de`.
- **Winner photos** — the 12 most‑recent winners from
  [metzlergmbh.de/gewinner](https://metzlergmbh.de/gewinner/). The winner
  months/names are declared in `build/template.html` (the `WINNERMETA`/`META` array
  in the winner‑carousel script); images are keyed by month in `build/data/winners.json`.
  To refresh, add the new month's photo to `winners.json` and its `{key, month, name}`
  entry to the array, then rebuild.

## Production note

The prototype inlines everything as base64 to stay a single portable file. In
production these images should be served as normal HTTP resources (responsive
`srcset`, `loading="lazy"`, CDN) rather than base64 — the page weight here is a
prototype artifact, not a required trade‑off.
