import {existsSync,lstatSync,readdirSync,readFileSync,realpathSync,rmSync} from 'node:fs';
import {dirname,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

// Explicit allowlist: never remove sources, node_modules, .git, environment files or out.
const root=realpathSync(resolve(dirname(fileURLToPath(import.meta.url)),'..'));
if(JSON.parse(readFileSync(resolve(root,'package.json'),'utf8')).name!=='la-umrah-travel')throw new Error('Unexpected project root');
const targets=['.next/dev','.next/cache','.next-redesign','.audit-tools','.preview-chrome','.preview-chrome-cdp','.preview-mobile-qa','tsconfig.tsbuildinfo',...readdirSync(root).filter(name=>/^preview-.*\.png$/.test(name)||/^lighthouse-.*\.json$/.test(name))];
const dryRun=process.argv.includes('--dry-run');
let removed=0;
for(const name of targets){
 const target=resolve(root,name);
 if(!target.toLowerCase().startsWith((root+sep).toLowerCase()))throw new Error(`Outside workspace: ${name}`);
 if(!existsSync(target))continue;
 if(!realpathSync(target).toLowerCase().startsWith((root+sep).toLowerCase()))throw new Error(`External link: ${name}`);
 if(lstatSync(target).isSymbolicLink())throw new Error(`Unexpected link: ${name}`);
 if(!dryRun)rmSync(target,{recursive:true,force:true,maxRetries:3,retryDelay:150});
 console.log(`${dryRun?'Would remove':'Removed'} ${name}`);removed++;
}
console.log(`${removed} generated paths ${dryRun?'identified':'removed'}. Source, dependencies and static export preserved.`);
