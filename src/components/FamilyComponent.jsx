import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import FamilleServices from '@/services/FamilyServices';
import { Cog, Zap, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFamily } from "@/store/familySlice";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';

const ProductFamilies = () => {
  const dispatch = useDispatch();
  const { language, t } = useLanguage(); // 'fr' or 'en'
  const [families, setFamilies] = useState([]);
  const Icon = [Cog, Zap, Settings];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const familyData = await FamilleServices.getAllFamilies();
        setFamilies(familyData.data);
        dispatch(setFamily(familyData.data));
      } catch (err) {
        console.error(err);
        toast.error(language === "en" ? "Error loading categories" : "Erreur lors du chargement des catégories");
      } 
    };

    fetchData();
  }, [dispatch, language]);

  return (
    <section id="famille" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('family')}</h2>
          <div className="w-24 h-1 bg-accent mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {families.map((family, index) => {
            const IconComponent = Icon[index % Icon.length];
            return (
              <Link
                key={index}
                to={`/products/${family.id}`}
                className="transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
              >
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-orange-200 rounded-full flex items-center justify-center">
                      <IconComponent className="text-primary" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-primary">
                      {language === 'fr' ? family.nomFrancais : family.nomAnglais}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {language === 'fr' ? family.descriptionFrancais : family.descriptionAnglais}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductFamilies;
