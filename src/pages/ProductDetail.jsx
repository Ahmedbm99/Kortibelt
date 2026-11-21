import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Download, FileText, MessageCircle, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import Seo from '@/components/Seo';
import { product as productSchema } from '@/lib/structuredData';
import {
  beltDatasheets,
  beltImages,
  beltMaterials,
  formatNumber,
  getSubcategoriesOf,
  localName,
  pathOfSubcategory,
  relatedBelts,
} from '@/data/catalog';
import { NO_IMAGE, imageSources, onImageError } from '@/lib/asset';
import { whatsappLink } from '@/lib/config';
import { slugify } from '@/lib/slug';

import Power from '@/assets/badges/power.webp';
import Premium from '@/assets/badges/premium.webp';
import Standard from '@/assets/badges/standard.webp';
import Titan from '@/assets/badges/titan.webp';
import Ultra from '@/assets/badges/ultra.webp';

const MATERIAL_BADGES = { CR: Power, 'CR+NR': Standard, 'NR+CR': Standard, EPDM: Ultra, HNBR: Titan, PU: Premium };

/** Lignes du tableau de spécifications : [clé de traduction, valeur formatée]. */
function specRows(belt, t, language) {
  const num = (v, unit) => (v === null || v === undefined || v === '' ? null : `${formatNumber(v, language)}${unit ? ` ${unit}` : ''}`);
  const temp =
    belt.temperature_min !== undefined || belt.temperature_max !== undefined
      ? `${belt.temperature_min ?? '…'} °C → ${belt.temperature_max ?? '…'} °C`
      : null;
  return [
    ['profile', belt.profil],
    ['Largeur', num(belt.largeur_mm, 'mm')],
    ['Hauteur', num(belt.hauteur_mm, 'mm')],
    ['Pas', num(belt.pas_mm, 'mm')],
    ['thicknessLabel', num(belt.epaisseur_mm, 'mm')],
    ['angle', num(belt.angle_trapeze_deg, '°')],
    ['ribs', num(belt.nombre_nervures)],
    ['weight', num(belt.poids_g_m, 'g/m')],
    ['reinforcement', belt.renforcement],
    ['tempRange', temp],
    ['maxSpeed', num(belt.vitesse_max_m_s, 'm/s')],
    ['maxLoad', num(belt.charge_max_n, 'N')],
    ['application', belt.application ? t(`title${belt.application}`) : null],
    ['manufacturer', belt.fabricant],
    ['manufacturerRef', belt.reference_fabricant],
  ].filter(([, v]) => v !== null && v !== undefined && v !== '');
}

const ProductDetail = ({ belt }) => {
  const navigate = useNavigate();
  const { t, language, paths } = useLanguage();
  const { addToCart } = useCart();

  const images = beltImages(belt);
  const materials = beltMaterials(belt);
  const datasheets = beltDatasheets(belt);

  const [imageIndex, setImageIndex] = useState(0);
  const [material, setMaterial] = useState(materials[0] || '');
  const [zoom, setZoom] = useState(null);
  const [touchX, setTouchX] = useState(null);

  const { family, category, subcategory } = pathOfSubcategory(belt.subcategory_id);
  const currentImage = images[imageIndex] || NO_IMAGE;
  const datasheet = datasheets[Math.max(0, materials.indexOf(material))] || datasheets[0];
  const specs = specRows(belt, t, language);
  const related = relatedBelts(belt);
  const label = material ? `${belt.nom} (${material})` : belt.nom;

  const showImage = (i) => setImageIndex((i + images.length) % images.length);
  const singleSub = getSubcategoriesOf(category.id).length === 1;
  const categoryName = localName(singleSub ? category : subcategory, language);
  const description = belt.description || t('defaultDescription');
  // Titre Google : nom (+ profil) et catégorie, sans dépasser ~60 caractères ni répéter la catégorie.
  const baseName = belt.profil && !slugify(belt.nom).includes(slugify(belt.profil)) ? `${belt.nom} ${belt.profil}` : belt.nom;
  const sameAsCategory = slugify(belt.nom).length > 3 && (slugify(categoryName).includes(slugify(belt.nom)) || slugify(belt.nom).includes(slugify(categoryName)));
  const withCategory = t('seoBeltTitle', { name: baseName, category: categoryName });
  const seoTitle =
    withCategory.length <= 50 && !sameAsCategory
      ? withCategory
      : baseName.length <= 30
        ? t('seoBeltTitleShort', { name: baseName })
        : baseName;
  const seoDescription = `${belt.nom}${belt.profil ? ` (${belt.profil})` : ''} – ${description}`;

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        image={images[0]}
        type="product"
        jsonLd={productSchema({
          belt,
          url: paths.belt(belt),
          images,
          category: `${localName(family, language)} > ${categoryName}`,
          materials,
          description,
        })}
      />
      <Breadcrumbs
        items={[
          { label: t('products'), to: paths.products() },
          { label: localName(family, language), to: paths.family(family) },
          singleSub ? null : { label: localName(category, language), to: paths.category(category) },
          { label: categoryName, to: paths.subcategory(subcategory) },
          { label: belt.nom },
        ]}
      />

      <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
        {/* Galerie */}
        <div>
          <div
            className="relative overflow-hidden rounded-xl bg-white shadow-lg"
            onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX === null || images.length < 2) return;
              const diff = touchX - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 50) showImage(imageIndex + (diff > 0 ? 1 : -1));
              setTouchX(null);
            }}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
            onMouseLeave={() => setZoom(null)}
          >
            <img
              key={currentImage}
              src={imageSources(currentImage).src}
              srcSet={imageSources(currentImage).srcSet}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt={belt.nom}
              onError={onImageError}
              fetchPriority={imageIndex === 0 ? 'high' : undefined}
              width="800"
              height="600"
              className="aspect-[4/3] w-full object-contain transition-transform duration-200"
              style={{ transform: zoom && images.length ? `scale(2)` : 'none', transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : 'center' }}
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => showImage(imageIndex - 1)}
                  aria-label={t('previousImage')}
                  className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-md hover:bg-white"
                >
                  <ChevronLeft size={24} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => showImage(imageIndex + 1)}
                  aria-label={t('nextImage')}
                  className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-md hover:bg-white"
                >
                  <ChevronRight size={24} aria-hidden="true" />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <li key={src}>
                  <button
                    type="button"
                    onClick={() => setImageIndex(i)}
                    aria-label={t('showImage', { n: i + 1 })}
                    aria-current={i === imageIndex}
                    className={`block h-20 w-20 overflow-hidden rounded-md border-2 bg-white ${i === imageIndex ? 'border-accent' : 'border-transparent'}`}
                  >
                    <img src={imageSources(src).src} alt="" loading="lazy" width="80" height="80" onError={onImageError} className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Informations et actions */}
        <div className="flex flex-col gap-6">
          <div>
            {belt.profil && <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">{belt.profil}</p>}
            <h1 className="mt-1 text-3xl font-extrabold text-primary md:text-4xl">{belt.nom}</h1>
          </div>

          <p className="leading-relaxed text-muted-foreground">{description}</p>

          {materials.length > 0 && (
            <fieldset>
              <legend className="mb-2 font-semibold text-primary">{t('chooseMaterial')}</legend>
              <div className="flex flex-wrap items-center gap-2">
                {materials.map((m) => (
                  <label
                    key={m}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/40 ${
                      material === m ? 'border-accent bg-accent-soft text-primary' : 'border-border bg-white text-muted-foreground hover:border-accent'
                    }`}
                  >
                    <input type="radio" name="material" value={m} checked={material === m} onChange={() => setMaterial(m)} className="sr-only" />
                    {m}
                  </label>
                ))}
                {MATERIAL_BADGES[material] && (
                  <img src={MATERIAL_BADGES[material]} alt="" className="ml-2 h-12 w-auto" width="96" height="48" />
                )}
              </div>
            </fieldset>
          )}

          <div className="flex flex-col gap-3 xl:flex-row">
            <button
              type="button"
              onClick={() => addToCart(belt, material)}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 xl:w-auto xl:flex-1 border-accent bg-white px-4 font-semibold text-accent-text hover:bg-accent-soft"
            >
              <Plus size={20} aria-hidden="true" />
              {t('addToQuote')}
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(belt, material);
                navigate(paths.cart());
              }}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-cta xl:w-auto xl:flex-1 px-4 font-semibold text-white hover:bg-cta-hover"
            >
              {t('requestQuoteNow')}
            </button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            {datasheet && (
              <a href={datasheet} target="_blank" rel="noopener noreferrer" download className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-2 hover:underline">
                <Download size={18} aria-hidden="true" /> {t('datasheet')}
              </a>
            )}
            <a
              href={whatsappLink(t('whatsappProductMessage', { name: label }))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-2 hover:underline"
            >
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('needHelpChoosing')}{' '}
            <Link to={paths.contact()} className="font-semibold text-accent-text hover:underline">
              {t('contactUs')}
            </Link>
          </p>
        </div>
      </div>

      {/* Spécifications */}
      {specs.length > 0 && (
        <section className="mt-12 max-w-3xl" aria-labelledby="specs-title">
          <h2 id="specs-title" className="mb-4 flex items-center gap-2 text-2xl font-bold text-primary">
            <FileText size={22} aria-hidden="true" /> {t('specifications')}
          </h2>
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <table className="w-full text-left text-sm">
              <tbody>
                {specs.map(([key, value], i) => (
                  <tr key={key} className={i % 2 ? 'bg-secondary/50' : ''}>
                    <th scope="row" className="w-1/2 px-4 py-3 font-medium text-muted-foreground">
                      {t(key)}
                    </th>
                    <td className="px-4 py-3 font-semibold text-primary">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Produits associés */}
      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="related-title">
          <h2 id="related-title" className="mb-4 text-2xl font-bold text-primary">
            {t('relatedProducts')}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((b) => (
              <ProductCard key={b.id} belt={b} compact />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetail;
