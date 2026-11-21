# Kortibelt — KORTIBELT catalogue website (frontend)

A single-page app for KORTIBELT, a brand of industrial belts distributed in Tunisia by AisGroup.
- **Browsing:** visitors go family → category → subcategory → product, or search from any page.
- **Quote cart:** visitors add belts to a quote "cart" (no prices), choosing a material and adding a note on each line.
- **Sending:** they send the quote request or a contact message.

The API lives in `../CourroieBack` and only sends emails. See `../CLAUDE.md` for how the two fit together. The UX audit and the owner's to-do list are in `docs/UX-AUDIT.md`.

## Stack and commands
- **Libraries:** React 19 with the React Compiler, Vite 7, react-router-dom 7, Tailwind v4 (`@tailwindcss/vite`), shadcn/ui (in `src/components/ui`), lucide-react, react-hot-toast, axios, react-phone-number-input, react-google-recaptcha-v3.
- **JavaScript (`.jsx`), not TypeScript.** The `@` alias points to `src/`.
- **Commands:**
  - `npm run dev`: dev server (client rendering only, no pre-rendering).
  - `npm run build`: client build, then SSR build of `src/entry-server.jsx`, then `scripts/prerender.mjs`, which writes one static HTML page per indexable URL (334 pages, FR + EN), `404.html`, `app.html`, `sitemap.xml` and `robots.txt`. Set `SITE_URL` so canonical, sitemap and structured-data URLs are right.
  - `npm run lint`: lint.
  - `npm run preview`: serve the build. Its SPA fallback is not Vercel's: client-only pages fall back to the home HTML.
  - `npm run assets`: images → WebP, thumbnails `-320/-640/-960.webp`, asset manifest, missing-files report.
- **Verify** with `npm run lint && npm run build`. There are no tests.
- **Deploy:** Vercel. `vercel.json`:
  - No catch-all rewrite, so unknown URLs get `404.html` with a real 404 status.
  - Client-only pages (`/devis`, `/merci`, `/en/quote…`, `/en/thank-you`) and the old `/products/*`, `/category/*`, `/subcategory/*` URLs are rewritten to `app.html`.
  - Old static URLs get permanent redirects.
  - Cache headers.

## Layout (`src/`)
```
main.jsx            Removes pre-rendered [data-seo] head tags, then hydrateRoot (pre-rendered page) or createRoot
                    (app.html, or 404.html marked data-client-only)
Root.jsx            LanguageProvider → CartProvider → App (shared by the browser and the pre-renderer)
entry-server.jsx    render(url) → { head, html } and prerenderRoutes() (used only by scripts/prerender.mjs)
App.jsx             FeedbackProvider (modal lazy-loaded on first open), Toaster, routes, WhatsApp button
routes.jsx          FR routes at the root and EN routes under /en (built from lib/paths.js SEGMENTS); CatalogPage picks
                    the catalogue page from the URL slugs; legacy redirects; lazy-loaded pages
data/catalog.js     THE way to read the catalogue: getters, slugs (familySlug/categorySlug/subcategorySlug per
                    language, beltSlug unique), findXBySlug, searchBelts, beltImages/beltDatasheets (skip missing files)
lib/paths.js        Every internal URL: pathsFor(lang).belt(b)/family(f)/…, parsePath(pathname), alternatePath (FR⇄EN)
lib/site.js         SITE_URL (from vite.config define) and absoluteUrl
lib/structuredData  schema.org JSON-LD: organization, website, breadcrumbList, product, itemList
lib/                asset.js (imageSources: srcset of thumbnails), config.js, storage.js, validation.js, pdf.js, share.js
contexts/           LanguageContext (language from the URL; t(key, vars); paths), CartContext (useSyncExternalStore
                    store: empty on the server, localStorage in the browser, synced across tabs), FeedbackContext
components/         Seo (title/description/canonical/hreflang/OG/JSON-LD, hoisted to <head> by React 19),
                    ResponsiveImage, Breadcrumbs (also emits BreadcrumbList), RecaptchaProvider (forms only), …
pages/              Home, Products, Types (family), subCategory (category), ProductDetail, Cart, Checkout,
                    thankyou, ContactPage, AboutPage, MatierePage, NotFound, FeedbackModal
i18n/               languages.js (original fr/en dictionaries) + ux.js (UX and SEO keys, merged in)
```

## Routes (language in the URL; slugs, not ids)
| Page | French | English |
|---|---|---|
| Home | `/` | `/en` |
| All belts (`?q=`, `?application=`, `?page=`) | `/courroies` | `/en/belts` |
| Family | `/courroies/<family>` | `/en/belts/<family>` |
| Category | `/courroies/<family>/<category>` | `/en/belts/<family>/<category>` |
| Subcategory | `/courroies/<family>/<category>/<sub>` | `/en/belts/…` |
| Product | `/courroie/<belt-slug>` | `/en/belt/<belt-slug>` |
| Quote cart / form / thanks | `/devis`, `/devis/coordonnees`, `/merci` | `/en/quote`, `/en/quote/details`, `/en/thank-you` |
| Other | `/contact`, `/a-propos`, `/matieres?id=1\|2\|3` | `/en/contact`, `/en/about`, `/en/materials` |

- **Slugs:**
  - Family, category and subcategory slugs come from `nomFrancais` / `nomAnglais`.
  - Belt slugs come from `nom` and are shared by both languages. Homonyms get the subcategory name appended.
- **Single-subcategory categories:** a category with a single subcategory shows its products at the category URL; the subcategory URL redirects there.
- **Renaming catalogue items changes their URLs.** Avoid it once the site is indexed, or add redirects.

## SEO rules
- **One `<Seo>` per page:** every page renders exactly one `<Seo title description jsonLd? noindex? />`. Never set `document.title` by hand.
- **Navigation:** build every link with `paths` from `useLanguage()`. Never hard-code a URL.
- **Noindex pages:**
  - Search results (`?q=`), `?page>1` and the quote, thanks and 404 pages are `noindex`.
  - `robots.txt` disallows the quote pages.
- **New indexable pages:**
  - Add the page to `prerenderRoutes()` in `entry-server.jsx`.
  - Add its client route.
  - Add its FR/EN mapping in `lib/paths.js`.
- **Pre-rendering safety:** anything that reads the browser (`window`, `localStorage`, `matchMedia`) must do it in an effect, an event or a `useSyncExternalStore` server snapshot. Otherwise the pre-rendered HTML and the browser render differ (hydration errors).
- **reCAPTCHA:** wrap any new form in `RecaptchaProvider` locally. Don't add it globally: it costs ~350 KB and third-party cookies on every page.

## Conventions
- **Catalogue data:** always read it through `data/catalog.js`. Never prefix asset paths with a host: use `assetUrl(path)` or `beltImages(belt)`. Paths are case-sensitive on Vercel. Product `id`s must be unique.
- **i18n:**
  - `const { t, language } = useLanguage()`. Use `t('key')` or `t('key', { n })` for `{n}` placeholders.
  - Add every new key to **both** `fr` and `en` in `i18n/ux.js`.
  - For data names, use `localName(item, language)`.
  - Product names and descriptions are French only.
- **Styling:**
  - Use the brand tokens defined in `src/index.css` `@theme`: `primary` (#0A1A2F navy), `accent` (#F97421, for backgrounds and borders), `accent-hover`, `accent-text` (#C2410C, for orange text on light backgrounds, which passes contrast) and `accent-soft`, plus `background`, `secondary`, `muted-foreground` and `border`.
  - Make tap targets at least 40–44 px.
- **Forms:**
  - Use `FormField` (it sets the label, the required/optional mark and `aria-describedby` errors) and `validateFields`.
  - Get the anti-spam fields with `useSpamGuard()` and spread `await guard.fields('<action>')` into the request.
  - On failure, show `t(apiErrorKey(err))` plus `<ContactFallback>`.
- **Two sending channels on every form** (quote, contact, feedback), chosen with `<ChannelPicker>`:
  - **Email:** the API call described above.
  - **WhatsApp (PDF):** no server involved. `lib/documents.js` (`buildQuotePdf`, `buildContactPdf`, `buildFeedbackPdf`) builds a branded PDF in the browser with jsPDF, which is lazy-loaded through `lib/pdf.js`. `<WhatsAppPdfPanel>` then lets the visitor send it: the share sheet (`navigator.share` with files, `lib/share.js`) when supported, otherwise download the PDF, open the wa.me chat and attach it.
  - With WhatsApp the email field is optional.
  - `wa.me` links can't attach files, so don't try to send the PDF through a link.
  - PDF text must stay in Latin characters (Helvetica/WinAnsi). `clean()` in `lib/pdf.js` strips anything else, such as emoji or Arabic.
- **Components:** PascalCase `.jsx` files with a default export, imported via `@/`. Give icon-only buttons an `aria-label`.
- **Responsive:** tested on screens from 320 px wide up to 1920 px. The breakpoints:
  - **Header:** compact below `lg` (1024 px): logo, cart and menu button. The search bar shows in the header from `md` and inside the menu below that.
  - **Catalogue sidebar:** shown from `lg`.
  - **Product page:** two columns from `md`; its two action buttons sit side by side only from `xl`.
- **Keep the page from scrolling sideways:**
  - Single-column grids holding long text or `truncate` need `grid-cols-1`, or `minmax(0,…)` tracks. Otherwise the column grows to fit the text and the page scrolls sideways; this happened with the WhatsApp PDF panel and the feedback dialog.
  - Wide tables go inside `overflow-x-auto`.
  - Long emails get `break-all`.
- **Tap targets** are at least 40–44 px on touch screens (`min-h-11` / `h-11`, including footer and breadcrumb links).
- **In a `flex-col`, don't use `flex-1` on buttons:** it collapses their height. Use `w-full` plus `<bp>:flex-1` instead.
- **Floating WhatsApp button:** hidden on phones on `/cart`, `/checkout`, `/contact` and `/thank-you`, where it would cover form fields.

## Known gaps (see `docs/UX-AUDIT.md`)
- **Missing files:** 288 photo and datasheet paths in the data point to files that don't exist. They are listed in `docs/missing-assets.md`, and the site shows placeholders for them. After adding files, run `npm run assets`.
- **Product names and descriptions are French only.**
- **There are no dimension or material filters yet.**
- **The main JS bundle (~173 kB gzipped) includes the whole catalogue.** That is acceptable at 138 products.
