# Actualités — publication statique

Le journal est indépendant de la page d’accueil : `/actualites/` et `/actualites/[slug]/`. Son entrée est présente dans la navigation principale, y compris le menu mobile. Aucun aperçu n’est ajouté à l’accueil.

## Ajouter un article

1. Créer `content/actualites/mon-nouvel-article.md`. Le nom du fichier devient le slug ; utiliser uniquement des lettres minuscules sans accents, chiffres et tirets.
2. Copier l’en-tête JSON ci-dessous entre les deux lignes `---`. Les virgules et guillemets doivent respecter JSON.
3. Rédiger le contenu en français. Une seule balise H1 est générée depuis `title` : commencer les sections Markdown par `##`.
4. Mettre la photographie optimisée dans `public/images/actualites/`, ou réutiliser un visuel local autorisé. `cover` est le chemin depuis `public`, sans le préfixe GitHub Pages. Renseigner sa description et conserver les crédits/licences.
5. Garder `draft: true` pendant la rédaction. Passer à `false` après validation éditoriale. La date doit être la date réelle de publication ; elle n’est jamais inventée automatiquement.
6. Exécuter `npm run lint`, `npm run build`, `npm run typecheck`, `npm run test:export` et `node scripts/check-blog.mjs`.
7. Publier via le processus GitHub existant lorsqu’il est autorisé. Une modification Markdown nécessite un nouveau build/déploiement ; il n’y a ni CMS ni publication en temps réel.

```md
---
{
  "title": "Le titre de votre article",
  "description": "Un résumé clair pour les lecteurs et les moteurs de recherche.",
  "category": "Préparation",
  "date": "2026-10-30",
  "cover": "/images/journey/medina-1600.webp",
  "coverAlt": "Le dôme vert et les minarets de la mosquée à Médine",
  "featured": false,
  "draft": true
}
---

Introduction de votre article.

## Premier sujet

Un paragraphe avec du **texte en gras** et un [lien interne](/contact).

- Un premier point.
- Un deuxième point.

### Un sous-sujet

Un autre paragraphe, avec un [lien externe](https://example.com).
```

## Règles et fonctionnalités

- Markdown volontairement limité : paragraphes, titres H2/H3, listes numérotées ou à puces, gras, liens internes et HTTPS. HTML brut, JavaScript, MDX, tableaux et images dans le corps ne sont pas exécutés/interprétés. Le rendu React échappe le texte ; aucun compilateur de code n’est utilisé.
- Métadonnées validées avec Zod au build. Un en-tête mal formé, une date impossible ou un fichier mal nommé fait échouer le build avec le fichier concerné.
- `draft: true` exclut un article de la liste, des routes exportées et du sitemap. La date ne programme pas une publication : un article non brouillon est publié au prochain déploiement, quelle que soit sa date.
- Classement par date décroissante, puis slug pour un résultat stable. Catégories calculées automatiquement à partir du contenu.
- Le premier article `featured: true` du classement est mis en avant. Les autres restent dans la grille. Les filtres affichent toutes les correspondances, dont les articles à la une.
- La grille affiche six articles à la fois puis propose « Afficher plus d’articles » lorsque nécessaire, sans nouvelle route serveur.
- Un sommaire est affiché à partir de cinq titres H2/H3. Les identifiants sont stables ; les doublons reçoivent un suffixe.
- Articles liés : même catégorie en priorité, puis autres articles récents ; jamais l’article courant.
- Partage natif lorsque disponible, copie de lien avec message d’échec honnête, liens WhatsApp/Facebook. Aucun SDK social, traceur ou script tiers.
- Chaque article dispose d’une canonical, d’Open Graph `article`, de Twitter Cards et d’un `BlogPosting` JSON-LD. Les articles publiés sont ajoutés au sitemap automatiquement.
- La structure de l’article est générée en HTML au build : le contenu reste lisible sans JavaScript. Les filtres et le partage enrichissent la page côté navigateur.

Les trois articles initiaux sont des textes éditoriaux de démarrage, à relire par l’agence avant publication. Ils ne constituent ni un programme contractuel ni un avis réglementaire.

## Favicon

`app/icon.svg` est la source du pictogramme Kaaba. Le favicon ICO contient des tailles 16, 32 et 48 px ; les PNG couvrent les onglets, Apple Touch et les icônes du manifest. Ce pictogramme est indépendant du logo officiel fourni ensuite par l’agence et intégré dans le header/footer via `components/brand-logo.tsx` et `public/brand/`. Le service worker passe à une nouvelle version de cache pour renouveler les icônes installées. Certains navigateurs peuvent conserver temporairement un ancien favicon ; une réinstallation du raccourci peut être nécessaire pour un raccourci déjà installé.
