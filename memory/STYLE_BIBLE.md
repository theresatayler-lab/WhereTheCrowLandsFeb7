# Where The Crowlands — Style Bible v3.0
> *Art Nouveau • Luminous • Celestial • Occult*

**Version:** 3.0 (Art Nouveau Redesign)  
**Last Updated:** December 2025

---

## Design Philosophy

### Core Aesthetic: "Luminous Art Nouveau + Occult"
The visual language draws from:
- **Art Nouveau elegance** — Organic curves, halo arcs, botanical flows
- **Celestial symbolism** — Lunar phases, sun discs, stars
- **Occult iconography** — Ravens, all-seeing eyes, alchemical motifs
- **Illuminated manuscript sensibility** — Vellum surfaces, gold linework

### Key Principles
1. **Ornament is structural** — Defines edges, sections, hierarchy (never decoration)
2. **Text on clear surfaces** — Always on vellum or solid dark, never on busy artwork
3. **Gold is stroke-only** — Linework, borders, glyphs (never flat fills)
4. **Luminous, not distressed** — Clean, light paper grain (not heavy parchment)
5. **Readability is sacred** — WCAG AA contrast minimum everywhere

---

## Color Palette (EXACT HEX VALUES)

| Token | Hex | Usage |
|-------|-----|-------|
| **Midnight Teal** | `#0E2A2F` | Primary dark background |
| **Celestial Blue** | `#123A3F` | Secondary dark, card backgrounds |
| **Vellum** | `#F3EFE8` | Content panels, light surfaces |
| **Antique Gold** | `#C8A44D` | Linework, borders, glyphs (STROKES ONLY) |
| **Muted Brass** | `#9E8438` | Secondary gold, subtle accents |
| **Rose Clay** | `#C26A5A` | Warm accent, dividers |
| **Ember Pink** | `#B94E6A` | Primary CTA, emphasis, labels |

### Color Layering Rules (CRITICAL)

Correct stacking order (top → bottom):
1. Text
2. Vellum panel or solid dark field
3. Ornament strokes (edges only)
4. Texture/grain
5. Background color

**NEVER reverse this order.**

---

## Typography

| Element | Font | Usage |
|---------|------|-------|
| **Hero Titles** | TC Phantasmagoria | High-impact moments only |
| **Section Headers** | Cinzel Decorative | Labels, form headers |
| **Body Text** | Crimson Text | All readable content |
| **UI Elements** | Montserrat | Buttons, metadata, small text |

### Typography Scale
- Hero H1: `text-3xl sm:text-5xl md:text-6xl`
- Section H2: `text-xl sm:text-2xl`
- Body: `text-sm sm:text-base` (line-height 1.6-1.8)
- Labels: `text-xs sm:text-sm uppercase tracking-wider`

---

## Component Library

### Location: `/frontend/src/components/OrnateElements.js`

### Corner Ornaments
```jsx
// Standard - most surfaces
<HaloCorner size={45} position="top-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />

// Elaborate - hero sections, thresholds, entry pages
<HaloCornerElaborate size={80} position="top-left" color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
```

### Dividers
```jsx
<LunarDivider width={280} color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
<LunarPhaseDivider width={350} /> // Moon phases
<SimpleDivider width={160} /> // Minimal
```

### Glyphs
```jsx
<RavenGlyph size={48} color={NOUVEAU_COLORS.antiqueGold} />
<SunDisc size={36} />
<MoonDisc size={36} />
<CrescentMoon size={24} facing="left" />
<CelestialEye size={36} />
<StarGlyph size={20} points={4} />
```

### Page Sections
```jsx
// Dark section (midnight teal)
<DarkSection variant="warm">
  {/* Hero content */}
</DarkSection>

// Light section (vellum)
<LightSection>
  {/* Form content */}
</LightSection>
```

### Cards
```jsx
// Dark theme card
<OrnateCard>...</OrnateCard>

// Light/vellum card with shadow
<LightOrnateCard>...</LightOrnateCard>

// Accent box with border
<BorderFrame variant="gold">...</BorderFrame>
```

---

## Button States

### Primary CTA (Ember Pink)
```css
.btn-ritual {
  background: #B94E6A;
  color: #F3EFE8;
  border: 1px solid #C8A44D60;
}
.btn-ritual:hover { brightness: 1.1; }
.btn-ritual:focus { box-shadow: 0 0 0 3px #B94E6A80; }
.btn-ritual:active { background: #A94060; }
.btn-ritual:disabled { background: #5A4A4F; color: #9A9A9A; }
```

### Secondary (Gold Outline)
```css
.btn-ritual-secondary {
  background: transparent;
  color: #C8A44D;
  border: 1px solid #C8A44D;
}
.btn-ritual-secondary:hover { background: #C8A44D15; }
```

---

## Vellum Panel Styling

```css
/* Lifted paper shadow - subtle, not modern card UI */
box-shadow: 0 1px 3px rgba(14, 42, 47, 0.08), 
            0 4px 12px rgba(14, 42, 47, 0.04), 
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
border: 1px solid #C8A44D50;
```

---

## Ornament Usage Guidelines

### Use ELABORATE corners for:
- Homepage hero
- Major section headers
- Key threshold moments (onboarding, entry pages)

### Use STANDARD corners for:
- Form panels
- Cards
- Secondary sections

### Ornaments must:
- Be `pointer-events-none`
- Be positioned at edges only
- Never cross text blocks
- Scale down gracefully on mobile

---

## Files Reference

| File | Purpose |
|------|---------|
| `tailwind.config.js` | Color tokens, fonts |
| `src/index.css` | CSS variables, button styles, overlays |
| `src/components/OrnateElements.js` | All reusable styled components |
| `src/assets/ornaments/artNouveau.js` | SVG ornament library |
| `src/pages/Home.js` | Homepage (Art Nouveau applied) |
| `src/pages/InvisibleHelpers.js` | Battle Cry page |

---

## Summary

The Crowlands Art Nouveau aesthetic is:
- **Midnight Teal** (`#0E2A2F`) backgrounds
- **Antique Gold** (`#C8A44D`) for strokes and glyphs only
- **Ember Pink** (`#B94E6A`) for CTAs and emphasis
- **Vellum** (`#F3EFE8`) panels for all readable content
- **Halo arc corners** at structural edges
- **Lunar dividers** between sections
- **Raven and celestial glyphs** as accent symbols

Every element should feel like an illuminated manuscript rendered as modern UI — elegant, mystical, and absolutely readable.

---

*"The sacred lives in a cup of tea, a sprig of rosemary, a moment of silence."*
