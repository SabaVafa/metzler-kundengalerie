import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const dir = fileURLToPath(new URL('./', import.meta.url));
const PORT = 5180;

const PAGE = `<!doctype html><meta charset=utf-8><title>resizing…</title><body style="font:14px monospace;padding:1rem">
<pre id=log>starting…</pre><script>
const log=(m)=>{document.getElementById('log').textContent+='\\n'+m;};
function loadImage(uri){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=uri;});}
(async()=>{
  const map = await fetch('/chromeimg.json').then(r=>r.json());
  const out={}; let n=0;
  for(const [k,uri] of Object.entries(map)){
    if(k.endsWith('.svg')){ out[k]=uri; continue; }
    try{
      const img=await loadImage(uri);
      const isPoster=k.includes('Poster');
      const maxW=isPoster?720:360;
      const s=Math.min(1,maxW/img.width);
      const w=Math.max(1,Math.round(img.width*s)), h=Math.max(1,Math.round(img.height*s));
      const c=document.createElement('canvas');c.width=w;c.height=h;
      const g=c.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(img,0,0,w,h);
      out[k]=c.toDataURL('image/webp',0.82);
      n++; log('ok '+n+'  '+w+'x'+h+'  '+k.split('/').pop());
    }catch(e){ out[k]=uri; log('KEEP '+k+' ('+e+')'); }
  }
  const r=await fetch('/savejson',{method:'POST',body:JSON.stringify(out)});
  log('saved: '+(await r.text()));
  document.title='DONE '+Object.keys(out).length;
})();
</script>`;

createServer(async (req,res)=>{
  const url=new URL(req.url,'http://x'); const p=decodeURIComponent(url.pathname);
  if(req.method==='POST' && p==='/savejson'){
    let body=''; for await (const c of req) body+=c;
    await writeFile(dir+'chromeimg-small.json', body);
    res.writeHead(200); res.end('bytes '+body.length); return;
  }
  if(p==='/resize'){ res.writeHead(200,{'content-type':'text/html; charset=utf-8'}); res.end(PAGE); return; }
  try{
    const buf=await readFile(dir+p.replace(/^\//,''));
    const ext=p.split('.').pop();
    const ct=ext==='json'?'application/json':ext==='html'?'text/html; charset=utf-8':'application/octet-stream';
    res.writeHead(200,{'content-type':ct}); res.end(buf);
  }catch(e){ res.writeHead(404); res.end('404'); }
}).listen(PORT,()=>console.log('resize server on http://localhost:'+PORT+'/resize'));
