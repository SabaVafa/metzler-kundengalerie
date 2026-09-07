/**
 * assemble.mjs — regenerate ../kundenbilder.html from source.
 *
 * Inlines the Metzler design-system chrome (vendor/) and embeds every image
 * (data/) into template.html, producing the self-contained ../kundenbilder.html.
 *
 * Run:  cd build && node assemble.mjs
 * No network and no external folders required — everything it needs is vendored.
 */
import { readFileSync, writeFileSync } from 'node:fs';
const here = new URL('./', import.meta.url);
const R = (p) => readFileSync(new URL(p, here), 'utf8');

let html = R('./template.html');

const stylesV2  = R('./vendor/styles-v2.css');   // topbar · header · nav · mobile-nav · footer · tokens · container
const chromeCss = R('./vendor/chrome.css');      // mega-menu · quickbar · breadcrumb
const chromeJs  = R('./vendor/chrome.js');       // header logic (mega-menu, mobile-nav, scroll-shrink, quickbar)
const img       = JSON.parse(R('./data/imgmap.json'));          // 26 customer photos (data URIs)
const chromeImg = JSON.parse(R('./data/chromeimg-small.json')); // logo · icons · mega · footer logos (data URIs)
const heroImgRaw = R('./data/hero-carousel.json');              // curated hero carousel photos (data URIs)

const sub = (s, marker, content) => {
  if (!s.includes(marker)) { console.error('MISSING marker', marker); process.exit(1); }
  return s.split(marker).join(content);
};

html = sub(html, '/*__STYLESV2__*/', stylesV2);
html = sub(html, '/*__CHROMECSS__*/', chromeCss);
html = sub(html, '/*__CHROMEJS__*/', chromeJs);
html = sub(html, '/*__IMGMAP__*/', 'window.IMG=' + JSON.stringify(img) + ';');
html = sub(html, '/*__HEROIMG__*/', 'window.HEROIMG=' + heroImgRaw + ';');

// swap chrome <img src="..."> markup paths for their embedded data URIs
let swapped = 0, missed = [];
for (const [src, uri] of Object.entries(chromeImg)) {
  const needle = 'src="' + src + '"';
  if (html.includes(needle)) { html = html.split(needle).join('src="' + uri + '"'); swapped++; }
  else missed.push(src);
}

writeFileSync(new URL('../kundenbilder.html', here), html, 'utf8');
console.log('✓ wrote ../kundenbilder.html', (Buffer.byteLength(html) / 1024 / 1024).toFixed(2) + 'MB');
console.log('  gallery images:', Object.keys(img).length, '· chrome images swapped:', swapped, '· missed:', missed.length, missed.slice(0, 5));
