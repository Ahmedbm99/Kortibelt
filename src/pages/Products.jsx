import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { selectedSubCategory } from '@/store/subCategorySlice';
import { ArrowLeft } from 'lucide-react';

const Products = () => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const application = searchParams.get("application"); 
  const { searchQuery, resetFilters } = useOutletContext();

  const selectedsubCategory = useSelector((state) => state.subCategory.selectedSubCategory);
  const products = useSelector((state) => state.belt.list);

  const mainRef = useRef(null);
  const prevCategory = useRef({ id, application });

  // Mettre à jour la catégorie sélectionnée uniquement si elle change
  useEffect(() => {
    if (id !== undefined && Number(selectedsubCategory) !== Number(id)) {
      dispatch(selectedSubCategory(id));
    }
  }, [id, dispatch, selectedsubCategory]);

  // Filtrer les produits
  const filteredProducts = products.filter((product) => {
    const matchesCategory = !id || product.subcategory_id === Number(id);
    const matchesApplication = !application || product.application === application;

    const normalize = (str) =>
      str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const matchesSearch =
      !searchQuery ||
      normalize(product.nom).includes(normalize(searchQuery)) ||
      normalize(product.profil).includes(normalize(searchQuery)) ||
      normalize(product.description).includes(normalize(searchQuery));

    return matchesCategory && matchesApplication && matchesSearch;
  });

  // Pagination
  const itemsPerPage = 9;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(start, start + itemsPerPage);

  // Scroll en haut quand la page change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page]);

  // Scroll en haut quand la catégorie ou l'application change
  useEffect(() => {
    const categoryChanged =
      prevCategory.current.id !== id ||
      prevCategory.current.application !== application;

    if (categoryChanged && mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    prevCategory.current = { id, application };
  }, [id, application]);

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <div className="flex flex-1 w-full pt-20">
        <main ref={mainRef} className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8 justify-between">
                            <Button
                variant="outline"
                className="bg-gray-500 text-white hover:bg-gray-600"
                onClick={() => window.history.back()} // ou utiliser navigate pour react-router
              >
                          <ArrowLeft size={18} />

                {t('back')}
              </Button>
              <div className="text-center flex-1 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                  {t('titleProduct')}
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

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  Aucun produit trouvé
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedProducts.map((product, index) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:-translate-y-1 transition-all duration-300 hover-lift border-0 shadow-lg animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={
                            product.images?.length
                              ? `https://ahmedbm99.github.io/Kortibelt${product.images[0].image_url}`
                              : "/fallback-image.png"
                          }
                          alt={product.nom}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>

                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold mb-3 text-primary">
                          {product.nom}
                        </h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                          {product.description}
                        </p>

                        <div className="flex flex-col gap-3">
                          <Button
                            variant="default"
                            className="w-full bg-accent hover:bg-accent/80 hover:-translate-y-1 transition-all duration-300"
                            asChild
                          >
                            <NavLink to={`/products/product/${product.id}`}>
                              {t('viewDetails')}
                            </NavLink>
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full border-accent cursor-pointer bg-orange-500 text-white hover:bg-accent hover:text-white hover:-translate-y-1 transition-all duration-300"
                            onClick={() => addToCart(product)}
                          >
                            {t('addToCart')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center items-center gap-4 mt-10">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-6 cursor-pointer"
                  >
                    {t('back')}
                  </Button>

                  <span className="text-lg font-semibold">
                    Page {page} / {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-6 cursor-pointer"
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

export default Products;
