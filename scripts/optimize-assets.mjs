// Optimise les images du site et met à jour les références dans le code.
//
//   npm run assets
//
// 1. Convertit chaque image PNG/JPG de public/ et src/assets/ en WebP (largeur max 1600 px,
//    qualité 80) et supprime l'original (l'historique git le conserve).
// 2. Réécrit les chemins "/….png|jpg|jpeg" en ".webp" dans src/data/*.js et les imports
//    d'images de src/assets dans src/**/*.{js,jsx}. Corrige la casse des dossiers (Vercel est sensible à la casse).
// 3. Génère src/data/assetManifest.json : la liste des fichiers réellement présents sous public/,
//    utilisée par le site pour masquer les images et fiches techniques manquantes.
// 4. Écrit docs/missing-assets.md : chaque fichier référencé par le catalogue mais absent de public/.
//
// À relancer après avoir ajouté de nouvelles photos ou fiches dans public/public/….
import { readdir, readFile, writeFile, stat, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

sharp.cache(false);
const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const ASSETS = path.join(ROOT, "src", "assets");
const DATA = path.join(ROOT, "src", "data");
const SRC = path.join(ROOT, "src");
const RASTER = /\.(png|jpe?g)$/i;
const KEEP_AS_IS = new Set(["favicon.png", "courroie.png", "logo.png", "og-image.jpg"]); // favicon, logo, image de partage (JPEG exigé par certains réseaux)

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const toPosix = (p) => p.split(path.sep).join("/");
let before = 0;
let after = 0;

async function convert(file, maxWidth) {
  const size = (await stat(file)).size;
  const target = file.replace(RASTER, ".webp");
  await sharp(await readFile(file), { limitInputPixels: false })
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(target);
  before += size;
  after += (await stat(target)).size;
  await unlink(file);
}

// 1. Conversion
for (const file of await walk(PUBLIC)) {
  if (RASTER.test(file) && !KEEP_AS_IS.has(path.basename(file))) await convert(file, 1600);
}
const convertedAssets = [];
for (const file of await walk(ASSETS)) {
  if (!RASTER.test(file) || KEEP_AS_IS.has(path.basename(file))) continue;
  const isBadge = toPosix(file).includes("/badges/");
  await convert(file, isBadge ? 240 : 1920);
  convertedAssets.push(toPosix(path.relative(ASSETS, file)));
}

// 1 bis. Vignettes des photos du catalogue (fichier-320.webp, -640, -960), utilisées via srcset.
// Les cartes produits téléchargent ainsi ~30-60 Ko au lieu de la photo complète.
const THUMB_WIDTHS = [320, 640, 960];
const VARIANT_RE = /-(\d+)\.webp$/i;
let thumbs = 0;
for (const file of await walk(path.join(PUBLIC, "public"))) {
  if (!/\.webp$/i.test(file) || VARIANT_RE.test(file)) continue;
  const input = await readFile(file);
  for (const width of THUMB_WIDTHS) {
    const target = file.replace(/\.webp$/i, `-${width}.webp`);
    try {
      if ((await stat(target)).mtimeMs >= (await stat(file)).mtimeMs) continue; // déjà à jour
    } catch {
      /* n'existe pas encore */
    }
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 60 }).toFile(target);
    thumbs++;
  }
}

// Inventaire de public/ (chemins URL, ex. "/public/Ctrapez/classic/z/1.webp")
const publicFiles = (await walk(PUBLIC)).map((f) => "/" + toPosix(path.relative(PUBLIC, f)));
const byLower = new Map(publicFiles.map((p) => [p.toLowerCase(), p]));

// 2. Réécriture des chemins dans src/data
const PATH_RE = /(["'`])(\/[^"'`\s]+?\.(?:png|jpe?g|webp|pdf))\1/gi;
const referenced = new Map(); // chemin -> fichier de données
for (const file of (await readdir(DATA)).filter((f) => f.endsWith(".js"))) {
  const full = path.join(DATA, file);
  const src = await readFile(full, "utf8");
  const next = src.replace(PATH_RE, (m, q, p) => {
    let url = p.replace(/\.(png|jpe?g)$/i, ".webp");
    const real = byLower.get(url.toLowerCase());
    if (real) url = real; // corrige la casse
    referenced.set(url, file);
    return `${q}${url}${q}`;
  });
  if (next !== src) await writeFile(full, next);
}

// Imports d'images de src/assets
if (convertedAssets.length) {
  for (const file of await walk(SRC)) {
    if (!/\.(jsx?|css)$/.test(file)) continue;
    const src = await readFile(file, "utf8");
    let next = src;
    for (const rel of convertedAssets) {
      const webp = rel.replace(RASTER, ".webp");
      next = next.split(`assets/${rel}`).join(`assets/${webp}`);
    }
    if (next !== src) await writeFile(file, next);
  }
}

// 3. Manifeste des fichiers présents
const manifest = publicFiles.filter((p) => /\.(webp|png|jpe?g|pdf|svg)$/i.test(p)).sort();
await writeFile(path.join(DATA, "assetManifest.json"), JSON.stringify(manifest, null, 0) + "\n");

// 4. Rapport des fichiers manquants
const present = new Set(publicFiles);
const missing = [...referenced.entries()].filter(([p]) => !present.has(p)).sort();
await mkdir(path.join(ROOT, "docs"), { recursive: true });
const report = [
  "# Missing catalogue files",
  "",
  "Generated by `npm run assets`. These files are referenced in `src/data/*.js` but don't exist under `public/`.",
  "The site hides them (placeholder image, no datasheet button). To fix one, add the file at that exact path",
  "(a .jpg/.png is fine: the script converts it to .webp) and run `npm run assets` again.",
  "",
  `**${missing.length} missing** (${missing.filter(([p]) => p.endsWith(".pdf")).length} datasheets).`,
  "",
  "| Path | Referenced in |",
  "|---|---|",
  ...missing.map(([p, f]) => `| \`${p}\` | ${f} |`),
  "",
].join("\n");
await writeFile(path.join(ROOT, "docs", "missing-assets.md"), report);

const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";
console.log(`Images converted: ${mb(before)} -> ${mb(after)}, thumbnails generated: ${thumbs}`);
console.log(`Referenced paths: ${referenced.size}, missing: ${missing.length}`);
