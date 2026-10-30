import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const source=await readFile('public/sw.js','utf8');
for(const base of ['/la-umrah-travel','/another-project']){
 const listeners={};const data=new Map();const deleted=[];let skip=false,claimed=false,offline=false,networkCalls=0,currentName,lastOptions;
 const prefix=`la-umrah-static:${encodeURIComponent(base+'/')}:`;
 const cache={async addAll(urls){for(const url of urls)data.set(url,new Response(url));},async match(request){return data.get(typeof request==='string'?request:new URL(request.url).pathname)?.clone();}};
 const caches={async open(name){currentName=name;return cache;},async match(request){return cache.match(request);},async keys(){return ['unrelated-cache','la-umrah-static-v2','la-umrah-static:%2Fother-site%2F:v3',prefix+'obsolete',currentName];},async delete(key){deleted.push(key);return true;}};
 const self={registration:{scope:'https://example.com'+base+'/'},clients:{async claim(){claimed=true;}},addEventListener(type,callback){listeners[type]=callback;},skipWaiting(){skip=true;}};
 const fetch=async(_request,options)=>{networkCalls++;lastOptions=options;if(offline)throw new Error('offline');return new Response('fresh-network');};
 vm.runInNewContext(source,{self,caches,fetch,URL,Response});
 async function lifecycle(type){let task;listeners[type]({waitUntil(p){task=p;}});await task;}
 async function dispatch(path,{mode='cors',method='GET'}={}){let response;listeners.fetch({request:{url:new URL(path,'https://example.com').href,method,mode},respondWith(p){response=p;}});return response?await response:null;}
 await lifecycle('install');assert.equal(data.size,5);assert.ok([...data.keys()].every(url=>url===base+'/hors-connexion.html'||url.startsWith(base+'/icons/')));
 await lifecycle('activate');assert.equal(claimed,true);assert.deepEqual(deleted,[prefix+'obsolete']);assert.equal(skip,false,'Update waits for user approval');
 for(const path of [base+'/api/devis',base+'/contact/?_rsc=abc','https://other.example/icon.png'])assert.equal(await dispatch(path),null);
 assert.equal(await dispatch(base+'/api/devis',{method:'POST'}),null);
 for(const path of ['/','/icons/icon-192.png',base+'-other/page','/other-site/'])assert.equal(await dispatch(path,{mode:'navigate'}),null,'Do not control other GitHub projects');
 for(const path of [base+'/',base+'/forfaits/confort/',base+'/contact/']){assert.equal(await(await dispatch(path,{mode:'navigate'})).text(),'fresh-network');assert.equal(lastOptions.cache,'no-store');}
 assert.equal(data.size,5,'Never store a quote or page response');offline=true;
 assert.equal(await(await dispatch(base+'/forfaits/confort/',{mode:'navigate'})).text(),base+'/hors-connexion.html');
 const calls=networkCalls;assert.ok(await dispatch(base+'/icons/icon-192.png'));assert.equal(networkCalls,calls);
 listeners.message({data:{type:'SKIP_WAITING'}});assert.equal(skip,true);
}
console.log('OK PWA: project-scoped offline page/icons, no page/API/POST/RSC cache, network-only navigation, deliberate updates and no interference with other projects.');
