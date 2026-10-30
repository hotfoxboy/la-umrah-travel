import assert from 'node:assert/strict';
import {createQuoteMailto,deliverQuote} from '../lib/quote-delivery.ts';
const data={name:'Voyageur & Test',email:'test@example.com',phone:'0141687306',travelers:2,package:'confort',date:'',message:'Question spéciale : a & b\nDeuxième ligne',consent:true,website:'',startedAt:Date.now()-5000};
const uri=createQuoteMailto(data,'contact@la-dreamtravel.com');const parsed=new URL(uri);
assert.equal(parsed.protocol,'mailto:');assert.equal(parsed.pathname,'contact@la-dreamtravel.com');assert.match(parsed.searchParams.get('body'),/Voyageur & Test/);assert.match(parsed.searchParams.get('body'),/a & b/);
const fetchOriginal=globalThis.fetch;let called=false;
try{
 globalThis.fetch=async()=>{called=true;throw new Error('No real network call allowed');};
 const fallback=await deliverQuote(data,'contact@la-dreamtravel.com','');assert.equal(called,false);assert.equal(fallback.transmitted,false);assert.equal(fallback.mailto,uri);assert.match(fallback.message,/pas encore transmise/);
 await assert.rejects(()=>deliverQuote({...data,consent:false},'contact@la-dreamtravel.com',''));
 await assert.rejects(()=>deliverQuote({...data,website:'spam'},'contact@la-dreamtravel.com',''));
 await assert.rejects(()=>deliverQuote(data,'contact@la-dreamtravel.com','http://example.com/quote'));
 for(const [status,body] of [[500,{error:'Failure'}],[200,{}],[200,{ok:false}]]){
  globalThis.fetch=async()=>new Response(JSON.stringify(body),{status});await assert.rejects(()=>deliverQuote(data,'contact@la-dreamtravel.com','https://example.com/quote'));
 }
 globalThis.fetch=async(url,options)=>{assert.equal(url.protocol,'https:');assert.equal(options.method,'POST');assert.equal(options.cache,'no-store');assert.equal(options.credentials,'omit');return new Response(JSON.stringify({ok:true}));};
 assert.equal((await deliverQuote(data,'contact@la-dreamtravel.com','https://example.com/quote')).transmitted,true);
 globalThis.fetch=async()=>{throw new Error('Offline');};await assert.rejects(()=>deliverQuote(data,'contact@la-dreamtravel.com','https://example.com/quote'));
}finally{globalThis.fetch=fetchOriginal;}
console.log('OK quote: encoded email draft, consent/honeypot, no simulated transmission, HTTPS endpoint errors and explicit acknowledgement. No real email or request sent.');
