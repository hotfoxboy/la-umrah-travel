import type {Metadata, Viewport} from 'next';
import './globals.css';
import './mobile.css';
import './design.css';
import {Header,Footer,WhatsAppButton} from '@/components/site';
import {AppLifecycle, MobileNavigation, KeyboardGuard, ConnectionStatus} from '@/components/app-shell';
import {assetPath,siteOrigin} from '@/lib/paths';
import {agency} from '@/lib/config';
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#041D40',interactiveWidget:'resizes-content'};
export const metadata:Metadata={metadataBase:new URL(siteOrigin),manifest:assetPath('/manifest.webmanifest'),appleWebApp:{capable:true,statusBarStyle:'default',title:'L.A Umrah'},icons:{apple:assetPath('/icons/apple-touch-icon.png'),icon:assetPath('/icon.svg')},title:{default:'L.A Umrah Travel — Votre Omra au départ de Paris',template:'%s | L.A Umrah Travel'},description:'Préparez votre Omra au départ de Paris avec L.A Umrah Travel. Conseils personnalisés et agence physique à Saint-Denis.',openGraph:{type:'website',locale:'fr_FR',siteName:agency.name,images:[{url:assetPath('/opengraph-image.png')}]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr" suppressHydrationWarning><body suppressHydrationWarning><a href="#main" className="skip-link">Aller au contenu</a><Header/><ConnectionStatus/><main id="main">{children}</main><Footer/><WhatsAppButton floating/><MobileNavigation/><KeyboardGuard/><AppLifecycle/></body></html>;}
