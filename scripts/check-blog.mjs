import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {getArticles,parseMarkdown} from '../lib/blog.ts';
import {absolutePageUrl,basePath} from '../lib/paths.ts';

const articles=getArticles();assert.ok(articles.length>=3);
const listing=await readFile(resolve('out/actualites/index.html'),'utf8');
assert.match(listing,/<h1[^>]*>Actualités &amp; inspirations<\/h1>/);
assert.match(listing,/À LA UNE/);assert.match(listing,/Filtrer les articles/);
assert.ok(listing.includes(absolutePageUrl('/actualites')));
const sitemap=await readFile('out/sitemap.xml','utf8');
for(const article of articles){
 const html=await readFile(resolve('out/actualites',article.slug,'index.html'),'utf8');
 assert.equal([...html.matchAll(/<h1\b/g)].length,1,article.slug);
 assert.ok(listing.includes(`${basePath}/actualites/${article.slug}/`),`${article.slug} listing link`);
 assert.ok(html.includes('rel="canonical" href="'+absolutePageUrl('/actualites/'+article.slug)+'"'),'Canonical');
 assert.match(html,/<meta property="og:type" content="article"/);
 assert.ok(html.includes('property="article:published_time" content="'+article.date+'"'));
 assert.match(html,/<meta name="twitter:card" content="summary_large_image"/);
 const json=html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];assert.ok(json);
 const structured=JSON.parse(json);assert.equal(structured['@type'],'BlogPosting');assert.equal(structured.headline,article.title);assert.equal(structured.datePublished,article.date);assert.equal(structured.mainEntityOfPage['@id'],absolutePageUrl('/actualites/'+article.slug));assert.ok(sitemap.includes(structured.mainEntityOfPage['@id']));
 assert.ok(await stat(resolve('out','.'+article.cover)),'Cover exists');
 for(const heading of article.toc)assert.ok(html.includes(`id="${heading.id}"`));
 if(article.toc.length>=5){assert.match(html,/Sommaire de l’article/);for(const heading of article.toc)assert.ok(html.includes('href="#'+heading.id+'"'));}
 assert.ok(html.includes('Partager cet article'));assert.ok(html.includes('À découvrir aussi'));
 const related=html.split('aria-labelledby="related-title"')[1];assert.ok(related);assert.ok(!related.includes(`href="${basePath}/actualites/${article.slug}/"`),'No self-related card');
}
const home=await readFile('out/index.html','utf8');assert.ok(home.includes(`${basePath}/actualites/`),'Main menu news link');assert.ok(!home.includes('class="news-card')&&!home.includes('news-intro'),'No news section on homepage');
const blocks=parseMarkdown('## Même titre\n\nUn **texte**.\n\n## Même titre\n\n- Une ligne\n- Une autre\n\n1. Étape une\n2. Étape deux');assert.equal(blocks[0].id,'meme-titre');assert.equal(blocks[2].id,'meme-titre-2');assert.equal(blocks[3].items.length,2);assert.equal(blocks[4].ordered,true);
const icon=await readFile('out/icon.svg','utf8');assert.ok(!icon.includes('<text'));assert.ok(icon.includes('#D8AD58'));
const ico=await readFile('app/favicon.ico');assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);
for(const size of [16,32])assert.ok(home.includes(`${basePath}/icons/favicon-${size}.png`));
assert.ok(home.includes(`${basePath}/icons/apple-touch-icon.png`));
console.log(`OK blog: ${articles.length} article routes, listing, images, canonical/OG/Twitter/BlogPosting, sitemap, TOC, related links, homepage isolation, Markdown parsing, Kaaba favicons.`);
