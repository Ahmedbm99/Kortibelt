import { Link } from 'react-router-dom';
import { Cog, Layers, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionTitle from '@/components/SectionTitle';
import { families, getCategoriesOf, localDescription, localName } from '@/data/catalog';

const ICONS = [Cog, Zap, Layers];

const ProductFamilies = () => {
  const { t, language, paths } = useLanguage();

  return (
    <section id="famille" className="bg-secondary py-16 md:py-20">
      <div className="container mx-auto px-4">
        <SectionTitle>{t('categories')}</SectionTitle>
        <div className="grid gap-6 md:grid-cols-3">
          {families.map((family, index) => {
            const Icon = ICONS[index % ICONS.length];
            const cats = getCategoriesOf(family.id);
            return (
              <Link
                key={family.id}
                to={paths.family(family)}
                className="group flex flex-col rounded-xl bg-white p-8 text-center shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
                  <Icon className="text-accent" size={32} aria-hidden="true" />
                </span>
                <h3 className="mb-3 text-xl font-bold text-primary">{localName(family, language)}</h3>
                <p className="mb-4 text-muted-foreground">{localDescription(family, language)}</p>
                <p className="mt-auto text-sm font-semibold text-accent-text">
                  {cats.map((c) => localName(c, language)).slice(0, 3).join(' · ')}
                  {cats.length > 3 ? ' …' : ''}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductFamilies;
