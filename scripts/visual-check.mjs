import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless','--disable-gpu','--no-first-run','--remote-debugging-port=9222','--user-data-dir='+resolve('.preview-chrome-cdp'),'about:blank'],{stdio:'ignore',windowsHide:true});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
let socket;
try {
 let targets;
 for(let i=0;i<30;i++){try{targets=await(await fetch('http://localhost:9222/json')).json();break;}catch{await pause(300);}}
 assert.ok(targets,'Chrome debugger');
 socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise(r=>socket.addEventListener('open',r,{once:true}));
 let id=0;const pending=new Map();
 socket.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.id){const p=pending.get(message.id);pending.delete(message.id);if(message.error)p.reject(new Error(JSON.stringify(message.error)));else p.resolve(message.result);}});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const current=++id;pending.set(current,{resolve,reject});socket.send(JSON.stringify({id:current,method,params}));});
 const evaluate=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true})).result.value;
 await send('Page.enable');
 for(const width of [390,768,1440]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<768});
 await send('Page.navigate',{url:'http://localhost:3000/la-umrah-travel'});await pause(2000);
 const metrics=await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})');
 assert.ok(metrics.scroll<=width,JSON.stringify({width,...metrics}));
 if(width===390){await evaluate('document.querySelector(".menu-toggle").click()');assert.equal(await evaluate('document.querySelector(".navigation").classList.contains("open")'),true);await evaluate('document.querySelector(".menu-toggle").click()');}
 const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(`preview-${width}.png`,Buffer.from(screenshot.data,'base64'));
 console.log(`OK viewport ${width}px: no horizontal overflow`);
 }
 await send('Page.navigate',{url:'http://localhost:3000/contact'});await pause(1500);
 await evaluate('document.querySelector("button[type=submit]").click()');await pause(400);
 assert.ok(await evaluate('document.querySelectorAll(".error").length>=3'),'Form errors');
 console.log('OK empty form: visible validation errors');
 await send('Browser.close');
} finally {socket?.close();browser.kill();}


