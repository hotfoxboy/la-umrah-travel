import http from 'node:http';
import {stat,readFile} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {basePath} from '../lib/paths.ts';

const types={'.html':'text/html; charset=utf-8','.txt':'text/plain; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.xml':'application/xml','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.avif':'image/avif','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2','.woff':'font/woff'};
export function createStaticServer(directory='out'){
  const root=resolve(directory);
  return http.createServer(async(request,response)=>{
    try{
      const url=new URL(request.url,'http://localhost');
      if(!['GET','HEAD'].includes(request.method)){request.resume();response.writeHead(405,{'Allow':'GET, HEAD'}).end();return;}
      if(url.pathname===basePath){response.writeHead(301,{'Location':basePath+'/'+url.search}).end();return;}
      if(!url.pathname.startsWith(basePath+'/')){response.writeHead(404).end('Not found');return;}
      const relative=decodeURIComponent(url.pathname.slice(basePath.length));
      const file=resolve(root,'.'+relative);
      if(file!==root&&!file.startsWith(root+sep)){response.writeHead(400).end();return;}
      let target=file;
      const info=await stat(file).catch(()=>null);
      if(info?.isDirectory()){
        if(!url.pathname.endsWith('/')){response.writeHead(301,{'Location':url.pathname+'/'+url.search}).end();return;}
        target=resolve(file,'index.html');
      }
      let body=await readFile(target).catch(()=>null);
      let status=200;
      if(!body){status=404;target=resolve(root,'404.html');body=await readFile(target).catch(()=>Buffer.from('Not found'));}
      const png=body.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
      response.writeHead(status,{'Content-Type':types[extname(target)]||(png?'image/png':'application/octet-stream'),'Cache-Control':'no-store'});
      response.end(request.method==='HEAD'?undefined:body);
    }catch{response.writeHead(400).end('Bad request');}
  });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const port=Number(process.env.PORT||3000);
  createStaticServer().listen(port,'127.0.0.1',()=>console.log(`Static preview: http://localhost:${port}${basePath}/`));
}
