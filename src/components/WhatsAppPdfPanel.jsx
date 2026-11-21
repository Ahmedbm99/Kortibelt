import { useState } from 'react';
import { Check, Download, ExternalLink, FileText, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { canShareFile, downloadFile, shareFile } from '@/lib/share';
import { config, whatsappLink } from '@/lib/config';

const formatSize = (bytes, language) => {
  const [kb, mb] = language === 'en' ? ['KB', 'MB'] : ['Ko', 'Mo'];
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} ${kb}` : `${(bytes / 1024 / 1024).toFixed(1)} ${mb}`;
};

/**
 * Étape finale d'un envoi WhatsApp : le PDF est prêt, le visiteur l'envoie lui-même.
 * - Téléphone (ou navigateur compatible) : bouton de partage → WhatsApp avec le PDF joint.
 * - Sinon : 1) télécharger le PDF  2) ouvrir la discussion WhatsApp  3) joindre le fichier.
 * Chaque action est un clic direct (exigé par les navigateurs pour le partage et les fenêtres).
 */
export default function WhatsAppPdfPanel({ file, message, onSent, onBack, compact = false }) {
  const { t, language } = useLanguage();
  const [downloaded, setDownloaded] = useState(false);
  const [shareFailed, setShareFailed] = useState(false);
  const shareable = canShareFile(file) && !shareFailed;

  const share = async () => {
    const result = await shareFile(file, message);
    if (result === 'unsupported') setShareFailed(true);
  };

  const download = () => {
    downloadFile(file);
    setDownloaded(true);
  };

  const step = 'flex h-11 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold';

  return (
    <div className={`space-y-4 ${compact ? '' : 'rounded-xl bg-white p-6 shadow-md'}`} role="region" aria-label={t('pdfReady')}>
      <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
        <FileText className="shrink-0 text-accent" size={28} aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-semibold text-primary">{t('pdfReady')}</p>
          <p className="truncate text-xs text-muted-foreground">
            {file.name} · {formatSize(file.size, language)}
          </p>
        </div>
      </div>

      {shareable ? (
        <>
          <button type="button" onClick={share} className={`${step} bg-[#25D366] text-white hover:bg-[#1EBE57]`}>
            <Share2 size={18} aria-hidden="true" /> {t('sharePdfWhatsapp')}
          </button>
          <p className="text-xs text-muted-foreground">{t('sharePdfHint', { phone: config.contactPhone })}</p>
          <details className="text-sm">
            <summary className="cursor-pointer font-medium text-primary">{t('shareOtherWay')}</summary>
            <ManualSteps {...{ t, download, downloaded, message, step }} />
          </details>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{t('manualIntro')}</p>
          <ManualSteps {...{ t, download, downloaded, message, step }} />
        </>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-between">
        {onBack && (
          <button type="button" onClick={onBack} className="h-11 rounded-md px-4 text-sm font-semibold text-muted-foreground hover:text-primary">
            {t('editRequest')}
          </button>
        )}
        <button
          type="button"
          onClick={onSent}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          <Check size={18} aria-hidden="true" /> {t('pdfSentDone')}
        </button>
      </div>
    </div>
  );
}

function ManualSteps({ t, download, downloaded, message, step }) {
  return (
    <ol className="mt-3 space-y-3">
      <li>
        <p className="mb-1 text-sm font-medium text-primary">1. {t('stepDownload')}</p>
        <button type="button" onClick={download} className={`${step} border border-border bg-white text-primary hover:bg-secondary`}>
          {downloaded ? <Check size={18} className="text-green-600" aria-hidden="true" /> : <Download size={18} aria-hidden="true" />}
          {downloaded ? t('downloaded') : t('downloadPdf')}
        </button>
      </li>
      <li>
        <p className="mb-1 text-sm font-medium text-primary">2. {t('stepOpenChat')}</p>
        <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className={`${step} bg-[#25D366] text-white hover:bg-[#1EBE57]`}>
          <ExternalLink size={18} aria-hidden="true" /> {t('openWhatsappChat')}
        </a>
      </li>
      <li className="text-sm text-muted-foreground">3. {t('stepAttach')}</li>
    </ol>
  );
}
