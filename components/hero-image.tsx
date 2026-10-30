import Image from 'next/image';
import {assetPath} from '@/lib/paths';
import './hero-image.css';

const srcSet=(widths:number[],format:string,mobile=false)=>widths.map(width=>`${assetPath(`/images/hero/kaaba-tawaf-hq-${mobile?'mobile-':''}${width}.${format}`)} ${width}w`).join(', ');

/** Art-directed crops keep the Kaaba visible without downloading a desktop image on phones. */
export function HeroImage(){return <picture className="home-hero-photo">
  <source media="(max-width: 640px)" type="image/avif" srcSet={srcSet([480,800,1200],'avif',true)} sizes="100vw"/>
  <source media="(max-width: 640px)" type="image/webp" srcSet={srcSet([480,800,1200],'webp',true)} sizes="100vw"/>
  <source type="image/avif" srcSet={srcSet([800,1280,1920,2560],'avif')} sizes="(max-width: 1023px) 100vw, 85vw"/>
  <source type="image/webp" srcSet={srcSet([800,1280,1920,2560],'webp')} sizes="(max-width: 1023px) 100vw, 85vw"/>
  <Image src={assetPath('/images/hero/kaaba-tawaf-hq.jpg')} alt="La Kaaba entourée des pèlerins accomplissant le tawaf et des arcades dorées de Masjid al-Haram, la nuit" fill sizes="100vw" loading="eager" fetchPriority="high" className="hero-image"/>
</picture>;}
