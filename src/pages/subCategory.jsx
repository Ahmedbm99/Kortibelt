import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useOutletContext, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { selectedType } from '@/store/typeSlice';

import defaultImage from '@/assets/noimage.jpg'; // ✅ image par défaut

const SubCategory = () => {
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  const { subcategoryid } = useParams();
  const { resetFilters } = useOutletContext();

  /* ---------- SYNC URL → REDUX ---------- */
  useEffect(() => {
    if (subcategoryid) {
      dispatch(selectedType(Number(subcategoryid)));
    }
  }, [subcategoryid, dispatch]);

  /* ---------- DATA ---------- */
  const subcategory = useSelector((state) => state.subCategory.list);
  const flatSubcategory = Array.isArray(subcategory) ? subcategory.flat() : [];

  const filteredSubcategories = flatSubcategory.filter((item) => {
    if (!subcategoryid) return true;
    return Number(item.category_id) === Number(subcategoryid);
  });

  /* ---------- PAGINATION ---------- */
  const itemsPerPage = 9;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(filteredSubcategories.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const paginatedSubcategories = filteredSubcategories.slice(
    start,
    start + itemsPerPage
  );

  const mainRef = useRef(null);

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <div className="flex flex-1 w-full pt-20">
        <main ref={mainRef} className="flex-1 overflow-auto" key={subcategoryid}>
          <div className="p-8">

            {/* ---------- HEADER ---------- */}
            <div className="flex items-center gap-4 mb-8 justify-between">
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold text-primary mb-3">
                  {t('titleProduct')}
                </h1>
                <div className="w-24 h-1 bg-accent mx-auto" />
              </div>

              {resetFilters && (
                <Button
                  variant="outline"
                  className="bg-red-500 text-white"
                  onClick={resetFilters}
                >
                  {t('resetFilters')}
                </Button>
              )}
            </div>

            {/* ---------- EMPTY ---------- */}
            {filteredSubcategories.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                Aucun résultat trouvé
              </div>
            ) : (
              <>
                {/* ---------- GRID ---------- */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedSubcategories.map((item, index) => (
                    <NavLink
                      to={`/products/${item.id}`}
                      key={`${item.id}-${index}`}
                      className="group block"
                    >
                      <Card className="h-full overflow-hidden shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                        {/* 🖼 IMAGE */}
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={`https://ahmedbm99.github.io/Kortibelt${item.imageUrl || defaultImage}`}
                            alt={
                              language === 'fr'
                                ? item.nomFrancais
                                : item.nomAnglais
                            }
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        <CardContent className="p-6">
                          <h3 className="text-2xl font-bold text-primary mb-3">
                            {language === 'fr'
                              ? item.nomFrancais
                              : item.nomAnglais}
                          </h3>

                          <p className="text-muted-foreground mb-6 line-clamp-3">
                            {item.seoDescription}
                          </p>

                          <Button className="w-full bg-accent hover:bg-accent/80">
                            {t('viewDetails')}
                          </Button>
                        </CardContent>
                      </Card>
                    </NavLink>
                  ))}
                </div>

                {/* ---------- PAGINATION ---------- */}
                <div className="flex justify-center gap-4 mt-10">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    {t('back')}
                  </Button>

                  <span className="font-semibold">
                    Page {page} / {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {t('next')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubCategory;
