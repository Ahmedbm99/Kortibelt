import { useId } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Minus, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import PageHeader from '@/components/PageHeader';
import Seo from '@/components/Seo';
import { imageSources, onImageError } from '@/lib/asset';
import { getBelt } from '@/data/catalog';

function CartLine({ item }) {
  const { t, paths } = useLanguage();
  const belt = getBelt(item.id);
  const { removeFromCart, updateQuantity, updateNote } = useCart();
  const qtyId = useId();
  const noteId = useId();

  return (
    <li className="rounded-xl bg-white p-4 shadow-md sm:p-5">
      <div className="flex flex-wrap items-start gap-4">
        <Link to={belt ? paths.belt(belt) : paths.products()} className="shrink-0" tabIndex={-1} aria-hidden="true">
          <img
            src={imageSources(item.image).src}
            alt=""
            onError={onImageError}
            width="96"
            height="96"
            className="h-20 w-20 rounded-lg object-cover sm:h-24 sm:w-24"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-primary">
            <Link to={belt ? paths.belt(belt) : paths.products()} className="hover:underline">
              {item.nom}
            </Link>
          </h2>
          <p className="text-sm text-muted-foreground">
            {[item.profil, item.material && `${t('material')} : ${item.material}`].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor={qtyId} className="sr-only">
            {t('quantity')}
          </label>
          <button
            type="button"
            onClick={() => updateQuantity(item.key, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label={t('decrease')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-secondary disabled:opacity-40"
          >
            <Minus size={16} aria-hidden="true" />
          </button>
          <input
            id={qtyId}
            type="number"
            inputMode="numeric"
            min="1"
            max="100000"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.key, e.target.value)}
            className="h-10 w-20 rounded-md border border-input text-center font-semibold outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="button"
            onClick={() => updateQuantity(item.key, item.quantity + 1)}
            aria-label={t('increase')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-secondary"
          >
            <Plus size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => removeFromCart(item.key)}
            aria-label={t('removeItem', { name: item.nom })}
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-md text-destructive hover:bg-red-50"
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mt-3">
        <label htmlFor={noteId} className="mb-1 block text-sm font-medium text-primary">
          {t('note')} <span className="font-normal text-muted-foreground">({t('optional')})</span>
        </label>
        <input
          id={noteId}
          type="text"
          value={item.note}
          maxLength={500}
          onChange={(e) => updateNote(item.key, e.target.value)}
          placeholder={t('notePlaceholder')}
          className="h-10 w-full rounded-md border border-input px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </div>
    </li>
  );
}

const Cart = () => {
  const { t, paths } = useLanguage();
  const { items, clearCart } = useCart();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <Seo title={t('quoteListTitle')} noindex />
      <PageHeader title={t('quoteListTitle')} intro={items.length > 0 ? t('quoteListIntro') : undefined} />

      {items.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <ClipboardList className="mx-auto mb-4 text-muted-foreground" size={56} aria-hidden="true" />
          <h2 className="text-xl font-bold text-primary">{t('quoteListEmpty')}</h2>
          <p className="mt-1 text-muted-foreground">{t('quoteListEmptyHint')}</p>
          <Link
            to={paths.products()}
            className="mt-6 inline-flex h-11 items-center rounded-md bg-cta px-6 font-semibold text-white hover:bg-cta-hover"
          >
            {t('allProducts')}
          </Link>
        </div>
      ) : (
        <>
          <ul className="mb-6 space-y-4">
            {items.map((item) => (
              <CartLine key={item.key} item={item} />
            ))}
          </ul>

          <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <Link
                to={paths.products()}
                className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-white px-5 font-semibold text-primary hover:bg-secondary"
              >
                {t('continueBrowsing')}
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold text-muted-foreground hover:text-destructive"
              >
                {t('clearCart')}
              </button>
            </div>
            <Link
              to={paths.checkout()}
              className="inline-flex h-12 items-center justify-center rounded-md bg-cta px-6 text-lg font-semibold text-white hover:bg-cta-hover"
            >
              {t('nextStep')}
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
