import {TravelImage} from '@/components/travel-image';
import Link from 'next/link';
import {photos} from '@/lib/config';
export function Hero({title,subtitle,eyebrow='VOTRE OMRA, EN TOUTE SÉRÉNITÉ',image=photos.makkah}:{title:string;subtitle?:string;eyebrow?:string;image?:string}){return <section className="page-hero"><TravelImage src={image} alt="" sizes="100vw" priority/><div className="page-hero-shade"/><div className="container"><div className="breadcrumb"><Link href="/">Accueil</Link> / {title}</div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div></section>;}
