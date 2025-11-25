import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroFactory from '@/assets/heroFactory.jpg';
import heroFactory1 from '@/assets/heroFactory1.jpg';
import heroFactory2 from '@/assets/heroFactory2.jpg';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';


const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {t, language} = useLanguage();
const slides = [
  {
    title: {
      fr: "Solutions Industrielles de Courroies",
      en: "Industrial Belt Solutions",
    },
    subtitle: {
      fr: "Plus de 20 ans d'expertise dans la fabrication de courroies",
      en: "Over 20 years of expertise in belt manufacturing",
    },
    image: heroFactory,
  },
  {
    title: {
      fr: "Qualité et Performance",
      en: "Quality & Performance",
    },
    subtitle: {
      fr: "Des produits fiables pour vos applications industrielles",
      en: "Reliable products for your industrial applications",
    },
    image: heroFactory1,
  },
  {
    title: {
      fr: "Précision et puissance",
      en: "Precision & Power",
    },
    subtitle: {
      fr: "Des produits avec grande précision et puissance",
      en: "Products offering high precision and power",
    },
    image: heroFactory2,
  },
];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-screen overflow-hidden ">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0  from-primary/90 to-primary/60" />
          </div>
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl text-primary-foreground animate-fade-in-up ">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-white">
                  {language==="fr"? slide.title.fr : slide.title.en}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-white ">
                  {language==="fr"? slide.subtitle.fr : slide.subtitle.en}
               
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className=" border-primary-foreground relative z-50 hover:bg-orange-400 hover:text-white bg-blue-400 cursor-pointer  text-accent-foreground text-lg px-8"
                    asChild
                  >
                    <NavLink to="/products"> {t("checkProduct")} </NavLink>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground relative z-50 hover:bg-orange-400 hover:text-white bg-blue-400 text-primary-foreground cursor-pointer text-lg px-8"
                    asChild
                  >
                   <NavLink to="/contact"> {t("contactUs")} </NavLink>

                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 backdrop-blur-sm p-3 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="text-primary-foreground" size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 backdrop-blur-sm p-3 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="text-primary-foreground" size={32} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-accent w-8' : 'bg-primary-foreground/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
