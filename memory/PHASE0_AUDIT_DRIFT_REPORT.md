# Phase 0: Audit & Drift Report
## Where The Crowlands — Design Recovery Plan
## Generated: 2026-06-11

---

## 1. CANONICAL PALETTE (Source of Truth)

| Role | Token | Hex | Status |
|------|-------|-----|--------|
| Page background | Deep Navy | #0C1D2E | Correctly wired in tailwind.config.js, index.css, NOUVEAU_COLORS |
| Cards / secondary | Primary Navy | #102534 | Correctly wired |
| Card dark surfaces | Card Teal | #123A3F | Correctly wired in index.css `--wtc-card-dark` |
| Reading surfaces | Vellum | #F3EFE8 | Correctly wired |
| Stroke/border accent | Antique Gold | #C8A44D | Correctly wired |
| Captions/metadata | Faded Gold | #A89872 | Correctly wired |
| CTAs/buttons | Ember Pink | #B94E6A | Correctly wired |
| Pull quotes/headings | Oxblood | #8B2232 | Correctly wired |
| Body on vellum | Ink Black | #1A1A1A | Correctly wired |
| Captions on vellum | Warm Grey | #5A524E | Correctly wired |

**Verdict: The 10-color canonical palette is correctly defined in all three authority files** (tailwind.config.js, index.css :root, ornaments/artNouveau.js NOUVEAU_COLORS). No conflicts between them.

---

## 2. DEPRECATED HEX USAGE

### 2a. Old Colors NOT Found in Active Code
The following deprecated hexes exist **only in documentation files** (design_guidelines.json, design_guidelines.md) and are NOT present in any .js/.jsx/.css source:

| Hex | Name | Where Found |
|-----|------|-------------|
| #0E2A2F | Old Midnight Teal | design_guidelines.json:46, design_guidelines.json:105 |
| #0A1F22 | Old Deep Obsidian | design_guidelines.json:47 |
| #9E8438 | Old Muted Brass | design_guidelines.json:50 (canonical is #A89872) |

### 2b. Wrong Persona Colors in design_guidelines.json (Lines 64-70)
**ALL five persona_schemes are wrong.** This file is a legacy artifact and should be corrected or deleted:

| Guide | JSON Color | Correct Tailwind Tint | Issue |
|-------|-----------|----------------------|-------|
| Shigg | #4A5D23 (olive green) | amber-600 / amber-500 | Wrong hue entirely |
| Cathleen | #8B3A3A (dark red) | teal-600 / teal-400 | Wrong hue |
| Katherine | #2F4F4F (dark teal) | violet-600 / violet-400 | Wrong hue |
| Theresa | #5D4037 (brown) | (investigator tint TBD) | No canonical tint defined |
| Brenda | #483D8B (slate violet) | (chronicler tint TBD) | Violet is Katherine ONLY |

### 2c. Pure Black (#000000) Found
- `Library.js:231` — book spine color for "Crow" by Ted Hughes. Single instance, cosmetic (book cover data).

---

## 3. NON-CANONICAL COLORS IN ACTIVE CODE

### 3a. Extended Palette (Documented, Acceptable)
These are outside the 10-color canon but serve specific roles and are consistent across files:

| Hex | Name | Where Used | Role |
|-----|------|-----------|------|
| #C26A5A | Rose Clay | tailwind.config.js, index.css | Destructive state / secondary accent |
| #D4B55D | Gold Light | tailwind.config.js, ornaments | Lighter gold variant for highlights |
| #6b1a28 | Crimson Deep | tailwind.config.js | Gradient depth color |
| #1A3548 | Navy Light | tailwind.config.js | Hover/elevated navy variant |
| #2A4558 | Navy Accent | tailwind.config.js | Focus ring / accent navy |
| #b87333 | Copper | ornaments/index.js | Decorative accent (Shigg copper) |
| #a8a8a8 | Silver | ornaments/index.js | Decorative accent |

### 3b. Warm Sepia Text Colors (Review Needed)
Used for body text on vellum surfaces — darker/warmer than canonical Ink Black:

| Hex | Files | Lines |
|-----|-------|-------|
| #2A2218 | OrnateElements.js, SpellBlockRenderer.jsx, index.css | 160, 160, 609/640/716/896 |
| #2a1f14 | TarotSummaryCard.jsx, index.css | 80/86/92, 1141/1168 |

**Decision needed:** Are these intentional "manuscript ink" variants, or should they be replaced with canonical #1A1A1A?

### 3c. Custom Dark Gradients (Component-Specific)
| Hex Values | File | Purpose |
|-----------|------|---------|
| #1a1a2e, #16213e, #0f0f23 | FlippableTarotCard.jsx:59 | Tarot card back gradient |
| #0F2438 | ShuffleOracle.js:49-93 | Oracle card backgrounds |
| #1D2847 | DecorativeDivider.js:26-30 | SVG corner ornament |

All are blue-biased (green < blue), not teal/green-biased. Acceptable but could be refactored to use canonical navy variants.

### 3d. Library.js Book Styling (~80 unique hex values)
Lines 85-358 define book cover colors (spine, text, accents) for ~20 decorative book objects. These are intentional per-book cosmetic data, not UI colors. They include the single #000000 instance. **Low priority — not core UI.**

### 3e. Timeline Taxonomy Colors (~14 unique hex values)
`timeline_models.py:41-210` defines colors for 14 taxonomy categories (Alchemy, Spiritualism, Folk Magic, etc.). These are data visualization colors, not UI chrome. Only two match canonical (#C8A44D for Occult Revival, #8B2232 for Performance). **Acceptable as data-viz palette.**

---

## 4. TAILWIND CONFIG TOKEN ANALYSIS

### 4a. Token Count
- **10 Shadcn/UI tokens** (background, foreground, card, primary, secondary, muted, accent, destructive, border, input, ring) — all correctly mapped
- **7 semantic tokens** (midnight-teal, celestial-blue, vellum, antique-gold, muted-brass, rose-clay, ember-pink) — all correct
- **~20 legacy tokens** (raven-black, ash-gray, weathered-beige, forest-moss, blood-red, etc.) — all resolve to canonical values

### 4b. Legacy Token Aliases
These are backward-compatibility aliases. All resolve to canonical values:
```
raven-black     → #0C1D2E (Deep Navy)
ash-gray        → #A89872 (Faded Gold)
weathered-beige → #F3EFE8 (Vellum)
forest-moss     → #102534 (Primary Navy)
blood-red       → #B94E6A (Ember Pink)
midnight-blue   → #0C1D2E (Deep Navy)
deep-blue       → #102534 (Primary Navy)
parchment       → #F3EFE8 (Vellum)
```

**Decision needed for Phase 1b:** Keep these aliases (zero runtime cost) or remove them to reduce confusion?

---

## 5. CSS VARIABLE LAYER ANALYSIS

### index.css :root Variables
Three layers defined, all internally consistent:

1. **WTC Master Palette** (lines 20-43): 11 variables — all canonical
2. **Shadcn/UI Compatibility** (lines 45-64): 18 variables — all canonical except `--destructive: #C26A5A`
3. **Legacy Nouveau Tokens** (lines 67-80): 11 variables — all canonical except `--rose-clay: #C26A5A`, `--gold-light: #D4B55D`, `--crimson-bright: #C26A5A`

**No conflicts between layers.** The WTC Master Palette is authoritative.

---

## 6. COMPONENT-LEVEL HARDCODED HEX AUDIT

### 6a. Components Using NOUVEAU_COLORS (Canonical Import)
- OrnateElements.js — primary consumer
- SpellPageFrame.jsx — uses COLORS.gold
- ornaments/artNouveau.js — source definition
- ornaments/index.js — alternative COLORS export

### 6b. Components with Hardcoded Hex (Should Use Tokens)

| File | Line(s) | Hex | Should Be |
|------|---------|-----|-----------|
| Navigation.js | 40,43,81 | #C8A44D | `text-gold` or NOUVEAU_COLORS.antiqueGold |
| Navigation.js | 55 | #0C1D2E, #102534 | Token-based gradient |
| Navigation.js | 62,83 | #B94E6A | `text-primary` or token |
| Footer.js | 12,108 | #0C1D2E | `bg-background` |
| Footer.js | 16,22,26,52,82 | #C8A44D, #B94E6A | Token references |
| DecorativeElements.js | 237 | #B8860B, #DAA520, #FFD700 | Non-canonical gold gradient |
| SpellBlockRenderer.jsx | 160 | #2A2218 | Token or #1A1A1A |
| Guides.js | 171, 217 | #e8e4dc | bg-vellum or token |

---

## 7. PAGE-LEVEL VIOLATIONS

### 7a. Hardcoded Hex in Page Components

| Page | Line | Hex | Fix |
|------|------|-----|-----|
| EarlyAccess.js | 68 | #0C1D2E | `bg-background` |
| SpellRequest.js | 1082 | #C8A44D | `text-gold` |
| Guides.js | 171, 217 | #e8e4dc | `bg-vellum` |
| Library.js | 466 | #F3EFE8, #e8dfd0 | Vellum gradient tokens |
| Library.js | 738, 746 | #F3EFE8 | `text-vellum` token |

### 7b. Non-Canonical Tailwind Classes

| Page | Line | Class | Fix |
|------|------|-------|-----|
| MyGrimoire.js | 382, 490 | `bg-red-500/10 text-red-600` | Define error/danger token |
| PaymentSuccess.js | 140, 141 | `bg-red-500/20 text-red-400` | Same |

### 7c. Semi-Transparent Overlay Violations
The design rules say "solid colors only — no semi-transparent backgrounds covering large areas":

| Page | Line | Pattern | Severity |
|------|------|---------|----------|
| Home.js | 50-51 | `rgba(12, 29, 46, 0.3)` vignette overlay | LOW (atmospheric, intentional) |
| EarlyAccess.js | 76 | `rgba(185, 78, 106, 0.08)` radial glow | LOW (< 30% viewport, tight radius) |

Both are within the "atmospheric glow" exception (radial, tight radius, < 30% viewport). Not violations.

### 7d. `transition-all` Violations (Forbidden — Breaks Transforms)

**Total: 40+ instances across 12 files.** Major offenders:

| Page | Count | Lines |
|------|-------|-------|
| Timeline.js | 18 | 515, 540, 727, 773, 786, 882, 905, 1065, 1103, 1180, 1207, 1270, 1320, 1332, 1391, 1403, 1787, 1798 |
| AIImage.js | 4 | 72, 367, 397, 431 |
| DesignPreview.js | 4 | 298, 412, 433, 447 |
| Rituals.js | 2 | 57, 70 |
| ProUpgrade.js | 2 | 232, 275 |
| WardFinder.js | 2 | 143, 388 |
| InvisibleHelpers.js | 2+ | various |
| Upgrade.js | 1 | 121 |
| Guides.js | 1 | 156 |
| CorrieTarot.js | 1 | 428 |

**Fix:** Replace `transition-all` with specific transition properties (`transition-colors`, `transition-transform`, `transition-opacity`).

---

## 8. SPELL GENERATION PATH AUDIT (Sync vs Async)

### 8a. Sync Path (POST /ai/generate-spell-v3) — Lines 5500-5766

| Stage | Status | Notes |
|-------|--------|-------|
| Tier selection | OK | `select_spell_tier()` returns SpellTier enum |
| Pipeline execution | OK | 4-stage: Archivist → Planner → Writer → QA |
| Image generation | OK | Parallel via `asyncio.gather()` |
| Quick tier visuals | OK | `QUICK_SPELL_VISUALS` attached to `spell_output['quick_visuals']` |
| Tier-aware routing | OK | TIER_PROVIDER_MAP: standard={header:gemini, tarot:openai}, premium={header:flux, tarot:openai, sigil:ideogram} |
| Response delivery | OK | Images inline as base64 |

### 8b. Async Path (POST /ai/generate-spell-job) — Lines 5805-6064

| Stage | Status | Notes |
|-------|--------|-------|
| Job creation | OK | Creates job doc in spell_jobs |
| Background processing | OK | Same pipeline with stage callbacks |
| Image generation | ISSUE | **Sequential** (not parallel like sync) |
| GridFS storage | OK | `_IMG_KEY_TO_REF` mapping, base64 stripped before persist |
| Quick tier visuals | **BUG** | `quick_visuals` NOT attached in async path |
| Sigil generation | **MISSING** | Premium tier sigil not generated in async path |
| Image rehydration | OK | Polling endpoint fetches from GridFS correctly |

### 8c. Grimoire Save/Load

| Stage | Status | Notes |
|-------|--------|-------|
| Save: GridFS storage | OK | `store_spell_images()` strips base64, stores refs |
| Save: Document size | OK | Images removed before MongoDB insert (16MB fix) |
| Load: Rehydration | OK | `storage_version >= 2` triggers GridFS fetch |
| Load: Frontend compat | OK | Reconstructs `image_base64`, `asset_plan.generated_assets`, `spell_data.generated_images` |

### 8d. Issues Found

1. **Async path: quick_visuals not wired** — When `skip_images=True` in `_generate_spell_background()`, no `quick_visuals` data is attached to the spell output. Quick spells generated via the async path will have no visual treatment.

2. **Async path: images generated sequentially** — The sync path uses `asyncio.gather()` for parallel generation, but the async background task awaits each image individually. This adds ~10-15s latency for standard tier, ~20-30s for premium.

3. **Async path: no sigil for premium** — The sync path generates sigils for premium tier; the async path does not have sigil generation code.

---

## 9. DESIGN GUIDELINES FILE STATUS

| File | Status | Issues |
|------|--------|--------|
| design_assets/VISUAL_SYSTEM_BRIEF.md | AUTHORITATIVE | Canonical spec, 379 lines |
| memory/BRAND_STYLE_GUIDE.md | OK | Brand bible, consistent |
| memory/STYLE_BIBLE.md | OK | Condensed system, consistent |
| design_guidelines.md | STALE | Contains correct CSS vars but references "ARTNOUVEAU.JS" constants that are now in ornaments/artNouveau.js |
| design_guidelines.json | **STALE/WRONG** | 2 wrong hex values, 5 wrong persona colors, old naming |

---

## 10. SUMMARY: WHAT TO FIX (Prioritized)

### CRITICAL (Phase 1a — Token Build & Wire)
1. Fix `design_guidelines.json` persona_schemes (all 5 wrong)
2. Fix `design_guidelines.json` palette (3 deprecated hexes)
3. Define canonical guide tint tokens (Theresa, Brenda missing)

### HIGH (Phase 1b — Deprecated Hex Purge)
4. Replace 40+ `transition-all` instances with specific properties
5. Replace hardcoded hex in components (Navigation.js, Footer.js, etc.)
6. Replace hardcoded hex in pages (EarlyAccess, SpellRequest, Guides, Library)
7. Replace `bg-red-500` / `text-red-400` with canonical error token

### MEDIUM (Phase 2+)
8. Decide on sepia text variants (#2A2218, #2a1f14) — keep or standardize
9. Decide on legacy Tailwind token aliases — keep or remove
10. Refactor FlippableTarotCard.jsx gradient to use canonical navies
11. Refactor DecorativeElements.js gold gradient to canonical values

### LOW / DEFERRED
12. Library.js book cover colors — cosmetic data, not core UI
13. Timeline taxonomy colors — data visualization, acceptable as-is

### BUGS (Not Design — Fix Independently)
14. Async spell path: attach `quick_visuals` for Quick tier
15. Async spell path: parallelize image generation with `asyncio.gather()`
16. Async spell path: add sigil generation for premium tier

---

*This report is read-only. No code was changed. All findings verified by automated search across the full codebase.*
