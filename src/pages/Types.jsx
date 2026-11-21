import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import ResponsiveImage from '@/components/ResponsiveImage';
import { getCategoriesOf, getSubcategoriesOf, localDescription, localName, beltCount } from '@/data/catalog';

/** Page famille : liste des catégories de la famille. */
const Types = ({ family }) => {
  const { t, language, paths } = useLanguage();
  const categories = getCategoriesOf(family.id);
  const name = localName(family, language);

  return (
    <>
      <Seo
        title={t('seoFamilyTitle', { name })}
        description={`${localDescription(family, language)} ${categories.map((c) => localName(c, language)).join(', ')}.`}
      />
      <Breadcrumbs items={[{ label: t('products'), to: paths.products() }, { label: name }]} />
      <PageHeader title={name} intro={localDescription(family, language)} />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((cat, index) => {
          const count = getSubcategoriesOf(cat.id).reduce((n, s) => n + beltCount(s.id), 0);
          return (
            <Link
              key={cat.id}
              to={paths.category(cat)}
              className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-xl"
            >
              <div className="aspect-video overflow-hidden bg-secondary">
                <ResponsiveImage
                  src={cat.imageUrl}
                  alt={localName(cat, language)}
                  priority={index < 2}
                  sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="mb-1 text-xl font-bold text-primary">{localName(cat, language)}</h2>
                <p className="mb-3 text-sm font-medium text-accent-text">{t('productsCount', { n: count })}</p>
                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{localDescription(cat, language)}</p>
                <span className="mt-auto inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white group-hover:bg-primary/90">
                  {t('seeProducts')}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Types;
