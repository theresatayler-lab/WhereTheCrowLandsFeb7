# Where The Crowlands - Complete Design Briefing

## Design Philosophy

**Identity**: Victorian-era occult aesthetic meets modern web experience  
**Core Mood**: Mysterious, warm, ancestral, empowering  
**Anti-Patterns**: No generic Bootstrap layouts, no pure black backgrounds, no flat gradients, no "AI slop" aesthetics

---

## Color Palette

### Primary Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| **Midnight Teal** | `#0E2A2F` | Primary background |
| **Deep Obsidian** | `#0A1F22` | Secondary/darker background |
| **Celestial Blue** | `#123A3F` | Card backgrounds, sections |

### Accent Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| **Antique Gold** | `#C8A44D` | Primary accent, borders, highlights |
| **Muted Brass** | `#9E8438` | Secondary text, subtle accents |
| **Ember Pink** | `#B94E6A` | CTA buttons, important highlights |
| **Rose Clay** | `#C26A5A` | Hover states, warm accents |

### Text Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| **Vellum** | `#F3EFE8` | Primary text (cream/off-white) |
| **Silver Mist** | `#D8CBB3` | Secondary text |

### Tailwind CSS Variables (Already Configured)

```css
/* In tailwind.config.js */
--night-deep: #0A1F22
--midnight-teal: #0E2A2F  
--silver-mist: #D8CBB3
--gold: #C8A44D
--ember: #B94E6A
```

---

## Persona Color Schemes

Each guide/persona has their own signature colors:

| Persona | Primary | Accent | Era/Vibe |
|---------|---------|--------|----------|
| **Shigg** | `#750609` (Deep Burgundy) | `#D8CBB3` (Silver) | Wartime poet, tea rituals |
| **Cathleen** | `#06133c` (Midnight Blue) | `#D8CBB3` (Silver) | Voice magic, spiritualism |
| **Katherine** | `#2F4F4F` (Dark Slate) | `#A9A9A9` (Grey) | Academic occultism |
| **Theresa** | `#5D4037` (Brown) | `#D7CCC8` (Taupe) | Family traditions |
| **Brenda** | `#3D2B1F` (Sepia Brown) | `#F5E6D3` (Cream) | Memory keeper, crows |

---

## Typography

### Font Stack

| Type | Font Family | Weight | Usage |
|------|-------------|--------|-------|
| **Display/Headings** | `Cinzel Decorative` | 700, 900 | Page titles, hero text |
| **Subheadings** | `Playfair Display` | 600, 700 | Section headers, card titles |
| **Body Text** | `Crimson Text` | 400, 600 | Lore, descriptions, spell text |
| **Accents** | `Italiana` | 400 | Dates, labels, navigation |

### Text Hierarchy

```
H1 (Hero): text-4xl sm:text-5xl lg:text-6xl font-cinzel
H2 (Section): text-2xl sm:text-3xl font-playfair  
H3 (Card): text-xl font-playfair
Body: text-base font-crimson leading-relaxed
Small: text-sm font-crimson text-silver-mist/80
```

---

## Layout Principles

### Spacing
- **Container padding**: `p-8 md:p-12 lg:p-20`
- **Element gaps**: `gap-8 md:gap-12`
- **Internal padding**: `p-6`
- Use **2-3x more spacing** than feels comfortable

### Container Styles

**Ornate Frame** (for cards, sections):
```css
border-2 border-gold/30 
relative p-8 
bg-midnight-teal/90 
backdrop-blur-sm
```

**Glass Panel** (for overlays):
```css
bg-midnight-teal/60 
backdrop-blur-md 
border border-white/10 
shadow-xl
```

---

## Component Styles

### Buttons

**Primary (Ritual)**:
```css
bg-ember text-vellum 
font-cinzel tracking-widest 
hover:bg-rose-clay 
transition-all duration-300 
shadow-[0_0_15px_rgba(185,78,106,0.4)] 
border border-gold/50
```

**Secondary (Ghost Gold)**:
```css
bg-transparent 
border border-gold 
text-gold 
hover:bg-gold/10 
font-playfair tracking-wide
```

### Cards

**Tarot Style**:
```css
aspect-[2/3] 
bg-celestial-blue 
border-2 border-gold/40 
rounded-lg 
hover:transform hover:-translate-y-2 
transition-transform duration-500 
shadow-2xl
```

**Lore Entry**:
```css
bg-midnight-teal 
border-l-4 border-gold 
p-6 shadow-lg
```

### Input Fields

**Vintage Field**:
```css
bg-transparent 
border-b-2 border-gold/30 
focus:border-ember 
outline-none 
text-vellum 
placeholder-muted-brass/50 
font-crimson text-lg py-2
```

---

## Visual Enhancers

### Textures

**Noise Overlay** (subtle grain):
```css
fixed inset-0 opacity-[0.03] pointer-events-none z-50
background: url('grainy-gradients.vercel.app/noise.svg')
```

### Glow Effects

```css
/* Gold glow */
drop-shadow-[0_0_8px_rgba(200,164,77,0.5)]

/* Ember glow */  
drop-shadow-[0_0_10px_rgba(185,78,106,0.6)]
```

### Vignette Effect
```css
background: radial-gradient(circle at center, transparent 0%, #0E2A2F 100%)
```

---

## Page-Specific Guidelines

### Home/Landing
- Full-screen hero with centered ornate title
- Parallax scrolling into lore sections
- Dark background with gold accents
- Crow/raven imagery

### Guides Page
- Bento grid layout (5 personas)
- Each persona card shows: image, name, title, bio excerpt
- "Choose as Guide" CTA button
- Hover reveals more detail

### Timeline
- Vertical timeline with alternating left/right cards
- Network graph view toggle
- Color-coded connections (teal = linked, amber = referenced)
- Filter panel with category chips

### Spell Request
- Multi-step wizard flow
- Persona selection at start
- Dark sections with gold accents
- Generated spell displays in ornate frame

### Invisible Helpers (Battle Cry)
- Dark, atmospheric hero
- Brenda images subtly integrated (low opacity, blended)
- Intention setting form
- PDF download capability

### Tarot
- Tabletop view aesthetic
- Cards in semi-circle spread
- Card flip animation
- Reading interpretation panel

---

## Ornate Elements Library

The app uses custom `OrnateElements.js` components:

| Component | Usage |
|-----------|-------|
| `DarkSection` | Dark background wrapper with variants |
| `LightSection` | Light/cream background wrapper |
| `GrandDivider` | Decorative section dividers |
| `ElaborateCorner` | Corner flourishes for frames |
| `CornerFlourish` | Smaller corner decorations |
| `LightOrnateCard` | Cream-colored framed card |
| `BorderFrame` | Gold border frame wrapper |
| `PageHeader` | Standardized page title component |

### DarkSection Variants
- `default` - Standard midnight teal
- `warm` - Slightly warmer tone
- `deep` - Deeper obsidian

---

## Image Treatment

### Atmospheric Images
- Use sepia/desaturated filters
- Low opacity (0.06-0.15) for backgrounds
- `mix-blend-mode: luminosity` for ghostly effect
- Gradient masks for fade-out edges

### Persona Images
- Vintage illustration style
- Ornate botanical borders
- Sepia and cream tones
- Period-appropriate styling (Victorian/Edwardian/Post-war)

---

## Animation Guidelines

### Entrance Animations
- Fade up: `initial={{ opacity: 0, y: 20 }}`
- Stagger children with `animation-delay`
- Use Framer Motion for complex animations

### Hover States
- Cards: slight lift (`hover:-translate-y-2`)
- Buttons: color shift + glow increase
- Links: underline animation or color change

### Page Transitions
- Smooth fade between routes
- Loading states with subtle pulse

---

## Accessibility Notes

- Maintain WCAG AA contrast ratios
- Gold on dark backgrounds: ensure sufficient brightness
- Use `font-medium` or `font-semibold` for small gold text
- All interactive elements need `data-testid`
- Focus states visible with gold outline

---

## File Structure

```
/app/frontend/src/
├── components/
│   ├── ui/           # Shadcn components
│   ├── OrnateElements.js  # Custom decorative components
│   ├── BrandIcon.jsx      # Logo/icon component
│   └── GlassCard.js       # Glass morphism card
├── data/
│   └── archetypes.js      # Persona definitions
├── pages/
│   ├── Home.js
│   ├── Guides.js
│   ├── Timeline.js
│   ├── SpellRequest.js
│   ├── InvisibleHelpers.js
│   ├── CorrieTarot.js
│   └── About.js
└── index.css          # Global styles, Tailwind config
```

---

## Quick Reference: CSS Classes

```css
/* Backgrounds */
.bg-night-deep      /* Darkest */
.bg-midnight-teal   /* Primary dark */

/* Text */
.text-silver-mist   /* Primary text */
.text-gold          /* Accent text */
.text-ember         /* Highlight text */

/* Fonts */
.font-cinzel        /* Display */
.font-playfair      /* Subheadings */
.font-crimson       /* Body */

/* Effects */
.glow-gold          /* Gold drop shadow */
.border-gold/30     /* Subtle gold border */
```

---

*Last Updated: February 2025*
