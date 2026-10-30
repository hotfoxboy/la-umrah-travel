import {ImageResponse} from 'next/og';
export const alt='L.A Umrah Travel — Votre Omra au départ de Paris';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function OpenGraph(){return new ImageResponse(<div style={{width:'100%',height:'100%',background:'#041D40',color:'white',display:'flex',flexDirection:'column',padding:90,justifyContent:'center',borderBottom:'12px solid #D8AD58'}}><div style={{fontSize:26,color:'#D8AD58',letterSpacing:7}}>L.A UMRAH TRAVEL</div><div style={{fontSize:78,marginTop:40}}>Votre Omra</div><div style={{fontSize:68,color:'#D8AD58'}}>au départ de Paris.</div><div style={{fontSize:24,marginTop:35}}>Un voyage spirituel inoubliable, en toute sérénité.</div></div>,size);}
