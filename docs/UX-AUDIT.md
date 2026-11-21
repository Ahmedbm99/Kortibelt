# KORTIBELT website — UX audit and changes

Audit of the catalogue site (`Kortibelt/`) and its API (`CourroieBack/`), done before moving the frontend from GitHub Pages to Vercel.
Each finding is marked **Fixed** or **Owner action**. The owner actions are collected at the end.

## Summary

The site lost leads in three ways:
- **Quotes could fail without anyone knowing.** The API answered "success" before the email was even sent.
- **The WhatsApp code step blocked people.** Visitors without WhatsApp could not finish a quote, and codes sometimes failed on Vercel.
- **The catalogue was hard to browse.** The mobile menu crashed, the product list was empty unless you visited Home first, search only worked on one page, and 8 products could not be opened because their ids were duplicated.

The site was also heavy. Images totalled 325 MB, and the home page alone downloaded about 43 MB.

All of these are fixed. What remains is mostly content the owner has to supply:
- **Missing files:** 80 products have no photo and 46 have no datasheet.
- **English product names:** none of the products have them yet.

## High priority

| # | Finding | Status |
|---|---|---|
| H1 | **A quote could report success without being sent.** The API didn't wait for the email and swallowed email errors. | **Fixed.** The API waits for the email and returns an error if it fails. The site then keeps the quote cart and offers email, WhatsApp and phone instead. |
| H2 | **A WhatsApp code was required to send a quote or a message.** It blocked people without WhatsApp, codes were lost between serverless instances, and it didn't stop bots: the quote endpoint wasn't protected. | **Fixed.** The code step is removed. The server now checks invisible reCAPTCHA, a hidden honeypot field and a minimum fill time. Twilio is no longer used. |
| H3 | **The contact form sent the message before the code was checked,** without validating the fields. | **Fixed.** One submit validates, then sends. Errors show inline. |
| H4 | **The quote cart was lost on reload,** and couldn't capture material or details. | **Fixed.** The cart is saved in the browser. Each line keeps the chosen material, the quantity (typed directly) and a note (length, teeth, application). All of it appears in the email. |
| H5 | **"Demander un devis" on the product page did nothing.** | **Fixed.** It adds the product to the quote and opens the quote cart. |
| H6 | **The mobile menu crashed** on Home, About and Materials. | **Fixed.** The navbar no longer depends on props from each page. |
| H7 | **The product list was empty or showed a placeholder** unless the visitor had visited Home first. | **Fixed.** Pages read the catalogue directly from the URL. Redux and redux-persist are removed. |
| H8 | **Duplicate product ids** (23–27, 50–55) made 8 belts unreachable and merged them in the cart. | **Fixed.** They were renumbered to 279–289. |
| H9 | **Search only worked on `/products`** and matched descriptions first (searching "Z" matched almost everything). | **Fixed.** Search works from every page through `/products?q=`, so results can be shared as a link. Exact and prefix matches on profile, name and reference rank first. |
| H10 | **Two application tiles always showed 0 results** (`automobile`, `automation`). | **Fixed.** The keys now match the data. Tiles and categories with no products are hidden, and each tile shows its product count. |
| H11 | **Main buttons and the scrolled navbar had no background.** Theme colours were never loaded. | **Fixed.** Brand colours are defined in `src/index.css` and used everywhere. |
| H12 | **Images were 325 MB,** with single photos up to 20 MB. | **Fixed.** Images were converted to WebP: `public/` went from 325 MB to 78 MB, of which 33 MB is PDFs. Images load lazily and the hero loads one slide at a time. |
| H13 | **296 of 449 photo and datasheet paths pointed to missing files.** One folder name differed only in capital letters (`PUspeciale`), which breaks on Vercel. | **Fixed in the site:** the capitalisation is corrected, missing photos show a placeholder, and missing datasheets hide the button. **Owner action:** add the files listed in `docs/missing-assets.md` (288 entries). |
| H14 | **Deep links returned 404 on refresh** (GitHub Pages). | **Fixed.** `vercel.json` sends every route to the app. |

## Medium priority

| Finding | Status |
|---|---|
| No breadcrumbs; every page title was generic ("Nos Produits") | **Fixed.** Breadcrumbs (Famille › Catégorie › Sous-catégorie › Produit) and real names as page titles |
| Pagination could land on an empty page and didn't scroll back up | **Fixed.** The page number is kept in the URL, reset when a filter changes, and the list scrolls to the top |
| No result count, no way to see or remove active filters | **Fixed.** Result count, removable filter chips, and a helpful empty state |
| Product cards showed only a name and a French description | **Fixed.** Cards now show profile, dimensions and materials, plus a quick "add to quote" button |
| The product page listed specs as bullets, left out most fields, and mixed decimal formats | **Fixed.** A full specification table with units, numbers formatted for the active language |
| Materials were hidden behind a "change material" button | **Fixed.** Materials are selectable chips; the datasheet follows the chosen material |
| Image arrows were invisible on touch screens; swiping on the image blocked page scroll | **Fixed.** Arrows are always visible, thumbnails are added, and vertical scroll works |
| The feedback popup opened after 5 minutes on any page, even mid-checkout | **Fixed.** Feedback is only offered on the thank-you page and from a footer link. Comments are optional and the form closes after it is sent |
| The WhatsApp bubble opened by itself on every page and covered forms | **Fixed.** It opens once, never on the cart or form pages, and is remembered once closed. Its message mentions the product being viewed |
| The cart icon was hidden in the mobile menu; there was no language switch on mobile | **Fixed.** Both are in the mobile header and menu |
| The thank-you page was bare | **Fixed.** It shows a summary of the request, the expected response time and a phone number for urgent requests |
| Errors were generic ("Erreur du serveur") | **Fixed.** Specific messages for network, anti-spam, email failure and invalid fields |
| Customers received no confirmation | **Fixed.** The API sends a confirmation email to the customer. Emails are sent from the company address with reply-to set to the customer, which avoids spam filtering |
| Quote, contact and feedback emails included user input without escaping | **Fixed.** All input is escaped |

## Low priority, accessibility and SEO

**Fixed:**
- **Translations:** wrong translation keys showed raw key names. Missing English text has been added.
- **Contrast:** orange text on white failed contrast. Text now uses a darker orange (`accent-text`, #C2410C).
- **Accessibility:** icon-only buttons have labels. The sidebar can be used with a keyboard. Home has a single main heading. A "skip to content" link is added. The hero carousel can be paused and respects reduced-motion settings.
- **SEO:** each page sets its own title and description, and the site has a sharing image (`public/og-image.webp`). `<html lang>` follows the active language.
- **Loading:** each page loads on demand, so the first visit downloads less.
- **Removed dead code:** API catalogue services, Redux, the duplicate cart hook, i18next, the reCAPTCHA v2 package, the Radix Themes wrapper and GitHub Pages files.

**Not done yet:**
- Product names and descriptions exist only in French (`courroieData.js`). English visitors see French product text. **Owner action** (content).
- The two PU timing-belt datasheets weigh 6 and 10 MB. **Owner action:** re-export them compressed if possible.
- No filters by dimension or material yet. Search covers profile, name and reference. This is a possible next step.

## Added after the audit: send by email or WhatsApp (PDF)

The quote, contact and feedback forms let the visitor choose **By email** (sent by the server, with a confirmation email) or **By WhatsApp (PDF)**.

With WhatsApp, the browser creates a branded PDF (reference number, date, details, product table, message). The visitor then sends it to the company's WhatsApp:
- **On a phone:** one tap opens the share sheet with the PDF attached. They pick WhatsApp, then the KORTIBELT chat.
- **On a computer:** they download the PDF, open the WhatsApp chat (message prefilled with the reference) and attach the file.

The site can't confirm that a WhatsApp message was actually sent, so the visitor confirms it with "C'est envoyé". Automatic sending to the company's WhatsApp would need the WhatsApp Business API; it was deliberately not chosen.

## Owner actions before going live

1. **Rotate the backend credentials.** `CourroieBack/.env` was committed and pushed, which exposes the SMTP, database, Twilio and reCAPTCHA secrets. Then remove `.env` and `node_modules` from git (`git rm -r --cached .env node_modules`); `.gitignore` is already fixed.
2. **Frontend on Vercel:** set `VITE_API_URL` to the backend's stable production URL plus `/apiv1`. Optionally also set `VITE_RECAPTCHA_SITE_KEY` and the contact details.
3. **Backend on Vercel:** set `ALLOWED_ORIGINS` to the new domain(s). You can delete `DB_*`, `TWILIO_*` and `CONTENT_SID`, which are no longer used.
4. **reCAPTCHA admin console:** add the new domain to the site key. Otherwise every form will report an anti-spam failure.
5. **Content:** add the missing photos and datasheets (`docs/missing-assets.md`), then run `npm run assets`. Add English product names when possible.
6. **Test once live:** send yourself a quote and a contact message, and check that both the sales email and the customer confirmation arrive.
