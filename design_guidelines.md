# Where The Crowlands — Visual Design Rules
## MANDATORY for all new pages and components

---

## COLOR PALETTE (Non-negotiable)

### CSS Variables (use these, never hardcode hex)
```css
:root {
  --wtc-bg-primary:      #0C1D2E;  /* Deep Navy — page backgrounds */
  --wtc-bg-secondary:    #102534;  /* Celestial Blue — cards, layered surfaces */
  --wtc-surface:         #F3EFE8;  /* Vellum / Bone Ivory — reading surfaces */
  --wtc-accent:          #C8A44D;  /* Antique Gold — borders, linework, NEVER fill */
  --wtc-accent-faded:    #A89872;  /* Faded Gold — captions on dark */
  --wtc-cta:             #B94E6A;  /* Ember Pink — buttons, links */
  --wtc-deep-accent:     #8B2232;  /* Oxblood — pull quotes, headings on light */
  --wtc-text-dark:       #1A1A1A;  /* Ink Black — body on Vellum */
  --wtc-text-light:      #F3EFE8;  /* Vellum — body on dark */
  --wtc-text-muted-dark: #A89872;  /* Faded Gold — captions on dark */
  --wtc-text-muted-light: #5A524E; /* Warm Grey — captions on light */
}
```

### Tailwind Class Mappings
| Purpose | Tailwind class | Hex |
|---------|---------------|-----|
| Page background | `bg-background` | #0C1D2E |
| Card background | `bg-card` / `bg-navy-mid` | #102534 |
| Vellum surface | `bg-vellum` / `text-vellum` | #F3EFE8 |
| Gold accent | `text-gold` / `border-gold` | #C8A44D |
| Ember Pink CTA | `bg-primary` / `text-primary` | #B94E6A |
| Oxblood | `text-crimson` | #8B2232 |
| Faded Gold | `text-muted-brass` | #A89872 |

---

## RULES

### Backgrounds
- SOLID colors only. Never semi-transparent backgrounds covering large areas.
- Deep Navy `#0C1D2E` for page backgrounds
- Celestial Blue `#102534` for cards, panels, secondary surfaces

### Gold Usage
- STROKE/BORDER ONLY. Never as a background fill.
- All card borders: 1px solid gold
- All h1/h2 on dark backgrounds: gold color
- All ornamental dividers: gold
- All decorative filigree: gold

### Ember Pink Usage
- ALL primary CTA buttons
- Subtitle text below gold headings (on dark surfaces)
- Links on dark backgrounds
- Active/hover states on interactive elements
- Hover → transitions to Oxblood #8B2232

### Text Hierarchy on Dark (#0C1D2E)
- h1/h2: `#C8A44D` (Antique Gold)
- Subtitle: `#B94E6A` (Ember Pink) or `#F3EFE8` (Vellum)
- Body: `#F3EFE8` at 75%+ opacity
- Captions: `#A89872` (Faded Gold)

### Text Hierarchy on Light (#F3EFE8)
- Body: `#1A1A1A` (Ink Black)
- Headings: `#8B2232` (Oxblood) or `#1A1A1A`
- Links: `#8B2232` (Oxblood)
- Never gold text on light surfaces

### Atmospheric Glows (ONLY allowed as)
- Radial gradient, NOT flat rectangle
- Centred on the content element it supports
- Tight radius (25-30% of bounding area)
- Rest of canvas stays untouched dark navy

### Typography
- Display headings: `font-cinzel` + gold color
- Body: `font-crimson` (serif) — never sans for prose
- UI/buttons/nav: `font-montserrat` (sans)
- Min body size: 14px / 1rem
- Line height: 1.6

### NEVER DO
- Place dark text on dark background
- Place light text on light background
- Use gold as a background fill
- Use semi-transparent rectangles covering >30% viewport
- Use teal/green-biased backgrounds (green channel >= blue channel)

---

## ARTNOUVEAU.JS / ORNATEELEMENTS CONSTANTS
```js
NOUVEAU_COLORS = {
  midnightTeal: '#0C1D2E',    // Deep Navy
  celestialBlue: '#102534',   // Celestial Blue
  vellum: '#F3EFE8',
  antiqueGold: '#C8A44D',
  mutedBrass: '#A89872',
  roseClay: '#C26A5A',
  emberPink: '#B94E6A',
  oxblood: '#8B2232',
  inkBlack: '#1A1A1A',
}
```

Last updated: March 13, 2026
