'use client';

import Link from 'next/link';
import {TravelImage} from '@/components/travel-image';
import {Heart, ArrowUpRight, MapPin, CalendarDays, Users} from 'lucide-react';
import {packages, photos} from '@/lib/config';
import {PackageCard} from './site';
import {FavoriteButton,useFavorites} from './favorite-button';

export function Favorites(){const saved=useFavorites();return <><p className="local-note">Vos favoris restent sur ce navigateur, sans compte. Ils ne sont pas synchronisés entre appareils et peuvent disparaître si vous effacez les données du site.</p>{saved.length?<div className="package-grid">{packages.filter(p=>saved.includes(p.slug)).map(item=><PackageCard key={item.slug} item={item}/>)}</div>:<div className="empty-state"><Heart size={36}/><h2>Gardez vos idées de voyage.</h2><p>Enregistrez la formule Confort pour la retrouver facilement ici.</p><Link className="button button-gold" href="/forfaits">Explorer les forfaits <ArrowUpRight size={18}/></Link></div>}</>;}

export function PackageExperience({item}:{item:typeof packages[number]}){return <div className="product-experience"><div className="product-gallery" role="region" aria-label="Galerie du séjour, faites défiler pour voir les photos" tabIndex={0}>{[{src:photos.makkah,alt:'La Kaaba à La Mecque'},{src:photos.medina,alt:'La Mosquée du Prophète à Médine'}].map((photo,index)=><figure key={photo.src}><TravelImage src={photo.src} alt={photo.alt} priority={index===0} sizes="(max-width:767px) 90vw, 600px"/><figcaption>{index+1} / 2 · {photo.alt}</figcaption></figure>)}</div><div className="product-heading"><div><span className="eyebrow">VOTRE SÉJOUR OMRA</span><h1>Formule {item.name}</h1><p>À partir de <strong>{item.price}</strong> / personne</p><small>Tarif indicatif · offre et disponibilité à confirmer</small></div><FavoriteButton slug={item.slug} compact/></div><div className="essential-cards">{[[MapPin,'Départ de Paris'],[CalendarDays,'Dates et durée à confirmer'],[Users,'Organisation GOODFLY']].map(([Icon,text])=>{const I=Icon as typeof MapPin;return <div key={String(text)}><I size={22}/><span>{String(text)}</span></div>;})}</div><p className="form-note">Photos illustratives. Les prestations incluses sont uniquement celles confirmées dans votre devis.</p><FavoriteButton slug={item.slug}/><div className="mobile-quote-bar"><div><small>À partir de</small><strong>{item.price}</strong><span> / pers.</span></div><Link className="button button-gold" href={`/contact?formule=${item.slug}`}>Demander un devis <ArrowUpRight size={17}/></Link></div></div>;}

