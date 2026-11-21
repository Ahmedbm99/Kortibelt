import { useState } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpamGuard } from '@/hooks/useSpamGuard';
import FeedbackService from '@/services/FeedbackServices';
import { apiErrorKey } from '@/services/Api';
import { textareaClass } from '@/components/FormField';
import ChannelPicker from '@/components/ChannelPicker';
import WhatsAppPdfPanel from '@/components/WhatsAppPdfPanel';
import { buildFeedbackPdf } from '@/lib/documents';

function StarRating({ label, value, onChange }) {
  const { t } = useLanguage();
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-primary">{label}</legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={t('rateN', { n })}
            aria-pressed={n === value}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-accent-soft"
          >
            <Star size={26} aria-hidden="true" className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Questionnaire de satisfaction (3 notes + commentaire facultatif), envoyé par email ou WhatsApp (PDF). */
export default function Feedback({ onDone }) {
  const { t, language } = useLanguage();
  const guard = useSpamGuard();
  const [ratings, setRatings] = useState([0, 0, 0]);
  const [avis, setAvis] = useState('');
  const [channel, setChannel] = useState('email');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [pdf, setPdf] = useState(null);

  const setRating = (i) => (n) => setRatings((r) => r.map((v, j) => (j === i ? n : v)));

  const done = () => {
    toast.success(t('feedbackThanks'));
    onDone?.();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (ratings.some((r) => r === 0)) {
      setError(t('ratingRequired'));
      return;
    }
    setSending(true);
    setError('');
    try {
      if (channel === 'whatsapp') {
        setPdf(await buildFeedbackPdf({ ratings, comment: avis, t, language }));
        return;
      }
      const spam = await guard.fields('feedback_submit');
      // Les questions sont envoyées dans la langue affichée, avec la note correspondante.
      await FeedbackService.addFeedback({
        question1: t('q1'),
        reponse1: ratings[0],
        question2: t('q2'),
        reponse2: ratings[1],
        question3: t('q3'),
        reponse3: ratings[2],
        avis,
        ...spam,
      });
      done();
    } catch (err) {
      if (channel === 'whatsapp') setError(t('pdfError'));
      else setError(t(err?.message === 'captcha_unavailable' ? 'errorCaptcha' : apiErrorKey(err)));
    } finally {
      setSending(false);
    }
  };

  if (pdf) {
    return <WhatsAppPdfPanel compact file={pdf.file} message={pdf.message} onSent={done} onBack={() => setPdf(null)} />;
  }

  return (
    <form onSubmit={submit} className="relative space-y-5">
      {guard.honeypotInput}
      <StarRating label={t('q1')} value={ratings[0]} onChange={setRating(0)} />
      <StarRating label={t('q2')} value={ratings[1]} onChange={setRating(1)} />
      <StarRating label={t('q3')} value={ratings[2]} onChange={setRating(2)} />
      <div>
        <label htmlFor="feedback-comment" className="mb-1 block text-sm font-medium text-primary">
          {t('commentLabel')} <span className="font-normal text-muted-foreground">({t('optional')})</span>
        </label>
        <textarea
          id="feedback-comment"
          rows={3}
          maxLength={2000}
          value={avis}
          onChange={(e) => setAvis(e.target.value)}
          placeholder={t('commentPlaceholder')}
          className={textareaClass}
        />
      </div>
      <ChannelPicker name="feedback-channel" value={channel} onChange={setChannel} />
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={sending}
        className={`inline-flex h-11 w-full items-center justify-center rounded-md px-6 font-semibold text-white disabled:opacity-60 ${
          channel === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#1EBE57]' : 'bg-cta hover:bg-cta-hover'
        }`}
      >
        {channel === 'whatsapp' ? (sending ? t('preparingPdf') : t('preparePdf')) : sending ? t('sending') : t('submit')}
      </button>
    </form>
  );
}
