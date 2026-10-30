import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {once} from 'node:events';
import {basePath,siteUrl,siteOrigin} from '../lib/paths.ts';
import {createStaticServer} from './serve-static.mjs';
const root=resolve('out');
async function files(dir){const result=[];for(const entry of await readdir(dir,{withFileTypes:true})){const file=resolve(dir,entry.name);if(entry.isDirectory())result.push(...await files(file));else result.push(file);}return result;}
const all=await files(root);const assets=new Set();let htmlCount=0;
function localUrl(value){
  value=value.replaceAll('&amp;','&');
  if(!value.startsWith('/')&&!value.startsWith(siteOrigin+'/'))return null;
  const url=new URL(value,siteOrigin);
  if(url.origin!==siteOrigin)return null;
  assert.ok(url.pathname.startsWith(basePath+'/')||url.pathname===basePath,`Outside basePath: ${value}`);
  assert.ok(!url.pathname.includes(basePath+basePath),`Duplicate prefix: ${value}`);
  return url;
}
async function checkResource(value){
 const url=localUrl(value);if(!url)return;
 assets.add(url.pathname+url.search);
 let file=resolve(root,'.'+decodeURIComponent(url.pathname.slice(basePath.length)||'/'));
 const info=await stat(file).catch(()=>null);assert.ok(info,`Missing export: ${value}`);
 if(info.isDirectory()){file=resolve(file,'index.html');assert.ok(await stat(file).catch(()=>null),`Missing index: ${value}`);}
 assert.ok(!url.pathname.includes('/_next/image'),'Runtime image optimizer must not be used');
}
for(const file of all){
 if(extname(file)==='.html'){
  htmlCount++;const html=await readFile(file,'utf8');
  assert.ok(!/https?:\/\/localhost/.test(html),`Localhost in ${file}`);
  for(const match of html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g))await checkResource(match[1]);
  for(const match of html.matchAll(/\bsrcSet="([^"]+)"/gi))for(const source of match[1].split(','))await checkResource(source.trim().split(/\s+/)[0]);
  for(const match of html.matchAll(/<meta\s+[^>]*(?:property|name)="(?:og:image|twitter:image)"[^>]*content="([^"]+)"/g))await checkResource(match[1]);
 }else if(extname(file)==='.css'){
  const css=await readFile(file,'utf8');for(const match of css.matchAll(/url\(["']?([^\s)"']+)/g))if(match[1].startsWith('/'))await checkResource(match[1]);
 }else if(extname(file)==='.js'){
  assert.ok(!(await readFile(file,'utf8')).includes('RESEND_API_KEY'),'Server email implementation leaked into browser export');
 }
}
const routes=['/','/forfaits/','/forfaits/confort/','/departs/','/favoris/','/contact/','/agence/','/informations/','/notre-approche/','/mentions-legales/','/confidentialite/','/cookies/','/conditions/'];
for(const route of routes){
 const file=resolve(root,'.'+route,'index.html');assert.ok(await stat(file).catch(()=>null),route);
 const target=route.startsWith('/forfaits/')?'/forfaits/':['/','/departs/','/favoris/','/contact/'].includes(route)?route:null;
 if(target){const html=await readFile(file,'utf8');const nav=html.match(/<nav class="bottom-nav"[^>]*>(.*?)<\/nav>/s)?.[1];assert.ok(nav,'Mobile navigation exported');const active=[...nav.matchAll(/<a\b([^>]*)>/g)].filter(([,attrs])=>attrs.includes('aria-current="page"'));assert.equal(active.length,1,`Active navigation: ${route}`);assert.ok(active[0][1].includes(`href="${basePath}${target}"`),`Wrong active entry: ${route}`);}
}
assert.ok(await stat(resolve(root,'.nojekyll')).catch(()=>null));
assert.equal(await stat(resolve(root,'api')).catch(()=>null),null,'No server API in export');
assert.equal(await stat(resolve(root,'server')).catch(()=>null),null,'No server sources in export');
for(const path of ['forfaits/essentielle','forfaits/premium'])assert.equal(await stat(resolve(root,path)).catch(()=>null),null,'Unavailable offer exported');
const manifest=JSON.parse(await readFile(resolve(root,'manifest.webmanifest'),'utf8'));
assert.equal(manifest.id,basePath+'/');assert.equal(manifest.scope,basePath+'/');assert.equal(manifest.start_url,basePath+'/');assert.equal(manifest.display,'standalone');
for(const icon of manifest.icons)await checkResource(icon.src);
const sitemap=await readFile(resolve(root,'sitemap.xml'),'utf8');for(const [,url] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)){assert.ok(url.startsWith(siteUrl));await checkResource(url);}
assert.ok(!sitemap.includes('/favoris'),'Private device favourites excluded from sitemap');
assert.match(await readFile(resolve(root,'robots.txt'),'utf8'),new RegExp(siteUrl+'sitemap.xml'));
const server=createStaticServer();server.listen(0,'127.0.0.1');await once(server,'listening');
const origin=`http://127.0.0.1:${server.address().port}`;
try{
 for(const path of [...routes.map(r=>basePath+r),...assets]){
  const response=await fetch(origin+path);assert.equal(response.status,200,`HTTP ${path}`);
  if(path.endsWith('.js'))assert.match(response.headers.get('content-type'),/javascript/);
  if(path.endsWith('.css'))assert.match(response.headers.get('content-type'),/text\/css/);
 }
 for(const path of ['/forfaits/',basePath+'/forfaits/essentielle/',basePath+'/forfaits/premium/',basePath+'/not-a-page/'])assert.equal((await fetch(origin+path)).status,404,path);
 assert.equal((await fetch(origin+basePath+'/api/devis',{method:'POST'})).status,405,'Static host cannot process a quote');
}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
console.log(`OK export: ${htmlCount} HTML files, ${routes.length} public pages, ${assets.size} local resource URLs, metadata, PWA paths, HTTP responses and real 404s. No server API or secrets exported.`);
