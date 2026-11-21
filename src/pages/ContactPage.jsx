import { useState } from 'react';
import { CheckCircle, Globe, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import { useLanguage } from '@/contexts/LanguageContext';
import PageHeader from '@/components/PageHeader';
import FormField, { inputClass, textareaClass } from '@/components/FormField';
import ContactFallback from '@/components/ContactFallback';
import { useSpamGuard } from '@/hooks/useSpamGuard';
import Seo from '@/components/Seo';
import ContactService from '@/services/ContactServices';
import { apiErrorKey } from '@/services/Api';
import { validateFields } from '@/lib/validation';
import { config } from '@/lib/config';
import ChannelPicker from '@/components/ChannelPicker';
import WhatsAppPdfPanel from '@/components/WhatsAppPdfPanel';
import { buildContactPdf } from '@/lib/documents';

// Par WhatsApp, l'email devient facultatif : le client est joignable sur WhatsApp.
const rulesFor = (channel) => ({
  name: { required: true },
  email: { required: channel === 'email', email: true },
  phone: { phone: true },
  message: { required: true },
});
const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactPage() {
  const { t, language } = useLanguage();
  const guard = useSpamGuard();

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [sent, setSent] = useState(null); // 'email' | 'whatsapp' une fois envoyé
  const [channel, setChannel] = useState('email');
  const [pdf, setPdf] = useState(null);

  const set = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
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
        setPdf(await buildContactPdf({ form, t, language }));
        return;
      }
      const spam = await guard.fields('contact_submit');
      await ContactService.sendMessage({ ...form, ...spam });
      setSent('email');
      setForm(EMPTY);
    } catch (err) {
      if (channel === 'whatsapp') setSubmitError('pdfError');
      else setSubmitError(err?.message === 'captcha_unavailable' ? 'errorCaptcha' : apiErrorKey(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <Seo title={t('seoContactTitle')} description={t('seoContactDescription', { phone: config.contactPhone })} />
      <PageHeader title={t('contactDistribution')} intro={t('contactIntro')} />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="h-fit space-y-6 rounded-xl bg-white p-6 shadow-md">
          <Info icon={MapPin} title={t('address')}>
            {t('industrialZone')}
            <br />
            {t('tunisia')}
          </Info>
          <Info icon={Phone} title={t('phone')}>
            <a href={`tel:${config.contactPhone.replace(/\s/g, '')}`} className="hover:underline">
              {config.contactPhone}
            </a>
          </Info>
          <Info icon={Mail} title={t('email')}>
            <a href={`mailto:${config.contactEmail}`} className="hover:underline">
              {config.contactEmail}
            </a>
          </Info>
          <Info icon={MessageSquare} title="WeChat">
            medfakhfakh
          </Info>
          <Info icon={Globe} title={t('website')}>
            <a href="https://www.aisgroup.tn" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-text hover:underline">
              aisgroup.tn
            </a>
          </Info>
        </div>

        {sent ? (
          <div role="status" className="rounded-xl bg-white p-8 text-center shadow-md">
            <CheckCircle className="mx-auto mb-4 h-14 w-14 text-green-600" aria-hidden="true" />
            <p className="text-xl font-bold text-primary">{t('messageSent')}</p>
            <p className="mt-2 text-muted-foreground">{t(sent === 'whatsapp' ? 'whatsappReply' : 'receiptSent')}</p>
            <button
              type="button"
              onClick={() => setSent(null)}
              className="mt-6 inline-flex h-11 items-center rounded-md border border-border px-5 font-semibold text-primary hover:bg-secondary"
            >
              {t('sendMessage')}
            </button>
          </div>
        ) : pdf ? (
          <WhatsAppPdfPanel
            file={pdf.file}
            message={pdf.message}
            onBack={() => setPdf(null)}
            onSent={() => {
              setPdf(null);
              setForm(EMPTY);
              setSent('whatsapp');
            }}
          />
        ) : (
          <form onSubmit={submit} noValidate className="relative space-y-5 rounded-xl bg-white p-6 shadow-md">
            {guard.honeypotInput}
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label={t('nameLabel')} required error={errors.name && t(errors.name)}>
                <input type="text" autoComplete="name" value={form.name} onChange={(e) => set('name')(e.target.value)} className={inputClass} />
              </FormField>
              <FormField label={t('emailLabel')} required={channel === 'email'} error={errors.email && t(errors.email)}>
                <input type="email" autoComplete="email" value={form.email} onChange={(e) => set('email')(e.target.value)} className={inputClass} />
              </FormField>
              <FormField label={t('phoneLabel')} error={errors.phone && t(errors.phone)}>
                <PhoneInput international defaultCountry="TN" autoComplete="tel" value={form.phone} onChange={(v) => set('phone')(v || '')} />
              </FormField>
              <FormField label={t('subjectLabel')}>
                <input type="text" value={form.subject} onChange={(e) => set('subject')(e.target.value)} className={inputClass} />
              </FormField>
            </div>
            <FormField label={t('messageLabel')} required error={errors.message && t(errors.message)}>
              <textarea rows={5} value={form.message} onChange={(e) => set('message')(e.target.value)} className={textareaClass} />
            </FormField>

            <ChannelPicker name="contact-channel" value={channel} onChange={setChannel} />

            {submitError && (
              <div role="alert" className="space-y-3">
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-destructive">{t(submitError)}</p>
                {submitError !== 'errorForm' && (
                  <ContactFallback subject={form.subject || t('contact')} body={`${form.message}\n\n${form.name}\n${form.phone}`} />
                )}
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
              {channel === 'whatsapp' ? (sending ? t('preparingPdf') : t('preparePdf')) : sending ? t('sending') : t('sendMessage')}
            </button>
            {channel === 'email' && <p className="text-xs text-muted-foreground">{t('captchaNotice')}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

function Info({ icon, title, children }) {
  const Icon = icon;
  return (
    <div className="flex items-start gap-4">
      <Icon className="mt-0.5 shrink-0 text-accent" size={24} aria-hidden="true" />
      <div>
        <h2 className="font-semibold text-primary">{title}</h2>
        <p className="text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
