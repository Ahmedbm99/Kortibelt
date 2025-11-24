import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {Accordion,AccordionItem,AccordionTrigger,AccordionContent} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingCart } from 'lucide-react';
import logo from "@/assets/logo.png";
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchBar from './SearchBar';
import {useCart} from '@/contexts/CartContext';
import FamilleServices from "@/services/FamilyServices";
import TypesServices from "@/services/TypesServices";
const Navbar = ({ onSearch, showSearch = true, onFamilySelect , onCategorySelect}) => {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language } = useLanguage();
  const { totalItems } = useCart();
const [families, setFamilies] = useState([]);
const [types, setTypes] = useState([]);

useEffect(() => {
  const loadData = async () => {
    try {
      const fam = await FamilleServices.getAllFamilies();
      const typ = await TypesServices.getAllTypes();
      setFamilies(fam.data);
      setTypes(typ.data);
    } catch (err) {
      console.log(err);
    }
  };
  loadData();
}, []);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-orange-600 font-semibold transition-colors"
      : "text-foreground hover:text-orange-400 transition-colors";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-lg shadow-md' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Logo" className="h-36 w-auto" />
          </NavLink>

          {/* Search Bar */}
          {showSearch && onSearch && (
            <div className="flex-1 max-w-md mx-4">
              <SearchBar onSearch={onSearch} placeholder={t('products')} />
            </div>
          )}

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={navLinkClass}>
              {t("Home")}
            </NavLink>

            <NavLink to="/products" className={navLinkClass}>
              {t("products")}
            </NavLink>
      
            <Button>
            <NavLink to="/about" className={navLinkClass}> {t("about")}
            </NavLink>
            </Button>
            <Button  >
              <NavLink to="/contact" className={navLinkClass}>{t("contact")}</NavLink>
            </Button>
            <Button variant="default" asChild className="bg-accent hover:bg-accent/90">
             <NavLink to="/cart" className={navLinkClass}>
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-400 text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </NavLink>
            </Button>
            <LanguageSelector />
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 animate-fade-in-up">
            <div className="flex flex-col gap-4 mt-4">
              <NavLink to="/" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                {t("Home")}
              </NavLink>

          <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4" >

            <Accordion type="single" collapsible className="w-full space-y-2">

              {families.map((f) => (
                <AccordionItem
                  key={f.id}
                  value={`fam-${f.id}`}
                  className="border-b pb-1"
                >
                  {/* FAMILY NAME */}
                  <AccordionTrigger
                    onClick={() => {
                      onFamilySelect(f.id);
                      navigate("/products");
                    }}
                    className="text-left font-medium text-foreground hover:text-orange-500"
                  >
                    {language === "en" ? f.nomAnglais : f.nomFrancais}
                  </AccordionTrigger>

                  {/* TYPES */}
                  <AccordionContent>
                    <div className="ml-4 mt-1 space-y-1 border-l border-gray-300 pl-3">
                      {types
                        .filter((t) => t.famille_id === f.id)
                        .map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              onCategorySelect(t.id);
                              setIsMobileMenuOpen(false);
                              navigate("/products");
                            }}
                            className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                          >
                            {language === "en" ? t.nomAnglais : t.nomFrancais}
                          </button>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}

            </Accordion>
          </div>


              <NavLink to="/about" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                {t("about")}
              </NavLink>

              <Button variant="default" asChild className="bg-accent hover:bg-accent/90 w-full mt-2">
                <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("contact")}
                </NavLink>
              </Button>
                            <Button variant="default" asChild className="bg-accent hover:bg-accent/90 w-full mt-2">
             <NavLink to="/cart" className="relative text-foreground hover:text-accent transition-colors">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </NavLink>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
