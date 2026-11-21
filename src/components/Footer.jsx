import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { families, localName } from '@/data/catalog';
import { config, whatsappLink } from '@/lib/config';

const Footer = () => {
  const { t, language, paths } = useLanguage();
  const { openFeedback } = useFeedback();

  const linkClass = 'inline-flex min-h-11 items-center text-white/85 transition-colors hover:text-accent md:min-h-9';

  return (
    <footer className="bg-primary py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-4 text-2xl font-bold text-accent">KORTIBELT</p>
            <p className="text-sm leading-relaxed text-white/85">{t('description')}</p>
          </div>

          <div>
            <h2 className="mb-4 font-bold text-accent">{t('products')}</h2>
            <ul className="text-sm">
              {families.map((fam) => (
                <li key={fam.id}>
                  <Link to={paths.family(fam)} className={linkClass}>
                    {localName(fam, language)}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={paths.products()} className={linkClass}>
                  {t('allProducts')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-bold text-accent">{t('company')}</h2>
            <ul className="text-sm">
              <li>
                <Link to={paths.about()} className={linkClass}>
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link to={paths.contact()} className={linkClass}>
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link to={paths.materials()} className={linkClass}>
                  {t('materialsTechnology')}
                </Link>
              </li>
              <li>
                <button type="button" onClick={openFeedback} className={`${linkClass} underline-offset-2 hover:underline`}>
                  {t('feedbackLink')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-bold text-accent">{t('contact')}</h2>
            <ul className="text-sm">
              <li>
                <a href={`tel:${config.contactPhone.replace(/\s/g, '')}`} className={`inline-flex items-center gap-2 ${linkClass}`}>
                  <Phone size={16} aria-hidden="true" /> {config.contactPhone}
                </a>
              </li>
              <li>
                <a href={`mailto:${config.contactEmail}`} className={`inline-flex items-center gap-2 ${linkClass}`}>
                  <Mail size={16} className="shrink-0" aria-hidden="true" /> <span className="break-all">{config.contactEmail}</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(t('whatsappDefaultMessage'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${linkClass}`}
                >
                  <MessageCircle size={16} aria-hidden="true" /> WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/85">
          <p>
            © {new Date().getFullYear()} KORTIBELT. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
