import manifest from "@/data/assetManifest.json";
import noImage from "@/assets/noimage.webp";

// Fichiers réellement présents sous public/ (généré par `npm run assets`).
const available = new Set(manifest);

export const NO_IMAGE = noImage;

/** Largeurs des versions réduites générées par `npm run assets` (fichier-320.webp, -640.webp, -960.webp). */
export const THUMB_WIDTHS = [320, 640, 960];
const FULL_WIDTH = 1600;

/** true si le fichier référencé par le catalogue existe dans public/. */
export const assetExists = (path) => Boolean(path) && available.has(path);

/** URL d'une image du catalogue, ou l'image par défaut si elle est absente. */
export const assetUrl = (path) => (assetExists(path) ? path : NO_IMAGE);

const variant = (path, width) => path.replace(/\.webp$/i, `-${width}.webp`);

/**
 * Sources d'une image du catalogue : la plus petite version en `src`, toutes les tailles en `srcSet`.
 * Le navigateur télécharge ainsi une vignette de ~40 Ko au lieu de la photo pleine taille.
 */
export const imageSources = (path) => {
  if (!assetExists(path)) return { src: NO_IMAGE };
  const variants = THUMB_WIDTHS.map((w) => [variant(path, w), w]).filter(([p]) => available.has(p));
  if (!variants.length) return { src: path };
  return {
    src: variants[0][0],
    srcSet: [...variants.map(([p, w]) => `${p} ${w}w`), `${path} ${FULL_WIDTH}w`].join(', '),
  };
};

/** À passer en onError d'un <img> : remplace une image cassée par l'image par défaut. */
export const onImageError = (e) => {
  if (e.currentTarget.src.endsWith(NO_IMAGE)) return;
  e.currentTarget.removeAttribute("srcset");
  e.currentTarget.src = NO_IMAGE;
};
