import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { beltDimensions, beltImages, beltMaterials } from '@/data/catalog';
import ResponsiveImage from '@/components/ResponsiveImage';

/** Carte produit : photo, profil, dimensions, matières ; lien vers la fiche et ajout rapide au devis. */
export default function ProductCard({ belt, compact = false, priority = false, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const { t, paths } = useLanguage();
  const { addToCart } = useCart();
  const image = beltImages(belt)[0];
  const materials = beltMaterials(belt);
  const dims = beltDimensions(belt);
  const to = paths.belt(belt);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-xl">
      <Link to={to} className="block aspect-[4/3] overflow-hidden bg-secondary" tabIndex={-1} aria-hidden="true">
        <ResponsiveImage
          src={image}
          alt={belt.nom}
          priority={priority}
          width={400}
          height={300}
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {belt.profil && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-text">{belt.profil}</p>
        )}
        <Heading className="mb-2 text-lg font-bold leading-snug text-primary">
          <Link to={to} className="hover:underline">
            {belt.nom}
          </Link>
        </Heading>
        {dims && <p className="mb-2 text-sm text-muted-foreground">{dims}</p>}
        {!compact && materials.length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-1" aria-label={t('materials')}>
            {materials.map((m) => (
              <li key={m} className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-primary">
                {m}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex gap-2">
          <Link
            to={to}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-white hover:bg-primary/90"
          >
            {t('viewDetails')}
          </Link>
          {!compact && (
            <button
              type="button"
              onClick={() => addToCart(belt, materials.length === 1 ? materials[0] : '')}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-accent px-3 text-sm font-semibold text-accent-text hover:bg-cta hover:text-white"
              aria-label={`${t('addToQuote')} — ${belt.nom}`}
            >
              <Plus size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{t('addToQuote')}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
