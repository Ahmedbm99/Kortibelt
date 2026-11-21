// Pré-rendu (build) : produit le HTML de chaque page pour Google et pour un affichage immédiat.
// Utilisé uniquement par scripts/prerender.mjs, jamais dans le navigateur.
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom';
import Root from '@/Root';
import { LANGS, pathsFor } from '@/lib/paths';
import { SITE_URL } from '@/lib/site';
import { families, getCategoriesOf, getSubcategoriesOf, belts } from '@/data/catalog';

export { SITE_URL };

/** Rend une adresse : { head, html } (balises <title>/<meta>/<link> séparées du contenu). */
export async function render(url) {
  const { prelude } = await prerenderToNodeStream(
    <StaticRouter location={url}>
      <Root />
    </StaticRouter>
  );
  let out = '';
  for await (const chunk of prelude) out += chunk;
  // React 19 place en tête les balises destinées au <head> (title, meta, link).
  const match = out.match(/^(?:<title>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*>)+/);
  const head = match ? match[0] : '';
  return { head, html: out.slice(head.length) };
}

/**
 * Pages à pré-rendre et à déclarer dans le sitemap, par langue.
 * Les pages de devis, de remerciement et les résultats de recherche ne sont pas indexées.
 */
export function prerenderRoutes() {
  const routes = [];
  for (const lang of LANGS) {
    const p = pathsFor(lang);
    routes.push(
      { path: p.home(), priority: 1.0, changefreq: 'weekly' },
      { path: p.products(), priority: 0.9, changefreq: 'weekly' },
      { path: p.contact(), priority: 0.7, changefreq: 'monthly' },
      { path: p.about(), priority: 0.5, changefreq: 'monthly' },
      { path: p.materials(), priority: 0.5, changefreq: 'monthly' }
    );
    for (const fam of families) {
      routes.push({ path: p.family(fam), priority: 0.8, changefreq: 'weekly' });
      for (const cat of getCategoriesOf(fam.id)) {
        routes.push({ path: p.category(cat), priority: 0.8, changefreq: 'weekly' });
        const subs = getSubcategoriesOf(cat.id);
        if (subs.length > 1) for (const sub of subs) routes.push({ path: p.subcategory(sub), priority: 0.7, changefreq: 'weekly' });
      }
    }
    for (const belt of belts) routes.push({ path: p.belt(belt), priority: 0.6, changefreq: 'monthly' });
  }
  return routes;
}

/** Adresse équivalente dans les deux langues (pour les liens hreflang du sitemap). */
export { alternatePath } from '@/lib/paths';
