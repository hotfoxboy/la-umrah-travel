'use client';
import {useState} from 'react';
import {Check,Copy,Share2} from 'lucide-react';

export function ArticleShare({url,title}:{url:string;title:string}){
 const [status,setStatus]=useState('');const [copied,setCopied]=useState(false);
 async function copy(){try{await navigator.clipboard.writeText(url);setCopied(true);setStatus('Lien copié.');}catch{setStatus('La copie automatique est indisponible. Copiez l’adresse dans la barre du navigateur.');}}
 async function share(){if(!navigator.share){await copy();return;}try{await navigator.share({url,title});}catch(error){if(!(error instanceof Error&&error.name==='AbortError'))setStatus('Le partage est indisponible. Vous pouvez copier le lien.');}}
 return <div className="news-share"><span>Partager cet article</span><div><button type="button" onClick={share}><Share2 size={17}/>Partager</button><button type="button" onClick={copy}>{copied?<Check size={17}/>:<Copy size={17}/>}Copier le lien</button><a href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">Facebook</a></div><p role="status">{status}</p></div>;
}
