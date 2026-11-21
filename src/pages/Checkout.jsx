import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import PageHeader from '@/components/PageHeader';
import FormField, { inputClass, textareaClass } from '@/components/FormField';
import ContactFallback from '@/components/ContactFallback';
import ChannelPicker from '@/components/ChannelPicker';
import WhatsAppPdfPanel from '@/components/WhatsAppPdfPanel';
import { useSpamGuard } from '@/hooks/useSpamGuard';
import Seo from '@/components/Seo';
import ContactService from '@/services/ContactServices';
import { apiErrorKey } from '@/services/Api';
import { validateFields } from '@/lib/validation';
import { buildQuotePdf } from '@/lib/documents';

// Par WhatsApp, l'email devient facultatif : le client est joignable sur WhatsApp.
const rulesFor = (channel) => ({
  name: { required: true },
  email: { required: channel === 'email', email: true },
  phone: { required: true, phone: true },
});

/** Texte brut de la demande, pour l'email / WhatsApp de secours. */
const summaryText = (items, form) =>
  [
    ...items.map((i) => `- ${i.nom}${i.material ? ` (${i.material})` : ''} × ${i.quantity}${i.note ? ` — ${i.note}` : ''}`),
    '',
    form.name && `${form.name}${form.company ? ` — ${form.company}` : ''}`,
    form.phone,
    form.message,
  ]
    .filter((l) => l !== undefined && l !== false)
    .join('\n');

const Checkout = () => {
  const { t, language, paths } = useLanguage();
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const guard = useSpamGuard();

  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', message: '' });
  const [channel, setChannel] = useState('email');
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [pdf, setPdf] = useState(null); // { file, message } une fois le PDF WhatsApp prêt

  if (items.length === 0) return <Navigate to={paths.cart()} replace />;

  const set = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  /** Demande envoyée (email ou WhatsApp) : page de remerciement, puis on vide la demande. */
  const finish = (sentChannel) => {
    const summary = items.map(({ key, nom, material, quantity }) => ({ key, nom, material, quantity }));
    navigate(paths.thanks(), { replace: true, state: { summary, email: form.email, channel: sentChannel } });
    clearCart();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const found = validateFields(form, rulesFor(channel));
    setErrors(found);
    if (Object.keys(found).length) {
      setSubmitError('errorForm');
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setSending(true);
    setSubmitError('');
    try {
      if (channel === 'whatsapp') {
        setPdf(await buildQuotePdf({ items, form, t, language }));
        return;
      }
      const spam = await guard.fields('quote_submit');
      await ContactService.sendQuote({
        ...form,
        ...spam,
        products: items.map((i) => ({
          id: i.id,
          name: i.nom,
          reference: i.reference || i.profil,
          material: i.material,
          note: i.note,
          quantity: i.quantity,
        })),
      });
      finish('email');
    } catch (err) {
      if (channel === 'whatsapp') setSubmitError('pdfError');
      else setSubmitError(err?.message === 'captcha_unavailable' ? 'errorCaptcha' : apiErrorKey(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <Seo title={t('quoteFormTitle')} noindex />
      <PageHeader title={t('quoteFormTitle')} intro={t('quoteFormIntro')} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        {pdf ? (
          <WhatsAppPdfPanel file={pdf.file} message={pdf.message} onSent={() => finish('whatsapp')} onBack={() => setPdf(null)} />
        ) : (
          <form onSubmit={submit} noValidate className="relative space-y-5 rounded-xl bg-white p-6 shadow-md">
            {guard.honeypotInput}
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label={t('nameLabel')} required error={errors.name && t(errors.name)}>
                <input type="text" autoComplete="name" value={form.name} onChange={(e) => set('name')(e.target.value)} className={inputClass} />
              </FormField>
              <FormField label={t('companyLabel')}>
                <input type="text" autoComplete="organization" value={form.company} onChange={(e) => set('company')(e.target.value)} className={inputClass} />
              </FormField>
              <FormField label={t('emailLabel')} required={channel === 'email'} error={errors.email && t(errors.email)}>
                <input type="email" autoComplete="email" value={form.email} onChange={(e) => set('email')(e.target.value)} className={inputClass} />
              </FormField>
              <FormField label={t('phoneLabel')} required error={errors.phone && t(errors.phone)}>
                <PhoneInput international defaultCountry="TN" autoComplete="tel" value={form.phone} onChange={(v) => set('phone')(v || '')} />
              </FormField>
            </div>
            <FormField label={t('messageLabel')}>
              <textarea rows={4} value={form.message} onChange={(e) => set('message')(e.target.value)} className={textareaClass} />
            </FormField>

            <ChannelPicker name="quote-channel" value={channel} onChange={setChannel} />

            {submitError && (
              <div role="alert" className="space-y-3">
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-destructive">{t(submitError)}</p>
                {submitError !== 'errorForm' && <ContactFallback subject={t('quoteFormTitle')} body={summaryText(items, form)} />}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              aria-busy={sending}
              className={`inline-flex h-12 w-full items-center justify-center rounded-md px-6 text-lg font-semibold text-white disabled:opacity-60 ${
                channel === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#1EBE57]' : 'bg-cta hover:bg-cta-hover'
              }`}
            >
              {channel === 'whatsapp' ? (sending ? t('preparingPdf') : t('preparePdf')) : sending ? t('sending') : t('sendQuote')}
            </button>
            {channel === 'email' && <p className="text-xs text-muted-foreground">{t('captchaNotice')}</p>}
          </form>
        )}

        <aside className="h-fit rounded-xl bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">{t('yourRequest')}</h2>
            <Link to={paths.cart()} className="inline-flex min-h-10 items-center text-sm font-semibold text-accent-text hover:underline">
              {t('editRequest')}
            </Link>
          </div>
          <ul className="divide-y divide-border text-sm">
            {items.map((i) => (
              <li key={i.key} className="py-2">
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-primary">{i.nom}</span>
                  <span className="shrink-0 font-semibold">× {i.quantity}</span>
                </div>
                {(i.material || i.note) && <p className="text-muted-foreground">{[i.material, i.note].filter(Boolean).join(' · ')}</p>}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
