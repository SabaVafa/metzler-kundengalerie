import { readFileSync, writeFileSync } from 'node:fs';
const ROOT = 'C:/Users/s.vafakhah/Desktop/PDP METZLER/';
// markup-src (as in index.html) -> disk path (decoded)
const M = [
  ['Home/Logo/Metzler_Logo-rot-Wei%C3%9F.svg','Home/Logo/Metzler_Logo-rot-Weiß.svg'],
  ['Home/Trust%20badges/Top%20SHOP/Label1.png','Home/Trust badges/Top SHOP/Label1.png'],
  ['Home/Trust%20badges/Top%20SHOP/Label2.png','Home/Trust badges/Top SHOP/Label2.png'],
  ['Home/Trust%20badges/Top%20SHOP/Label3.png','Home/Trust badges/Top SHOP/Label3.png'],
  ['Home/Trust%20badges/Top%20SHOP/Labels4.png','Home/Trust badges/Top SHOP/Labels4.png'],
  ['Paymentshipping%20logos/DPD.png','Paymentshipping logos/DPD.png'],
  ['Paymentshipping%20logos/DHL.png','Paymentshipping logos/DHL.png'],
  ['Paymentshipping%20logos/GOGREEN.png','Paymentshipping logos/GOGREEN.png'],
  ['Paymentshipping%20logos/payment/SEPA.png','Paymentshipping logos/payment/SEPA.png'],
  ['Paymentshipping%20logos/payment/AMEX.png','Paymentshipping logos/payment/AMEX.png'],
  ['Paymentshipping%20logos/payment/VISA.png','Paymentshipping logos/payment/VISA.png'],
  ['Paymentshipping%20logos/payment/KLARNA.png','Paymentshipping logos/payment/KLARNA.png'],
  ['Paymentshipping%20logos/payment/PAYPAL.png','Paymentshipping logos/payment/PAYPAL.png'],
  ['Paymentshipping%20logos/payment/MASTER%20CARD.png','Paymentshipping logos/payment/MASTER CARD.png'],
  ['Paymentshipping%20logos/payment/APPLE%20PAY.png','Paymentshipping logos/payment/APPLE PAY.png'],
  ['Paymentshipping%20logos/payment/GOOGLE%20PAY.png','Paymentshipping logos/payment/GOOGLE PAY.png'],
  ['Paymentshipping%20logos/payment/AMAZON.png','Paymentshipping logos/payment/AMAZON.png'],
  ['Paymentshipping%20logos/payment/VORKASEE.png','Paymentshipping logos/payment/VORKASEE.png'],
];
const mime = f => f.endsWith('.svg')?'image/svg+xml':f.endsWith('.png')?'image/png':'application/octet-stream';
const file = new URL('./chromeimg-small.json', import.meta.url);
const map = JSON.parse(readFileSync(file,'utf8'));
let added=0, total=0, miss=[];
for (const [src, disk] of M){
  try { const buf=readFileSync(ROOT+disk); total+=buf.length; map[src]=`data:${mime(disk)};base64,`+buf.toString('base64'); added++; }
  catch(e){ miss.push(disk); }
}
writeFileSync(file, JSON.stringify(map));
console.log('footer imgs added:', added, 'of', M.length, '· +'+(total/1024).toFixed(0)+'KB · total keys now', Object.keys(map).length, '· missing', miss);
