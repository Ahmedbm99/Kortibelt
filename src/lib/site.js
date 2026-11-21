// Adresse publique du site, fixée au moment du build (voir vite.config.js : SITE_URL).
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'http://localhost:4173').replace(/\/+$/, '');

/** URL absolue d'un chemin du site ("/courroies" → "https://…/courroies", "/" → "https://…/"). */
export const absoluteUrl = (path) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path || '/'}`);
