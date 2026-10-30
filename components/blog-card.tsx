import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import type {ArticleSummary} from '@/lib/blog-types';
import {assetPath} from '@/lib/paths';
import {formatArticleDate} from '@/lib/blog-format';

export function BlogCard({article,featured=false}:{article:ArticleSummary;featured?:boolean}){return <article className={`news-card${featured?' news-card-featured':''}`}>
  <Link className="news-card-image" href={`/actualites/${article.slug}`} tabIndex={-1} aria-hidden="true"><Image src={assetPath(article.cover)} alt="" fill sizes={featured?'(max-width:767px) 100vw, 50vw':'(max-width:767px) 100vw, (max-width:1100px) 45vw, 400px'} loading="lazy"/></Link>
  <div className="news-card-copy"><div className="news-meta"><span>{article.category}</span><time dateTime={article.date}>{formatArticleDate(article.date)}</time></div>{featured&&<span className="news-featured-label">À LA UNE</span>}<h2><Link href={`/actualites/${article.slug}`}>{article.title}</Link></h2><p>{article.description}</p><Link className="news-read" href={`/actualites/${article.slug}`}>Lire l’article <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
</article>;}
