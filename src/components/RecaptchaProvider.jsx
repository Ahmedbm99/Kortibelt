import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { useLanguage } from '@/contexts/LanguageContext';
import { config } from '@/lib/config';

/** reCAPTCHA v3 (invisible) dans la langue du site ; le script est chargé en asynchrone. */
export default function RecaptchaProvider({ children }) {
  const { language } = useLanguage();
  return (
    <GoogleReCaptchaProvider reCaptchaKey={config.recaptchaSiteKey} language={language} scriptProps={{ async: true, defer: true }}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
