import type {MetadataRoute} from 'next';
import {agency} from '@/lib/config';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:new URL('/sitemap.xml',agency.url).toString()};}
