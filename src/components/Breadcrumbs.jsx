import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { breadcrumbList } from '@/lib/structuredData';

/**
 * Fil d'Ariane visible + données structurées BreadcrumbList (affichées par Google sous le titre).
 * items : [{ label, to? }] ; le dernier élément est la page courante.
 */
export default function Breadcrumbs({ items }) {
  const { t, paths } = useLanguage();
  const all = [{ label: t('home'), to: paths.home() }, ...items.filter((i) => i && i.label)];

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList(all)) }} />
      <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
        {all.map((item, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={14} aria-hidden="true" />}
              {last || !item.to ? (
                <span aria-current={last ? 'page' : undefined} className={last ? 'font-medium text-primary' : ''}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="inline-flex min-h-10 items-center hover:text-accent-text hover:underline lg:min-h-0">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
