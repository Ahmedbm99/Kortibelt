import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { alternatePath } from '@/lib/paths';
import { SITE_URL, absoluteUrl } from '@/lib/site';

const SITE_NAME = 'KORTIBELT';
const MAX_DESCRIPTION = 158;

/** Coupe une description proprement pour Google (~155 caractères). */
const clip = (text) => {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= MAX_DESCRIPTION) return s;
  return `${s.slice(0, MAX_DESCRIPTION - 1).replace(/[\s,;:.]+\S*$/, '')}…`;
};

/**
 * Balises de référencement d'une page : titre, description, URL canonique, versions FR/EN (hreflang),
 * Open Graph (partage) et données structurées JSON-LD.
 * React 19 place automatiquement <title>, <meta> et <link> dans le <head>, y compris au pré-rendu.
 */
export default function Seo({ title, description, image, noindex = false, jsonLd, type = 'website' }) {
  const { pathname } = useLocation();
  const { language, t } = useLanguage();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : t('seoHomeTitle');
  const desc = clip(description || t('seoHomeDescription'));
  const canonical = absoluteUrl(pathname);
  const fr = absoluteUrl(alternatePath(pathname, '', 'fr'));
  const en = absoluteUrl(alternatePath(pathname, '', 'en'));
  const ogImage = image ? absoluteUrl(image) : `${SITE_URL}/og-image.jpg`;
  const data = Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : jsonLd ? [jsonLd] : [];

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <>
          <link rel="alternate" hrefLang="fr" href={fr} />
          <link rel="alternate" hrefLang="en" href={en} />
          <link rel="alternate" hrefLang="x-default" href={fr} />
        </>
      )}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={language === 'en' ? 'en_US' : 'fr_FR'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      {data.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />
      ))}
    </>
  );
}
