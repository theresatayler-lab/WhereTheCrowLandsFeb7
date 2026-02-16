# Where The Crowlands — Icon Style Guide

## Visual Style
**Period**: Victorian-era woodcut / copperplate engraving  
**Technique**: Black ink on white, fine crosshatching, stipple shading  
**Mood**: Archival, hand-printed, museum-quality illustration  
**NOT**: Cartoon, flat vector, emoji, modern minimalist, colored

## Color Treatment (Applied Programmatically)
- Source artwork is **black & white only**
- Background is removed → **transparent PNG**
- Black ink lines are tinted to **Gold (#C8A44D)** using luminance mapping
- Darker lines = more opaque gold, lighter areas = more transparent
- This creates a warm, aged-gold-on-dark appearance that matches the site's navy/gold palette

## Sizing
| Use Case | Size | Format |
|---|---|---|
| Inline icon (anchors, categories) | 48x48px | PNG, transparent |
| Setting cards | 48x48px | PNG, transparent |
| Guide profiles | 48x48px | PNG, transparent |
| Decorative (headers, dividers) | 96-128px | PNG, transparent |

**Max file size**: 8KB per icon (optimized PNG)

## File Organization
```
/frontend/public/icons/
  anchors/          # 25 anchor object icons
    anchor-tea.png
    anchor-bird.png
    anchor-bread.png
    ...
  settings/          # 5 "where will you perform" icons
    setting-home-quiet.png
    setting-nature.png
    ...
  guides/            # 5 guide profile icons
    guide-shigg.png
    guide-cathleen.png
    ...
  alchemize/         # 8 category icons
    alchemize-protection.png
    alchemize-baneful-justice.png
    ...
```

## Naming Convention
- Lowercase, kebab-case
- Prefix matches the category: `anchor-`, `setting-`, `guide-`, `alchemize-`
- Name matches the `id` field in the code data arrays

## AI Generation Prompt Template
Use this prompt (or close variant) when generating new icons:

```
Victorian-era woodcut engraving illustration of [SUBJECT].
Black ink on pure white background.
Fine crosshatching and stipple shading technique.
Detailed but clean single-object composition, no text, no border frame.
Style of 19th century British natural history or occult reference book illustration.
High contrast black lines, white negative space.
Square format, centered subject with breathing room around edges.
```

### Subject-Specific Variants:
- **Objects** (candle, salt, scissors): "a single [object], detailed craftsmanship visible"
- **Nature** (bird, herb, tree): "botanical/ornithological illustration style"
- **Scenes** (cottage, train): "vignette style, circular or contained composition"
- **Abstract concepts** (protection, courage): "symbolic representation using period-appropriate iconography"

## Color Mixing (Future)
The user has expressed interest in mixing the site's color schemes:
- **Gold (#C8A44D)**: Default tint for most icons
- **Crimson (#B94E6A)**: Could be used for Alchemize categories or active states
- **Cream (#F3EFE8)**: For icons on dark backgrounds that need lighter treatment
- **Navy (#0E2A2F)**: For icons on light/cream backgrounds

## Where Icons Are Used in Code
| File | What | Current Implementation |
|---|---|---|
| `SpellRequest.js` ANCHORS array | `icon` field → `<img src={a.icon}>` | Custom woodcut PNGs |
| `SpellRequest.js` SETTINGS array | `icon` field → `<img src={s.icon}>` | Custom woodcut PNGs |
| `SpellRequest.js` PERSONAS array | `icon` field → `<img src={p.icon}>` | Custom woodcut PNGs |
| `SpellRequest.js` ALCHEMIZE_OPTIONS | `icon` field → lucide component | **Needs replacement** |
| `GrimoirePage.js` archetype display | Inline img tag | Custom woodcut PNGs |
| `Navigation.js` | Various lucide icons | Keep as-is (UI chrome) |

## Processing Script
To process new raw icons: `/tmp/process_icons.py`
- Downloads from URL, removes white background, tints to gold, resizes to 48px
- Can be re-run with new icon URLs added to the ICONS array
