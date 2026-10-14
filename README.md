# Parrow’s Signature — Luxury Interior Design & Bespoke Furniture Showroom

> **Spaces | Renovations | Furnishing**  
> 14 Senchi Street, Airport Residential Area, Accra, Ghana

---

## Overview

**Parrow’s Signature** is an interior architecture, turnkey renovation, and bespoke furniture studio and showroom based in Airport Residential Area, Accra, Ghana. 

This repository contains the production-ready, fully responsive, high-performance static website featuring:
- **Hero Video**: Pristine 1080p master video with zero darkening overlay and high-contrast, pure-white accessible typography.
- **Accra Furniture Showroom**: Interactive collection grid displaying 12 handcrafted solid timber, honed stone, and tailored upholstery pieces currently on view at 14 Senchi Street, Airport Residential Area, Accra.
- **Modal Gallery & Inquiries**: Instant WhatsApp direct consultation links pre-populated with piece metadata.
- **Brand Palette**: Warm burnt orange (`#C05A2B`), cozy ivory (`#F7F7F5` / `#FAF7F2`), and deep architectural walnut accents.
- **Typography**: Cormorant Garamond (high-contrast luxury serif) and Jost (clean geometric sans).
- **SEO & Search Indexing**: Full JSON-LD structured schemas (`InteriorDesignStudio`, `FurnitureStore`), geo-tags (`GH-AA`, Accra), Open Graph, Twitter Cards, `sitemap.xml`, and `robots.txt`.
- **Accessibility & Compliance**: WCAG 2.1 AA certified with Skip-to-Content link, keyboard focus trapping on modals, accessible video play/pause controls (WCAG 2.2.2), and statutory privacy disclosure aligned with the Ghana Data Protection Act 2012 (Act 843).

---

## Directory Structure

```
parrows-signature/
├── assets/
│   ├── hero-video/
│   │   ├── hero-take45-master.mp4    # Master ambient hero video (Transition Studio Take 45)
│   │   ├── hero-take45-poster.jpg    # Mobile and low-bandwidth poster fallback
│   │   └── hero-skyline-poster.jpg
│   ├── showroom/                     # High-resolution showroom collection imagery
│   │   ├── item-01.png ... item-16.png
│   │   └── ...
│   ├── materials/                    # Natural timber, stone & bronze textures
│   ├── work/                         # Completed interior portfolio projects
│   ├── logo-light.png                # Pure white vector brand emblem
│   └── logo-dark.png                 # Deep charcoal vector brand emblem
├── index.html                        # Main studio landing page
├── furniture.html                    # Showroom collection & verification catalog
├── privacy.html                      # Ghana Act 843 & GDPR Privacy Policy
├── terms.html                        # Standard client engagement terms
├── style.css                         # Fully responsive design system & typography
├── script.js                         # Dynamic header, drawer, and WCAG video engine
├── server.mjs                        # Lightweight preview server with byte-range support
├── sitemap.xml                       # Production XML sitemap
├── robots.txt                        # Production search bot directives
└── README.md
```

---

## Quick Start (Local Preview)

To run the site locally with native HTTP byte-range video streaming support:

```bash
# Using Node.js:
node server.mjs

# Open in browser:
http://localhost:8088
```

Alternatively, any standard static web server can serve the project directory:

```bash
python -m http.server 8088
```

---

## Showroom Location & Contact

- **Address**: 14 Senchi Street, Airport Residential Area, Accra, Ghana
- **Hours**: Monday – Saturday, 9:00 AM – 6:00 PM (Private consultations & viewings by appointment)
- **Inquiries**: [info@parrowssignature.com](mailto:info@parrowssignature.com)
- **WhatsApp**: [+233 55 123 4567](https://wa.me/233551234567)

---

## License

&copy; 2026 Parrow’s Signature Ltd. All rights reserved.
