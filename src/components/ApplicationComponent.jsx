import { Link } from 'react-router-dom';
import { Car, Factory, Package, Tractor } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionTitle from '@/components/SectionTitle';
import { applicationCount } from '@/data/catalog';

// Les clés correspondent au champ `application` des courroies ; les tuiles sans produit sont masquées.
const APPLICATIONS = [
  { key: 'industry', icon: Factory },
  { key: 'automotive', icon: Car },
  { key: 'agriculture', icon: Tractor },
  { key: 'conveyors', icon: Package },
];

const Applications = () => {
  const { t, paths } = useLanguage();
  const items = APPLICATIONS.filter((a) => applicationCount(a.key) > 0);

  return (
    <section id="applications" className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <SectionTitle>{t('titleapplications')}</SectionTitle>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {items.map(({ key, icon }) => {
            const Icon = icon;
            return (
              <Link
                key={key}
                to={paths.products({ application: key })}
                className="group rounded-xl bg-white p-6 text-center shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft transition-transform group-hover:scale-110">
                  <Icon className="text-accent" size={28} aria-hidden="true" />
                </span>
                <h3 className="mb-1 text-lg font-bold text-primary">{t(`title${key}`)}</h3>
                <p className="text-sm text-muted-foreground">{t(`description${key}`)}</p>
                <p className="mt-2 text-xs font-semibold text-accent-text">{t('productsCount', { n: applicationCount(key) })}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Applications;
