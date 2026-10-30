import Link from 'next/link';
import {ArrowRight,ArrowUpRight,Plane,UserRound,Building2,MapPin,HeartHandshake,ShieldCheck,Headphones} from 'lucide-react';
import {TravelImage} from '@/components/travel-image';
import {HeroImage} from '@/components/hero-image';
import {Benefits,PackageCard,CTASection,Reveal} from '@/components/site';
import {Button} from '@/components/ui/button';
import {packages,photos} from '@/lib/config';
const reasons=[{icon:HeartHandshake,text:'Un accompagnement personnalisé'},{icon:MapPin,text:'Une agence physique à Saint-Denis'},{icon:ShieldCheck,text:'Des séjours organisés avec GOODFLY'},{icon:Headphones,text:'Une assistance selon les prestations de votre contrat'}];
export default function Home(){return <>
  <section className="hero reference-hero">
    <HeroImage/><div className="hero-shade"/>
    <div className="container hero-content"><span className="eyebrow light">VOYAGES RELIGIEUX</span><h1>Votre Omra<br/><em>au départ de Paris</em></h1><p>Un voyage spirituel inoubliable,<br/>en toute sérénité.</p>
      <div className="hero-trust"><span><span className="trust-icon"><Plane size={25}/></span><span>Départ<br/><strong>de Paris</strong></span></span><span><span className="trust-icon"><UserRound size={25}/></span><span>Accompagnement<br/><strong>personnalisé</strong></span></span><span><span className="trust-icon"><Building2 size={25}/></span><span>Hébergement<br/><strong>selon la formule</strong></span></span></div>
      <div className="hero-actions"><Button asChild><Link href="/forfaits">Découvrir nos forfaits <ArrowRight size={18}/></Link></Button><Link className="hero-secondary" href="/contact">Parler à un conseiller <ArrowUpRight size={16}/></Link></div>
    </div><div className="hero-destination"><span>LA MECQUE · ARABIE SAOUDITE</span><span>Le voyage commence par une intention.</span></div>
  </section><Benefits/>
  <section className="home-catalog section"><div className="container home-catalog-layout"><div className="catalog-main"><Reveal><div className="section-heading"><div><span className="eyebrow">VOTRE VOYAGE, NOTRE ATTENTION</span><h2>Nos formules Omra</h2><p>Des séjours adaptés à vos besoins, préparés avec soin.</p></div></div></Reveal><div className="package-grid">{packages.map(item=><Reveal key={item.slug}><PackageCard item={item}/></Reveal>)}</div><p className="commercial-note">Formule Confort : tarif indicatif, sous réserve de confirmation. Essentielle et Premium : collections en préparation, non commercialisées.</p><Link href="/forfaits" className="text-link catalog-more">Tous nos forfaits <ArrowRight size={16}/></Link></div>
    <aside className="experience-panel"><span className="eyebrow">L’ESPRIT L.A UMRAH</span><h2>Une expérience<br/><em>hors du commun</em></h2><ul>{reasons.map(({icon:Icon,text})=><li key={text}><span><Icon size={15}/></span>{text}</li>)}</ul><div className="arch-photo"><TravelImage src={photos.medina} alt="La Mosquée du Prophète à Médine" sizes="(max-width:1023px) 80vw,280px"/></div><Link href="/notre-approche">Découvrir notre approche <ArrowUpRight size={16}/></Link></aside>
  </div></section>
  <section className="agency-ribbon"><div className="container"><span className="agency-ribbon-icon"><MapPin size={26}/></span><div><span className="eyebrow">UNE ÉQUIPE PROCHE DE VOUS</span><h2>Rencontrons-nous à Saint-Denis.</h2></div><Link href="/agence" className="text-link">Découvrir notre agence <ArrowRight size={17}/></Link></div></section><CTASection/>
  </>;}
