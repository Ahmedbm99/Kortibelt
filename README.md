# KORTIBELT — website

Catalogue and quote-request website for KORTIBELT industrial belts (React 19 + Vite 7 + Tailwind v4).
The catalogue is static (`src/data/`); the API in the sibling `CourroieBack` repo only sends the quote, contact and feedback emails.

## Run locally

```bash
npm install
cp .env.example .env.local   # then edit VITE_API_URL if your API isn't on localhost:8080
npm run dev                  # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build into `dist/`: pre-renders every page (FR + EN) to static HTML and generates `sitemap.xml`, `robots.txt` and `404.html` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run assets` | Convert new photos in `public/` to WebP, create the 320/640/960 px thumbnails, update catalogue paths, regenerate `src/data/assetManifest.json` and `docs/missing-assets.md` |

## Environment variables

Set these in `.env.local` locally and in Vercel (Project → Settings → Environment Variables). See `.env.example`.

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL including `/apiv1` (use the backend's stable production domain) |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v3 site key (public). The site's domain must be allowed in the reCAPTCHA admin console |
| `VITE_WHATSAPP_NUMBER`, `VITE_CONTACT_EMAIL`, `VITE_CONTACT_PHONE` | Contact details shown on the site and used for fallbacks |
| `SITE_URL` | Build-time: the public address (e.g. `https://www.kortibelt.com`), used for canonical URLs, hreflang, sitemap and structured data |
| `GOOGLE_SITE_VERIFICATION` | Build-time, optional: Google Search Console verification code |

## Deploy on Vercel

1. Import this repository in Vercel. It detects Vite. `vercel.json` sets the rewrites for client-only pages, the redirects from old URLs and the cache headers. Unknown URLs return a real 404.
2. Add the environment variables above.
3. In the backend project, set `ALLOWED_ORIGINS` to the new domain (comma-separated, e.g. `https://kortibelt.com,https://www.kortibelt.com`).
4. Add the domain to the reCAPTCHA key's allowed domains.
5. Set `SITE_URL` to the domain and redeploy, then submit `/sitemap.xml` in Google Search Console (see `docs/SEO.md`).

## Editing the catalogue

- Products: `src/data/courroieData.js` (each product needs a unique `id`; its URL comes from its `nom`, so renaming a product changes its address). Families, categories, subcategories: `family.js`, `category.js`, `subcategory.js`.
- Photos and datasheets live under `public/public/…` and are referenced as `/public/…`. Paths are case-sensitive on Vercel.
- After adding files, run `npm run assets`: images become WebP, and missing files are listed in `docs/missing-assets.md` (the site hides them until they exist).

See `docs/UX-AUDIT.md` for the UX audit and `docs/SEO.md` for SEO, performance and the owner's to-do list.
