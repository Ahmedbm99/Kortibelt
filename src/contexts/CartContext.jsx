import { createContext, useContext, useSyncExternalStore } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { storage } from "@/lib/storage";
import { getBelt, beltImages } from "@/data/catalog";

// Panier = demande de devis (pas de prix). Sauvegardé dans le navigateur.
const STORAGE_KEY = "kortibelt_quote";
const CartContext = createContext(undefined);

/** Une ligne = une courroie dans une matière donnée. */
const lineKey = (id, material) => `${id}::${material || ""}`;

const toLine = (belt, material, quantity = 1) => ({
  key: lineKey(belt.id, material),
  id: belt.id,
  nom: belt.nom,
  profil: belt.profil,
  reference: belt.reference_fabricant || "",
  image: beltImages(belt)[0] || null,
  material: material || "",
  note: "",
  quantity,
});

const loadLines = () => {
  const saved = storage.getJSON(STORAGE_KEY, []);
  if (!Array.isArray(saved)) return [];
  // On ne garde que les produits qui existent encore dans le catalogue.
  return saved.filter((l) => l && l.key && getBelt(l.id));
};

// Magasin externe : les pages pré-rendues (HTML statique) affichent un panier vide,
// puis le navigateur charge le panier enregistré sans erreur d'hydratation (useSyncExternalStore).
const EMPTY = [];
let current = null;
const listeners = new Set();
const readLines = () => {
  if (current === null) current = loadLines();
  return current;
};
const writeLines = (next) => {
  current = next;
  storage.setJSON(STORAGE_KEY, next);
  listeners.forEach((l) => l());
};
const subscribe = (listener) => {
  listeners.add(listener);
  // Synchronisation entre onglets ouverts
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) {
      current = loadLines();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

export const CartProvider = ({ children }) => {
  const { t, paths } = useLanguage();
  const items = useSyncExternalStore(subscribe, readLines, () => EMPTY);
  const setItems = (update) => writeLines(typeof update === "function" ? update(readLines()) : update);

  const viewLink = (
    <Link to={paths.cart()} className="font-semibold text-accent-text underline" onClick={() => toast.dismiss()}>
      {t("viewQuote")}
    </Link>
  );

  /** Ajoute une courroie (dans la matière choisie) à la demande de devis. */
  const addToCart = (belt, material = "") => {
    const key = lineKey(belt.id, material);
    const exists = items.some((l) => l.key === key);
    setItems((prev) =>
      exists ? prev.map((l) => (l.key === key ? { ...l, quantity: l.quantity + 1 } : l)) : [...prev, toLine(belt, material)]
    );
    const label = material ? `${belt.nom} (${material})` : belt.nom;
    toast.success(
      <span className="flex flex-col gap-1">
        <span>{t(exists ? "quantityIncreased" : "addedToQuote", { name: label })}</span>
        {viewLink}
      </span>,
      { id: "cart" }
    );
  };

  const removeFromCart = (key) => {
    const index = items.findIndex((l) => l.key === key);
    if (index === -1) return;
    const removed = items[index];
    setItems((prev) => prev.filter((l) => l.key !== key));
    toast(
      (tst) => (
        <span className="flex items-center gap-3">
          {t("removedFromQuote")}
          <button
            type="button"
            className="font-semibold text-accent-text underline"
            onClick={() => {
              setItems((prev) => {
                const next = prev.filter((l) => l.key !== key);
                next.splice(Math.min(index, next.length), 0, removed);
                return next;
              });
              toast.dismiss(tst.id);
            }}
          >
            {t("undo")}
          </button>
        </span>
      ),
      { id: "cart", duration: 5000 }
    );
  };

  const updateLine = (key, patch) => setItems((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));

  const updateQuantity = (key, quantity) => {
    const q = Math.max(1, Math.min(100000, Math.floor(Number(quantity) || 1)));
    updateLine(key, { quantity: q });
  };

  const updateNote = (key, note) => updateLine(key, { note: note.slice(0, 500) });

  /** Vide la demande sans notification (après envoi réussi, ou bouton "Vider"). */
  const clearCart = () => setItems([]);

  const totalItems = items.length;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, updateNote, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
