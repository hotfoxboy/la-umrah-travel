import type { QuoteInput } from './quote';
/** Public endpoint URL only; no provider API key belongs in client variables. */
export const quoteEndpoint = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT?.trim() || '';
export function createQuoteMailto(data: QuoteInput, recipient: string): string {
  const body = [
    `Nom : ${data.name}`, `Email : ${data.email}`, `Téléphone : ${data.phone}`,
    `Voyageurs : ${data.travelers}`, `Formule : ${data.package}`,
    `Départ souhaité : ${data.date || 'À définir'}`, '', data.message,
    '', 'Consentement au traitement de cette demande : oui',
  ].join('\r\n');
  return `mailto:${recipient}?subject=${encodeURIComponent('Demande de devis Omra')}&body=${encodeURIComponent(body)}`;
}

export async function deliverQuote(data: QuoteInput, recipient: string, endpoint = quoteEndpoint) {
  if (data.website || !data.consent) throw new Error('Veuillez vérifier les champs et le consentement.');
  if (!endpoint) return {
    transmitted: false,
    mailto: createQuoteMailto(data, recipient),
    message: `Votre demande n’est pas encore transmise. Vérifiez puis envoyez l’email dans votre application de messagerie. Si elle ne s’ouvre pas, contactez ${recipient}.`,
  };
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Le service de transmission doit utiliser une adresse HTTPS valide.');
  const response = await fetch(url, {
    method: 'POST', cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(15000),
    headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.ok !== true) throw new Error(result?.error || 'Votre demande n’a pas pu être confirmée. Contactez l’agence au 01 41 68 73 06.');
  return {transmitted: true, mailto: undefined, message: 'Votre demande a été transmise à notre équipe. Un conseiller reviendra vers vous.'};
}
