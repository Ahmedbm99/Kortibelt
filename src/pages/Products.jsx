import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchX, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import Seo from '@/components/Seo';
import { APPLICATIONS, belts, getSubcategoriesOf, localName, pathOfSubcategory, searchBelts } from '@/data/catalog';
import { itemList } from '@/lib/structuredData';

const PER_PAGE = 12;

/** Liste de produits : toutes, ou d'une sous-catégorie ; filtres ?application=, recherche ?q=, page ?page=. */
const Products = ({ subcategory: sub = null }) => {
  const { t, language, paths } = useLanguage();
  const [params, setParams] = useSearchParams();
  const topRef = useRef(null);

  const q = params.get('q') || '';
  const application = APPLICATIONS.includes(params.get('application')) ? params.get('application') : '';
  const { family, category } = sub ? pathOfSubcategory(sub.id) : {};

  let list = belts;
  if (sub) list = list.filter((b) => b.subcategory_id === sub.id);
  if (application) list = list.filter((b) => b.application === application);
  list = searchBelts(list, q);

  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(Math.max(1, Number(params.get('page')) || 1), totalPages);
  const visible = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Catégorie à sous-catégorie unique : on affiche le nom de la catégorie.
  const title = sub ? localName(getSubcategoriesOf(category.id).length === 1 ? category : sub, language) : application ? t(`title${application}`) : t('allProducts');
  const singleSub = sub && getSubcategoriesOf(category.id).length === 1;
  const seoTitle = sub
    ? language === 'fr' && sub.seoTitle
      ? sub.seoTitle
      : t('seoSubTitle', { name: localName(sub, language), category: localName(category, language) })
    : application
      ? t('seoApplicationTitle', { a: t(`title${application}`) })
      : t('seoProductsTitle');
  const seoDescription =
    sub && language === 'fr' && sub.seoDescription
      ? sub.seoDescription
      : t('seoProductsDescription', { list: list.slice(0, 6).map((b) => b.profil || b.nom).join(', ') });

  // Remonter en haut de la liste quand la page change.
  useEffect(() => {
    if (params.get('page')) topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /** Modifie un paramètre d'URL ; tout changement de filtre revient à la page 1. */
  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  const hasFilters = Boolean(q || application);

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        noindex={Boolean(q) || page > 1}
        jsonLd={itemList(visible.map((b) => ({ url: paths.belt(b), name: b.nom })))}
      />
      <Breadcrumbs
        items={
          sub
            ? [
                { label: t('products'), to: paths.products() },
                { label: localName(family, language), to: paths.family(family) },
                singleSub
                  ? { label: localName(category, language) }
                  : { label: localName(category, language), to: paths.category(category) },
                !singleSub && { label: localName(sub, language) },
              ]
            : [{ label: t('products') }]
        }
      />
      <div ref={topRef} className="scroll-mt-28" />
      <PageHeader title={title}>
        <div className="mt-4 flex flex-wrap items-center gap-2" aria-live="polite">
          <span className="text-sm font-medium text-muted-foreground">{t('resultsCount', { n: list.length })}</span>
          {q && (
            <FilterChip label={t('searchFor', { q })} onRemove={() => setParam('q', '')} removeLabel={t('removeFilter')} />
          )}
          {application && (
            <FilterChip
              label={t('applicationFilter', { a: t(`title${application}`) })}
              onRemove={() => setParam('application', '')}
              removeLabel={t('removeFilter')}
            />
          )}
        </div>
      </PageHeader>

      {list.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <SearchX className="mx-auto mb-4 text-muted-foreground" size={48} aria-hidden="true" />
          <p className="text-lg font-semibold text-primary">{t('noResults')}</p>
          <p className="mt-1 text-muted-foreground">{t('noResultsHint')}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {hasFilters && (
              <button
                type="button"
                onClick={() => setParams(new URLSearchParams())}
                className="h-11 rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary/90"
              >
                {t('clearFilters')}
              </button>
            )}
            <Link to={paths.home()} className="inline-flex h-11 items-center rounded-md border border-border px-5 text-sm font-semibold text-primary hover:bg-secondary">
              {t('browseFamilies')}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((belt, index) => (
              <ProductCard key={belt.id} belt={belt} headingLevel={2} priority={index < 2} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label={t('pagination')} className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setParam('page', String(page - 1))}
                className="h-11 rounded-md border border-border bg-white px-5 text-sm font-semibold text-primary hover:bg-secondary disabled:opacity-40"
              >
                {t('previous')}
              </button>
              <span className="text-sm font-semibold text-primary">{t('pageOf', { page, total: totalPages })}</span>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setParam('page', String(page + 1))}
                className="h-11 rounded-md border border-border bg-white px-5 text-sm font-semibold text-primary hover:bg-secondary disabled:opacity-40"
              >
                {t('next')}
              </button>
            </nav>
          )}
        </>
      )}
    </>
  );
};

function FilterChip({ label, onRemove, removeLabel }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft py-1 pl-3 pr-1 text-sm font-medium text-primary">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${removeLabel} : ${label}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-cta hover:text-white"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </span>
  );
}

export default Products;
