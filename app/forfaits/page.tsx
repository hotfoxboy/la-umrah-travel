import {Hero} from '@/components/hero';
import {PackageCard,CTASection} from '@/components/site';
import {packages} from '@/lib/config';
export const metadata={title:'Nos forfaits Omra'};
export default function Packages(){return <><Hero title="Nos forfaits Omra" subtitle="Un séjour adapté à votre projet, un accompagnement à votre mesure."/><section className="section"><div className="container"><div className="legal-notice">La formule Confort est proposée à titre indicatif, sous réserve de confirmation de l’offre. Les formules Essentielle et Premium sont en préparation et ne sont pas commercialisées.</div><div className="package-grid">{packages.map(item=><PackageCard key={item.slug} item={item}/>)}</div><p className="commercial-note">Dates, durée, hôtels, prestations et disponibilités : confirmation sur devis uniquement.</p></div></section><CTASection/></>;}
