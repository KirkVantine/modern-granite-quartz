# Modern Granite Quartz website

Static site: `index.html`, `styles.css`, `script.js`, plus `assets/`. No build step. Open `index.html` or serve the folder with any static host (Netlify, Cloudflare Pages, GitHub Pages).

## Before launch

- **Quote form**: `QUOTE_EMAIL` is set to qualitygranite7@gmail.com, so submitting opens the visitor's email app with the request filled in. For requests that send without the visitor's email app, set `QUOTE_ENDPOINT` (Formspree, or a Cloudflare Pages function with Resend like the New Beginnings site).
- **Contact**: phone (248) 981-0033 and qualitygranite7@gmail.com appear in the header, hero, quote section, footer and structured data.
- **Service area**: the "Where we install" section lists cities in Oakland, Livingston, Washtenaw, Wayne and Macomb counties. Confirm the list with Razvan; the same cities are repeated in the `areaServed` structured data in the page head.
- **Reviews**: only one public review was available (Vitalie Cortac). Add more real reviews to the `#reviews` section as they come in.
- **Photos**: `assets/img/` holds the 10 job photos from Facebook, renamed. `assets/source/` has the untouched originals. The profile photo was not used.

## Logo files

- `assets/logo.svg`: full logo, dark on light (fonts embedded, works anywhere)
- `assets/logo-light.svg`: full logo, light for dark backgrounds
- `assets/logo-mark.svg`: the mark alone (favicon, social avatar): a waterfall countertop in profile, two pieces meeting at a gold 45° mitered seam

## Brand

| Token | Hex | Use |
|---|---|---|
| Calacatta | `#F4F4F2` | page background |
| Graphite | `#1E2328` | text, dark bands, logo |
| Vein gold | `#C9A56B` | accents, vein line, buttons on dark |
| Vein ink | `#7E5F31` | gold text on light backgrounds |
| Slate | `#56616B` | secondary text |

Type: Archivo (Google Fonts). Expanded width (125) for headings and the logo, normal width for body text.
