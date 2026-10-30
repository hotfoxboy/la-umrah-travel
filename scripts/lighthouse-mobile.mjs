import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
function tool(name){try{return pathToFileURL(require.resolve(name,{paths:[resolve('.audit-tools')]})).href;}catch{throw new Error('Installer les outils isolés : npm install --prefix .audit-tools --no-save --package-lock=false lighthouse@12.8.2');}}
const {default:lighthouse}=await import(tool('lighthouse'));
const {launch}=await import(tool('chrome-launcher'));
const browser=await launch({chromePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',chromeFlags:['--headless','--disable-gpu','--no-first-run']});
try{for(const path of ['/','/forfaits/confort','/contact']){const {lhr}=await lighthouse((process.env.TEST_BASE_URL||'http://localhost:3000')+path,{port:browser.port,output:'json',onlyCategories:['performance','accessibility'],logLevel:'error',formFactor:'mobile',screenEmulation:{mobile:true,width:390,height:844,deviceScaleFactor:1,disabled:false},throttlingMethod:'simulate'});const file=path==='/'?'accueil':path.split('/').at(-1);await writeFile(`lighthouse-${file}.json`,JSON.stringify(lhr,null,2));console.log(JSON.stringify({path,performance:lhr.categories.performance.score*100,accessibility:lhr.categories.accessibility.score*100,LCP:lhr.audits['largest-contentful-paint'].numericValue,CLS:lhr.audits['cumulative-layout-shift'].numericValue,TBT:lhr.audits['total-blocking-time'].numericValue,failures:Object.values(lhr.audits).filter(a=>a.score!==null&&a.score<1&&a.details?.items?.length).map(a=>({id:a.id,score:a.score,display:a.displayValue,items:a.details.items.slice(0,3).map(i=>({selector:i.node?.selector,explanation:i.node?.explanation}))}))}));}}finally{await browser.kill();}
