import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const base=(process.env.TEST_BASE_URL||'http://localhost:3180/la-umrah-travel').replace(/\/$/,'');
const port=9555;
const browser=spawn(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless','--disable-gpu','--no-first-run',`--remote-debugging-port=${port}`,'--user-data-dir='+resolve('.preview-mobile-qa/blog'),'about:blank'],{stdio:'ignore',windowsHide:true});
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
 for(const width of [320,390,768,1100,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<768});
  for(const path of ['/','/actualites/','/actualites/preparer-son-projet-omra/']){
   await send('Page.navigate',{url:base+path});await pause(1000);
   assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,width+' '+path+' overflow');
   const logo=await evaluate('(async()=>{const img=document.querySelector(".header .official-logo-image");await img.decode();return {width:img.naturalWidth,height:img.getBoundingClientRect().height,src:img.currentSrc};})()');assert.ok(logo.width>0&&logo.height>30,JSON.stringify(logo));
   if(path!=='/'){
    assert.equal(await evaluate('[...document.querySelectorAll(".navigation a")].find(a=>a.pathname.endsWith("/actualites/")).getAttribute("aria-current")'),'page');
    if(path==='/actualites/'){
     await evaluate('document.querySelector(".news-filters button:nth-child(2)").click()');await pause(100);
     assert.equal(await evaluate('document.querySelectorAll(".news-card").length'),1);assert.equal(await evaluate('document.querySelector(".news-filters button:nth-child(2)").getAttribute("aria-pressed")'),'true');
     await evaluate('document.querySelector(".news-filters button:first-child").click()');assert.equal(await evaluate('document.querySelectorAll(".news-card").length'),3);
    }else{
     assert.equal(await evaluate('document.querySelectorAll(".news-toc a").length'),6);
     const anchor=await evaluate('document.querySelector(".news-toc a").getAttribute("href")');assert.ok(await evaluate('Boolean(document.querySelector('+JSON.stringify(anchor)+'))'));
     await evaluate('document.querySelector(".news-share button:nth-child(2)").click()');await pause(100);assert.ok((await evaluate('document.querySelector(".news-share [role=status]").textContent')).length>0);
    }
   }else{assert.equal(await evaluate('document.querySelectorAll(".news-card").length'),0);}
   if([390,1440].includes(width)){const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile('preview-blog-'+width+'-'+(path==='/'?'home':path==='/actualites/'?'listing':'article')+'.png',Buffer.from(shot.data,'base64'));}
  }
  console.log('OK '+width+'px: logo, homepage isolation, news navigation, filters, article/TOC/share, no overflow');
 }
 assert.deepEqual(errors,[]);await send('Browser.close');
}finally{socket?.close();browser.kill();}
