import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/** Bascule FR / EN : affiche les deux langues, la langue active en surbrillance. */
export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const next = language === 'fr' ? 'en' : 'fr';

  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      title={t('switchLanguage')}
      aria-label={t('switchLanguage')}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-3 text-sm font-semibold text-primary transition-colors hover:border-accent"
    >
      <Globe size={16} aria-hidden="true" />
      <span className={language === 'fr' ? 'text-accent-text' : 'text-muted-foreground'}>FR</span>
      <span aria-hidden="true" className="text-border">|</span>
      <span className={language === 'en' ? 'text-accent-text' : 'text-muted-foreground'}>EN</span>
    </button>
  );
}
