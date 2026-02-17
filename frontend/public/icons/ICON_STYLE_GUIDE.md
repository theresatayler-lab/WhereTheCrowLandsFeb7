# Crowlands Icon System

## Visual Language
All icons in the Crowlands app follow a unified visual system:

- **Victorian 19th century woodcut engraving**
- **Natural history illustration influence**
- **Archival etching aesthetic**

**The goal is:** Timeless • Literary • Occult-adjacent • Precise • Quietly powerful

---

## Core Rules

### 1. Single Object Only
Icons must represent one clear symbolic object. No grouped scenes. No decorative framing unless conceptually required.

**✅ Correct:**
- Compass
- Teacup
- Feather
- Shield

**❌ Incorrect:**
- Collages
- Scene compositions
- Decorative borders with flourishes

### 2. Black Ink Only
- Pure black (#000000)
- No grayscale
- No color
- No sepia
- No textured paper backgrounds
- No gradients

### 3. Line Treatment
- Fine cross hatching allowed
- No heavy shadow blocks
- No filled silhouette shapes
- Line weight must feel consistent across icons
- Avoid extreme micro-detail that breaks at small sizes

### 4. Composition
- Square artboard (1:1)
- Object centered
- Clean negative space around object
- Must read clearly at 24px–32px

**Test rule:** If the icon becomes muddy at 32px, it is too detailed.

### 5. Export Standards
- **Preferred:** SVG
- **Fallback:** 512px transparent PNG

**File naming format:**
```
[concept-name]-icon.svg
```

**Examples:**
- `compass-icon.svg`
- `alchemize-protection-icon.svg`
- `anchor-poetry-icon.svg`
- `home-quiet-icon.svg`

**Rules:** Lowercase • Hyphenated • No spaces • No caps

---

## 🖋 Icon Generation Prompts

### MASTER PROMPT TEMPLATE (DALL·E)
Use this for standard icon generation:

```
Victorian 19th century woodcut engraving illustration of [INSERT SINGLE OBJECT HERE], simple clear form, front-facing or slight natural angle, Victorian 19th century woodcut engraving illustration, single isolated object, highly detailed ink linework, fine cross hatching, natural history illustration style, black ink only, no grayscale wash, no shading gradients, no background, transparent background, centered composition, standalone icon, archival etching style, clean negative space, high contrast, white background removed, vector-friendly, no text
```

**How to Use It:**
Replace only: `[INSERT SINGLE OBJECT HERE]`

**Examples:**
- a small ceramic teacup and saucer
- a vintage leather satchel
- a simple botanical sprig
- an antique magnifying glass
- a heraldic shield
- a rising sun with fine linear rays

Everything else stays exactly the same.

### VECTOR-CLEANER VARIANT PROMPT
Use when icons will be converted to SVG (optimized for cleaner vectorization):

```
Victorian 19th century woodcut engraving illustration of [INSERT SINGLE OBJECT HERE], simple clear silhouette, minimal interior complexity, front-facing or slight natural angle, Victorian 19th century woodcut engraving illustration, single isolated object, controlled line density, refined ink linework, light and disciplined cross hatching, no heavy shadow blocks, natural history illustration style, black ink only, pure black lines (#000000), no grayscale wash, no shading gradients, no texture fills, no background, transparent background, centered composition, standalone icon, archival etching style, clean negative space, high contrast, white background removed, vector-friendly, scalable, no text
```

**Why This Works Better for SVG:**
It reduces:
- Dense shadow pooling
- Micro-line noise
- Background artifacting
- Unnecessary tonal depth

That means:
- Cleaner Image Trace (Illustrator)
- Cleaner Vector Magic output
- Fewer anchor points
- Better scaling at 24px UI size

### Optional Add-On (For Even Tighter Consistency)
At the end of either prompt you can add:
```
minimal Victorian ornamentation, restrained detailing, avoid heavy shadow blocks
```
This reduces DALL·E drift into gothic poster territory.

---

## 🔒 Non-Negotiable Rules for Consistency

When generating icons:

1. **One object only** (never grouped elements unless the concept requires it)
2. **No symbols floating around it**
3. **No collage sheets**
4. **No text in image**
5. **No background texture**
6. **Pure black ink only**
7. **High contrast**
8. **Centered in a square composition**
9. **Must work when scaled to 24–32px in UI**

---

## Color Treatment (Applied Programmatically)

- Source artwork is **black & white only**
- Background is removed → **transparent PNG**
- Black ink lines are tinted to **Gold (#C8A44D)** using luminance mapping
- Darker lines = more opaque gold, lighter areas = more transparent
- This creates a warm, aged-gold-on-dark appearance that matches the site's navy/gold palette

### Color Mixing Options
- **Gold (#C8A44D)**: Default tint for most icons
- **Crimson (#B94E6A)**: Could be used for Alchemize categories or active states
- **Cream (#F3EFE8)**: For icons on dark backgrounds that need lighter treatment
- **Navy (#0E2A2F)**: For icons on light/cream backgrounds

---

## File Organization

```
/frontend/public/icons/
  anchors/          # 25 anchor object icons
    anchor-tea.png
    anchor-bird.png
    anchor-bread.png
    ...
  settings/         # 5 "where will you perform" icons
    setting-home-quiet.png
    setting-nature.png
    ...
  guides/           # 5 guide profile icons
    guide-shigg.png
    guide-cathleen.png
    ...
  alchemize/        # 8 category icons
    alchemize-protection.png
    alchemize-baneful-justice.png
    ...
  ui/               # UI utility icons
    icon-crystal-ball.png
    icon-grimoire.png
    icon-library-books.png
    icon-sparkles.png
    ...
```

### Current Naming Convention
- Lowercase, kebab-case
- Prefix matches the category: `anchor-`, `setting-`, `guide-`, `alchemize-`, `icon-`
- Name matches the `id` field in the code data arrays

---

## Sizing Standards

| Use Case | Size | Format |
|---|---|---|
| Inline icon (anchors, categories) | 48x48px | PNG, transparent |
| Setting cards | 48x48px | PNG, transparent |
| Guide profiles | 48x48px | PNG, transparent |
| Decorative (headers, dividers) | 96-128px | PNG, transparent |

**Max file size**: 8KB per icon (optimized PNG)

---

## Vector Cleanup Workflow

If generated as PNG:

1. Convert to grayscale (if needed)
2. Increase contrast to pure black
3. Remove any background residue
4. Vectorize with:
   - Illustrator Image Trace (Black & White Logo preset)
   - Or Vector Magic
5. Simplify anchor points
6. Export as optimized SVG

---

## QA Checklist Before Commit

- ✅ Single object
- ✅ Pure black only
- ✅ Transparent background
- ✅ Centered
- ✅ Reads at 32px
- ✅ File named correctly
- ✅ No stray pixels
- ✅ No background remnants

---

## Long-Term Consistency Rule

If an icon feels:
- Too gothic
- Too fantasy poster
- Too ornate
- Too modern
- Too minimalist

**It does not belong in Crowlands.**

The aesthetic should feel: **19th century archival illustration — restrained and deliberate.**

---

## Where Icons Are Used in Code

| File | What | Current Implementation |
|---|---|---|
| `SpellRequest.js` ANCHORS array | `icon` field → `<img src={a.icon}>` | Custom woodcut PNGs |
| `SpellRequest.js` SETTINGS array | `icon` field → `<img src={s.icon}>` | Custom woodcut PNGs |
| `SpellRequest.js` PERSONAS array | `icon` field → `<img src={p.icon}>` | Custom woodcut PNGs |
| `SpellRequest.js` ALCHEMIZE_OPTIONS | `icon` field → lucide component | **Needs replacement** |
| `GrimoirePage.js` archetype display | Inline img tag | Custom woodcut PNGs |
| `Navigation.js` | Various lucide icons | Keep as-is (UI chrome) |

---

## Processing Script

To process new raw icons: `/tmp/process_icons.py`

- Downloads from URL, removes white background, tints to gold, resizes to 48px
- Can be re-run with new icon URLs added to the ICONS array

---

## Subject-Specific Generation Tips

### Objects (candle, salt, scissors)
"a single [object], detailed craftsmanship visible"

### Nature (bird, herb, tree)
"botanical/ornithological illustration style"

### Scenes (cottage, train)
"vignette style, circular or contained composition"

### Abstract concepts (protection, courage)
"symbolic representation using period-appropriate iconography"
