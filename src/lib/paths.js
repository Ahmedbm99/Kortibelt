// Adresses du site, en français (racine) et en anglais (/en).
// Toute navigation interne passe par ces fonctions : ne jamais écrire une URL à la main.
import {
  beltSlug,
  categorySlug,
  familySlug,
  findBeltBySlug,
  findCategoryBySlug,
  findFamilyBySlug,
  findSubcategoryBySlug,
  getBelt as getBeltLegacy,
  getCategory,
  getFamily,
  getSubcategoriesOf,
  getSubcategory,
  subcategorySlug,
} from '@/data/catalog';

export const LANGS = ['fr', 'en'];

/** Segments d'URL traduits. */
export const SEGMENTS = {
  fr: { products: 'courroies', belt: 'courroie', cart: 'devis', checkout: 'devis/coordonnees', thanks: 'merci', contact: 'contact', about: 'a-propos', materials: 'matieres' },
  en: { products: 'belts', belt: 'belt', cart: 'quote', checkout: 'quote/details', thanks: 'thank-you', contact: 'contact', about: 'about', materials: 'materials' },
};

export const langFromPath = (pathname) => (pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr');
const base = (lang) => (lang === 'en' ? '/en' : '');
const withQuery = (path, query) => {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query || {})) if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  const s = params.toString();
  return s ? `${path}?${s}` : path;
};

/** Constructeurs d'adresses pour une langue donnée. */
export function pathsFor(lang) {
  const s = SEGMENTS[lang];
  const b = base(lang);
  const products = (query) => withQuery(`${b}/${s.products}`, query);
  const family = (fam) => `${b}/${s.products}/${familySlug(fam, lang)}`;
  const category = (cat) => `${family(getFamily(cat.famille_id))}/${categorySlug(cat, lang)}`;
  // Une catégorie à une seule sous-catégorie affiche directement ses produits : une seule adresse.
  const subcategory = (sub) => {
    const cat = getCategory(sub.category_id);
    return getSubcategoriesOf(cat.id).length === 1 ? category(cat) : `${category(cat)}/${subcategorySlug(sub, lang)}`;
  };
  return {
    lang,
    home: () => b || '/',
    products,
    family,
    category,
    subcategory,
    belt: (belt) => `${b}/${s.belt}/${beltSlug(belt)}`,
    cart: () => `${b}/${s.cart}`,
    checkout: () => `${b}/${s.checkout}`,
    thanks: () => `${b}/${s.thanks}`,
    contact: () => `${b}/${s.contact}`,
    about: () => `${b}/${s.about}`,
    materials: (id) => withQuery(`${b}/${s.materials}`, { id }),
  };
}

/**
 * Analyse une adresse : { lang, page, family?, category?, subcategory?, belt? }.
 * page ∈ home | products | family | category | subcategory | belt | cart | checkout | thanks | contact | about | materials | unknown
 */
export function parsePath(pathname) {
  const lang = langFromPath(pathname);
  const rest = (lang === 'en' ? pathname.slice(3) : pathname).replace(/^\/+|\/+$/g, '');
  const s = SEGMENTS[lang];
  if (!rest) return { lang, page: 'home' };
  for (const page of ['checkout', 'cart', 'thanks', 'contact', 'about', 'materials']) {
    if (rest === s[page]) return { lang, page };
  }
  const parts = rest.split('/');
  if (parts[0] === s.belt && parts.length === 2) {
    const belt = findBeltBySlug(parts[1]);
    return belt ? { lang, page: 'belt', belt } : { lang, page: 'unknown' };
  }
  if (parts[0] === s.products) {
    if (parts.length === 1) return { lang, page: 'products' };
    const family = findFamilyBySlug(parts[1], lang);
    if (!family) return { lang, page: 'unknown' };
    if (parts.length === 2) return { lang, page: 'family', family };
    const category = findCategoryBySlug(family, parts[2], lang);
    if (!category) return { lang, page: 'unknown' };
    if (parts.length === 3) return { lang, page: 'category', family, category };
    const subcategory = findSubcategoryBySlug(category, parts[3], lang);
    if (!subcategory || parts.length > 4) return { lang, page: 'unknown' };
    return { lang, page: 'subcategory', family, category, subcategory };
  }
  return { lang, page: 'unknown' };
}

/** Même page dans l'autre langue (pour le sélecteur de langue et les balises hreflang). */
export function alternatePath(pathname, search, targetLang) {
  const info = parsePath(pathname);
  const p = pathsFor(targetLang);
  const query = search || '';
  switch (info.page) {
    case 'home':
      return p.home();
    case 'products':
      return p.products() + query;
    case 'family':
      return p.family(info.family);
    case 'category':
      return p.category(info.category);
    case 'subcategory':
      return p.subcategory(info.subcategory);
    case 'belt':
      return p.belt(info.belt);
    case 'materials':
      return p.materials() + query;
    case 'unknown':
      return p.home();
    default:
      return p[info.page]();
  }
}

/** Adresse d'une ancienne URL (/products/…, /category/…) : utilisée pour les redirections. */
export function legacyPath(pathname, search) {
  const p = pathsFor('fr');
  const m = (re) => pathname.match(re);
  let r;
  if ((r = m(/^\/products\/product\/(\d+)$/))) {
    const belt = getBeltLegacy(r[1]);
    return belt ? p.belt(belt) : p.products();
  }
  if ((r = m(/^\/products\/(\d+)$/))) {
    const sub = getSubcategory(r[1]);
    return sub ? p.subcategory(sub) : p.products();
  }
  if ((r = m(/^\/category\/(\d+)$/))) {
    const fam = getFamily(r[1]);
    return fam ? p.family(fam) : p.products();
  }
  if ((r = m(/^\/subcategory\/(\d+)$/))) {
    const cat = getCategory(r[1]);
    return cat ? p.category(cat) : p.products();
  }
  if (pathname === '/products') return p.products() + (search || '');
  return p.home();
}
