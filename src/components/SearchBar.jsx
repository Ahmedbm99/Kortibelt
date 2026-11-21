import { useId, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Recherche globale : envoie vers /products?q=… (lien partageable, fonctionne depuis toutes les pages).
 * Sur la page produits, la recherche se met à jour pendant la saisie.
 */
const SearchBar = ({ onSubmitted }) => {
  const { t, paths } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const urlQuery = params.get('q') || '';
  const [query, setQuery] = useState(urlQuery);
  const id = useId();
  const productsPath = paths.products();
  const onProducts = pathname === productsPath;

  // Garder le champ synchronisé quand l'URL change (bouton retour, filtre effacé…).
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);
  if (lastUrlQuery !== urlQuery) {
    setLastUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const go = (value, replace) => {
    const q = value.trim();
    const next = new URLSearchParams(onProducts ? params : undefined);
    if (q) next.set('q', q);
    else next.delete('q');
    const search = next.toString();
    navigate({ pathname: productsPath, search: search ? `?${search}` : '' }, { replace });
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (onProducts) go(e.target.value, true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    go(query, onProducts);
    onSubmitted?.();
  };

  return (
    <form role="search" onSubmit={handleSubmit} className="relative w-full max-w-md">
      <label htmlFor={id} className="sr-only">
        {t('searchLabel')}
      </label>
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={query}
        onChange={handleChange}
        placeholder={t('searchPlaceholder')}
        className="h-11 w-full rounded-full border border-input bg-white pl-10 pr-24 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 h-9 -translate-y-1/2 rounded-full bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
      >
        {t('search')}
      </button>
    </form>
  );
};

export default SearchBar;
