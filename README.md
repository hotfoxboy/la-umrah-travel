# L.A Umrah Travel

Site vitrine français réalisé avec Next.js App Router, TypeScript, Tailwind CSS, primitives shadcn/ui (Button / Radix Slot), Lucide, Motion, React Hook Form et Zod.

Experience mobile et PWA : voir [MOBILE.md](./MOBILE.md) pour le cache, les tests et la recette sur appareils reels.

## Lancement

Prérequis : Node.js 20.9 minimum et npm. Sous PowerShell, utiliser npm.cmd si les scripts PowerShell sont désactivés.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Ouvrir http://localhost:3000.

```sh
npx tsc --noEmit
npm run lint
npm run build
npm start
```

## Configuration et architecture

- `lib/config.ts` : coordonnées, horaires, photographies, catalogue et navigation.
- `lib/pages.ts` : FAQ prudente et textes légaux de préparation.
- `lib/quote.ts` : schéma partagé de validation des demandes.
- `components/` : header, footer, hero, cartes, FAQ, CTA, formulaire, carte à activation volontaire et bouton WhatsApp.
- `components/ui/button.tsx` : composant fondé sur les primitives shadcn/ui (Radix Slot, CVA et composition Tailwind).
- `app/forfaits/[slug]` : détail de la seule formule proposée, Confort ; les deux autres slugs renvoient 404.
- `app/api/devis` : validation serveur et transmission email. Point d’intégration pour un futur CRM ou backend.

Aucun paiement, aucune confirmation de vente, aucun faux avis et aucun outil publicitaire ne sont intégrés. Les placeholders Essentielle/Premium sont explicitement non commercialisés. Les photos sont illustratives et doivent être validées pour la version finale. L’identité typographique provisoire ne remplace pas le logo officiel.

## Activer les demandes de devis

1. Créer/configurer un compte Resend et vérifier le domaine de l’adresse expéditrice.
2. Définir `RESEND_API_KEY`, `QUOTE_FROM_EMAIL` et `QUOTE_TO_EMAIL` dans les secrets serveur de l’hébergement.
3. Envoyer un devis de test et contrôler sa réception effective dans la boîte destinataire avant publication.

Le serveur ne répond positivement qu’après acceptation du message par Resend avec identifiant. Cela confirme la prise en charge par le prestataire, pas la livraison finale : surveiller les rejets et rebonds dans Resend. Sans secrets, le formulaire renvoie 503 et invite à contacter l’agence. Les données ne sont pas sauvegardées localement. Protection : honeypot, délai minimal, validation Zod, contrôle d’origine, limite de taille et limite de tentatives en mémoire. Pour plusieurs instances, configurer une protection partagée au niveau hébergeur / WAF et vérifier les en-têtes proxy de confiance. Ne pas exposer la clé API au client. Pas de données personnelles dans les journaux applicatifs.

## Déploiement

Utiliser un hébergement Node.js compatible Next.js, par exemple Vercel ou un serveur Node. Le site ne peut pas être exporté comme un simple dossier statique à cause de l’API. Définir `NEXT_PUBLIC_SITE_URL` avec le domaine HTTPS final et les variables email, installer, construire et démarrer. Configurer HTTPS, protection antispam partagée, supervision des erreurs et des emails. Aucun déploiement ni envoi à un tiers n’a été effectué par ce dépôt.

WhatsApp est désactivé tant que `NEXT_PUBLIC_WHATSAPP_NUMBER` est vide ; le bouton du header appelle alors l’agence. Renseigner uniquement un numéro WhatsApp confirmé. La carte Google n’est chargée qu’après clic ; aucun bandeau cookies n’est activé en l’absence de traceurs.

## Informations et ressources à fournir avant production

- Logo officiel vectoriel / haute définition, photographies autorisées de La Mecque, Médine et de l’agence, et droits d’utilisation.
- Confirmation écrite du tarif Confort, dates, durée, hôtels, classifications et distances, vols, bagages, transferts, repas, guide, visites, inclusions, exclusions et conditions de visa.
- Offres Essentielle et Premium validées avant toute commercialisation ; les activer avec leur contenu réel, pas simplement un indicateur.
- Horaires, emplacement précis dans le centre commercial et numéro WhatsApp confirmé.
- Validation de la référence Atout France fournie et du rôle contractuel de GOODFLY. Aucun logo IATA, Amadeus ou certification non vérifiée n’est utilisé.
- SIREN / RCS, capital, TVA, directeur de publication, hébergeur, garantie financière, assurance RCP, médiateur, CGV/conditions particulières et documents précontractuels.
- Validation juridique des textes, durées de conservation, sous-traitance email, transferts internationaux et processus d’exercice des droits.
- Domaine, secrets email, test de livraison, protection antispam partagée et validation réglementaire officielle actualisée avant publication.
- Recette visuelle desktop/tablette/mobile, clavier, lecteur d’écran et mesure Core Web Vitals sur l’hébergement réel.

Les textes juridiques signalent leurs éléments manquants et ne doivent pas être considérés comme validés. La FAQ renvoie vers les autorités plutôt que d’affirmer des règles d’entrée ou de santé non vérifiées.

## Vérifications réalisées

TypeScript, ESLint et build de production : réussis. `node scripts/smoke.mjs` vérifie les pages, images, SEO, erreurs 404 des formules non commercialisées et les protections API (origine, consentement, honeypot, délai, email, limite de tentatives). Ce script doit être exécuté sur un serveur local neuf sans identifiants Resend : il vérifie le refus 503 sans configuration et ne doit envoyer aucun email. La livraison réelle reste à tester après activation du service. Les sources photographiques figurent dans `public/PHOTOS.md`.

Chrome headless : rendu contrôlé à 390, 768 et 1440 px, absence de débordement horizontal, ouverture du menu mobile et erreurs du formulaire vide vérifiées. Reproduire avec `node scripts/visual-check.mjs` pendant que le serveur local tourne ; définir `CHROME_PATH` si Chrome est installé ailleurs que son emplacement Windows standard. Les captures `preview-*.png` et profils temporaires sont ignorés par Git. Ces contrôles ne constituent pas un audit WCAG ni une mesure terrain des Core Web Vitals.
