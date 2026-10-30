'use client';
import {useState,useSyncExternalStore} from 'react';
import {Heart} from 'lucide-react';
import {packages} from '@/lib/config';
const key='la-umrah-favorites-v1';
const change='la-umrah-favorites-change';
const subscribe=(callback:()=>void)=>{window.addEventListener('storage',callback);window.addEventListener(change,callback);return()=>{window.removeEventListener('storage',callback);window.removeEventListener(change,callback);};};
function snapshot(){try{return localStorage.getItem(key)||'[]';}catch{return '[]';}}
function parse(value:string):string[]{try{const result:unknown=JSON.parse(value);return Array.isArray(result)?result.filter((slug):slug is string=>typeof slug==='string'&&packages.some(p=>p.available&&p.slug===slug)):[];}catch{return [];}}
export function useFavorites(){return parse(useSyncExternalStore(subscribe,snapshot,()=> '[]'));}

export function FavoriteButton({slug,compact=false}:{slug:string;compact?:boolean}){const saved=useFavorites().includes(slug);const [error,setError]=useState('');function toggle(){try{const current=parse(snapshot());localStorage.setItem(key,JSON.stringify(saved?current.filter(s=>s!==slug):[...current,slug]));window.dispatchEvent(new Event(change));setError('');}catch{setError('Le stockage local est indisponible sur ce navigateur.');}}return <div className={compact?'favorite-compact':'favorite-control'}><button type="button" className="favorite-button" onClick={toggle} aria-pressed={saved} aria-label={compact?(saved?'Retirer des favoris':'Enregistrer dans les favoris'):(saved?'Enregistré sur cet appareil, retirer des favoris':'Enregistrer ce forfait dans les favoris')}><Heart size={21} fill={saved?'currentColor':'none'}/>{!compact&&<span>{saved?'Enregistré sur cet appareil':'Enregistrer ce forfait'}</span>}</button>{error&&<span className="error" role="status">{error}</span>}</div>;}

