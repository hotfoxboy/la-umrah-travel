import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://localhost:3000';
for(const path of ['/','/forfaits','/forfaits/confort','/contact','/agence','/informations','/notre-approche','/mentions-legales','/confidentialite','/cookies','/conditions','/sitemap.xml','/robots.txt','/opengraph-image','/kaaba.jpg','/medina.jpg']){
 const response=await fetch(base+path);assert.equal(response.status,200,path);console.log(`OK ${path}`);
}
for(const path of ['/forfaits/essentielle','/forfaits/premium','/page-inexistante'])assert.equal((await fetch(base+path)).status,404,path);
const valid={name:'Test Recette',email:'test@example.com',phone:'0141687306',travelers:2,package:'confort',date:'',message:'Test sans transmission',consent:true,website:'',startedAt:Date.now()-5000};
async function post(body,origin=base){return fetch(base+'/api/devis',{method:'POST',headers:{'Content-Type':'application/json',origin},body:JSON.stringify(body)});}
assert.equal((await post(valid,'https://example.com')).status,403,'Origin guard');
assert.equal((await post({...valid,consent:false})).status,400,'Consent validation');
assert.equal((await post({...valid,website:'spam'})).status,400,'Honeypot');
assert.equal((await post({...valid,startedAt:Date.now()})).status,400,'Timing guard');
assert.equal((await post({...valid,email:'invalid'})).status,400,'Email validation');
// Run only without configured provider: this must never send a real email.
const unavailable=await post(valid);assert.equal(unavailable.status,503,'Unconfigured provider must fail honestly');assert.match((await unavailable.json()).error,/pas encore activée/);
assert.equal((await post(valid)).status,429,'Rate limiter');
console.log('OK API: origin, consent, honeypot, timing, email, missing provider, rate limit. No email sent.');
