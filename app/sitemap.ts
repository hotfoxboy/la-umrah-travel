import type {MetadataRoute} from 'next';
import {agency} from '@/lib/config';
export default function sitemap():MetadataRoute.Sitemap{return ['/','/forfaits','/forfaits/confort','/departs','/notre-approche','/informations','/agence','/contact','/mentions-legales','/confidentialite','/cookies','/conditions'].map(path=>({url:new URL(path,agency.url).toString()}));}
