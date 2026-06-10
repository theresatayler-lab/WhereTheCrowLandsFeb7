# Design Customization Guide - Where The Crowlands

## Current Design System

### Colors (Currently: Rich Bloomsbury/1920s Art Deco)
```css
Background: #120f14 (Deep midnight plum)
Foreground/Text: #f3f2e9 (Warm cream)
Primary/Accent: #d4af37 (Art deco gold)
Secondary: #2d2436 (Dark purple)
Rose Accent: #c08e9b (Bloomsbury rose)
Green Accent: #6b8e4a (Artichoke green)
Orange Accent: #cc5500 (Burnt orange)
Borders: #383042 (Subtle purple-grey)
```

**Current Vibe**: Dark, mystical, sophisticated, 1920s literary salon meets occult lodge

### Typography
```
Headings: Italiana (elegant serif)
Magical Accents: Cinzel Decorative (ornate)
Body Text: Montserrat (clean, readable)
```

### Visual Elements
- Glass-morphism cards (backdrop blur, subtle borders)
- Gold hover effects and glows
- Smooth animations (framer-motion)
- Custom gold scrollbar
- Subtle noise texture overlay
- Minimal gradients (design principle: avoid dark gradients)

## What Can You Customize?

### 1. COLOR SCHEME (Easiest)
**Tell me your preference:**

**Option A: Keep mystical but change palette**
Examples:
- "Darker/more witchy" → More blacks, deep purples
- "Earthier" → Browns, forest greens, stone greys
- "More vibrant/modern" → Brighter jewel tones
- "Minimalist" → Black, white, one accent color

**Option B: Completely different vibe**
Examples:
- "Cottagecore witch" → Soft greens, creams, botanical
- "Modern minimalist" → Crisp whites, blacks, single bold accent
- "Gothic vampire" → Deep reds, blacks, silver
- "Crystal/New Age" → Purples, teals, whites, iridescent
- "Forest witch" → Deep greens, browns, moss tones
- "Cosmic/astral" → Deep blues, purples, silver stars

**What I need from you:**
```
Primary color (main accent): #______
Background color: #______
Text color: #______
Secondary accent: #______
Border color: #______
Any specific color meanings?: (e.g., "green represents growth")
```

OR just describe the vibe you want:
"I want it to feel more _____ and less _____"

### 2. TYPOGRAPHY (Easy)
**Current fonts work for you or want different?**

**Tell me:**
- Heading style preference: 
  - Current: Elegant/classical (Italiana)
  - Other options: Gothic, Modern, Mystical, Handwritten, Bold
  
- Body text preference:
  - Current: Clean sans-serif (Montserrat)
  - Other options: Serif for readability, Different sans-serif

**Popular witchy font combinations:**
- **Gothic**: Crimson Text + Source Sans Pro
- **Mystical**: Philosopher + Raleway  
- **Modern Witch**: Playfair Display + Inter
- **Handwritten**: Dawning of a New Day + Open Sans
- **Bold**: Bebas Neue + Roboto

**What I need:**
Just say: "I want headings to look more [gothic/modern/elegant/bold]"
Or give me specific Google Fonts names if you have them.

### 3. LOGO / BRANDING
**Current:** Moon icon + "Where The Crowlands" text

**Options:**
a) **Custom crow illustration** - Do you have one or want me to source?
b) **Different icon** - What represents your brand? (pentacle, cauldron, crystal, etc.)
c) **Text-only logo** with special typography
d) **Combination mark** - Symbol + text

**What I need:**
- Existing logo file? (PNG, SVG, etc.)
- Description of what you want
- Any specific crow imagery you love?

### 4. HERO IMAGE (Currently: Dark mystical abstract)
**Want a different main background image?**

**Options:**
a) **Your own photo/artwork** - Upload it
b) **Specific imagery** - Tell me theme:
   - Forest/nature scene
   - Crow/raven imagery
   - Moon phases
   - Vintage occult imagery
   - Abstract mystical
   - Sacred geometry
   
**What I need:**
- Image file (high-res, 1920x1080+ recommended)
- OR description: "I want the hero to show _____"

### 5. CARD STYLE
**Current:** Glass-morphism (frosted glass effect with blur)

**Other options:**
- **Solid cards** with shadows
- **Outlined/minimal** cards
- **Textured** (paper, parchment, stone)
- **Floating/elevated** with strong shadows
- **Flat/modern** no depth

**What I need:**
Just tell me: "I want cards to look more [solid/minimal/textured/etc.]"

### 6. IMAGERY FOR CONTENT
**Current issues you mentioned:**
- Using stock photos instead of real historical figures
- Need authentic period photographs

**What I need from you:**

**For Historical Figures:**
- Do you have access to historical photos? 
- Want me to source from public domain archives? (I documented sources in HISTORICAL_ACCURACY_NOTES.md)
- OR prefer illustrated portraits instead of photos?

**For Deities:**
- Classical art (paintings/sculptures)?
- Modern illustrations?
- Symbolic imagery (moon, crow, etc.)?
- Your own commissioned art?

**For Sacred Sites:**
- Current stock photos OK or want specific sites?
- Can source from Wikimedia Commons

**What I need:**
- Image files (if you have them)
- OR tell me your preference and I'll source public domain images
- Image style preference: Photos, illustrations, classical art, mixed?

### 7. ANIMATIONS & INTERACTIONS
**Current:** Smooth, subtle (cards lift on hover, fade-ins)

**Want different?**
- More dramatic (bigger movements, particles, sparkles)
- Minimal (no animations, instant transitions)
- Playful (bounces, wiggles)
- Keep current

### 8. NAVIGATION STYLE
**Current:** Horizontal top nav with small icons

**Other options:**
- Sidebar navigation
- Mega menu with descriptions
- Minimal text-only
- Icon-only with tooltips
- Keep current but different style

## Quick Customization Examples

### Example 1: "I want it darker and more witchy"
```css
Background: #000000 (Pure black)
Primary: #8b0000 (Dark red)
Secondary: #2d1b2e (Deep purple)
Text: #e0e0e0 (Light grey)
Borders: #3a1f3d (Dark purple)
```
+ Gothic fonts
+ Darker imagery
+ More shadows, less blur

### Example 2: "I want it earthy and natural"
```css
Background: #1a1410 (Dark brown)
Primary: #8b7355 (Warm tan)
Secondary: #2d4a2b (Forest green)
Text: #f5f5dc (Beige)
Accent: #d4a574 (Clay/terracotta)
```
+ Natural serif fonts
+ Botanical imagery
+ Wood/stone textures

### Example 3: "I want it clean and modern"
```css
Background: #ffffff (White)
Primary: #1a1a1a (Almost black)
Secondary: #7c3aed (Purple accent)
Text: #1a1a1a
Borders: #e5e5e5 (Light grey)
```
+ Modern sans-serif fonts
+ Minimal animations
+ Lots of whitespace

## What I Need From You - Priority Order

### 🎨 PRIORITY 1: Overall Vibe
Answer these:
1. **Feeling**: What 3 words describe how you want users to feel?
   (e.g., "empowered, grounded, magical")

2. **Less of / More of**: 
   - "Less _____, more _____"
   (e.g., "Less Victorian, more modern")

3. **Brand personality**: 
   - Mysterious vs. Approachable?
   - Serious vs. Playful?
   - Ancient vs. Contemporary?

### 🖼️ PRIORITY 2: Visual Assets (If you have them)
- Logo (PNG/SVG)
- Hero background image
- Historical photos (if sourced)
- Any other imagery

### 🎨 PRIORITY 3: Colors
Either:
- **Easy**: "I want it more [dark/light/earthy/vibrant/minimal]"
- **Specific**: Give me hex codes or show me examples you like

### ✏️ PRIORITY 4: Typography
- Keep current or change?
- Style preference (gothic/modern/elegant/bold)?

## How to Show Me What You Want

### Option 1: Description
"I want it to feel more [adjective] with [color/style] elements, less [current thing]"

### Option 2: Example Sites
"I like the style of [website URL]"

### Option 3: Mood Board
Share Pinterest boards, screenshots, color palettes you love

### Option 4: Specific Changes
"Change the gold to silver"
"Make background darker"
"Use this font for headings"

## Easy Changes I Can Make Right Now (5 min each)

1. **Color swap** - Give me new colors
2. **Font change** - Tell me style or font names
3. **Logo update** - Provide file or description
4. **Hero image** - Provide image or theme
5. **Card style** - Describe what you want
6. **Remove/add animations** - More or less?

## Where Design Files Live

- **Color system**: `/app/frontend/tailwind.config.js`
- **Global styles**: `/app/frontend/src/index.css`
- **Design guidelines**: `/app/design_guidelines.json`
- **Component styles**: Individual component files

All can be updated quickly!

## My Recommendation

**Step 1:** Tell me in your own words:
"I want Where The Crowlands to feel _____ and look _____"

**Step 2:** If you have assets (logo, photos), share those

**Step 3:** I'll show you mockups and we iterate

**What's your vision for the look and feel?**
