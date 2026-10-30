import Image from 'next/image';
import {assetPath} from '@/lib/paths';
import './brand-logo.css';

/** Official artwork supplied by the agency; no recreation of the logo. */
export function BrandLogo(){return <picture className="official-logo-picture"><source srcSet={`${assetPath('/brand/la-umrah-travel-400.webp')} 400w, ${assetPath('/brand/la-umrah-travel-800.webp')} 800w`} sizes="(max-width:640px) 140px, 220px" type="image/webp"/><Image className="official-logo-image" src={assetPath('/brand/la-umrah-travel-400.webp')} width={400} height={273} alt="L.A Umrah Travel — by L.A Dream Travel"/></picture>;}
