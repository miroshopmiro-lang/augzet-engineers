# Augzet Engineers — Website

A multipage marketing site for **Augzet Engineers** — a team of electrical engineers, consultants and contractors in Ernakulam, Kerala. Built on the visual chassis of quantaservices.com: cinematic dark-dignity hero, scribed capability grid, mono-type engineering metadata, and a single loud conversion color.

**Positioning:** the core is electrical. Capabilities are ordered Electrical System Design → Home Automation → Solar Power → Testing & Maintenance, matching the order on the client's own live site (augzet.com). Solar is one of four capabilities, not the headline.

## Run locally

```
node serve.js
```

Then open http://localhost:4173

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero (animated SVG solar-field scene) · manifesto · capabilities · stats · flagship case study · why us · testimonials · CTA |
| `/services.html` | Capabilities index + process |
| `/services/solar-power.html` | Capability detail |
| `/services/electrical-design.html` | Capability detail |
| `/services/home-automation.html` | Capability detail |
| `/services/testing-maintenance.html` | Capability detail |
| `/projects.html` | Filterable delivery record |
| `/about.html` | Company story, beliefs, stats |
| `/contact.html` | Quote form + contact details |

## Stack

- Static HTML + one CSS file (`assets/css/main.css`, design tokens in `:root`) + one JS file (`assets/js/main.js`)
- GSAP 3.12 + ScrollTrigger (self-hosted in `assets/js/vendor/`) — hero timeline, scroll reveals, counters, sticky case-study beats, marquee
- Google Fonts: Bebas Neue (display — stands in for Quanta's Alternate Gothic Extra Condensed) · Oswald (tracked labels/nav) · Montserrat (body — stands in for Proxima Nova)
- No build step. Deploy the folder to any static host (root-relative asset paths — serve from the domain root).

## Design tokens (verified against quantaservices.com CSS)

| Token | Hex | Quanta source | Role |
|---|---|---|---|
| `--charcoal` | `#221F1F` | `--gray-1000` | Primary dark ground (warm) |
| `--charcoal-2` | `#1A1717` | `--gray-800` | Deep panels, topo texture base |
| `--light` | `#F4F4F4` | `--gray-100` | Light sections (diagonal hatch) |
| `--red` | `#CD0A1B` | `--red-300` | Chips on light, arrow boxes, red headlines |
| `--gold` | `#F0941D` | `--gold-300` | Chips on dark, headline splits, bar CTAs |

Signature devices (all from Quanta's homepage): filled chip eyebrows, two-tone stacked condensed headlines with 0.1em tracking, red square arrow-box links, textured gold bar buttons, topographic contour overlays on dark, diagonal hatch on light, vertical accent rules, red left-border story cards, centered topo pre-footer CTA band.

## Content sources

All copy, stats (186+ projects, 1,000+ kW, 1,00,000+ kg CO₂, 40-day MNRE subsidy), reviews, contact details and social links come from augzet.com (archived April 2026) and its public Google reviews. Project cards on `/projects.html` are representative profiles — swap in real project photos/data when available.

## Accessibility & performance

- `prefers-reduced-motion` honored everywhere (reveals become instant, animations stop)
- Mobile-first responsive: full-bleed poster panels, stacked stats, full-screen overlay menu
- Real client photography in `assets/img/photos/` (resized with ffmpeg to 1600w and 1000w JPEG; WebP was tested and did not beat JPEG on these already-compressed sources). Remaining decorative visuals are inline SVG.
- **Temporary placeholders:** a few images are hotlinked from Unsplash while waiting on client photos — every one is marked with `data-temp-image` in the HTML plus a `<!-- TEMP -->` comment. Grep for `data-temp-image` to find and replace them all.
- The contact form is client-side demo only: wire `.quote-form` submit in `assets/js/main.js` to your endpoint/CRM to go live
