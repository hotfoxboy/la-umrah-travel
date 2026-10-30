import {NextRequest,NextResponse} from 'next/server';
import {quoteSchema} from '@/lib/quote';
export const runtime='nodejs';
// Local limiter is a secondary guard; configure shared rate limiting at the hosting edge.
const attempts=new Map<string,{count:number;expires:number}>();
export async function POST(request:NextRequest){
 if(request.headers.get('origin')!==new URL(request.url).origin)return NextResponse.json({error:'Origine de la demande refusée.'},{status:403});
 const length=Number(request.headers.get('content-length')||0);if(length>20000)return NextResponse.json({error:'Demande trop volumineuse.'},{status:413});
 const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';const now=Date.now();
 for(const [key,value] of attempts)if(value.expires<now)attempts.delete(key);
 if(attempts.size>10000)return NextResponse.json({error:'Service momentanément occupé. Veuillez nous appeler.'},{status:503});
 const entry=attempts.get(ip)||{count:0,expires:now+600000};entry.count++;attempts.set(ip,entry);
 if(entry.count>5)return NextResponse.json({error:'Trop de tentatives. Réessayez dans 10 minutes ou appelez notre agence.'},{status:429,headers:{'Retry-After':'600'}});
 let raw:unknown;try{const body=await request.text();if(body.length>20000)return NextResponse.json({error:'Demande trop volumineuse.'},{status:413});raw=JSON.parse(body);}catch{return NextResponse.json({error:'Demande invalide.'},{status:400});}
 const parsed=quoteSchema.safeParse(raw);if(!parsed.success)return NextResponse.json({error:'Veuillez vérifier les champs et le consentement.'},{status:400});
 const data=parsed.data;if(now-data.startedAt<3000||now-data.startedAt>86400000)return NextResponse.json({error:'Veuillez patienter quelques secondes puis réessayer, ou recharger le formulaire.'},{status:400});
 if(!process.env.RESEND_API_KEY||!process.env.QUOTE_FROM_EMAIL||!process.env.QUOTE_TO_EMAIL)return NextResponse.json({error:'La transmission en ligne n’est pas encore activée. Contactez-nous au 01 41 68 73 06 ou à contact@la-dreamtravel.com.'},{status:503});
 try{const response=await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(12000),headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.QUOTE_FROM_EMAIL,to:[process.env.QUOTE_TO_EMAIL],reply_to:data.email,subject:'Nouvelle demande de devis Omra',text:`Nom : ${data.name}\nEmail : ${data.email}\nTéléphone : ${data.phone}\nVoyageurs : ${data.travelers}\nFormule : ${data.package}\nDépart souhaité : ${data.date||'À définir'}\nMessage : ${data.message}\nConsentement au traitement : oui\nReçu le : ${new Date().toISOString()}`})});if(!response.ok)throw new Error('provider');const result=await response.json();if(!result.id)throw new Error('missing-id');return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Votre demande n’a pas pu être confirmée. Contactez l’agence au 01 41 68 73 06.'},{status:502});}
}
