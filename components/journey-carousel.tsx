'use client';

import Image from 'next/image';
import {useCallback,useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {ArrowLeft,ArrowRight,MapPin,Pause,Play} from 'lucide-react';
import {assetPath} from '@/lib/paths';
import {journeyGallery} from '@/lib/journey-gallery';
import './journey-carousel.css';

const motionQuery='(prefers-reduced-motion: reduce)';
const subscribeMotion=(notify:()=>void)=>{const query=matchMedia(motionQuery);query.addEventListener('change',notify);return()=>query.removeEventListener('change',notify);};
const reducedMotion=()=>matchMedia(motionQuery).matches;
const serverMotion=()=>true;

export function JourneyCarousel(){
  const [active,setActive]=useState(0);
  const [playing,setPlaying]=useState(true);
  const [hovered,setHovered]=useState(false);
  const reduce=useSyncExternalStore(subscribeMotion,reducedMotion,serverMotion);
  const track=useRef<HTMLDivElement>(null);
  const section=useRef<HTMLElement>(null);
  const visible=useRef(false);
  const current=useRef(0);
  const drag=useRef<{x:number;scroll:number}|null>(null);
  const goTo=useCallback((index:number)=>{
    const el=track.current;if(!el)return;
    const next=(index+journeyGallery.length)%journeyGallery.length;
    el.scrollTo({left:next*el.clientWidth,behavior:reduce?'instant':'smooth'});
  },[reduce]);

  useEffect(()=>{
    const el=section.current;if(!el)return;
    const observer=new IntersectionObserver(([entry])=>{visible.current=entry.isIntersecting;},{threshold:.35});
    observer.observe(el);return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(!playing||hovered||reduce)return;
    const timer=setInterval(()=>{if(visible.current&&!document.hidden)goTo(current.current+1);},6500);
    return()=>clearInterval(timer);
  },[playing,hovered,reduce,goTo]);
  useEffect(()=>{
    const el=track.current;if(!el)return;
    // Keep the selected photograph aligned after orientation or viewport changes.
    const observer=new ResizeObserver(()=>el.scrollTo({left:current.current*el.clientWidth,behavior:'instant'}));
    observer.observe(el);return()=>observer.disconnect();
  },[]);

  const select=(index:number)=>{setPlaying(false);goTo(index);};
  return <section ref={section} className="journey-gallery" aria-labelledby="journey-gallery-title" aria-roledescription="carrousel"
    onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
    onFocusCapture={event=>{if(!(event.target as HTMLElement).closest('[data-playback]'))setPlaying(false);}}>
    <div className="container">
      <div className="journey-gallery-heading"><div><span className="journey-gallery-eyebrow">L’INSPIRATION DU VOYAGE</span><h2 id="journey-gallery-title">Des lieux sacrés.<br/><span>Des émotions inoubliables.</span></h2></div><p>De La Mecque à Médine, un regard sur les lieux et les instants qui font la beauté de votre Omra.</p></div>
      <div className="journey-gallery-frame">
        <div ref={track} id="journey-gallery-slides" className="journey-gallery-track" tabIndex={0} aria-label="Photographies du voyage. Utilisez les flèches pour naviguer."
          onPointerDown={event=>{setPlaying(false);if(event.pointerType==='mouse'&&event.button===0){const el=event.currentTarget;drag.current={x:event.clientX,scroll:el.scrollLeft};el.style.scrollSnapType='none';el.setPointerCapture(event.pointerId);}}}
          onPointerMove={event=>{if(drag.current){event.currentTarget.scrollLeft=drag.current.scroll+drag.current.x-event.clientX;}}}
          onPointerUp={event=>{if(drag.current){drag.current=null;event.currentTarget.style.scrollSnapType='';goTo(current.current);}}}
          onPointerCancel={event=>{drag.current=null;event.currentTarget.style.scrollSnapType='';}}
          onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();select(current.current+(event.key==='ArrowRight'?1:-1));}if(event.key==='Home'||event.key==='End'){event.preventDefault();select(event.key==='Home'?0:journeyGallery.length-1);}}}
          onScroll={()=>{const el=track.current;if(!el)return;const index=Math.min(journeyGallery.length-1,Math.max(0,Math.round(el.scrollLeft/el.clientWidth)));current.current=index;setActive(index);}}>
          {journeyGallery.map((slide,index)=><figure key={slide.id} className="journey-gallery-slide" role="group" aria-roledescription="diapositive" aria-label={`${index+1} sur ${journeyGallery.length} : ${slide.title}`} aria-hidden={index!==active}>
            <picture><source type="image/avif" srcSet={[640,1024,1600].map(width=>`${assetPath(`/images/journey/${slide.image}-${width}.avif`)} ${width}w`).join(', ')} sizes="(max-width: 767px) 100vw, (max-width: 1440px) 90vw, 1280px"/><source type="image/webp" srcSet={[640,1024,1600].map(width=>`${assetPath(`/images/journey/${slide.image}-${width}.webp`)} ${width}w`).join(', ')} sizes="(max-width: 767px) 100vw, (max-width: 1440px) 90vw, 1280px"/><Image src={assetPath(`/images/journey/${slide.image}-1024.webp`)} alt={slide.alt} fill sizes="100vw" loading="lazy" draggable={false}/></picture>
            <figcaption><span className="journey-gallery-location"><MapPin size={15} aria-hidden="true"/>{slide.location}</span><h3>{slide.title}</h3><p>{slide.description}</p></figcaption>
          </figure>)}
        </div>
        <div className="journey-gallery-arrows"><button type="button" aria-label="Photographie précédente" aria-controls="journey-gallery-slides" onClick={()=>select(current.current-1)}><ArrowLeft size={21}/></button><button type="button" aria-label="Photographie suivante" aria-controls="journey-gallery-slides" onClick={()=>select(current.current+1)}><ArrowRight size={21}/></button></div>
        <span className="journey-gallery-counter" aria-hidden="true">0{active+1}<span> / 0{journeyGallery.length}</span></span>
      </div>
      <div className="journey-gallery-toolbar"><div className="journey-gallery-dots" role="group" aria-label="Choisir une photographie">{journeyGallery.map((slide,index)=><button key={slide.id} type="button" aria-label={`Afficher la photographie ${index+1} : ${slide.location}`} aria-current={active===index?'true':undefined} aria-controls="journey-gallery-slides" onClick={()=>select(index)}><span/></button>)}</div><button type="button" data-playback className="journey-gallery-playback" disabled={reduce} aria-pressed={playing&&!reduce} aria-label={reduce?'Défilement automatique désactivé : mouvement réduit':playing?'Mettre le défilement automatique en pause':'Activer le défilement automatique'} onClick={()=>setPlaying(value=>!value)}>{playing&&!reduce?<Pause size={16}/>:<Play size={16}/>}<span>{reduce?'Mouvement réduit':playing?'Pause':'Lecture'}</span></button></div>
      <span className="sr-only" aria-live={playing&&!reduce?'off':'polite'} aria-atomic="true">Photographie {active+1} sur {journeyGallery.length} : {journeyGallery[active].title}</span>
      <p className="journey-gallery-note">Photographies d’inspiration. Elles ne constituent pas un programme de séjour.</p>
    </div>
  </section>;
}
