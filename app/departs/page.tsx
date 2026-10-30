import Link from 'next/link';
import {CalendarDays} from 'lucide-react';
import {Hero} from '@/components/hero';
export const metadata={title:'Départs Omra depuis Paris'};
export default function Departures(){return <><Hero title="Vos prochains départs" subtitle="Omra au départ de Paris : préparons ensemble les dates qui vous conviennent."/><section className="section"><div className="container empty-state"><CalendarDays size={36}/><h2>Votre date, notre prochain échange.</h2><p>Aucune date de départ n’est confirmée à ce jour. Indiquez vos préférences à un conseiller pour recevoir une proposition selon les offres disponibles.</p><Link className="button button-gold" href="/contact">Proposer mes dates</Link><Link className="text-link" href="/forfaits">Découvrir la formule Confort</Link></div></section></>;}
