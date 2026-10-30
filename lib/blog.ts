import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {z} from 'zod';
import type {Article,ArticleBlock,ArticleSummary} from './blog-types';

const metadata=z.object({title:z.string().min(5),description:z.string().min(20),category:z.string().min(2),date:z.iso.date(),cover:z.string().regex(/^\/[a-zA-Z0-9/_\-.]+\.(webp|avif|jpg|png)$/),coverAlt:z.string().min(10),featured:z.boolean().default(false),draft:z.boolean().default(false)}).strict();
const directory=join(process.cwd(),'content','actualites');

/** Deliberately small Markdown subset; React renders text without executing HTML or MDX. */
export function parseMarkdown(body:string):ArticleBlock[]{
 const blocks:ArticleBlock[]=[];const used=new Map<string,number>();const lines=body.trim().split(/\r?\n/);let i=0;
 while(i<lines.length){
  const line=lines[i].trim();if(!line){i++;continue;}
  const heading=line.match(/^(#{2,3})\s+(.+)$/);
  if(heading){const text=heading[2];const base=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'section';const count=(used.get(base)||0)+1;used.set(base,count);blocks.push({type:'heading',level:heading[1].length as 2|3,text,id:count===1?base:`${base}-${count}`});i++;continue;}
  if(/^(- |\d+\. )/.test(line)){const ordered=/^\d+\./.test(line);const items:string[]=[];while(i<lines.length&&(ordered?/^\d+\. /:/^- /).test(lines[i].trim()))items.push(lines[i++].trim().replace(/^(- |\d+\. )/,''));blocks.push({type:'list',ordered,items});continue;}
  const paragraph:string[]=[];while(i<lines.length&&lines[i].trim()&&!/^(#{2,3}\s|- |\d+\. )/.test(lines[i].trim()))paragraph.push(lines[i++].trim());blocks.push({type:'paragraph',text:paragraph.join(' ')});
 }
 return blocks;
}

export function getArticles():Article[]{
 return readdirSync(directory).filter(file=>file.endsWith('.md')).map(file=>{
  const slug=file.slice(0,-3);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw new Error(`Invalid article filename: ${file}`);
  const source=readFileSync(join(directory,file),'utf8').replace(/^\uFEFF/,'');const match=source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/);
  if(!match)throw new Error(`Invalid Markdown header in ${file}`);
  const data=metadata.parse(JSON.parse(match[1]));const blocks=parseMarkdown(match[2]);if(!blocks.length)throw new Error(`Empty article: ${file}`);
  return {...data,slug,blocks,toc:blocks.flatMap(block=>block.type==='heading'?[{id:block.id,text:block.text,level:block.level}]:[])};
 }).filter(article=>!article.draft).sort((a,b)=>b.date.localeCompare(a.date)||a.slug.localeCompare(b.slug));
}
export function getArticle(slug:string){return getArticles().find(article=>article.slug===slug);}
export function articleSummary({slug,title,description,category,date,cover,coverAlt,featured}:ArticleSummary):ArticleSummary{return {slug,title,description,category,date,cover,coverAlt,featured};}
export function articleDate(date:string){return new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));}
