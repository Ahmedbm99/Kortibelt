// Accès unique au catalogue statique (familles → catégories → sous-catégories → courroies).
// Les pages lisent toujours ici, à partir des paramètres d'URL : pas d'état global.
import families from "./family";
import categories from "./category";
import subcategoriesRaw from "./subcategory";
import belts from "./courroieData";
import { assetExists } from "@/lib/asset";
import { slugify } from "@/lib/slug";

export const subcategories = subcategoriesRaw.flat();
export { families, categories, belts };

// Applications proposées en filtre (clé = valeur du champ `application` des courroies).
export const APPLICATIONS = ["industry", "automotive", "agriculture", "conveyors"];

const byId = (list) => new Map(list.map((x) => [x.id, x]));
const familyMap = byId(families);
const categoryMap = byId(categories);
const subcategoryMap = byId(subcategories);
const beltMap = byId(belts);

export const getFamily = (id) => familyMap.get(Number(id));
export const getCategory = (id) => categoryMap.get(Number(id));
export const getSubcategory = (id) => subcategoryMap.get(Number(id));
export const getBelt = (id) => beltMap.get(Number(id));

const countBySub = belts.reduce((acc, b) => {
  acc[b.subcategory_id] = (acc[b.subcategory_id] || 0) + 1;
  return acc;
}, {});

// ---------- Slugs (adresses lisibles) ----------
// Familles, catégories, sous-catégories : un slug par langue (uniques dans leur parent).
// Courroies : un slug unique (nom français), complété par la sous-catégorie en cas d'homonyme.
const LANG_FIELD = { fr: 'nomFrancais', en: 'nomAnglais' };
const nodeSlug = (item, lang) => slugify(item[LANG_FIELD[lang]] || item.nomFrancais);

const beltSlugs = new Map();
{
  const byName = new Map();
  for (const b of belts) {
    const s = slugify(b.nom);
    byName.set(s, [...(byName.get(s) || []), b]);
  }
  const used = new Set();
  for (const [s, list] of byName) {
    for (const b of list) {
      let slug = list.length === 1 ? s : `${s}-${slugify(getSubcategory(b.subcategory_id)?.nomFrancais || b.profil)}`;
      if (used.has(slug)) slug = `${slug}-${b.id}`;
      used.add(slug);
      beltSlugs.set(b.id, slug);
    }
  }
}
const beltBySlug = new Map([...beltSlugs].map(([id, slug]) => [slug, beltMap.get(id)]));

export const familySlug = (fam, lang) => nodeSlug(fam, lang);
export const categorySlug = (cat, lang) => nodeSlug(cat, lang);
export const subcategorySlug = (sub, lang) => nodeSlug(sub, lang);
export const beltSlug = (belt) => beltSlugs.get(belt.id);

export const findFamilyBySlug = (slug, lang) => families.find((f) => familySlug(f, lang) === slug);
export const findCategoryBySlug = (family, slug, lang) =>
  family && categories.find((c) => c.famille_id === family.id && categorySlug(c, lang) === slug);
export const findSubcategoryBySlug = (category, slug, lang) =>
  category && subcategories.find((s) => s.category_id === category.id && subcategorySlug(s, lang) === slug);
export const findBeltBySlug = (slug) => beltBySlug.get(slug);

/** Nombre de courroies d'une sous-catégorie. */
export const beltCount = (subcategoryId) => countBySub[subcategoryId] || 0;

/** Sous-catégories d'une catégorie, sans les sous-catégories vides. */
export const getSubcategoriesOf = (categoryId) =>
  subcategories.filter((s) => s.category_id === Number(categoryId) && beltCount(s.id) > 0);

/** Catégories d'une famille, sans les catégories vides. */
export const getCategoriesOf = (familyId) =>
  categories.filter((c) => c.famille_id === Number(familyId) && getSubcategoriesOf(c.id).length > 0);

/** Nombre de courroies par application (pour masquer les tuiles vides). */
export const applicationCount = (key) => belts.filter((b) => b.application === key).length;

/** Nom localisé d'une famille / catégorie / sous-catégorie. */
export const localName = (item, language) =>
  item ? (language === "en" ? item.nomAnglais || item.nomFrancais : item.nomFrancais) : "";

export const localDescription = (item, language) =>
  item ? (language === "en" ? item.descriptionAnglais || item.descriptionFrancais : item.descriptionFrancais) : "";

/** Fil d'Ariane d'une sous-catégorie : [famille, catégorie, sous-catégorie]. */
export const pathOfSubcategory = (subcategoryId) => {
  const sub = getSubcategory(subcategoryId);
  const cat = sub && getCategory(sub.category_id);
  const fam = cat && getFamily(cat.famille_id);
  return { family: fam, category: cat, subcategory: sub };
};

/** Images existantes d'une courroie (les fichiers manquants sont ignorés). */
export const beltImages = (belt) =>
  (belt?.images || []).map((i) => i.image_url).filter(assetExists);

/** Fiches techniques existantes d'une courroie. */
export const beltDatasheets = (belt) =>
  (belt?.fiches || []).map((f) => f.fiche_technique_url).filter(assetExists);

/** Matières d'une courroie, sans doublons. */
export const beltMaterials = (belt) => [...new Set((belt?.matieres || []).map((m) => m.matiere).filter(Boolean))];

/** Dimensions courtes pour les cartes : "10 × 6 mm" ou "Pas 8 mm". */
export const beltDimensions = (belt) => {
  const parts = [];
  if (belt.largeur_mm && belt.hauteur_mm) parts.push(`${belt.largeur_mm} × ${belt.hauteur_mm} mm`);
  else if (belt.largeur_mm) parts.push(`${belt.largeur_mm} mm`);
  if (belt.pas_mm) parts.push(`P ${belt.pas_mm} mm`);
  return parts.join(" · ");
};

const normalize = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

/**
 * Recherche classée : correspondance exacte ou en début de profil / nom / référence d'abord,
 * puis correspondance dans ces champs, puis dans la description.
 */
export const searchBelts = (list, query) => {
  const q = normalize(query);
  if (!q) return list;
  const scored = [];
  for (const b of list) {
    const profil = normalize(b.profil);
    const keys = [profil, normalize(b.nom), normalize(b.reference_fabricant)];
    let score = 0;
    if (profil === q) score = 100;
    else if (keys.some((k) => k && k.startsWith(q))) score = 80;
    else if (keys.some((k) => k && k.split(/[\s-]+/).some((w) => w.startsWith(q)))) score = 60;
    else if (keys.some((k) => k && k.includes(q))) score = 40;
    else if (q.length >= 3 && normalize(b.description).includes(q)) score = 10;
    if (score) scored.push({ b, score });
  }
  return scored.sort((x, y) => y.score - x.score).map((x) => x.b);
};

/** Courroies de la même sous-catégorie (produits associés). */
export const relatedBelts = (belt, limit = 4) =>
  belts.filter((b) => b.subcategory_id === belt.subcategory_id && b.id !== belt.id).slice(0, limit);

/** Formate un nombre du catalogue ("8,5" ou "9.7") selon la langue. */
export const formatNumber = (value, language) => {
  const n = Number(String(value).replace(",", "."));
  if (!Number.isFinite(n)) return String(value);
  return n.toLocaleString(language === "en" ? "en-US" : "fr-FR", { maximumFractionDigits: 2 });
};
