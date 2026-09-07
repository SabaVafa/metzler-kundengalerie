import { readFileSync, writeFileSync } from 'node:fs';
const ROOT = 'C:/Users/s.vafakhah/Desktop/PDP METZLER/';
// markup-src (as it appears in index.html, %20-encoded) -> disk path (decoded)
const MAP = [
  ['Home/Logo/Metzler_Logo-rot-schwarz.svg','Home/Logo/Metzler_Logo-rot-schwarz.svg'],
  ['Home/ICONS/menu.svg','Home/ICONS/menu.svg'],
  ['Home/ICONS/profile.svg','Home/ICONS/profile.svg'],
  ['Home/ICONS/cart.svg','Home/ICONS/cart.svg'],
  ['Product%20Image/einfamilien-briefkasten.png','Product Image/einfamilien-briefkasten.png'],
  ['Product%20Image/briefkasten-ohne-gravur.webp','Product Image/briefkasten-ohne-gravur.webp'],
  ['Product%20Image/standbriefkaesten.webp','Product Image/standbriefkaesten.webp'],
  ['Product%20Image/briefkasten-klingel-sprechanlage.webp','Product Image/briefkasten-klingel-sprechanlage.webp'],
  ['Product%20Image/mehrfamilien-briefkaesten.webp','Product Image/mehrfamilien-briefkaesten.webp'],
  ['Product%20Image/unterputz-briefkaesten.webp','Product Image/unterputz-briefkaesten.webp'],
  ['Product%20Image/paketboxen.webp','Product Image/paketboxen.webp'],
  ['Product%20Image/briefkastenschilder.webp','Product Image/briefkastenschilder.webp'],
  ['Product%20Image/briefkastenstaender.webp','Product Image/briefkastenstaender.webp'],
  ['Product%20Image/ersatzteile-zubehoer.webp','Product Image/ersatzteile-zubehoer.webp'],
  ['Poster/poster-briefkasten2.png','Poster/poster-briefkasten2.png'],
  ['Product%20Image/Sprechanlage/video-station.png','Product Image/Sprechanlage/video-station.png'],
  ['Product%20Image/Sprechanlage/audio-station.png','Product Image/Sprechanlage/audio-station.png'],
  ['Product%20Image/Sprechanlage/mehrfamilien-anlage.png','Product Image/Sprechanlage/mehrfamilien-anlage.png'],
  ['Product%20Image/Sprechanlage/touch-display-station.png','Product Image/Sprechanlage/touch-display-station.png'],
  ['Product%20Image/Sprechanlage/briefkasten-paketbox.png','Product Image/Sprechanlage/briefkasten-paketbox.png'],
  ['Product%20Image/Sprechanlage/innenstation.png','Product Image/Sprechanlage/innenstation.png'],
  ['Product%20Image/Sprechanlage/bus-xdm10.png','Product Image/Sprechanlage/bus-xdm10.png'],
  ['Product%20Image/Sprechanlage/zubehoer.png','Product Image/Sprechanlage/zubehoer.png'],
  ['Poster/poster-sprechanlage-xdm10.png','Poster/poster-sprechanlage-xdm10.png'],
];
const mime = f => f.endsWith('.svg')?'image/svg+xml':f.endsWith('.webp')?'image/webp':f.endsWith('.png')?'image/png':f.endsWith('.jpg')||f.endsWith('.jpeg')?'image/jpeg':'application/octet-stream';
const out = {}; let total=0, miss=[];
for (const [src, disk] of MAP){
  try {
    const buf = readFileSync(ROOT + disk);
    total += buf.length;
    const b64 = buf.toString('base64');
    out[src] = `data:${mime(disk)};base64,${b64}`;
    console.log('ok', (buf.length/1024).toFixed(1).padStart(7)+'KB', disk);
  } catch(e){ miss.push(disk); console.log('MISS', disk); }
}
writeFileSync(new URL('./chromeimg.json', import.meta.url), JSON.stringify(out));
console.log('---', Object.keys(out).length, 'of', MAP.length, 'total', (total/1024/1024).toFixed(2)+'MB', 'missing:', miss.length);
