'use client';
import {useState} from 'react';
import type {ArticleSummary} from '@/lib/blog-types';
import {BlogCard} from './blog-card';

const PAGE_SIZE=6;
export function BlogList({articles}:{articles:ArticleSummary[]}){
 const [category,setCategory]=useState('Toutes');const [limit,setLimit]=useState(PAGE_SIZE);
 const categories=['Toutes',...new Set(articles.map(article=>article.category))];
 const filtered=articles.filter(article=>category==='Toutes'||article.category===category);
 const featured=category==='Toutes'?filtered.find(article=>article.featured):undefined;
 const remaining=filtered.filter(article=>article.slug!==featured?.slug);
 return <div className="news-list"><div className="news-filters" role="group" aria-label="Filtrer les articles par catégorie">{categories.map(name=><button type="button" key={name} aria-pressed={category===name} onClick={()=>{setCategory(name);setLimit(PAGE_SIZE);}}>{name}</button>)}</div><p className="news-result" role="status">{filtered.length} article{filtered.length===1?'':'s'}{category==='Toutes'?'':` · ${category}`}</p>
 {featured&&<div className="news-featured"><BlogCard article={featured} featured/></div>}
 <div className="news-grid">{remaining.slice(0,limit).map(article=><BlogCard key={article.slug} article={article}/>)}</div>
 {remaining.length>limit&&<button className="news-more" type="button" onClick={()=>setLimit(value=>value+PAGE_SIZE)}>Afficher plus d’articles</button>}
 {articles.length===0&&<p className="news-empty">Nos prochains articles seront disponibles ici.</p>}
 </div>;
}
