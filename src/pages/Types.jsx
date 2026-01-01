import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { NavLink, useOutletContext, useParams } from 'react-router-dom';

import assetsImg from '@/assets/assets.png';
import assetsPu from '@/assets/pu.png';
import assetsThermo from '@/assets/thermo.jpg';

import category from '@/data/category';

const Category = () => {
  const { t, language } = useLanguage();

  const { selectedFamily, resetFilters } = useOutletContext();
  const { familyid } = useParams();

  /* ---------------------------------
     🔐 Sécurisation du familyId
  ---------------------------------- */
  const familyId = Number(selectedFamily ?? familyid);

  /* ---------------------------------
     🖼 Mapping images par famille
  ---------------------------------- */
  const familyImages = {
    4: assetsImg,
    5: assetsPu,
    6: assetsThermo,
  };

  const imageSrc = familyImages[familyId] ?? assetsThermo;

  /* ---------------------------------
     📦 Filtrage catégories
  ---------------------------------- */
  const filteredTypes = category.filter(
    (type) => type.famille_id === familyId
  );

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <div className="flex flex-1 w-full pt-20">
        <main className="flex-1 overflow-auto">
          <div className="p-8">

            {/* -------- Header -------- */}
            <div className="flex items-center gap-4 mb-8 justify-between">
              <div className="text-center flex-1 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                  {t('titleTypes')}
                </h1>
                <div className="w-24 h-1 bg-accent mx-auto" />
              </div>

              {resetFilters && (
                <Button
                  variant="outline"
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={resetFilters}
                >
                  {t('resetFilters')}
                </Button>
              )}
            </div>

            {/* -------- Grid -------- */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTypes.map((type, index) => (
                <NavLink
                  key={type.id}
                  to={`/subcategory/${type.id}`}
                  className="group block focus:outline-none"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card
                    className="h-full overflow-hidden transition-all duration-300
                               hover:-translate-y-1 hover:shadow-xl
                               border-0 shadow-lg animate-fade-in-up"
                  >
                    {/* Image */}
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={imageSrc}
                        alt={
                          language === 'fr'
                            ? type.nomFrancais
                            : type.nomAnglais
                        }
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform
                                   duration-500 group-hover:scale-110"
                      />
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-3 text-primary">
                        {language === 'fr'
                          ? type.nomFrancais
                          : type.nomAnglais}
                      </h3>

                      <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                        {language === 'fr'
                          ? type.descriptionFrancais
                          : type.descriptionAnglais}
                      </p>

                      <Button
                        variant="default"
                        className="w-full bg-accent hover:bg-orange-300/80
                                   hover:-translate-y-1 transition-all duration-300"
                        asChild
                      >
                        <span>{t('viewDetails')}</span>
                      </Button>
                    </CardContent>
                  </Card>
                </NavLink>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Category;
