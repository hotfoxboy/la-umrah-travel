import {Hero} from '@/components/hero';
import {Favorites} from '@/components/mobile-app';
export const metadata={title:'Mes favoris',robots:{index:false,follow:true}};
export default function FavoritesPage(){return <><Hero title="Vos envies de voyage" subtitle="Retrouvez les forfaits enregistrés sur cet appareil."/><section className="section"><div className="container"><Favorites/></div></section></>;}
