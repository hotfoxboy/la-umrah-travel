import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const base=(process.env.TEST_BASE_URL||'http://localhost:3170/la-umrah-travel').replace(/\/$/,'');
const port=9444;
const browser=spawn(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless','--disable-gpu','--no-first-run',`--remote-debugging-port=${port}`,'--user-data-dir='+resolve('.preview-mobile-qa/carousel'),'about:blank'],{stdio:'ignore',windowsHide:true});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
let socket;
try{
 let targets;for(let i=0;i<30;i++){try{targets=await(await fetch(`http://localhost:${port}/json`)).json();break;}catch{await pause(300);}}
 assert.ok(targets,'Chrome debugger');
 socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise(r=>socket.addEventListener('open',r,{once:true}));
 let id=0;const pending=new Map();const errors=[];
 socket.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text);if(message.id){const p=pending.get(message.id);pending.delete(message.id);if(message.error)p.reject(new Error(JSON.stringify(message.error)));else p.resolve(message.result);}});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const current=++id;pending.set(current,{resolve,reject});socket.send(JSON.stringify({id:current,method,params}));});
 const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
 await send('Page.enable');await send('Runtime.enable');
 const active=()=>evaluate("[...document.querySelectorAll('.journey-gallery-dots button')].findIndex(el=>el.hasAttribute('aria-current'))");
 const click=async selector=>{await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);await pause(800);};
 for(const width of [320,390,768,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});
  await send('Page.navigate',{url:base+'/'});await pause(1300);
  await evaluate("document.querySelector('.journey-gallery').scrollIntoView({block:'start',behavior:'instant'})");await pause(300);
  assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,`${width}: overflow`);
  await evaluate("document.querySelector('.journey-gallery img').decode()");
  assert.equal(await evaluate("document.querySelectorAll('.journey-gallery-slide').length"),4);
  await click('.journey-gallery-arrows button:last-child');assert.equal(await active(),1);
  await click('.journey-gallery-arrows button:first-child');assert.equal(await active(),0);
  await click('.journey-gallery-dots button:nth-child(4)');assert.equal(await active(),3);
  await click('.journey-gallery-arrows button:last-child');assert.equal(await active(),0,'Wrap to first');
  assert.equal(await evaluate("document.querySelector('[data-playback]').getAttribute('aria-pressed')"),'false','Interaction pauses playback');
  await evaluate("document.querySelector('.journey-gallery-track').focus()");
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight'});await pause(800);assert.equal(await active(),1,'Keyboard next');
  await click('.journey-gallery-dots button:first-child');
  const bounds=await evaluate("(()=>{const r=document.querySelector('.journey-gallery-track').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})()");
  if(width<768){
   await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
   const y=Math.round(bounds.y+Math.min(120,bounds.height/3));const start=Math.round(bounds.x+bounds.width*.85);const end=Math.round(bounds.x+bounds.width*.15);
   await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start,y}]});
   for(let step=1;step<=10;step++){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start+(end-start)*step/10,y}]});await pause(35);}
   await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(900);assert.ok(await active()>0,'Touch swipe changes slide');
  }else{
   const y=bounds.y+100;const start=bounds.x+bounds.width*.85;const end=bounds.x+bounds.width*.15;
   await send('Input.dispatchMouseEvent',{type:'mousePressed',x:start,y,button:'left',clickCount:1});
   for(let step=1;step<=8;step++)await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:start+(end-start)*step/8,y,button:'left',buttons:1});
   await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:end,y,button:'left',clickCount:1});await pause(900);assert.ok(await active()>0,'Mouse drag changes slide');
  }
  // Capture the section rather than changing or comparing unrelated page content.
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1,y:1});
  const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(`preview-carousel-${width}.png`,Buffer.from(shot.data,'base64'));
  console.log(`OK carousel ${width}px: images, arrows, dots, wrapping, keyboard, drag/swipe, no overflow`);
 }
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:true});
 await send('Page.navigate',{url:base+'/'});await pause(1300);
 await evaluate("document.querySelector('.journey-gallery').scrollIntoView({block:'start',behavior:'instant'})");
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1,y:1});
 await pause(7200);assert.ok(await active()>0,'Visible carousel automatically advances');
 await click('.journey-gallery-dots button:first-child');await pause(7200);assert.equal(await active(),0,'Manual interaction persistently pauses autoplay');
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await pause(300);
 assert.equal(await evaluate("document.querySelector('[data-playback]').disabled"),true,'Reduced motion disables autoplay');
 assert.equal(await evaluate("getComputedStyle(document.querySelector('.journey-gallery-slide img')).transitionDuration"),'0s');
 assert.deepEqual(errors,[],'No JavaScript errors');
 console.log('OK autoplay, interaction pause, reduced motion, no JavaScript errors');
 await send('Browser.close');
}finally{socket?.close();browser.kill();}
