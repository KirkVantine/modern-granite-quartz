# Modern Granite Quartz website

Static site: `index.html`, `styles.css`, `script.js`, plus `assets/`. No build step.

**Live:** https://moderngranitequartz.com, hosted on Cloudflare Workers (assets only), deployed automatically from `main` by Cloudflare Workers Builds. `wrangler.jsonc` configures it; `.assetsignore` keeps non-site files (README, git files, `assets/source/`) off the server. Domain registered on KV's Cloudflare account 2026-09-29, renews 2027-09-29.

The GitHub Pages preview was turned off at launch (2026-09-29) so search engines only see one copy of the site.

## Before launch

- **Quote form**: posts to `/api/quote` (`src/worker.js`), which emails each request to qualitygranite7@gmail.com through Resend, from `quotes@moderngranitequartz.com` with Reply-To set to the customer. Needs the `RESEND_API_KEY` secret in Cloudflare (Worker > Settings > Variables and Secrets) and moderngranitequartz.com verified in Resend. Without the key, or if sending fails, the form falls back to opening the visitor's email app pre-filled, so no request is lost. Spam traps: hidden `company` field and a 3-second minimum fill time. Delivery address and sender are `QUOTE_TO` / `QUOTE_FROM` in `wrangler.jsonc`.
- **Contact**: phone (248) 981-0033 and qualitygranite7@gmail.com appear in the header, hero, quote section, footer and structured data.
- **Service area**: the "Where we install" section lists cities in Oakland, Livingston, Washtenaw, Wayne and Macomb counties. Confirm the list with Razvan; the same cities are repeated in the `areaServed` structured data in the page head.
- **Reviews**: only one public review was available (Vitalie Cortac). Add more real reviews to the `#reviews` section as they come in.
- **Photos**: `assets/img/` holds web-sized copies (max 2048px, ~200-600 KB). Ten are photos Razvan sent on 2026-09-29 (originals in `assets/source/razvan-batch-1` and `razvan-batch-2`); four are from the Facebook page (originals in `assets/source/`). The profile photo was not used.

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
