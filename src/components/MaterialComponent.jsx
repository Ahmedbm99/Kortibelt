import { Link } from 'react-router-dom';
import Surface from '@/assets/surface.webp';
import fibre from '@/assets/fibre.webp';
import raw from '@/assets/raw.webp';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionTitle from '@/components/SectionTitle';

const ITEMS = [
  { key: 'surfaceClassification', image: Surface, id: 1 },
  { key: 'fiberClassification', image: fibre, id: 2 },
  { key: 'rawClassification', image: raw, id: 3 },
];

export default function MaterialComponent() {
  const { t, paths } = useLanguage();

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <SectionTitle>{t('materialsTechnology')}</SectionTitle>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ITEMS.map((item) => (
            <Link
              key={item.key}
              to={paths.materials(item.id)}
              className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-xl"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="mb-4 text-xl font-semibold text-primary">{t(item.key)}</h3>
                <span className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-white group-hover:bg-primary/90">
                  {t('readMore')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
