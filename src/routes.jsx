import { Fragment, lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from '@/layout/Layout';
import SiteLayout from '@/layout/SiteLayout';
import ScrollToTop from '@/components/ScrollToTop';
import RecaptchaProvider from '@/components/RecaptchaProvider';
import Home from '@/pages/Home';
import { LANGS, SEGMENTS, legacyPath, parsePath, pathsFor } from '@/lib/paths';
import { getSubcategoriesOf } from '@/data/catalog';

// Chaque page est chargée à la demande pour alléger la première visite.
const Products = lazy(() => import('@/pages/Products'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Types = lazy(() => import('@/pages/Types'));
const SubCategory = lazy(() => import('@/pages/subCategory'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const ThankYou = lazy(() => import('@/pages/thankyou'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const MatierePage = lazy(() => import('@/pages/MatierePage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
    </div>
  );
}

/** Pages du catalogue : la page affichée est déduite de l'adresse (slugs). */
function CatalogPage() {
  const { pathname } = useLocation();
  const info = parsePath(pathname);
  const paths = pathsFor(info.lang);

  switch (info.page) {
    case 'products':
      return <Products />;
    case 'family':
      return <Types family={info.family} />;
    case 'category': {
      const subs = getSubcategoriesOf(info.category.id);
      if (subs.length === 0) return <NotFound />;
      return subs.length === 1 ? <Products key={subs[0].id} subcategory={subs[0]} /> : <SubCategory category={info.category} />;
    }
    case 'subcategory': {
      // Une catégorie à sous-catégorie unique a une seule adresse : celle de la catégorie.
      const canonical = paths.subcategory(info.subcategory);
      if (canonical !== pathname.replace(/\/+$/, '')) return <Navigate to={canonical} replace />;
      return <Products key={info.subcategory.id} subcategory={info.subcategory} />;
    }
    case 'belt':
      return <ProductDetail key={info.belt.id} belt={info.belt} />;
    default:
      return <NotFound />;
  }
}

/** Anciennes adresses (/products/…, /category/…) → nouvelles adresses. */
function LegacyRedirect() {
  const { pathname, search } = useLocation();
  return <Navigate to={legacyPath(pathname, search)} replace />;
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {LANGS.map((lang) => {
            const b = lang === 'en' ? '/en' : '';
            const s = SEGMENTS[lang];
            return (
              <Fragment key={lang}>
                {/* Catalogue : barre latérale des catégories */}
                <Route element={<Layout />}>
                  <Route path={`${b}/${s.products}`} element={<CatalogPage />} />
                  <Route path={`${b}/${s.products}/*`} element={<CatalogPage />} />
                  <Route path={`${b}/${s.belt}/:slug`} element={<CatalogPage />} />
                </Route>

                {/* Autres pages : barre de navigation + pied de page */}
                <Route element={<SiteLayout />}>
                  <Route path={b || '/'} element={<Home />} />
                  <Route path={`${b}/${s.cart}`} element={<Cart />} />
                  <Route path={`${b}/${s.checkout}`} element={<RecaptchaProvider><Checkout /></RecaptchaProvider>} />
                  <Route path={`${b}/${s.thanks}`} element={<ThankYou />} />
                  <Route path={`${b}/${s.about}`} element={<AboutPage />} />
                  <Route path={`${b}/${s.contact}`} element={<RecaptchaProvider><ContactPage /></RecaptchaProvider>} />
                  <Route path={`${b}/${s.materials}`} element={<MatierePage />} />
                </Route>
              </Fragment>
            );
          })}

          {/* Anciennes adresses du site */}
          <Route path="/products" element={<LegacyRedirect />} />
          <Route path="/products/*" element={<LegacyRedirect />} />
          <Route path="/category/:id" element={<LegacyRedirect />} />
          <Route path="/subcategory/:id" element={<LegacyRedirect />} />
          <Route path="/cart" element={<Navigate to="/devis" replace />} />
          <Route path="/checkout" element={<Navigate to="/devis/coordonnees" replace />} />
          <Route path="/thank-you" element={<Navigate to="/merci" replace />} />
          <Route path="/about" element={<Navigate to="/a-propos" replace />} />
          <Route path="/classement" element={<Navigate to="/matieres" replace />} />

          <Route element={<SiteLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
