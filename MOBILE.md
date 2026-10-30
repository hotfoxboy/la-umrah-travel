# Expérience mobile et PWA

> GitHub Pages : la configuration actuelle est statique. Ouvrir http://localhost:3000/la-umrah-travel/ apres `npm run build` et `npm start`. Le formulaire prepare un email sans confirmation de transmission, ou utilise un endpoint HTTPS optionnel. Voir [GITHUB-PAGES.md](./GITHUB-PAGES.md). Les scores ci-dessous sont historiques et ne constituent pas une nouvelle mesure de cette exportation.

Le site fonctionne directement dans le navigateur. Son installation sur l’écran d’accueil est facultative et dépend du navigateur. Les icônes à initiales restent provisoires en attendant le logo officiel.

## Comportements livrés

- Navigation inférieure à cinq entrées jusqu’à 1023 px, page active et safe areas. Menu secondaire compact ; navigation horizontale sur ordinateur.
- Favoris dans `localStorage`, uniquement des identifiants de forfaits. Aucun compte ni synchronisation. Retrait possible depuis la fiche ou la liste.
- Fiche Confort avec galerie à défilement tactile, prix et informations essentielles, accordéons, action fixe au-dessus de la navigation.
- Formulaire : cibles tactiles, saisie de téléphone et voyageurs adaptée, date native, validation après interaction et à chaque correction. La navigation inférieure s’efface pendant la saisie pour laisser place au clavier. Aucune demande n’est mise en file d’attente hors ligne.
- Skeleton de transition, images mobiles AVIF/WebP, réduction des animations et absence de blocage du zoom.

## Politique de cache

Le service worker ne conserve que la page hors connexion, les icônes et la police Quicksand explicitement autorisées. Ni HTML de catalogue, ni tarifs, ni réponses React Server Components, ni API, ni POST de formulaire ne sont stockés. Les navigations utilisent le réseau avec `cache: no-store` ; en cas d’échec, une page dédiée indique qu’une connexion est nécessaire. Le cache applicatif est séparé des favoris locaux.

La nouvelle version du service worker attend. Une notification propose son activation, puis un rechargement volontaire après avoir terminé la demande. Aucun rechargement automatique ne détruit le formulaire. Incrémenter la version de `public/sw.js` lorsque les fichiers précachés changent ; les anciens caches de cette application sont alors supprimés, sans effacer les favoris ni les caches d’autres applications.

Le fonctionnement PWA exige HTTPS en production (localhost est accepté pour les tests). Tester les mises à jour avec deux builds successifs sur un environnement de recette. Aucun message de confirmation ne doit être affiché si l’API refuse l’envoi.

## Reproduire les tests

Construire et lancer le serveur de production dans un premier terminal :

```powershell
npm.cmd run build
npm.cmd start
```

Dans un deuxième terminal :

```powershell
node scripts/test-sw.mjs
node scripts/mobile-check.mjs
```

`CHROME_PATH` permet de choisir l’exécutable Chrome et `TEST_BASE_URL` un autre serveur local. Le test Chrome couvre les largeurs 320, 360, 375, 390, 393, 412, 430, 768, 1024 et 1440 px sur l’accueil, la fiche Confort et le contact. Il contrôle le débordement, les cinq entrées et leurs dimensions, le positionnement du devis fixe, la persistance et le retrait des favoris, le menu, la validation, l’orientation, le défilement de la galerie, la réduction des animations, le contenu réel du cache et la navigation hors connexion puis le retour en ligne. Chrome simule séparément le réseau du document et celui du service worker.

Les mesures Lighthouse utilisent un outillage facultatif isolé du projet :

```powershell
npm.cmd install --prefix .audit-tools --no-save --package-lock=false lighthouse@12.8.2
node scripts/lighthouse-mobile.mjs
```

Ce dossier d’outillage et les rapports JSON sont ignorés par Git. Il n’est pas nécessaire au lancement, au build ou au déploiement. Les rapports locaux portent sur l’accueil, la fiche Confort et le contact en simulation mobile à 390 × 844, sans autre test navigateur concurrent.

## Recette sur appareils réels à terminer

Les tailles Chrome simulées ne sont pas des tests Safari iOS, Samsung Internet ni des tests sur matériel réel. Avant production, réaliser les vérifications suivantes sur iPhone SE, iPhone 15/16, Samsung Galaxy, Android Chrome, iOS Safari, tablette et ordinateur :

- Parcours accueil → forfait → devis ; focus, clavier réel, correction des erreurs et absence d’envoi si la connexion est perdue.
- Paysage/portrait, encoche et barre d’accueil, zoom, VoiceOver/TalkBack, retour navigateur et ouverture de WhatsApp après configuration.
- Balayage de la galerie, favoris persistants après fermeture, stockage indisponible ou effacé.
- Ajout à l’écran d’accueil, démarrage standalone, première visite sans service worker, retour hors connexion et retour au réseau.
- Nouvelle version pendant un formulaire rempli : reporter, activer sans rechargement automatique, puis recharger volontairement.
- Réception effective des emails avec le compte de l’agence, déjà nécessaire avant production.

Les objectifs LCP < 2,5 s, INP < 200 ms et CLS < 0,1 au 75e percentile nécessitent des mesures de terrain après déploiement. Un audit local ne démontre pas ces percentiles. Le TBT de Lighthouse ne remplace pas l’INP. Le consentement et la confidentialité doivent être étudiés avant d’ajouter une collecte de mesures.

## Mesures locales du 29 octobre 2026

Build de production, Chrome headless, Lighthouse 12.8.2, mode mobile et ralentissement simulé, un audit à la fois. Résultats d’une exécution, non des percentiles :

| Page | Performance | Accessibilité | LCP simulé | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: |
| Accueil | 97 | 100 | 2,44 s | 0 | 93 ms |
| Formule Confort | 93 | 100 | 3,05 s | 0 | 125 ms |
| Contact | 96 | 100 | 1,99 s | 0 | 213 ms |

Les objectifs de score sont atteints dans cette exécution. Le LCP simulé de la fiche Confort dépasse encore 2,5 s ; le suivi sur l’hébergement final reste nécessaire. Aucun INP terrain ni test Safari iOS sur appareil réel n’est revendiqué. Les rapports complets restent dans les fichiers locaux `lighthouse-accueil.json`, `lighthouse-confort.json` et `lighthouse-contact.json`.

TypeScript, lint, build, tests HTTP et tests de cache : réussis. L’audit npm du projet livré ne signale aucune vulnérabilité au moment du contrôle ; Lighthouse est isolé dans le dossier facultatif d’outillage et n’est pas une dépendance du site.

Le contrôle complémentaire à 390 px vérifie un vrai balayage tactile émulé via Chrome, le focus pendant une réduction du viewport, le retour de validation et le mode hors connexion du document et du service worker. La version de Chrome disponible ne permet pas d’émuler les valeurs des safe areas : les règles `env(safe-area-inset-*)` sont présentes, mais leur validation visuelle sur une encoche et une barre d’accueil réelles reste à faire, ainsi que le clavier natif iOS/Android.
