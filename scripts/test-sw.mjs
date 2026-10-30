import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const listeners={};const data=new Map();const deleted=[];let skip=false;let claimed=false;let offline=false;let networkCalls=0;
const cache={async addAll(urls){for(const url of urls)data.set(url,new Response(url));},async match(request){return data.get(typeof request==='string'?request:new URL(request.url).pathname)?.clone();}};
const caches={async open(){return cache;},async match(request){return cache.match(request);},async keys(){return ['unrelated-cache','la-umrah-static-obsolete','la-umrah-static-v2'];},async delete(key){deleted.push(key);return true;}};
const self={location:{origin:'https://example.com'},clients:{async claim(){claimed=true;}},addEventListener(type,callback){listeners[type]=callback;},skipWaiting(){skip=true;}};
let lastOptions;
const fetch=async(_request,options)=>{networkCalls++;lastOptions=options;if(offline)throw new Error('offline');return new Response('fresh-network');};
vm.runInNewContext(await readFile('public/sw.js','utf8'),{self,caches,fetch,URL,Response});
async function lifecycle(type){let task;listeners[type]({waitUntil(p){task=p;}});await task;}
async function dispatch(path,{mode='cors',method='GET'}={}){let response;listeners.fetch({request:{url:new URL(path,'https://example.com').href,method,mode},respondWith(p){response=p;}});return response?await response:null;}
await lifecycle('install');assert.ok([...data.keys()].every(url=>url==='/hors-connexion.html'||url.startsWith('/icons/')));
await lifecycle('activate');assert.equal(claimed,true);assert.deepEqual(deleted,['la-umrah-static-obsolete']);assert.equal(skip,false,'Update must wait for user approval');
assert.equal(await dispatch('/api/devis',{method:'POST'}),null);assert.equal(await dispatch('/api/devis'),null);assert.equal(await dispatch('/contact?_rsc=abc'),null);assert.equal(await dispatch('https://other.example/icon.png'),null);
for(const page of ['/','/forfaits/confort','/contact']){assert.equal(await(await dispatch(page,{mode:'navigate'})).text(),'fresh-network');assert.equal(lastOptions.cache,'no-store','Navigation must bypass the HTTP cache as well');}
assert.equal(data.size,5,'Never store a quote or page response');
offline=true;
assert.equal(await(await dispatch('/forfaits/confort',{mode:'navigate'})).text(),'/hors-connexion.html','Offline navigation must never show stale price');
const calls=networkCalls;assert.ok(await dispatch('/icons/icon-192.png'));assert.equal(networkCalls,calls,'Static icon cache');
listeners.message({data:{type:'SKIP_WAITING'}});assert.equal(skip,true);
console.log('OK service worker: narrow cache, fresh pages, no API/POST/RSC cache, offline fallback, deliberate activation and old-cache cleanup.');
