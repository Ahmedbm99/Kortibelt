import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Users, TrendingUp } from 'lucide-react';

const AboutComponent = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Award, value: '20+', label: t('Aboutexperience') },
    { icon: Users, value: '500+', label: t('AboutSatisfaction') },
    { icon: TrendingUp, value: '98%', label: t('AboutPercentage') },
  ];

  return (
    <>
      {/* ABOUT SECTION */}
      <section id="about" className="py-20 bg-blue-950 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* LEFT TEXT */}
            <div className="animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t('aboutKortibelt')}
              </h2>

              <div className="w-28 h-1 bg-orange-500 mb-8" />

              <p className="text-lg leading-relaxed mb-6 opacity-90">
                {t('overviewKortibelt')}
              </p>

              <p className="text-lg leading-relaxed opacity-90">
                {t('overviewKortibeltS')}
              </p>
            </div>

            {/* RIGHT STATS */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center animate-scale-in border border-white/10"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="mx-auto mb-4 text-orange-500" size={40} />
                    <div className="text-4xl font-bold mb-2 text-orange-500">
                      {stat.value}
                    </div>
                    <div className="text-sm opacity-80">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* GOOGLE MAP SECTION */}
      <div className="w-full h-[400px] md:h-[500px] overflow-hidden relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d819.8071861254737!2d10.73829756625433!3d34.72462812805315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13002d0056200c07%3A0xb6fb8be2de6302ab!2sAIS!5e0!3m2!1sfr!2stn!4v1762950057246!5m2!1sfr!2stn"
          className="absolute inset-0 w-full h-full"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title="AIS Location"
        />
      </div>
    </>
  );
};

export default AboutComponent;
