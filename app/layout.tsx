import type {Metadata, Viewport} from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './mobile.css';
import './design.css';
import './readability.css';
import {Header,Footer,WhatsAppButton} from '@/components/site';
import {AppLifecycle, MobileNavigation, KeyboardGuard, ConnectionStatus} from '@/components/app-shell';
import {assetPath,siteOrigin} from '@/lib/paths';
import {agency} from '@/lib/config';
const quicksand=localFont({src:'../public/fonts/quicksand-latin.woff2',weight:'400 700',style:'normal',display:'swap',variable:'--font-quicksand',adjustFontFallback:false});
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#041D40',interactiveWidget:'resizes-content'};
export const metadata:Metadata={metadataBase:new URL(siteOrigin),manifest:assetPath('/manifest.webmanifest'),appleWebApp:{capable:true,statusBarStyle:'default',title:'L.A Umrah'},icons:{apple:[{url:assetPath('/icons/apple-touch-icon.png'),sizes:'180x180',type:'image/png'}],icon:[{url:assetPath('/icon.svg'),type:'image/svg+xml'},{url:assetPath('/icons/favicon-32.png'),sizes:'32x32',type:'image/png'},{url:assetPath('/icons/favicon-16.png'),sizes:'16x16',type:'image/png'}],shortcut:assetPath('/favicon.ico')},title:{default:'L.A Umrah Travel — Votre Omra au départ de Paris',template:'%s | L.A Umrah Travel'},description:'Préparez votre Omra au départ de Paris avec L.A Umrah Travel. Conseils personnalisés et agence physique à Saint-Denis.',openGraph:{type:'website',locale:'fr_FR',siteName:agency.name,images:[{url:assetPath('/opengraph-image.png')}]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr" className={quicksand.variable} suppressHydrationWarning><body suppressHydrationWarning><a href="#main" className="skip-link">Aller au contenu</a><Header/><ConnectionStatus/><main id="main">{children}</main><Footer/><WhatsAppButton floating/><MobileNavigation/><KeyboardGuard/><AppLifecycle/></body></html>;}
