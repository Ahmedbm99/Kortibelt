import { Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { preloadPdf } from '@/lib/pdf';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

function WhatsAppGlyph() {
  return <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />;
}

/** Choix du canal d'envoi d'un formulaire : email (via le serveur) ou WhatsApp (PDF envoyé par le visiteur). */
export default function ChannelPicker({ value, onChange, name }) {
  const { t } = useLanguage();
  const options = [
    { value: 'email', label: t('channelEmail'), hint: t('channelEmailHint'), icon: <Mail size={20} className="text-primary" aria-hidden="true" /> },
    { value: 'whatsapp', label: t('channelWhatsapp'), hint: t('channelWhatsappHint'), icon: <WhatsAppGlyph /> },
  ];

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-primary">{t('channelLegend')}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/40 ${
              value === o.value ? 'border-accent bg-accent-soft' : 'border-border bg-white hover:border-accent/60'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => {
                if (o.value === 'whatsapp') preloadPdf().catch(() => {});
                onChange(o.value);
              }}
              className="sr-only"
            />
            <span className="mt-0.5">{o.icon}</span>
            <span>
              <span className="block font-semibold text-primary">{o.label}</span>
              <span className="block text-xs text-muted-foreground">{o.hint}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
