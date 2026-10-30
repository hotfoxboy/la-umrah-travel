# L.A Umrah Travel

Site vitrine français réalisé avec Next.js App Router, TypeScript, Tailwind CSS, primitives shadcn/ui (Button / Radix Slot), Lucide, Motion, React Hook Form et Zod.

Experience mobile et PWA : voir [MOBILE.md](./MOBILE.md) pour le cache, les tests et la recette sur appareils reels.

## GitHub Pages

Preparado para https://hotfoxboy.github.io/la-umrah-travel/. Ver [GITHUB-PAGES.md](./GITHUB-PAGES.md) para exportacao estatica, limitacoes, testes e publicacao por GitHub Actions. Nenhuma publicacao e feita automaticamente no ambiente local.

## Lancement

Prérequis : Node.js 22.18 minimum et npm. Sous PowerShell, utiliser npm.cmd si les scripts PowerShell sont désactivés.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Ouvrir http://localhost:3000/la-umrah-travel/.

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
- `server/quote/route.ts` : API Node originale préservée pour un backend séparé ; non exportée sur GitHub Pages.

Aucun paiement, aucune confirmation de vente, aucun faux avis et aucun outil publicitaire ne sont intégrés. Les placeholders Essentielle/Premium sont explicitement non commercialisés. Les photos sont illustratives et doivent être validées pour la version finale. L’identité typographique provisoire ne remplace pas le logo officiel.

## Devis et deploiement statique

Le formulaire reste valide dans le navigateur et prepare un email dans la messagerie du visiteur, sans confirmer un envoi. Un backend HTTPS optionnel peut etre raccorde via NEXT_PUBLIC_QUOTE_ENDPOINT. Aucune cle secrete ne doit etre ajoutee au frontend.

`npm run build` genere `out`. `npm start` sert ces fichiers dans le sous-repertoire `/la-umrah-travel/`. Le workflow GitHub Actions est prepare pour la branche `main` mais ne sera execute a distance que lorsque vous publierez les modifications. Details et alternatives : [GITHUB-PAGES.md](./GITHUB-PAGES.md).

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

## Verifications

Executer `npm run build`, `npm run test:export`, `npm run test:pwa`, `npm run test:quote`, `npm run lint` et `npm run typecheck`. Les anciens tests de l’API Node sont conserves dans `server/quote/smoke.mjs` et ne concernent pas GitHub Pages. Les tests mobiles sont adaptes au sous-repertoire. Voir [GITHUB-PAGES.md](./GITHUB-PAGES.md).
