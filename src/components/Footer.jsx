import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Linkedin, Mail, Phone, Globe,  } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-blue-950 py-12 z-50">
      <div className="container mx-auto px-4">

        <div className="grid md:grid-cols-4 gap-8 mb-8">

          {/* LOGO + DESCRIPTION */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-orange-600">KORTIBELT</h3>
              
            <p className="text-white text-sm leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* PRODUITS */}
          <div>
            <h4 className="font-bold mb-4 text-orange-600">{t("products")}</h4>
            <ul className="space-y-2 text-sm text-white">
              <li><a href="#" className="hover:text-accent transition-colors">{t("p1")}</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">{t("p2")}</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">{t("p3")}</a></li>
            </ul>
          </div>

          {/* ENTREPRISE */}
          <div>
            <h4 className="font-bold mb-4 text-orange-600">{t("company")}</h4>
            <ul className="space-y-2 text-sm text-white">
              <li><a href="#about" className="hover:text-accent transition-colors">{t("about")}</a></li>
              <li><a href="#contact" className="hover:text-accent transition-colors">{t("contact")}</a></li>
            </ul>
          </div>

          {/* CONTACT & SOCIAL */}
          <div>
            <h4 className="font-bold mb-4 text-orange-600">{t("follow")}</h4>

            <div className="flex flex-col gap-2 text-white text-sm">
            </div>

            <div className="flex gap-4 mt-4">
              <a className="w-10 h-10 text-white hover:bg-accent rounded-full flex items-center justify-center transition-all hover:scale-110">
                <Facebook size={20} />
              </a>
              <a className="w-10 h-10 text-white hover:bg-accent rounded-full flex items-center justify-center transition-all hover:scale-110">
                <Linkedin size={20} />
              </a>
              <a className="w-10 h-10 text-white hover:bg-accent rounded-full flex items-center justify-center transition-all hover:scale-110">
                <Mail size={20} />
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/20 text-center text-sm text-white">
          <p>© {new Date().getFullYear()} KORTIBELT. {t("rights")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
