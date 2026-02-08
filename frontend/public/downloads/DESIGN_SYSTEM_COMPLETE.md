# WHERE THE CROWLANDS - Complete Design System
## Copy-Paste Reference Document

> **Source files:** `memory/STYLE_BIBLE.md`, `frontend/tailwind.config.js`, `frontend/src/components/OrnateElements.js`

---

## DESIGN PHILOSOPHY

### Core Aesthetic: "Luminous Art Nouveau + Occult"
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
6. **BOLD EXPRESSION** — Ornaments are architectural, not decorative accents

---

## COLOR PALETTE (EXACT HEX VALUES)

### Primary Palette
| Token | Hex | Usage |
|-------|-----|-------|
| **Midnight Teal** | `#0E2A2F` | Primary dark background |
| **Celestial Blue** | `#123A3F` | Secondary dark, card backgrounds |
| **Vellum** | `#F3EFE8` | Content panels, light surfaces |
| **Antique Gold** | `#C8A44D` | Linework, borders, glyphs (STROKES ONLY) |
| **Muted Brass** | `#9E8438` | Secondary gold, subtle accents |
| **Rose Clay** | `#C26A5A` | Warm accent, dividers |
| **Ember Pink** | `#B94E6A` | Primary CTA, emphasis, labels |

### Extended Palette (from CLAUDE.md)
| Token | Hex | Usage |
|-------|-----|-------|
| Navy Dark | `#0a1628` | Deep navy — main backgrounds |
| Navy Mid | `#0E2A2F` | Midnight teal — section backgrounds |
| Cream | `#F3EFE8` | Vellum — text/reading surfaces |
| Gold | `#C8A44D` | Antique gold — accents, icons |
| Crimson | `#8b2232` | Deep crimson — CTAs |
| Crimson Bright | `#B94E6A` | Ember pink — highlights |

### Guide-Specific Colors
| Guide | Primary | Secondary | Background |
|-------|---------|-----------|------------|
| Shigg | `amber-600` | `amber-500` | `amber-900/15` |
| Cathleen | `teal-600` | `teal-400` | `teal-900/15` |
| Katherine | `violet-600` | `violet-400` | `violet-900/15` |

### Image Generation Palette
| Name | Hex | Role |
|------|-----|------|
| Primary | midnight navy | `#0e1629` |
| Secondary | oxblood burgundy | `#8b2232` |
| Accent | antique gold | `#d4a84b` |
| Neutral | bone ivory | `#f5f0e6` |
| Highlight | burnished copper | — |

### Color Layering Rules (CRITICAL)
Correct stacking order (top → bottom):
1. Text
2. Vellum panel or solid dark field
3. Ornament strokes (edges only)
4. Texture/grain
5. Background color

**NEVER reverse this order.**

---

## TYPOGRAPHY

| Element | Font | Usage |
|---------|------|-------|
| **Hero Titles** | TC Phantasmagoria | High-impact moments only (loaded via `<style>` tag) |
| **Section Headers** | Cinzel Decorative | Labels, form headers |
| **Body Text** | Crimson Text | All readable content |
| **UI Elements** | Montserrat | Buttons, metadata, small text |

### Typography Scale
```
Hero H1:  text-3xl sm:text-5xl md:text-6xl
Section H2: text-xl sm:text-2xl
Body:     text-sm sm:text-base (line-height 1.6-1.8)
Labels:   text-xs sm:text-sm uppercase tracking-wider
```

---

## CONTRAST-LOCKED READING SURFACES (MANDATORY)

Any content intended to be read for more than 2-3 lines MUST sit on a contrast-locked surface.

### Two Allowed Reading Surfaces

**Vellum Plate:**
```css
.reading-plate-vellum {
  background-color: #F3EFE8;
  color: #1a1a1a;
}
```

**Dark Plate:**
```css
.reading-plate-dark {
  background-color: #0E2A2F;
  color: #F3EFE8;
}
```

### Minimum Contrast Ratios
- Body text: WCAG AA minimum (4.5:1)
- Headings: 3:1 minimum

### Inside Reading Surfaces: FORBIDDEN
- No gradients
- No overlays
- No color blending
- No opacity tricks

### Outside the Plate: ALLOWED
- Rich gradients
- Ember / rose / gold atmospheres
- Color washes, underlays, vignettes
- Celestial or magical textures

### Correct Visual Structure
```
[Atmospheric Background Layer]
  - gradients, magic, color richness

    [Vellum or Dark Plate]
      - flat background
      - high contrast text
      - generous padding
      - subtle shadow to lift from background

        [Text Content]
          - headings, prose, instructions
```

---

## COMPONENT LIBRARY

Location: `frontend/src/components/OrnateElements.js`

### Corner Ornaments
```jsx
// Standard - most surfaces
<HaloCorner size={45} position="top-left" color={NOUVEAU_COLORS.mutedBrass} opacity={0.5} />

// Elaborate - hero sections, thresholds, entry pages
<HaloCornerElaborate size={80} position="top-left" color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
```

**Use ELABORATE corners for:** Homepage hero, major section headers, key threshold moments
**Use STANDARD corners for:** Form panels, cards, secondary sections

### Dividers
```jsx
<LunarDivider width={280} color={NOUVEAU_COLORS.antiqueGold} opacity={0.6} />
<LunarPhaseDivider width={350} />  // Moon phases
<SimpleDivider width={160} />       // Minimal
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
<OrnateCard>...</OrnateCard>         // Dark theme card
<LightOrnateCard>...</LightOrnateCard> // Light/vellum card with shadow
<BorderFrame variant="gold">...</BorderFrame> // Accent box with border
```

### Ornament Rules
- Must be `pointer-events-none`
- Positioned at edges only
- Never cross text blocks
- Scale down gracefully on mobile

---

## BUTTON STATES

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

## VELLUM PANEL STYLING

```css
/* Lifted paper shadow — subtle, not modern card UI */
box-shadow: 0 1px 3px rgba(14, 42, 47, 0.08),
            0 4px 12px rgba(14, 42, 47, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
border: 1px solid #C8A44D50;
```

---

## ORNAMENT STROKE WEIGHTS (BOLD)

| Element | Stroke Width |
|---------|-------------|
| Primary arcs | 3-4px |
| Secondary arcs | 2-2.5px |
| Tertiary details | 1.5px |
| Accent lines | 1-1.5px |
| Divider lines | 2-2.5px |
| Glyph outlines | 2.5-3.5px |

---

## BRAND ICON LIBRARY

Custom gold icons available at `/frontend/public/images/brand/`:
- moon, book, star, skull, key, sunMoon, eye, ouroboros, pentagram, hexagram, column

`BrandIcon` component supports gold/pink variants (CSS filter for pink).

### Usage
| Location | Icon | Variant |
|----------|------|---------|
| Feature Cards | Star (Craft Spells), Book (Grimoire), Moon (Archives) | Gold |
| Major Dividers | Eye | Gold |
| Cycle Dividers | Ouroboros | Gold |
| Celestial Dividers | SunMoon | Gold |
| Lineage Section | Skull | Gold |

---

## VISUAL RULES SUMMARY

### MANDATORY
1. Reading surfaces MUST be solid — no opacity under text
2. Minimum contrast 4.5:1 for body, 3:1 for headings
3. Gold is stroke-only — never flat fills
4. One atmospheric image per page maximum

### FORBIDDEN
- Purple/violet gradients (except Katherine's content)
- `transition: all` (breaks transforms)
- Generic card grids
- Text directly on colored gradients
- Text on semi-transparent washes

---

## BRAND VOICE (for copy/UI text)

**Tone:** Reverent but accessible, warm but not saccharine, historically grounded

**Use:** "Working" (not spell), "Practice", "Intention", "Guide", "The tradition holds..."

**Avoid:** "Manifest", "Universe" as agent, "High vibes", certainty language, medical claims

---

*Generated from memory/STYLE_BIBLE.md, CLAUDE.md, frontend/tailwind.config.js, frontend/src/components/OrnateElements.js*
