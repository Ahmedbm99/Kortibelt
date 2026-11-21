import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { parsePath } from '@/lib/paths';
import { whatsappLink } from '@/lib/config';
import { storage } from '@/lib/storage';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

const DISMISS_KEY = 'kortibelt_whatsapp_dismissed';
// Pas de bulle automatique sur les formulaires : elle couvrirait les champs.
const QUIET_PAGES = ['cart', 'checkout', 'contact', 'thanks'];


export default function WhatsAppButton() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Message prérempli avec le produit consulté.
  const info = parsePath(pathname);
  const belt = info.page === 'belt' ? info.belt : null;
  const message = belt ? t('whatsappProductMessage', { name: belt.nom }) : t('whatsappDefaultMessage');
  const quiet = QUIET_PAGES.includes(info.page);

  // Bulle d'aide une seule fois, après 8 s, hors formulaires, si l'utilisateur ne l'a pas déjà fermée.
  useEffect(() => {
    if (quiet || storage.get(DISMISS_KEY)) return undefined;
    const timer = setTimeout(() => setOpen(true), 8000);
    return () => clearTimeout(timer);
  }, [quiet]);

  const dismiss = () => {
    setOpen(false);
    storage.set(DISMISS_KEY, '1');
  };

  return (
    // Sur téléphone, le bouton flottant masquerait les champs des formulaires (qui proposent déjà WhatsApp).
    <div className={`fixed bottom-4 right-4 z-40 flex-col items-end sm:bottom-5 sm:right-5 ${quiet ? 'hidden md:flex' : 'flex'}`}>
      {open && !quiet && (
        <div role="dialog" aria-label={t('whatsappAssistance')} className="absolute bottom-full right-0 mb-3 w-[min(16rem,calc(100vw-2rem))] animate-fade-in-up rounded-xl bg-white p-4 shadow-2xl">
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="font-semibold text-primary">{t('whatsappAssistance')}</p>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t('closeBubble')}
              className="-mr-2 -mt-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">{t('whatsappBubbleText')}</p>
          <p className="mb-3 rounded-md border-l-4 border-[#25D366] bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
            <strong>{t('available')}</strong> {t('availabilityTime')}
          </p>
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#25D366] font-semibold text-white hover:bg-[#1EBE57]"
          >
            <WhatsAppIcon /> {t('chatOnWhatsApp')}
          </a>
        </div>
      )}
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('whatsappHelp')}
        title={t('whatsappHelp')}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] sm:h-14 sm:w-14 text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#1EBE57]"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
