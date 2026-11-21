import { Mail, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { config, mailtoLink, whatsappLink } from '@/lib/config';

/**
 * Solution de secours quand l'envoi échoue (réseau, reCAPTCHA bloqué, email en panne) :
 * le client envoie la même demande par email ou WhatsApp, déjà rédigée.
 */
export default function ContactFallback({ subject, body }) {
  const { t } = useLanguage();
  const btn =
    'inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-white px-4 text-sm font-semibold text-primary hover:bg-secondary';

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
      <p className="mb-3 text-sm font-medium text-primary">{t('fallbackTitle')}</p>
      <div className="flex flex-wrap gap-2">
        <a href={mailtoLink(subject, body)} className={btn}>
          <Mail size={16} aria-hidden="true" /> {t('sendByEmail')}
        </a>
        <a href={whatsappLink(`${subject}\n\n${body}`)} target="_blank" rel="noopener noreferrer" className={btn}>
          <MessageCircle size={16} aria-hidden="true" /> {t('sendByWhatsapp')}
        </a>
        <a href={`tel:${config.contactPhone.replace(/\s/g, '')}`} className={btn}>
          <Phone size={16} aria-hidden="true" /> {config.contactPhone}
        </a>
      </div>
    </div>
  );
}
