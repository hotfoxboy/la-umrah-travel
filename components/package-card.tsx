'use client';
import Link from 'next/link';
import {ArrowRight,Check} from 'lucide-react';
import {packages,photos} from '@/lib/config';
import {TravelImage} from './travel-image';
import {FavoriteButton} from './favorite-button';
export function PackageCard({item}:{item:typeof packages[number]}){return <article className={`package-card ${item.available?'featured':''}`}>
  <div className="package-ribbon"><h3>Formule {item.name}</h3>{item.available&&<span>NOTRE SÉLECTION</span>}</div>
  <div className="package-photo"><TravelImage src={item.image} alt={item.image===photos.medina?'La Mosquée du Prophète à Médine':'La Kaaba à La Mecque'} sizes="(max-width:640px) 100vw,(max-width:1023px) 45vw,350px"/>{item.available&&<FavoriteButton slug={item.slug} compact/>}</div>
  <div className="package-body"><p>{item.description}</p><ul>{(item.available?['Départ de Paris','Accompagnement personnalisé','Organisation avec GOODFLY']:['Formule en préparation','Contenu et tarif à confirmer','Non ouverte à la réservation']).map(text=><li key={text}><Check size={15}/>{text}</li>)}</ul>
    <div className="package-price"><small>{item.available?'À partir de':'Collection en préparation'}</small><strong>{item.price}</strong>{item.available&&<span>/ personne</span>}</div>
    {item.available?<><Link className="package-link" href={`/forfaits/${item.slug}`}>Voir le détail <ArrowRight size={16}/></Link><Link className="quote-link" href={`/contact?formule=${item.slug}`}>Demander un devis</Link></>:<p className="unavailable">Offre non commercialisée</p>}
  </div></article>;}
