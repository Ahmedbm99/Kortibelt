import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import logo from '@/assets/logo.png';
import LanguageSelector from './LanguageSelector';
import SearchBar from './SearchBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { families, getCategoriesOf, localName } from '@/data/catalog';
import { parsePath } from '@/lib/paths';

const linkClass = ({ isActive }) =>
  `rounded-md px-2 py-1 font-medium transition-colors ${
    isActive ? 'text-accent-text' : 'text-primary hover:text-accent-text'
  }`;

// "Produits" est actif sur toutes les pages du catalogue.
const CATALOG_PAGES = ['products', 'family', 'category', 'subcategory', 'belt'];

function CartLink({ className = '' }) {
  const { t, paths } = useLanguage();
  const { totalItems } = useCart();
  return (
    <NavLink
      to={paths.cart()}
      aria-label={t('quoteCartCount', { n: totalItems })}
      className={({ isActive }) =>
        `relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
          isActive ? 'bg-cta text-white' : 'bg-accent-soft text-primary hover:bg-cta hover:text-white'
        } ${className}`
      }
    >
      <ShoppingCart size={22} aria-hidden="true" />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
          {totalItems}
        </span>
      )}
    </NavLink>
  );
}

const Navbar = () => {
  const { t, language, paths } = useLanguage();
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  // Le menu mobile se referme tout seul quand la page change.
  const [menuOpenAt, setMenuOpenAt] = useState(null);
  const menuOpen = menuOpenAt === pathname;
  const inCatalog = CATALOG_PAGES.includes(parsePath(pathname).page);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpenAt(null);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-white"
      >
        {t('skipToContent')}
      </a>
      <nav className="container mx-auto flex h-20 items-center gap-3 px-4" aria-label="Navigation principale">
        <Link to={paths.home()} className="flex shrink-0 items-center gap-2" aria-label="KORTIBELT — Accueil">
          <img src={logo} alt="KORTIBELT" className="h-24 w-auto" width="160" height="56" />
          <span className="hidden text-xs font-semibold text-accent-text xl:block">{t('Kortibeltcitation')}</span>
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <SearchBar />
        </div>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <NavLink to={paths.home()} end className={linkClass}>
            {t('home')}
          </NavLink>
          <NavLink to={paths.products()} className={() => linkClass({ isActive: inCatalog })}>
            {t('products')}
          </NavLink>
          <NavLink to={paths.about()} className={linkClass}>
            {t('about')}
          </NavLink>
          <NavLink to={paths.contact()} className={linkClass}>
            {t('contact')}
          </NavLink>
          <LanguageSelector />
          <CartLink />
        </div>

        {/* Mobile et tablette : panier et menu toujours visibles */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <CartLink />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-primary hover:bg-secondary"
            onClick={() => setMenuOpenAt(menuOpen ? null : pathname)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t bg-white px-4 pb-6 lg:hidden">
          <div className="py-4 md:hidden">
            <SearchBar onSubmitted={close} />
          </div>
          <div className="flex flex-col gap-1">
            <NavLink to={paths.home()} end className={linkClass} onClick={close}>
              {t('home')}
            </NavLink>
            <NavLink to={paths.products()} className={linkClass} onClick={close}>
              {t('allProducts')}
            </NavLink>
          </div>

          <Accordion type="single" collapsible className="mt-2 w-full">
            {families.map((f) => (
              <AccordionItem key={f.id} value={`fam-${f.id}`}>
                <AccordionTrigger className="px-2 text-left text-base font-medium text-primary">
                  {localName(f, language)}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="ml-2 space-y-1 border-l border-border pl-3">
                    <li>
                      <Link to={paths.family(f)} onClick={close} className="block py-2 text-sm font-semibold text-accent-text">
                        {t('seeCategories')}
                      </Link>
                    </li>
                    {getCategoriesOf(f.id).map((c) => (
                      <li key={c.id}>
                        <Link to={paths.category(c)} onClick={close} className="block py-2 text-sm text-muted-foreground hover:text-primary">
                          {localName(c, language)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-2 flex flex-col gap-1">
            <NavLink to={paths.about()} className={linkClass} onClick={close}>
              {t('about')}
            </NavLink>
            <NavLink to={paths.contact()} className={linkClass} onClick={close}>
              {t('contact')}
            </NavLink>
          </div>
          <div className="mt-4">
            <LanguageSelector />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
