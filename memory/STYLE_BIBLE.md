# Where The Crowlands — Style Bible
> *A comprehensive design system for the historical witchcraft archive*

**Version:** 2.0  
**Last Updated:** December 2025

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Component Library](#component-library)
5. [Ornament System](#ornament-system)
6. [Page Sections & Layouts](#page-sections--layouts)
7. [Persona-Specific Theming](#persona-specific-theming)
8. [CSS Utilities & Effects](#css-utilities--effects)
9. [Implementation Reference](#implementation-reference)

---

## Design Philosophy

### Core Aesthetic: "Wartime Chapel + Occult Diagram"
The visual language of Where The Crowlands draws from:
- **Victorian spiritualism** — Séance parlors, ornate borders, mystical diagrams
- **WWII-era British occultism** — Dion Fortune's wartime work, practical magic
- **Art Nouveau flourishes** — Organic curves, botanical motifs, elegant corners
- **Collectible grimoire aesthetic** — Each page should feel like a treasured manuscript

### Key Principles
1. **Ornate but legible** — Decorative elements enhance, never obscure
2. **Dark elegance** — Rich navy backgrounds with warm gold/crimson accents
3. **Parchment contrast** — Light sections use cream/bone tones for readability
4. **Mystical gravitas** — Every element should feel intentional and meaningful
5. **Responsive restraint** — Ornaments scale down gracefully on mobile

---

## Color System

### Primary Palette (Tailwind Config)

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#0e1629` | Deep midnight navy — primary dark bg |
| `foreground` | `#e8e4dc` | Warm off-white — primary text |
| `card` | `#121d33` | Slightly lighter navy — card backgrounds |
| `primary` | `#b82330` | Vibrant crimson red — CTAs, emphasis |
| `secondary` | `#1a2d4d` | Navy blue — secondary elements |
| `muted` | `#1a3050` | Muted navy — subtle backgrounds |
| `accent` | `#d4a84b` | Warm antique gold — accents, borders |
| `destructive` | `#8b1a1a` | Deep red — errors, warnings |
| `border` | `#2a4163` | Blue-tinted — borders, dividers |
| `ring` | `#b82330` | Crimson — focus rings |

### Extended Color Tokens

```css
/* Crimson Family */
--crimson: #b82330;
--crimson-bright: #d42a3a;
--crimson-deep: #8a1a24;

/* Gold Family */
--gold: #d4a84b;
--gold-light: #e6c068;
--gold-dark: #a88535;

/* Navy Family */
--navy-dark: #0e1629;
--navy-mid: #121d33;
--navy-light: #1a2d4d;
--navy-accent: #2a4163;

/* Neutrals */
--silver-mist: #9aabc0;
--blue-grey: #5c7a9e;
--cream: #f5f0e6;
--parchment: #e8e4dc;
```

### Ornament Library Colors (JavaScript)
```javascript
export const COLORS = {
  gold: '#d4a84b',
  goldLight: '#e6c068',
  goldDark: '#b8923d',
  crimson: '#b82330',
  oxblood: '#8b2232',
  navy: '#0e1629',
  navyMid: '#1a2d4d',
  bone: '#f5f0e6',
  copper: '#b87333',
  silver: '#a8a8a8'
};
```

---

## Typography

### Font Stack

| Font | Family | Usage |
|------|--------|-------|
| **TC Phantasmagoria** | Custom (OTF) | Hero titles, ritual names, high-impact moments |
| **Cinzel Decorative** | Serif | Section headers, labels, buttons |
| **Crimson Text** | Serif | Body text, descriptions, prose |
| **Playfair Display** | Serif | Secondary headers, elegant callouts |
| **Montserrat** | Sans-serif | UI elements, metadata, small text |
| **Italiana** | Serif | Alternative accent (rarely used) |

### Font Classes

```css
/* TC Phantasmagoria - USE SPARINGLY */
.font-phantasmagoria {
  font-family: 'TC Phantasmagoria', 'Cinzel Decorative', serif;
  letter-spacing: 0.02em;
}

.phantasmagoria-hero {
  font-family: 'TC Phantasmagoria', 'Cinzel Decorative', serif;
  letter-spacing: 0.08em;
  line-height: 1.1;
}

.phantasmagoria-accent {
  font-family: 'TC Phantasmagoria', 'Cinzel Decorative', serif;
  font-size: 0.9em;
  letter-spacing: 0.03em;
}

.ritual-title {
  font-family: 'TC Phantasmagoria', 'Cinzel Decorative', serif;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

### Typography Scale

| Element | Mobile | Desktop | Class Example |
|---------|--------|---------|---------------|
| Hero H1 | `text-3xl` | `text-5xl` / `text-6xl` | `phantasmagoria-hero` |
| Section H2 | `text-xl` | `text-2xl` | `font-cinzel` |
| Card Title | `text-lg` | `text-xl` | `font-playfair` |
| Body | `text-sm` | `text-base` | `font-crimson` |
| Label | `text-xs` | `text-sm` | `font-cinzel tracking-wider uppercase` |
| Metadata | `text-xs` | `text-xs` | `font-montserrat` |

---

## Component Library

### Location: `/frontend/src/components/OrnateElements.js`

### Core Components

#### Corner Ornaments
```jsx
<ElaborateCorner variant="gold" className="w-16 h-16" />
<CornerFlourish position="top-left" variant="crimson" />
```
- Variants: `gold`, `crimson`
- Positions: `top-left`, `top-right`, `bottom-left`, `bottom-right`

#### Dividers
```jsx
<GrandDivider variant="moon" light={false} />
<MysticalDivider variant="crow" light={true} />
<SectionDivider variant="stars" />
```
- GrandDivider variants: `default`, `moon`, `eye`, `crow`, `sparkle`
- MysticalDivider variants: `default`, `crow`, `moon`
- SectionDivider variants: `default`, `stars`, `moons`, `celtic`, `eyes`, `feathers`, `birds`

#### Page Section Wrappers
```jsx
<DarkSection variant="warm" className="py-12 px-6">
  {/* Navy background with texture */}
</DarkSection>

<LightSection className="py-8 px-6">
  {/* Cream/parchment background with corner ornaments */}
</LightSection>
```

#### Cards & Frames
```jsx
<LightOrnateCard hover={true}>
  {/* Parchment card with gold corners */}
</LightOrnateCard>

<BorderFrame variant="crimson" className="bg-crimson/5">
  {/* Bordered content block */}
</BorderFrame>
```
- BorderFrame variants: `gold`, `crimson`

#### Form Elements
```jsx
<SectionLabel 
  title="What is your intention?"
  context="Descriptive help text here"
/>

<CrowlandsInput
  value={value}
  onChange={handler}
  placeholder="Enter text..."
  rows={3} // for textarea
/>

<CrowlandsChip
  label="Option Name"
  selected={isSelected}
  onClick={handler}
/>
```

#### Glyphs & Icons
```jsx
<BestiaryGlyph animal="crow" size="md" color="#d4a84b" />
<OccultGlyph symbol="pentacle" size="lg" />
```
- Animals: `crow`, `raven`, `magpie`, `robin`, `sparrow`, `owl`, `hare`, `stag`, `fox`, `moth`, `toad`, `serpent`
- Symbols: `pentacle`, `triquetra`, `crescent`, `sunDisc`, `key`, `chalice`, `candle`, `bell`, `compass`, `mirror`, `feather`, `thread`

---

## Ornament System

### Location: `/frontend/src/assets/ornaments/index.js`

### Architecture
The ornament system provides a **deterministic mapping** — each page gets a specific, consistent set of ornaments.

### Page Configuration
```javascript
PAGE_ORNAMENT_CONFIG = {
  'home': {
    cornerStyle: 'elaborate',
    dividerStyle: 'moon',
    accentGlyph: 'crow',
    secondaryGlyph: 'crescent'
  },
  'spell-request': {
    cornerStyle: 'occult',
    dividerStyle: 'stars',
    accentGlyph: 'candle',
    secondaryGlyph: 'pentacle'
  },
  // ... etc
}
```

### Available Corner Styles (20 total)
`classic`, `elaborate`, `floral`, `celtic`, `artNouveau`, `geometric`, `vine`, `occult`, `simple`, `double`, `diamond`, `star`, `spiral`, `wave`, `leaf`, `cross`, `arc`, `bracket`, `scroll`, `tassel`

### Available Divider Styles (12 total)
`classic`, `moon`, `stars`, `diamonds`, `wave`, `dots`, `ornate`, `celtic`, `arrows`, `simple`, `doubleLine`, `gradient`

### Bestiary Glyphs (24 total)
**Birds:** `crow`, `raven`, `magpie`, `robin`, `sparrow`, `owl`
**Animals:** `hare`, `stag`, `fox`, `moth`, `toad`, `serpent`
**Occult:** `pentacle`, `triquetra`, `crescent`, `sunDisc`, `key`, `chalice`, `candle`, `bell`, `compass`, `mirror`, `feather`, `thread`

### Helper Functions
```javascript
import { 
  getGlyph,
  getCornerForPage,
  getDividerForPage,
  getPageOrnamentSet,
  PageCorners,
  SectionDivider,
  GlyphAccent
} from '../assets/ornaments';

// Get full ornament set for a page
const ornaments = getPageOrnamentSet('spell-request');

// Render page corners
<PageCorners pageId="home" size={60} />

// Render section divider
<SectionDivider pageId="home" width={200} />

// Render accent glyph
<GlyphAccent pageId="home" size={24} />
```

---

## Page Sections & Layouts

### Standard Page Structure

```jsx
<div className="min-h-screen bg-navy-dark">
  {/* Hero Header - Dark */}
  <DarkSection className="py-12 px-4" variant="warm">
    <CornerFlourish position="top-left" />
    <CornerFlourish position="top-right" />
    
    <div className="max-w-4xl mx-auto text-center">
      <Icon className="w-12 h-12 mx-auto mb-4 text-crimson-bright" />
      <h1 className="phantasmagoria-hero text-4xl text-gold-light mb-3">
        Page Title
      </h1>
      <p className="font-crimson text-silver-mist/80 italic">
        Subtitle text
      </p>
    </div>
    
    <GrandDivider variant="eye" />
  </DarkSection>

  {/* Content - Light Parchment */}
  <LightSection className="py-8 px-6">
    <div className="max-w-2xl mx-auto">
      <LightOrnateCard>
        {/* Card content */}
      </LightOrnateCard>
    </div>
  </LightSection>

  {/* Footer - Dark */}
  <DarkSection className="py-8 px-4">
    <div className="max-w-xl mx-auto text-center">
      <p className="font-crimson text-silver-mist/80 italic">
        Closing statement
      </p>
    </div>
  </DarkSection>
</div>
```

### Dark Section Backgrounds
```css
/* Standard - blue gradients */
background: radial-gradient(ellipse at 30% 50%, rgba(26, 45, 77, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 50%, rgba(42, 65, 99, 0.2) 0%, transparent 40%);

/* Warm variant - subtle crimson/gold */
background: radial-gradient(ellipse at 50% 30%, rgba(184, 35, 48, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(212, 168, 75, 0.08) 0%, transparent 40%);
```

### Light Section Style
```css
background: linear-gradient(135deg, #f5f0e6 0%, #e8e0d0 50%, #f5f0e6 100%);
/* Plus top/bottom crimson + gold accent lines */
/* Plus corner ornaments (ElaborateCorner) */
```

---

## Persona-Specific Theming

### The Four Women of the Lineage

Each archetype has a unique color scheme for persona-specific pages:

| Persona | Primary | Secondary | Accent |
|---------|---------|-----------|--------|
| **Shigg** (Silent Gen) | `#750609` | `#D8CBB3` | `#06133c` |
| **Cathleen** (WWII) | `#06133c` | `#D8CBB3` | `#750609` |
| **Katherine** (Victorian) | `#4B5A3E` | `#D8CBB3` | `#750609` |
| **Theresa** (Contemporary) | `#750609` | `#06133c` | `#4B5A3E` |

### Persona Border Frames (CSS)
```css
.border-frame-cathleen::before {
  background-image: url('https://customer-assets.emergentagent.com/.../CathleenBorder.png');
}

.border-frame-katherine::before {
  background-image: url('https://customer-assets.emergentagent.com/.../KateBorder.png');
}

.border-frame-theresa::before {
  background-image: url('https://customer-assets.emergentagent.com/.../TheresaBorder.png');
}
```

### Usage in Archetype Pages
```jsx
import { getArchetypeById } from '../data/archetypes';

const archetype = getArchetypeById('shiggy');
const { primary, secondary, accent } = archetype.colorScheme;

<div style={{ borderColor: primary }}>
  {/* Persona-themed content */}
</div>
```

---

## CSS Utilities & Effects

### Glow Effects
```css
.glow-gold {
  filter: drop-shadow(0 0 8px rgba(212, 168, 75, 0.6));
}

.glow-crimson {
  filter: drop-shadow(0 0 8px rgba(184, 35, 48, 0.6));
}
```

### Button Styles

```css
/* Primary CTA - Bold Art Deco */
.btn-ritual {
  font-family: 'Cinzel Decorative', serif;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #b82330 0%, #8a1a24 100%);
  color: #f5f0e6;
  border: 2px solid #d4a84b;
}

/* Secondary - Outlined */
.btn-ritual-secondary {
  font-family: 'Playfair Display', serif;
  background: transparent;
  color: #d4a84b;
  border: 2px solid #d4a84b;
}

/* Ghost - Minimal */
.btn-ritual-ghost {
  font-family: 'Cinzel Decorative', serif;
  background: rgba(14, 22, 41, 0.6);
  color: #e6c068;
  border: 1px solid rgba(212, 168, 75, 0.4);
}
```

### Scrollbar Styling
```css
::-webkit-scrollbar { width: 12px; }
::-webkit-scrollbar-track { background: #121d33; border-left: 1px solid #2a4163; }
::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #b82330, #8a1a24);
  border: 2px solid #d4a84b;
}
```

### Body Texture Overlay
```css
/* Subtle paper grain */
body::before {
  background-image: repeating-linear-gradient(0deg, #d4a84b 0px, transparent 1px, transparent 3px, #d4a84b 4px),
                    repeating-linear-gradient(90deg, #d4a84b 0px, transparent 1px, transparent 3px, #d4a84b 4px);
  opacity: 0.02;
}

/* Vignette effect */
body::after {
  background: radial-gradient(ellipse at center, transparent 40%, rgba(14, 22, 41, 0.4) 100%);
}
```

---

## Implementation Reference

### Key Files
| File | Purpose |
|------|---------|
| `/frontend/tailwind.config.js` | Color tokens, fonts, background images |
| `/frontend/src/index.css` | CSS variables, button styles, overlays |
| `/frontend/src/components/OrnateElements.js` | Reusable styled components |
| `/frontend/src/assets/ornaments/index.js` | SVG glyphs, corners, dividers |
| `/frontend/src/data/archetypes.js` | Persona color schemes & data |
| `/frontend/public/index.html` | Custom font face (Phantasmagoria) |

### Background Image Assets
```javascript
// Available in Tailwind as bg-* classes
'engraving-landscape': "url('...COuld_we_creatre_more_of_these...png')",
'engraving-coral': "url('...background_style_f734269c...0.png')",
'engraving-texture-1': "url('...background_style_f734269c...1.png')",
'engraving-texture-2': "url('...background_style_f734269c...2.png')",
'engraving-texture-3': "url('...background_style_f734269c...3.png')",
'engraving-texture-4': "url('...lets_create_more...0.png')",
'engraving-texture-5': "url('...lets_create_more...2.png')",
'engraving-texture-6': "url('...create_more_background...0.png')",
'engraving-texture-7': "url('...create_more_background...1.png')",
'engraving-brand': "url('...full_brand_from_this...0.png')",
```

### Quick Reference: Common Patterns

**Hero Title:**
```jsx
<h1 className="phantasmagoria-hero text-4xl sm:text-5xl text-gold-light mb-3"
    style={{ textShadow: '0 2px 30px rgba(212, 168, 75, 0.5)' }}>
  Title Here
</h1>
```

**Section Label:**
```jsx
<h3 className="font-cinzel text-xs text-gold tracking-wider uppercase mb-1">
  LABEL TEXT
</h3>
```

**Body Copy:**
```jsx
<p className="text-navy-dark/80 font-crimson text-sm leading-relaxed">
  Content here...
</p>
```

**Accent Box:**
```jsx
<BorderFrame variant="gold" className="bg-gold/5">
  <p className="text-navy-dark/80 text-sm italic font-crimson">
    Quoted or emphasized text
  </p>
</BorderFrame>
```

**Chip/Tag Selection:**
```jsx
<CrowlandsChip
  label="Option"
  selected={isSelected}
  onClick={() => handleSelect('Option')}
/>
```

---

## Summary

The Crowlands aesthetic is a careful balance of:
- **Dark navy backgrounds** (`#0e1629`) with subtle texture
- **Gold accents** (`#d4a84b`) for borders, dividers, glyphs
- **Crimson highlights** (`#b82330`) for CTAs and emphasis
- **Parchment sections** (`#f5f0e6`) for readable content areas
- **Ornate SVG elements** that scale gracefully
- **Phantasmagoria font** used sparingly for maximum impact
- **Persona-specific color schemes** for archetype pages

Every element should feel like it belongs in a treasured grimoire — elegant, mystical, and intentional.

---

*"The sacred lives in a cup of tea, a sprig of rosemary, a moment of silence."*  
— Shigg, Parliament of Birds Poet Laureate
