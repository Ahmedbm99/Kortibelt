import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React, { useEffect, useRef, useState } from 'react';
import BeltsServices from '@/services/BeltsServices';
import toast from 'react-hot-toast';
import {setBelt} from '@/store/beltSlice'
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const carouselRef = useRef(null);
  const dispatch =useDispatch();
  const {t} = useLanguage();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await BeltsServices.getAllBelts();
        setProducts(res.data);
        dispatch(setBelt(res.data))
      } catch (err) {
        toast.error("Impossible de charger les produits");
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  // 🔄 Auto-scroll every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const scrollAmount = carouselRef.current.offsetWidth * 0.5;
        carouselRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="produits" className="py-20 bg-background">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
             {t('FeaturedProducts')}  
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto" />
        </div>

        {/* AUTO SLIDER */}
        <div className="relative">
          
          <div
            ref={carouselRef}
            className="flex overflow-x-auto space-x-6 px-3 scroll-smooth"
          >
            {products.map((product, index) => (
              <Card
                key={index}
                className="
                  flex-shrink-0 overflow-hidden hover-lift border-0 shadow-lg
                  w-[80%] sm:w-[45%] md:w-[30%] lg:w-[22%] xl:w-[18%]
                  animate-fade-in-up
                "
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                
                <div className="aspect-video overflow-hidden">
                  <img
                    src={
                      product.Images?.length
                        ? `https://ahmedbm99.github.io/CourroieFront${product.Images[0].image_url}`
                        : "/fallback-image.png"
                    }
                    alt={product.nom}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-primary">
                    {product.nom}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {product.profil || "Courroie industrielle de haute qualité et durabilité."}
                  </p>

                  <Button
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <NavLink to={`/products/product/${product.id}`}>
  {t("savoirPlus")}
</NavLink>

                  </Button>
                </CardContent>

              </Card>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
