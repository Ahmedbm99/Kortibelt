import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionTitle from '@/components/SectionTitle';
import ProductCard from '@/components/ProductCard';
import { belts, beltImages, subcategories } from '@/data/catalog';

// Un produit avec photo par sous-catégorie, pour montrer la diversité de la gamme.
const featured = subcategories
  .map((s) => belts.find((b) => b.subcategory_id === s.id && beltImages(b).length > 0))
  .filter(Boolean)
  .slice(0, 8);

const FeaturedProducts = () => {
  const { t, paths } = useLanguage();

  return (
    <section id="produits" className="bg-secondary py-16 md:py-20">
      <div className="container mx-auto px-4">
        <SectionTitle>{t('FeaturedProducts')}</SectionTitle>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((belt) => (
            <ProductCard key={belt.id} belt={belt} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to={paths.products()} className="inline-flex h-12 items-center rounded-md bg-primary px-7 font-semibold text-white hover:bg-primary/90">
            {t('allProducts')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
