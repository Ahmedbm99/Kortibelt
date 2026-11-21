import { NavLink, useLocation } from 'react-router-dom';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { families, getCategoriesOf, getSubcategoriesOf, localName, pathOfSubcategory } from '@/data/catalog';
import { parsePath } from '@/lib/paths';

/** Famille / catégorie / sous-catégorie actives, déduites de l'adresse. */
function useActivePath() {
  const { pathname } = useLocation();
  const info = parsePath(pathname);
  if (info.page === 'belt') {
    const p = pathOfSubcategory(info.belt.subcategory_id);
    return { familyId: p.family?.id, categoryId: p.category?.id, subcategoryId: p.subcategory?.id };
  }
  if (info.page === 'category' && getSubcategoriesOf(info.category.id).length === 1) {
    return { familyId: info.family.id, categoryId: info.category.id, subcategoryId: getSubcategoriesOf(info.category.id)[0].id };
  }
  return { familyId: info.family?.id, categoryId: info.category?.id, subcategoryId: info.subcategory?.id };
}

const itemClass = (active) =>
  `block rounded-md px-2 py-1.5 text-sm transition-colors ${
    active ? 'bg-accent-soft font-semibold text-accent-text' : 'text-muted-foreground hover:bg-secondary hover:text-primary'
  }`;

export default function Sidebar() {
  const { t, language, paths } = useLanguage();
  const active = useActivePath();

  return (
    <nav aria-label={t('productCategory')} className="sticky top-24 max-h-[calc(100vh-7rem)] w-72 overflow-y-auto p-4">
      <h2 className="text-xl font-bold text-primary">{t('productCategory')}</h2>
      <div className="mb-4 mt-2 h-1 w-16 bg-accent" />

      <NavLink to={paths.products()} end className={({ isActive }) => itemClass(isActive)}>
        {t('allProducts')}
      </NavLink>

      <Accordion
        key={active.familyId ?? 'none'}
        type="single"
        collapsible
        defaultValue={active.familyId ? `fam-${active.familyId}` : undefined}
        className="mt-2 w-full"
      >
        {families.map((f) => (
          <AccordionItem key={f.id} value={`fam-${f.id}`}>
            <AccordionTrigger
              className={`px-2 text-left font-medium ${active.familyId === f.id ? 'text-accent-text' : 'text-primary'}`}
            >
              {localName(f, language)}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-2 space-y-1 border-l border-border pl-3">
                <li>
                  <NavLink to={paths.family(f)} className={({ isActive }) => itemClass(isActive)}>
                    {t('seeCategories')}
                  </NavLink>
                </li>
                {getCategoriesOf(f.id).map((c) => {
                  const subs = getSubcategoriesOf(c.id);
                  const catActive = active.categoryId === c.id;
                  return (
                    <li key={c.id}>
                      {/* Une seule sous-catégorie : lien direct vers les produits */}
                      <NavLink
                        to={paths.category(c)}
                        className={() => itemClass(catActive && (subs.length === 1 || !active.subcategoryId))}
                      >
                        {localName(c, language)}
                      </NavLink>
                      {catActive && subs.length > 1 && (
                        <ul className="ml-3 mt-1 space-y-1 border-l border-border pl-3">
                          {subs.map((s) => (
                            <li key={s.id}>
                              <NavLink to={paths.subcategory(s)} className={() => itemClass(active.subcategoryId === s.id)}>
                                {localName(s, language)}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </nav>
  );
}
