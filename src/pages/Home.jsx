import Hero from '@/components/Hero';
import WelcomeSection from '@/components/WelcomeSection';
import ProductFamilies from '@/components/FamilyComponent';
import Applications from '@/components/ApplicationComponent';
import FeaturedProducts from '@/components/FeaturedProducts';
import AboutComponent from '@/components/AboutComponent';
import MaterialComponent from '@/components/MaterialComponent';
import Seo from '@/components/Seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { organization, website } from '@/lib/structuredData';

export default function Home() {
  const { language } = useLanguage();
  return (
    <>
      <Seo jsonLd={[organization(), website(language)]} />
      <Hero />
      <ProductFamilies />
      <Applications />
      <FeaturedProducts />
      <WelcomeSection />
      <AboutComponent />
      <MaterialComponent />
    </>
  );
}
