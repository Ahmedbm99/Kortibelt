import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import classificationData from '@/data/data.js';
import { useLanguage } from '@/contexts/LanguageContext';
import { assetExists } from '@/lib/asset';

const CLASSIFICATIONS = Object.values(classificationData);
const TITLE_KEYS = { 1: 'surfaceClassification', 2: 'fiberClassification', 3: 'rawClassification' };

/** Classification des matières ; ?id= choisit la classification (lien depuis l'accueil). */
export default function MatiereComponent() {
  const { t, language } = useLanguage();
  const [params, setParams] = useSearchParams();
  const index = Math.max(0, CLASSIFICATIONS.findIndex((c) => String(c.id) === params.get('id')));
  const current = CLASSIFICATIONS[index];

  if (!current) return <p className="py-10 text-center">{t('noData')}</p>;

  const go = (i) => {
    const next = CLASSIFICATIONS[(i + CLASSIFICATIONS.length) % CLASSIFICATIONS.length];
    setParams({ id: String(next.id) });
  };

  const navButton =
    'inline-flex h-11 items-center gap-1 rounded-md border border-border bg-white px-4 text-sm font-semibold text-primary hover:bg-secondary';

  return (
    <section className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary md:text-4xl">{t(TITLE_KEYS[current.id] || 'materialsTechnology')}</h1>
          <div className="mt-3 h-1 w-20 bg-accent" />
        </div>
        <nav className="flex w-full items-center justify-between gap-2 sm:w-auto" aria-label={t('materialsTechnology')}>
          <button type="button" onClick={() => go(index - 1)} className={navButton}>
            <ChevronLeft size={18} aria-hidden="true" /> {t('previous')}
          </button>
          <span className="px-1 text-sm text-muted-foreground">
            <span className="sm:hidden">{index + 1} / {CLASSIFICATIONS.length}</span>
            <span className="hidden sm:inline">{t('classificationNav', { i: index + 1, n: CLASSIFICATIONS.length })}</span>
          </span>
          <button type="button" onClick={() => go(index + 1)} className={navButton}>
            {t('next')} <ChevronRight size={18} aria-hidden="true" />
          </button>
        </nav>
      </div>

      {(current.types || []).map((type) => {
        const images = (type.images || []).filter(assetExists);
        return (
          <article key={type.id} className="mb-12 animate-fade-in-up">
            <h2 className="mb-4 text-2xl font-bold capitalize text-primary">{type.name[language] || type.name.fr}</h2>
            {type.properties?.length > 0 && (
              <ol className="mb-6 list-inside list-decimal space-y-2 rounded-xl bg-white p-6 text-primary/90 shadow-sm">
                {type.properties.map((prop, i) => (
                  <li key={i}>{prop[language] || prop.fr}</li>
                ))}
              </ol>
            )}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {images.map((img, i) => (
                  <figure key={img} className="overflow-hidden rounded-lg shadow-sm">
                    <img
                      src={img}
                      alt={`${type.name[language] || type.name.fr} ${i + 1}`}
                      loading="lazy"
                      className="h-44 w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </figure>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
