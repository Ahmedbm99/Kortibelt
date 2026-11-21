import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import ResponsiveImage from '@/components/ResponsiveImage';
import { beltCount, getFamily, getSubcategoriesOf, localDescription, localName } from '@/data/catalog';

/** Page catégorie : liste de ses sous-catégories. */
const SubCategory = ({ category }) => {
  const { t, language, paths } = useLanguage();
  const family = getFamily(category.famille_id);
  const subs = getSubcategoriesOf(category.id);
  const name = localName(category, language);

  return (
    <>
      <Seo title={t('seoCategoryTitle', { name, family: localName(family, language) })} description={localDescription(category, language)} />
      <Breadcrumbs
        items={[
          { label: t('products'), to: paths.products() },
          { label: localName(family, language), to: paths.family(family) },
          { label: name },
        ]}
      />
      <PageHeader title={name} intro={localDescription(category, language)} />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {subs.map((sub, index) => (
          <Link
            key={sub.id}
            to={paths.subcategory(sub)}
            className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-xl"
          >
            <div className="aspect-video overflow-hidden bg-secondary">
              <ResponsiveImage
                src={sub.imageUrl}
                alt={localName(sub, language)}
                priority={index < 2}
                sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h2 className="mb-1 text-xl font-bold text-primary">{localName(sub, language)}</h2>
              <p className="mb-3 text-sm font-medium text-accent-text">{t('productsCount', { n: beltCount(sub.id) })}</p>
              {language === 'fr' && sub.seoDescription && (
                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{sub.seoDescription}</p>
              )}
              <span className="mt-auto inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white group-hover:bg-primary/90">
                {t('seeProducts')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default SubCategory;
