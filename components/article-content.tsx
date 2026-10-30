import Link from 'next/link';
import type {ReactNode} from 'react';
import type {ArticleBlock} from '@/lib/blog-types';

function Inline({text}:{text:string}){
 const result:ReactNode[]=[];const pattern=/\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^\s)]+)\)/g;let start=0;
 for(const match of text.matchAll(pattern)){result.push(text.slice(start,match.index));const key=match.index;if(match[1])result.push(<strong key={key}>{match[1]}</strong>);else{const href=match[3];if(href.startsWith('/')&&!href.startsWith('//'))result.push(<Link key={key} href={href}>{match[2]}</Link>);else if(/^https:\/\//.test(href))result.push(<a key={key} href={href} rel="noreferrer" target="_blank">{match[2]}</a>);else result.push(match[2]);}start=match.index!+match[0].length;}
 result.push(text.slice(start));return <>{result}</>;
}
export function ArticleContent({blocks}:{blocks:ArticleBlock[]}){return <div className="news-prose">{blocks.map((block,index)=>{
 if(block.type==='heading'){const Tag=block.level===2?'h2':'h3';return <Tag key={block.id} id={block.id}><Inline text={block.text}/></Tag>;}
 if(block.type==='list'){const Tag=block.ordered?'ol':'ul';return <Tag key={index}>{block.items.map((item,i)=><li key={i}><Inline text={item}/></li>)}</Tag>;}
 return <p key={index}><Inline text={block.text}/></p>;
 })}</div>;}
