import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Seo from '@/components/Seo';

const NotFound = () => {
  const { t, paths } = useLanguage();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Seo title={t('notFoundTitle')} noindex />
      <div className="text-center">
        <p className="text-6xl font-extrabold text-accent">404</p>
        <h1 className="mt-2 text-2xl font-bold text-primary">{t('notFoundTitle')}</h1>
        <p className="mt-2 text-muted-foreground">{t('notFoundText')}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to={paths.home()} className="inline-flex h-11 items-center rounded-md bg-primary px-5 font-semibold text-white hover:bg-primary/90">
            {t('backToHome')}
          </Link>
          <Link to={paths.products()} className="inline-flex h-11 items-center rounded-md border border-border px-5 font-semibold text-primary hover:bg-secondary">
            {t('allProducts')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
