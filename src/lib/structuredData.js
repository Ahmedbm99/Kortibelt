// Données structurées schema.org (JSON-LD) : aident Google à comprendre l'entreprise et les produits.
import { config } from '@/lib/config';
import { SITE_URL, absoluteUrl } from '@/lib/site';

export const organization = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'KORTIBELT',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    'Courroies industrielles de transmission de puissance : trapézoïdales, synchrones, Poly-V, polyuréthane et thermosoudables. Distribution exclusive en Tunisie par AisGroup.',
  email: config.contactEmail,
  telephone: config.contactPhone,
  address: { '@type': 'PostalAddress', addressCountry: 'TN' },
  areaServed: ['TN', 'Africa', 'Middle East'],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: config.contactPhone,
      email: config.contactEmail,
      availableLanguage: ['French', 'English', 'Arabic'],
      areaServed: 'TN',
    },
  ],
  brand: { '@type': 'Brand', name: 'KORTIBELT' },
});

export const website = (language) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'KORTIBELT',
  url: SITE_URL,
  inLanguage: language === 'en' ? 'en' : 'fr',
  publisher: { '@id': `${SITE_URL}/#organization` },
});

/** Fil d'Ariane : items = [{ label, to }] (le premier est l'accueil). */
export const breadcrumbList = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.label,
    ...(item.to ? { item: absoluteUrl(item.to) } : {}),
  })),
});

/** Fiche produit (sans prix : vente sur devis). */
export const product = ({ belt, url, images, category, materials, description }) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: belt.nom,
  description,
  url: absoluteUrl(url),
  image: images.map(absoluteUrl),
  sku: `KB-${belt.id}`,
  ...(belt.reference_fabricant ? { mpn: belt.reference_fabricant } : {}),
  brand: { '@type': 'Brand', name: 'KORTIBELT' },
  manufacturer: { '@id': `${SITE_URL}/#organization` },
  category,
  ...(materials.length ? { material: materials.join(', ') } : {}),
  additionalProperty: [
    ['Profil', belt.profil],
    ['Largeur (mm)', belt.largeur_mm],
    ['Hauteur (mm)', belt.hauteur_mm],
    ['Pas (mm)', belt.pas_mm],
  ]
    .filter(([, v]) => v)
    .map(([name, value]) => ({ '@type': 'PropertyValue', name, value: String(value) })),
});

/** Liste de produits (pages catégorie). */
export const itemList = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(it.url), name: it.name })),
});
