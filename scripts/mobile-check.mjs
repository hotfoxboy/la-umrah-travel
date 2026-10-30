import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://localhost:3000';
const port=9333;
const browser=spawn(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless','--disable-gpu','--no-first-run',`--remote-debugging-port=${port}`,'--user-data-dir='+resolve('.preview-mobile-qa'),'about:blank'],{stdio:'ignore',windowsHide:true});
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));let socket;
try{
 let targets;for(let i=0;i<30;i++){try{targets=await(await fetch(`http://localhost:${port}/json`)).json();break;}catch{await pause(300);}}assert.ok(targets,'Chrome debugger');
 socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>socket.addEventListener('open',r,{once:true}));
 let id=0;const pending=new Map();const errors=[];
 socket.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text);if(message.id){const p=pending.get(message.id);pending.delete(message.id);if(message.error)p.reject(new Error(JSON.stringify(message.error)));else p.resolve(message.result);}});
 const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const current=++id;pending.set(current,{resolve,reject});socket.send(JSON.stringify({id:current,method,params,...(sessionId?{sessionId}:{})}));});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const go=async path=>{await send('Page.navigate',{url:base+path});await pause(1500);};
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 await send('Emulation.setFocusEmulationEnabled',{enabled:true});
 const manifest=await(await fetch(base+'/manifest.webmanifest')).json();assert.equal(manifest.display,'standalone');assert.ok(manifest.icons.some(i=>i.sizes==='512x512'&&i.purpose==='maskable'));
 await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
 for(const width of (process.env.TEST_WIDTHS?process.env.TEST_WIDTHS.split(',').map(Number):[320,360,375,390,393,412,430,768,1024,1440])){
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:width<768});
  for(const path of (process.env.TEST_PATHS?process.env.TEST_PATHS.split(','):['/','/forfaits/confort','/contact'])){
   await go(path);
   const result=await evaluate(`({scroll:document.documentElement.scrollWidth,width:innerWidth,nav:getComputedStyle(document.querySelector('.bottom-nav')).display})`);
   assert.ok(result.scroll<=width,JSON.stringify({path,width,...result}));assert.equal(result.nav==='none',width>=1024);
   if(width<1024){assert.equal(await evaluate("document.querySelectorAll('.bottom-nav a').length"),5);assert.equal(await evaluate("[...document.querySelectorAll('.bottom-nav a')].every(el=>{const r=el.getBoundingClientRect();return r.width>=44&&r.height>=44;})"),true);}
   if(path==='/forfaits/confort'&&width<1024){const positions=await evaluate("({cta:document.querySelector('.mobile-quote-bar').getBoundingClientRect().bottom,nav:document.querySelector('.bottom-nav').getBoundingClientRect().top})");assert.ok(positions.cta<=positions.nav+1,'CTA overlaps navigation');}
   if([390,1440].includes(width)){const {cssContentSize}=await send('Page.getLayoutMetrics');const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:Math.min(cssContentSize.height,3200),scale:1}});await writeFile(`preview-redesign-${width}-${path==='/'?'home':path.split('/').at(-1)}.png`,Buffer.from(shot.data,'base64'));}
  }
  if([320,390,768,1440].includes(width)){const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(`preview-app-${width}.png`,Buffer.from(shot.data,'base64'));}
  console.log(`OK ${width}px: home/product/contact, overflow, navigation, touch targets, sticky CTA`);
 }
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await go('/forfaits/confort');
 await evaluate("localStorage.removeItem('la-umrah-favorites-v1');window.dispatchEvent(new Event('la-umrah-favorites-change'))");await pause(200);
 await evaluate("document.querySelector('.favorite-button').click()");await pause(200);assert.equal(await evaluate("document.querySelector('.favorite-button').getAttribute('aria-pressed')"),'true');
 await go('/favoris');assert.equal(await evaluate("document.querySelectorAll('.package-card').length"),1,'Favorite persists across pages');
 await send('Page.reload');await pause(1200);assert.equal(await evaluate("document.querySelectorAll('.package-card').length"),1,'Favorite persists after reload');
 await evaluate("document.querySelector('.favorite-button').click()");await pause(200);assert.equal(await evaluate("document.querySelectorAll('.package-card').length"),0,'Remove favorite');
 await evaluate("document.querySelector('.menu-toggle').click()");assert.equal(await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')"),'true');
 await evaluate("document.querySelector('.bottom-nav a[href=\"/contact\"]').click()");await pause(1000);assert.equal(await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')"),'false','Menu closes after bottom navigation');
 await evaluate("document.querySelector('button[type=submit]').click()");await pause(250);assert.equal(await evaluate("document.querySelector('#name').getAttribute('aria-invalid')"),'true');assert.equal(await evaluate("document.querySelector('#phone').inputMode"),'tel');
 await evaluate("(()=>{const el=document.querySelector('#name');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(el,'Voyageur Test');el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));el.blur();})()");await pause(250);assert.equal(await evaluate("document.querySelector('#name').getAttribute('aria-invalid')"),'false','Live validation clears error');
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:430,deviceScaleFactor:1,mobile:true});await pause(150);await evaluate("document.querySelector('#phone').focus()");assert.equal(await evaluate("getComputedStyle(document.querySelector('.bottom-nav')).visibility"),'hidden','Do not compete with focused form and keyboard');await evaluate('document.activeElement.blur()');
 const protocol=await(await fetch(`http://localhost:${port}/json/protocol`)).json();
 if(protocol.domains.find(d=>d.domain==='Emulation')?.commands.some(c=>c.name==='setSafeAreaInsets')){await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setSafeAreaInsets',{insets:{top:47,bottom:34,left:0,right:0}});await pause(150);assert.equal(await evaluate("Math.round(document.querySelector('.bottom-nav').getBoundingClientRect().height)"),100,'Home indicator inset');assert.equal(await evaluate("parseInt(getComputedStyle(document.querySelector('.header')).paddingTop)"),47,'Notch inset');await send('Emulation.setSafeAreaInsets',{insets:{top:0,bottom:0,left:0,right:0}});console.log('OK simulated iPhone safe areas: top 47px, bottom 34px');}else console.log('Safe-area emulation unavailable: physical device test required.');
 // Rotate while keeping the same document.
 await send('Emulation.setDeviceMetricsOverride',{width:844,height:390,deviceScaleFactor:1,mobile:true,screenOrientation:{type:'landscapePrimary',angle:90}});await pause(200);assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});assert.equal(await evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches"),true);
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await go('/forfaits/confort');
 const gallery=await evaluate("(()=>{const r=document.querySelector('.product-gallery').getBoundingClientRect();return {y:r.top+r.height/2};})()");await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:310,y:gallery.y}]});for(const x of [270,230,190,150,110,70]){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:gallery.y}]});await pause(40);}await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(500);assert.ok(await evaluate("document.querySelector('.product-gallery').scrollLeft>0"),'Touch swipe moves the gallery');
 await evaluate("navigator.serviceWorker.ready.then(()=>new Promise(resolve=>{if(navigator.serviceWorker.controller)resolve(true);else navigator.serviceWorker.addEventListener('controllerchange',()=>resolve(true),{once:true});}))");
 const keys=await evaluate("caches.keys().then(async names=>(await Promise.all(names.filter(n=>n.startsWith('la-umrah-')).map(async n=>(await(await caches.open(n)).keys()).map(r=>new URL(r.url).pathname)))).flat())");assert.ok(keys.length>0&&keys.every(p=>p==='/hors-connexion.html'||p.startsWith('/icons/')),'Only approved static resources cached');
 const targetsInfo=await send('Target.getTargets');const worker=targetsInfo.targetInfos.find(t=>t.type==='service_worker'&&t.url===base+'/sw.js');assert.ok(worker,'Active service worker target');const attached=await send('Target.attachToTarget',{targetId:worker.targetId,flatten:true});await send('Network.enable',{},attached.sessionId);await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0},attached.sessionId);
 await send('Network.setCacheDisabled',{cacheDisabled:true});await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});await go('/forfaits/confort?offline-test=1');assert.match(await evaluate('document.body.innerText'),/connexion est indisponible/);assert.equal(await evaluate("document.body.innerText.includes('1 580')"),false,'No stale offline price');
 await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1},attached.sessionId);
 await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});await go('/');assert.equal(await evaluate("document.querySelector('h1').textContent.includes('Votre Omra')"),true);
 assert.deepEqual(errors,[],'Uncaught JavaScript errors');
 console.log('OK favorites persist/remove, menu routing, form validation, orientation, reduced motion, gallery, actual SW offline fallback and return online.');
 await send('Browser.close');
}finally{socket?.close();browser.kill();}
