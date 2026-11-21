import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import Seo from '@/components/Seo';
import { config } from '@/lib/config';

const ThankYou = () => {
  const { t, paths } = useLanguage();
  const { openFeedback } = useFeedback();
  const { state } = useLocation();
  const summary = state?.summary || [];

  return (
    <div className="container mx-auto flex max-w-2xl flex-col items-center px-4 py-16">
      <Seo title={t('thankYouTitle')} noindex />
      <div className="w-full rounded-xl bg-white p-8 text-center shadow-lg sm:p-10">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" aria-hidden="true" />
        <h1 className="text-3xl font-bold text-primary">{t('thankYouTitle')}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t(state?.channel === 'whatsapp' ? 'whatsappReply' : 'responseTime')}</p>
        {state?.channel !== 'whatsapp' && state?.email && <p className="mt-1 text-sm text-muted-foreground">{t('receiptSent')}</p>}

        {summary.length > 0 && (
          <div className="mt-6 rounded-lg bg-secondary p-4 text-left">
            <h2 className="mb-2 font-semibold text-primary">{t('yourRequest')}</h2>
            <ul className="space-y-1 text-sm">
              {summary.map((i) => (
                <li key={i.key} className="flex justify-between gap-3">
                  <span>
                    {i.nom}
                    {i.material ? ` (${i.material})` : ''}
                  </span>
                  <span className="font-semibold">× {i.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-sm text-muted-foreground">
          {t('urgent', { phone: config.contactPhone })}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to={paths.products()} className="inline-flex h-11 items-center justify-center rounded-md bg-cta px-6 font-semibold text-white hover:bg-cta-hover">
            {t('browseMore')}
          </Link>
          <button
            type="button"
            onClick={openFeedback}
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 font-semibold text-primary hover:bg-secondary"
          >
            {t('giveFeedback')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
