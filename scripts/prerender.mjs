// Pré-rendu statique (exécuté par `npm run build`, après les builds client et SSR).
// Écrit une page HTML complète par adresse indexable (FR et EN), puis :
//   dist/app.html     coquille vide pour les pages client uniquement (devis, merci), non indexée
//   dist/404.html     page introuvable (servie avec le statut 404 par Vercel)
//   dist/sitemap.xml  toutes les pages, avec leurs versions FR/EN (hreflang)
//   dist/robots.txt   autorise l'exploration, exclut les pages de devis, indique le sitemap
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SSR_ENTRY = path.join(ROOT, 'dist-ssr', 'entry-server.js');

const { render, prerenderRoutes, SITE_URL, alternatePath } = await import(pathToFileURL(SSR_ENTRY).href);

const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
const verification = process.env.GOOGLE_SITE_VERIFICATION
  ? `<meta name="google-site-verification" content="${process.env.GOOGLE_SITE_VERIFICATION.replace(/"/g, '')}" />`
  : '';

// Les balises SEO pré-rendues sont marquées data-seo : le navigateur les retire juste avant que React
// n'insère les siennes (sinon chaque page aurait deux <title>, deux descriptions…).
const markSeo = (head) => head.replace(/<(title|meta|link)\b/g, '<$1 data-seo');

const fill = ({ head, html, lang, clientOnly = false }) =>
  template
    .replace('<html lang="fr">', `<html lang="${lang}">`)
    .replace('<!--seo-head-->', `${markSeo(head)}${verification}`)
    .replace('<div id="root"><!--app-html--></div>', `<div id="root"${clientOnly ? ' data-client-only' : ''}>${html}</div>`);

const fileFor = (urlPath) => (urlPath === '/' ? path.join(DIST, 'index.html') : path.join(DIST, ...urlPath.split('/').filter(Boolean), 'index.html'));
const langOf = (urlPath) => (urlPath === '/en' || urlPath.startsWith('/en/') ? 'en' : 'fr');

// 1. Coquille pour les pages rendues uniquement dans le navigateur
await writeFile(
  path.join(DIST, 'app.html'),
  fill({ head: '<title>KORTIBELT</title><meta name="robots" content="noindex" />', html: '', lang: 'fr' })
);

// 2. Pages indexables
const routes = prerenderRoutes();
let count = 0;
for (const route of routes) {
  const { head, html } = await render(route.path);
  if (!head.includes('<title>')) throw new Error(`Pas de <title> pour ${route.path}`);
  const file = fileFor(route.path);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, fill({ head, html, lang: langOf(route.path) }));
  count++;
}

// 3. Page 404
{
  const { head, html } = await render('/__page-introuvable__');
  // La page 404 peut s'afficher sous n'importe quelle adresse : rendue à nouveau côté navigateur.
  await writeFile(path.join(DIST, '404.html'), fill({ head, html, lang: 'fr', clientOnly: true }));
}

// 4. Sitemap (une entrée par adresse, avec ses équivalents FR/EN)
const today = new Date().toISOString().slice(0, 10);
const abs = (p) => (p === '/' ? SITE_URL + '/' : SITE_URL + p);
const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const entries = routes.map((r) => {
  const fr = alternatePath(r.path, '', 'fr');
  const en = alternatePath(r.path, '', 'en');
  return [
    '  <url>',
    `    <loc>${xmlEscape(abs(r.path))}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${r.changefreq}</changefreq>`,
    `    <priority>${r.priority.toFixed(1)}</priority>`,
    `    <xhtml:link rel="alternate" hreflang="fr" href="${xmlEscape(abs(fr))}"/>`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${xmlEscape(abs(en))}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(abs(fr))}"/>`,
    '  </url>',
  ].join('\n');
});
await writeFile(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`
);

// 5. robots.txt
await writeFile(
  path.join(DIST, 'robots.txt'),
  [
    'User-agent: *',
    'Allow: /',
    'Disallow: /devis',
    'Disallow: /merci',
    'Disallow: /en/quote',
    'Disallow: /en/thank-you',
    'Disallow: /app.html',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n')
);

await rm(path.join(ROOT, 'dist-ssr'), { recursive: true, force: true });
console.log(`Pré-rendu : ${count} pages, 404.html, app.html, sitemap.xml, robots.txt (site : ${SITE_URL})`);
