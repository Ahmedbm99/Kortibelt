# KORTIBELT — SEO and performance

## What to expect

Nobody can guarantee the first Google result for every search. Ranking depends on:
- **Competition** for each search term.
- **Links from other sites** pointing to yours.
- **The domain's age and reputation.**
- **Google's own judgment** of the content.

What the site can control, it now does well. Lighthouse, Google's own audit tool, gives 100/100 for SEO on every page. The site is fast and Google can read all of it. For product searches ("courroie SPZ", "courroie HTD 8M Tunisie"), a well-built specialist site can rank highly after a few weeks or months. For broad searches ("courroie"), the steps under "What you still need to do" matter more than the code.

## What was done

- **Pre-built pages.** Every page in both languages (334 pages) is generated as complete HTML at build time: content, title, description, canonical URL, French/English links and structured data. Before, Google received an empty page and had to run JavaScript to see anything.
- **Keyword URLs in French and English.**
  - Examples: `/courroie/courroie-trapezoidale-standard-z` and `/courroies/courroie-caoutchouc/courroies-synchrones`.
  - English pages live under `/en/…`, each linked to its French twin with `hreflang`.
  - The language switch keeps you on the same page.
  - Old addresses (`/products/…`) redirect to the new ones.
- **Unique titles and descriptions.** Each page has its own title (no duplicates within a language) and a description of about 155 characters, written around what people search: profile, type of belt, Tunisia.
- **Structured data (schema.org).**
  - Organization on the home page, Product on each of the 138 products, BreadcrumbList on every catalogue page, ItemList on listings.
  - Google can show breadcrumbs under your result and understands each page is a product from the KORTIBELT brand.
  - No prices are declared because the site sells on quote. Price-rich results (stars, prices) therefore won't appear, and they shouldn't be faked.
- **`sitemap.xml` and `robots.txt`** are generated at every build. The quote, thank-you and search-result pages are excluded or marked `noindex` so they don't compete with real pages.
- **Real 404s.** Unknown addresses return a proper 404 status instead of a blank page.
- **Speed:**
  - Thumbnails of 320, 640 and 960 px are served to fit the screen, about 14–73 KB instead of 240 KB.
  - The home hero image is fetched with high priority.
  - The font is now self-hosted instead of loaded from Google Fonts.
  - Font Awesome (~100 KB) was replaced by one inline icon.
  - reCAPTCHA (~350 KB plus third-party cookies) now loads only on the contact, quote and feedback forms.
  - The feedback window's code downloads only when it is opened.
- **Accessibility fixes** that also count for Google:
  - Orange buttons with white text now meet the contrast standard (#C2410C).
  - Headings are in order.
  - The WhatsApp bubble no longer shifts the layout.

### Measured results (Lighthouse, mobile, local build with compression)

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Home | 97 | 100 | 100 | 100 |
| Product page | 100 | 100 | 100 | 100 |
| All belts (12 photos) | 80 | 100 | 100 | 100 |
| Contact | 99 | 100 | 79* | 100 |

\* reCAPTCHA sets Google cookies, which Lighthouse counts against "best practices". This only happens on the pages with a form, and it's the cost of spam protection.

Re-measure on the real domain with [PageSpeed Insights](https://pagespeed.web.dev/) once it's live.

## What you still need to do (most impact first)

1. **Set the domain.** In Vercel, add your domain and set the env variable `SITE_URL` (e.g. `https://www.kortibelt.com`), then redeploy. Until then, canonical URLs and the sitemap point to the `vercel.app` address.
2. **Google Search Console** ([search.google.com/search-console](https://search.google.com/search-console)):
   - Add the domain. The simplest check is the DNS record; or put the HTML-tag code in the Vercel env variable `GOOGLE_SITE_VERIFICATION` and redeploy.
   - Submit `https://<your-domain>/sitemap.xml`.
   - Use "URL inspection" → "Request indexing" for the home page and the main categories.
3. **Google Business Profile** ([business.google.com](https://business.google.com)) for KORTIBELT / AisGroup, with address, phone, opening hours, photos and a link to the site. This is the biggest lever for local searches like "courroie Sfax" or "courroie Tunisie".
4. **Point the old site here.** Replace the old GitHub Pages site (`ahmedbm99.github.io/Kortibelt`) with a page that redirects to the new domain, so any existing links and rankings carry over.
5. **Get links from other sites.** Examples:
   - aisgroup.tn linking to the catalogue
   - Tunisian business directories and industrial supplier platforms
   - partners and distributors
   - LinkedIn and Facebook pages

   A handful of good links is worth more than any code change.
6. **Improve the content.** These also lift ranking:
   - 48 products share the same description as another product. Give each product its own 2–3 sentences (uses, dimensions, equivalents such as "compatible SPZ / 3V").
   - Add English product names and descriptions; English pages currently show French product text.
   - Add the 288 missing photos and datasheets listed in `docs/missing-assets.md` (product pages with photos rank and convert better).
   - A short buying guide per category ("Comment choisir une courroie trapézoïdale ?") targets the questions people search.
7. **Ask satisfied customers for Google reviews** on the Business Profile.

## Checking it yourself

- **What Google sees:** right-click → "View page source" on any page. The product name, description and specifications are in the HTML.
- **Structured data:** [search.google.com/test/rich-results](https://search.google.com/test/rich-results). Enter a product URL; it should show "Product" and "Breadcrumbs".
- **Sitemap:** open `https://<your-domain>/sitemap.xml`.
