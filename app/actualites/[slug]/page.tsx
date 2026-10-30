import type {Metadata} from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {getArticles,getArticle,articleSummary} from '@/lib/blog';
import {formatArticleDate} from '@/lib/blog-format';
import {absolutePageUrl,assetPath,siteOrigin} from '@/lib/paths';
import {agency} from '@/lib/config';
import {ArticleContent} from '@/components/article-content';
import {ArticleShare} from '@/components/article-share';
import {BlogCard} from '@/components/blog-card';

export const dynamicParams=false;
export function generateStaticParams(){return getArticles().map(article=>({slug:article.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const article=getArticle(slug);if(!article)notFound();const url=absolutePageUrl(`/actualites/${slug}`);const image=new URL(assetPath(article.cover),siteOrigin).href;
 return {title:article.title,description:article.description,alternates:{canonical:url},openGraph:{type:'article',locale:'fr_FR',title:article.title,description:article.description,url,publishedTime:article.date,authors:[agency.name],section:article.category,images:[{url:image,alt:article.coverAlt}]},twitter:{card:'summary_large_image',title:article.title,description:article.description,images:[image]}};
}
export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const article=getArticle(slug);if(!article)notFound();const url=absolutePageUrl(`/actualites/${slug}`);const related=getArticles().filter(item=>item.slug!==slug).sort((a,b)=>Number(b.category===article.category)-Number(a.category===article.category)).slice(0,2);
 const structuredData={'@context':'https://schema.org','@type':'BlogPosting',headline:article.title,description:article.description,datePublished:article.date,image:[new URL(assetPath(article.cover),siteOrigin).href],author:{'@type':'Organization',name:agency.name,url:agency.url},publisher:{'@type':'Organization',name:agency.name,url:agency.url},mainEntityOfPage:{'@type':'WebPage','@id':url},articleSection:article.category,inLanguage:'fr-FR'};
 return <div className="news-area"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,'\\u003c')}}/><article className="container news-article"><nav className="news-breadcrumb" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span aria-hidden="true">/</span><Link href="/actualites">Actualités</Link></nav><header className="news-article-header"><div className="news-meta"><span>{article.category}</span><time dateTime={article.date}>{formatArticleDate(article.date)}</time></div><h1>{article.title}</h1><p>{article.description}</p><span className="news-byline">Par L.A Umrah Travel</span></header><figure className="news-article-cover"><Image src={assetPath(article.cover)} alt={article.coverAlt} fill sizes="(max-width:767px) 100vw, 1100px" loading="eager" fetchPriority="high"/></figure><div className={`news-reading-layout${article.toc.length<5?' news-reading-short':''}`}>
 {article.toc.length>=5&&<aside className="news-toc"><nav aria-label="Sommaire de l’article"><h2>Dans cet article</h2><ol>{article.toc.map(item=><li key={item.id} className={item.level===3?'news-toc-sub':undefined}><a href={`#${item.id}`}>{item.text}</a></li>)}</ol></nav></aside>}
 <div><ArticleContent blocks={article.blocks}/><ArticleShare url={url} title={article.title}/><Link className="news-back" href="/actualites">← Toutes les actualités</Link></div></div></article>{related.length>0&&<section className="container news-related" aria-labelledby="related-title"><span className="news-eyebrow">POUR POURSUIVRE LA LECTURE</span><h2 id="related-title">À découvrir aussi</h2><div className="news-grid">{related.map(item=><BlogCard key={item.slug} article={articleSummary(item)}/>)}</div></section>}</div>;
}
