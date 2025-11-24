import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

import { useEffect, useState } from 'react';
import BeltsServices from '@/services/BeltsServices';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();

  const [product, setProduct] = useState(null);
  const [Fiche, setFiche] = useState([]);
  const [Images, setImages] = useState([]);
  const [Matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoomPosition, setZoomPosition] = useState(null);
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await BeltsServices.getBeltById(id);
        setProduct(res.data);
        setFiche(res.data.Fiches || []);
        setImages(res.data.Images || []);
        setMatieres(res.data.Matieres || []);
      } catch (err) {
        toast.error("Erreur lors du chargement du produit",err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="pt-40 text-center">Loading...</p>;
  if (!product) return <p className="pt-40 text-center">{t('productNotFound')}</p>;

  const currentMaterial = Matieres[currentMaterialIndex]?.matiere || "-";
  const currentImage = Images[currentMaterialIndex]?.image_url || Images[0]?.image_url || null;
  const currentFiche =
    Fiche[currentMaterialIndex]?.fiche_technique_url ||
    Fiche[0]?.fiche_technique_url ||
    null;
const handleNextMaterial = () =>
    Matieres.length > 1 &&
    setCurrentMaterialIndex(i => (i + 1) % Matieres.length);
  const specifications = [
    { key: 'profil', label: t('Profile') },
    { key: 'nom', label: t('Reference') },
    { key: 'largeur_mm', label: t('Largeur'), unit: 'mm' },
    { key: 'hauteur_mm', label: t('Hauteur'), unit: 'mm' },
    { key: 'pas_mm', label: t('Pas'), unit: 'mm' },
    { key: 'reference_fabricant', label: t('Reference Fabricant') }
  ]
    .filter(attr => product[attr.key] !== null)
    .map(attr => ({
      label: attr.label,
      value: product[attr.key] + (attr.unit || '')
    }));

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0A1A2F]">

      {/* BACK BUTTON */}
      <div className="container mx-auto px-4 pt-32">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-[#FBE4D4] text-[#0A1A2F] hover:bg-[#ffd1b1] border-none"
        >
          <ArrowLeft size={18} />
          {t('back')}
        </Button>
      </div>

      {/* HEADER + IMAGE */}
      <div className="container mx-auto px-4 mt-10 grid md:grid-cols-2 gap-12">

     <div className="relative animate-fade-in-up space-y-6">

            {/* Main Image */}
            {currentImage ? (
              <div
                className="relative overflow-hidden rounded-xl shadow-2xl bg-white"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomPosition({ x, y });
                }}
                onMouseLeave={() => setZoomPosition(null)}
              >
                {/* Material Badge */}
                {currentMaterial && (
                  <img
                    src={`https://ahmedbm99.github.io/CourroieFront/badges/${
                      currentMaterial === 'CR'
                        ? 'power.png'
                        : currentMaterial === 'CR+NR' || currentMaterial === 'NR+CR'
                        ? 'standard.png'
                        : currentMaterial === 'EPDM'
                        ? 'ultra.png'
                        : currentMaterial === 'HNBR'
                        ? 'titan.png'
                        : null
                    }`}
                    alt={currentMaterial}
                    className="absolute top-4 left-4 w-[120px] z-20 rounded-lg p-1 shadow-md bg-white/70 backdrop-blur"
                  />
                )}

                <img
                  src={`https://ahmedbm99.github.io/CourroieFront${currentImage}`}
                  alt={product.nom}
                  className="w-full h-auto transition-transform duration-200"
                  style={{
                    transform: zoomPosition
                      ? `scale(2) translate(${50 - zoomPosition.x}%, ${50 - zoomPosition.y}%)`
                      : "scale(1)",
                  }}
                />
              </div>
            ) : (
              <p>{t('imageUnavailable')}</p>
            )}
            </div>

        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-extrabold text-[#0A1A2F]">
            { product.nom}
             </h1>
                <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-lg">{t('Materials')}:</p>

                    {Matieres.length > 1 && (
                    <Button 
                        size="sm"
                        variant="outline"
                        onClick={handleNextMaterial}
                        className="border-[#F97421] text-[#F97421] cursor-pointer hover:bg-[#FFF3E9]"
                    >
                        {t('changeMaterial')}
                    </Button>
                    )}
                </div>

                <p className="text-[#1F2A44] text-base font-medium">
                    {currentMaterial}
                </p>
                </div>
          <p className="text-lg leading-relaxed text-[#1F2A44] opacity-80">
            {product.description ||
              "Courroie synchrone haute performance pour applications exigeantes."}
          </p>

          {/* BUTTONS */}
          <div className="space-y-4">
            <Button
              className="w-full py-6 bg-[#F97421] text-white text-lg cursor-pointer font-semibold rounded-xl hover:bg-[#ff7f2d]"
            >
              <ShoppingCart className="mr-3" size={20} />
              {t('addToCart')}
            </Button>

            {currentFiche && (
              <Button
                variant="outline"
                onClick={() =>
                  window.open(`https://ahmedbm99.github.io/CourroieFront${currentFiche}`, '_blank')
                }
                className="w-full py-6 text-[#F97421] border-[#F97421] text-lg cursor-pointer font-semibold rounded-xl hover:bg-[#FFF5EF]"
              >
                <Download className="mr-3" size={22} />
                {t('downloadDatasheet')}
              </Button>
            )}

            <Button
              className="w-full py-6 bg-[#0A1A2F] text-white text-lg cursor-pointer font-semibold rounded-xl hover:bg-[#102542]"
            >
              {t('requestQuote') || "Demander un devis"}
            </Button>
          </div>

        </div>
      </div>

      {/* BOTTOM SECTIONS */}
      <div className="container mx-auto px-4 mt-20 grid md:grid-cols-2 gap-10 pb-24">

        {/* SPECIFICATIONS */}
        <Card className="shadow-xl rounded-2xl border-none">
          <CardContent className="p-10">
               
    
            <h2 className="text-2xl font-bold mb-6 text-[#0A1A2F]">{t('specifications')}</h2>
            <ul className="space-y-4">
              {specifications.map((spec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#F97421]">•</span>
                  <span className="text-[#1F2A44]">{spec.label}: {spec.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>


      </div>

    </div>
  );
};

export default ProductDetail;
