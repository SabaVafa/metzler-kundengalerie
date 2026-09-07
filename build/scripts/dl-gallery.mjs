import { writeFileSync } from 'node:fs';

const DIR = '02-24/Neue-Bilder-Komprimiert/';
const webp = (size, file) => `https://edelstahl-tuerklingel.de/media/image/opc/${size}/${DIR}${file}.webp`;

// id -> [webp-basename, original-xl-url]
const M = [
  ['ebenhard_colson', 'briefkatsen-ebenhard-vdm10-colson-1', 'briefkatsen-ebenhard-vdm10-colson-1.png'],
  ['kian_3x',         'vdm10-kian-3x', 'vdm10-kian-3x.png'],
  ['bispo',           'paketbox-bispo-1', 'paketbox-bispo-1.png'],
  ['elbars_magneto',  'hausnummernschild-elbars-klingelplatte-magneto', 'hausnummernschild-elbars-klingelplatte-magneto.png'],
  ['hugo_up',         'vdm10-up_briefkasten-1', 'vdm10-up_briefkasten-1.png'],
  ['lepo2',           'briefkasten-lepo2-1', 'briefkasten-lepo2-1.png'],
  ['vitus',           'tuerklingel-vitus-1', 'tuerklingel-vitus-1.png'],
  ['colson_3x',       'vdm10-colson-3x', 'vdm10-colson-3x.png'],
  ['hoffmann_blanko', 'briefkasten-blanko-1', 'briefkasten-blanko-1.png'],
  ['mtb_pflanzdach',  'muelltonnenbox-pflanzdach-4x', 'muelltonnenbox-pflanzdach-4x.png'],
  ['modell01_heidi',  'briefkasten-modell01-türklingel-heidi-2', 'briefkasten-modell01-t%C3%BCrklingel-heidi-2.png'],
  ['horizon',         'vdm10-horizon-1', 'vdm10-horizon-1.png'],
  ['hugo_bauhaus',    'briefkasten-hugo-1', 'briefkasten-hugo-1.png'],
  ['heidi',           'tuerklingel-heidi-2', 'tuerklingel-heidi-2.png'],
  ['bispo2',          'paketbox-bispo2-1', 'paketbox-bispo2-1.png'],
  ['siebert_vdm10',   'briefkasten-vdm10-siebert', 'briefkasten-vdm10-siebert.png'],
  ['bach',            'schriftzug-bach-1', 'schriftzug-bach-1.png'],
  ['mtb_holz',        'muelltonnenbox-holzoptik-2x', 'muelltonnenbox-holzoptik-2x.png'],
  ['thobe',           'standbriefkasten-thobe-dackel', 'standbriefkasten-thobe-dackel.png'],
  ['modellg_stella',  'briefkasten-blanco-modell-g-tuerklingel-heidi', 'briefkasten-blanco-modell-g-tuerklingel-heidi.png'],
  ['colson_2x',       'vdm10-colson-2x', 'vdm10-colson-2x.png'],
  ['bk212',           'doppelbriefkasten-bk212-1', 'doppelbriefkasten-bk212-1.png'],
  ['siebert',         'briefkasten-sieber-1', 'briefkasten-sieber-1.png'],
  ['mtb_anthrazit',   'muelltonnenbox-anthrazit-2x', 'muelltonnenbox-anthrazit-2x.png'],
  ['hermann',         'briefkasten-hermann-2', 'briefkasten-hermann-2.png'],
  ['standbk_01',      'standbriefkasten-modell01-1', 'standbriefkasten-modell01-1.png'],
];

const H = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
  'Accept': 'image/webp,image/*,*/*',
  'Referer': 'https://edelstahl-tuerklingel.de/tuerklingel-galerie',
};

async function tryUrl(url) {
  try {
    const res = await fetch(encodeURI(url), { headers: H });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1200) return null; // treat tiny/empty as miss
    const ct = res.headers.get('content-type') || (url.endsWith('.webp') ? 'image/webp' : url.endsWith('.jpg') ? 'image/jpeg' : 'image/png');
    return { buf, ct };
  } catch { return null; }
}

const out = {};
let total = 0;
for (const [id, file, orig] of M) {
  const candidates = [
    webp('md', file), webp('sm', file), webp('lg', file), webp('xl', file), webp('xs', file),
    `https://edelstahl-tuerklingel.de/media/image/opc/xl/${DIR}${orig}`,
    `https://edelstahl-tuerklingel.de/media/image/opc/lg/${DIR}${orig}`,
  ];
  let got = null, src = '';
  for (const u of candidates) { got = await tryUrl(u); if (got) { src = u; break; } }
  if (!got) { console.log('MISS', id); continue; }
  total += got.buf.length;
  out[id] = `data:${got.ct};base64,` + got.buf.toString('base64');
  console.log('ok', id.padEnd(18), (got.buf.length/1024).toFixed(1).padStart(6)+'KB', src.split('/opc/')[1].split('/')[0]);
}
writeFileSync(new URL('./imgmap.json', import.meta.url), JSON.stringify(out));
console.log('---', Object.keys(out).length, 'of', M.length, 'total', (total/1024/1024).toFixed(2)+'MB');
