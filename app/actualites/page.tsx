import type {Metadata} from 'next';
import Link from 'next/link';
import {getArticles,articleSummary} from '@/lib/blog';
import {BlogList} from '@/components/blog-list';
import {absolutePageUrl,assetPath} from '@/lib/paths';

export const metadata:Metadata={title:'Actualités',description:'Conseils de préparation, destinations et vie de notre agence : les articles de L.A Umrah Travel pour accompagner votre projet d’Omra.',alternates:{canonical:absolutePageUrl('/actualites')},openGraph:{type:'website',title:'Actualités | L.A Umrah Travel',description:'Préparation, destinations et accompagnement : explorez nos articles.',url:absolutePageUrl('/actualites'),images:[{url:assetPath('/opengraph-image.png')}]}};
export default function NewsPage(){const articles=getArticles().map(articleSummary);return <div className="news-area"><header className="news-intro"><div className="container"><nav className="news-breadcrumb" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span aria-hidden="true">/</span><span>Actualités</span></nav><span className="news-eyebrow">LE JOURNAL L.A UMRAH</span><h1>Actualités & inspirations</h1><p>Des repères pour préparer votre voyage, découvrir les destinations et faire connaissance avec notre équipe.</p></div></header><section className="container news-list-section" aria-label="Les articles de L.A Umrah Travel"><BlogList articles={articles}/></section></div>;}
