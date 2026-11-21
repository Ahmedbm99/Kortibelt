import { useEffect, useState } from 'react';
import { preload } from 'react-dom';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import heroFactory from '@/assets/heroFactory.webp';
import heroFactory1 from '@/assets/heroFactory1.webp';
import heroFactory2 from '@/assets/heroFactory2.webp';
import { useLanguage } from '@/contexts/LanguageContext';

const SLIDES = [
  {
    title: { fr: 'Solutions industrielles de courroies', en: 'Industrial belt solutions' },
    subtitle: { fr: "Plus de 20 ans d'expertise dans la transmission de puissance", en: 'Over 20 years of expertise in power transmission' },
    image: heroFactory,
  },
  {
    title: { fr: 'Qualité et performance', en: 'Quality & performance' },
    subtitle: { fr: 'Des produits fiables pour vos applications industrielles', en: 'Reliable products for your industrial applications' },
    image: heroFactory1,
  },
  {
    title: { fr: 'Précision et puissance', en: 'Precision & power' },
    subtitle: { fr: 'Courroies trapézoïdales, synchrones, Poly-V et PU', en: 'V-belts, timing belts, Poly-V and PU belts' },
    image: heroFactory2,
  },
];

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const Hero = () => {
  const { t, language, paths } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  // Image principale de la page : téléchargée en priorité (meilleur LCP).
  preload(heroFactory, { as: 'image', fetchPriority: 'high' });
  const [hovered, setHovered] = useState(false);
  // Seules les images déjà affichées sont chargées (la première tout de suite).
  const [seen, setSeen] = useState(() => new Set([0]));

  const show = (i) => {
    const next = (i + SLIDES.length) % SLIDES.length;
    setCurrent(next);
    setSeen((s) => (s.has(next) ? s : new Set(s).add(next)));
  };

  useEffect(() => {
    if (paused || hovered || reducedMotion()) return undefined;
    const timer = setInterval(() => show(current + 1), 6000);
    return () => clearInterval(timer);
  }, [paused, hovered, current]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative min-h-[70vh] overflow-hidden bg-primary"
      aria-roledescription="carousel"
      aria-label="KORTIBELT"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {SLIDES.map((s, i) => (
        <div
          key={i}
          aria-hidden={i !== current}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          style={seen.has(i) ? { backgroundImage: `url(${s.image})` } : undefined}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />

      <div className="relative flex min-h-[70vh] items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl text-white" aria-live={paused ? 'polite' : 'off'}>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-6xl">{slide.title[language] || slide.title.fr}</h1>
            <p className="mb-8 text-lg text-white/90 md:text-2xl">{slide.subtitle[language] || slide.subtitle.fr}</p>
            <div className="flex flex-wrap gap-4">
              <Link to={paths.products()} className="inline-flex h-12 items-center rounded-md bg-cta px-7 text-lg font-semibold text-white hover:bg-cta-hover">
                {t('checkProduct')}
              </Link>
              <Link
                to={paths.contact()}
                className="inline-flex h-12 items-center rounded-md border-2 border-white px-7 text-lg font-semibold text-white hover:bg-white hover:text-primary"
              >
                {t('contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 sm:bottom-6 sm:gap-2">
        <button
          type="button"
          onClick={() => show(current - 1)}
          aria-label={t('previousSlide')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => show(i)}
            aria-label={t('goToSlide', { n: i + 1 })}
            aria-current={i === current}
            className="flex h-10 w-10 items-center justify-center"
          >
            <span className={`block h-3 rounded-full transition-all ${i === current ? 'w-8 bg-accent' : 'w-3 bg-white/60'}`} />
          </button>
        ))}
        <button
          type="button"
          onClick={() => show(current + 1)}
          aria-label={t('nextSlide')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40"
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? t('heroPlay') : t('heroPause')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40"
        >
          {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
        </button>
      </div>
    </section>
  );
};

export default Hero;
