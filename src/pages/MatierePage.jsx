import MatiereComponent from '@/components/MatiereComponent';
import Seo from '@/components/Seo';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MatierePage() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={t('seoMaterialsTitle')} description={t('seoMaterialsDescription')} />
      <MatiereComponent />
    </>
  );
}
