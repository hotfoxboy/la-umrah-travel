import {assetPath,siteUrl} from './paths';
export const agency = { name:'L.A UMRAH TRAVEL', phone:'01 41 68 73 06', telephone:'+33141687306', email:'contact@la-dreamtravel.com', address:'Centre Commercial Basilique, Saint-Denis', legalAddress:'2 Passage du Saulger, 93200 Saint-Denis, France', whatsapp:process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '', hours:'Contactez-nous pour connaître nos horaires.', url:siteUrl };
export const photos = { makkah:assetPath('/kaaba.jpg'), panorama:assetPath('/kaaba-panorama.jpg'), medina:assetPath('/medina.jpg') };
export const packages = [
 {slug:'essentielle',name:'Essentielle',price:'Sur demande',available:false,description:'L’essentiel de votre voyage spirituel.',image:photos.panorama},
 {slug:'confort',name:'Confort',price:'1 580 €',available:true,description:'La sérénité à chaque étape de votre Omra.',image:photos.medina},
 {slug:'premium',name:'Premium',price:'Sur demande',available:false,description:'Une attention particulière à votre confort.',image:photos.medina},
];
export const navigation = [['Accueil','/'],['Nos forfaits','/forfaits'],['Notre approche','/notre-approche'],['Notre agence','/agence'],['Actualités','/actualites'],['Contact','/contact']];
