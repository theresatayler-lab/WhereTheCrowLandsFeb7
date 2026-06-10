# CROWLANDS VISUAL SYSTEM — IMPLEMENTATION BRIEF
## CLAUDE.md-style guide for building out spell-page and site visuals
**Date:** June 10, 2026 · **Owner:** Theresa Tayler · **Status:** APPROVED SPEC
**Scope:** Spell page visual layout, image placement, per-guide ornament system, Quick-tier visuals, PDF grimoire layout, static fallback libraries, loading-screen rotation.
> Any Claude Code session may pick this up cold. Read this entire file before touching
> `image_provider.py`, `image_style_matrix.py`, `spell_prompts.py`, `GrimoirePage`,
> `SpellBlockRenderer.jsx`, `OrnateElements.js`, or `ornaments/index.js`.
>
> This document supersedes `design_assets/archive/VISUAL_BRIEF.md` (the short
> three-decision brief) and all earlier color/design docs.

---
## 0. CANONICAL PALETTE — SINGLE SOURCE OF TRUTH
This palette supersedes ALL earlier values found anywhere in the repo or docs.
If you find a deprecated hex in code, replace it with its canonical counterpart.

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Page background | Deep Navy / Midnight | `#0C1D2E` | Body background, hero sections |
| Primary dark surface | Primary Navy | `#102534` | Secondary dark containers, nav, footers |
| Card surface (dark) | Celestial Blue/Teal | `#123A3F` | Cards and layered surfaces on dark |
| Reading surface | Vellum / Bone Ivory | `#F3EFE8` | ALL body-text containers, light cards |
| Accent | Antique Gold | `#C8A44D` | **Strokes/linework ONLY. Never fill.** |
| CTA | Ember Pink | `#B94E6A` | Buttons, CTAs, drop caps, interactive accents |
| Deep accent | Oxblood Burgundy | `#8B2232` | Pull quotes, headings on vellum, sigil cores |
| Text on light | Ink Black | `#1A1A1A` | Body on vellum |
| Text on dark | Vellum @ 72–80% | `#F3EFE8` | Body prose on navy |
| Muted on dark | Faded Gold | `#A89872` | Tags, metadata, secondary linework |
| Muted on light | Warm Grey | `#5A524E` | Captions on vellum |

### DEPRECATED — replace on sight, never introduce
```
#0a1628  (old navy-dark)            #0E2A2F  (old navy-mid / midnight teal)
#06133c  (parchment-era blue)       #750609  (parchment-era blood red)
#D8CBB3  (weathered beige bg)       #e8dcc8  (parchment card)
#1C1C1C  (raven black bg)           #d4af37  (Art Deco gold)
#120f14  (midnight plum)            #B82330  (old crimson)
```

### Tailwind / CSS variables (update `tailwind.config.js` and `:root` to match)
```css
:root {
  --wtc-bg:          #0C1D2E;
  --wtc-bg-primary:  #102534;
  --wtc-card-dark:   #123A3F;
  --wtc-surface:     #F3EFE8;
  --wtc-gold:        #C8A44D;
  --wtc-gold-faded:  #A89872;
  --wtc-cta:         #B94E6A;
  --wtc-oxblood:     #8B2232;
  --wtc-ink:         #1A1A1A;
  --wtc-grey-warm:   #5A524E;
}
```

### Text-on-dark colour hierarchy (the candlelight rule)
Title → Antique Gold · Subtitle/emphasis → Ember Pink · Tag/label → Faded Gold ·
Body prose → Vellum at ~75% opacity. Warm tones glow from within the dark.
**No blanket overlays.** Warm glows are tight radial effects centred on the content
zone they support, dissolving cleanly into the navy.

---
## 1. TYPOGRAPHY CANON
| Role | Typeface | Fallbacks | Rules |
|------|----------|-----------|-------|
| Display / hero titles | TC Phantasmagoria | Cinzel Decorative, Playfair Display, Georgia, serif | Ceremonial only, never body |
| Section headings | Cinzel Decorative | Playfair Display, Georgia, serif | letter-spacing 0.05em |
| Body prose | Crimson Text | Georgia, Times New Roman, serif | min 14px / 1rem, line-height 1.6, NEVER sans |
| UI / labels / nav | Montserrat | Arial, Helvetica, sans-serif | 13px, uppercase, tracking 0.08–0.1em |

**Deprecated fonts:** Italiana (parchment era) — replace with Cinzel Decorative.

---
## 2. HARD RULES (non-negotiable, apply to every change)
1. Gold `#C8A44D` is strokes/linework only — never flat fill, never background.
2. Body text sits on solid surfaces only (Vellum or the dark navys). No text over
   gradients, photos, or textures. No opacity layers under reading text.
3. Body text is always serif (Crimson Text).
4. Corners: 2px max radius or sharp. Never rounded/pill.
5. No emoji in UI or formal content.
6. Ornament = Art Nouveau filigree / Victorian engraving, bilateral or radial symmetry.
   Never modern-geometric, never glassmorphism, never drop-shadow gloss.
7. One atmospheric image per page maximum (spell pages follow §3 layout exactly).
8. Min contrast 4.5:1 body, 3:1 headings.
9. Animations are slow and ceremonial: candle-flicker 2–4s cycles, medallion rotation
   60–120s, ink-reveal fades. Nothing frantic, nothing under ~1.5s.
10. Voice: "working" not "spell" in user-facing brand copy (product/code names may
    retain "spell" where already established, e.g. spell-request route).
11. **Image persistence:** never store base64 image data inside `spell_data` in
    MongoDB (16 MB document limit). GridFS is the single source of truth for saved
    spell images; grimoire loads must reconstruct images into BOTH
    `asset_plan.generated_assets` AND `spell_data.generated_images` (the
    GrimoirePage read path). Implemented in commit `95615bd` — do not regress.

---
## 3. SPELL PAGE VISUAL LAYOUT — THE SIX DECISIONS (RESOLVED)
The page tells one ceremonial arc: **Plate (atmosphere) → Emblem (invitation) →
Working (text + guide ornaments) → Seal (closure)**.

### 3.1 Header image → FRAMED VIGNETTE PLATE (not wallpaper, not full-bleed hero)
- Kill the 14%-opacity soft-light background treatment. Remove entirely.
- Render the generated header (Gemini std / FAL premium) as a contained plate at the
  top of the spell, like a chapter illustration in a Victorian natural history book:
  - Aspect ~16:9, width 100% of the content column, `max-height: 480px`,
    `object-fit: cover`, full opacity.
  - Frame: 1px Antique Gold border + 8–12px Deep Navy mat + outer 1px gold hairline
    (double-rule plate frame). Corner ornaments from the guide's corner style (§4).
  - Below the plate: a one-line caption slot in Montserrat 12px Faded Gold,
    uppercase, e.g. the working's category ("A WORKING OF PROTECTION").
- Mobile: same treatment, `max-height: 300px`.
- If no generated header (failure or Quick tier): render the guide's static fallback
  header (§6) or the Quick-tier CSS treatment (§5). Never an empty box.

### 3.2 Sigil → INLINE SEAL between closing words and reflection prompt (+ printables)
- New render position: immediately after the working's closing words, before the
  reflection/journal block.
- Presentation: circular crop, ~240px diameter desktop / 180px mobile, centred,
  1px gold ring with a second hairline ring 6px out (seal impression look).
- Caption beneath, Montserrat 12px Faded Gold, centred: "THE SEAL OF THIS WORKING".
- Subtle ink-reveal animation on scroll-into-view (fade from navy, ~2s).
- KEEP the copy in PrintablesBlock — sigil appears in both places.
- NEVER as a watermark behind text (violates Hard Rule 2).

### 3.3 Tarot card → LARGER FRONTISPIECE, stays in the header zone
- Size up from current small render to 320–360px height desktop (~256px mobile).
- Position: in the SpellHeader beside the title block on desktop (title left, card
  right); stacked beneath the title on mobile.
- Mat treatment: Vellum mat (12px) inside a 1px gold frame — like a mounted plate.
- Keep the flippable interaction (FlippableTarotCard).
- The tarot is the *invitation*; the sigil is the *closure*. Do not move tarot to
  the end and do not duplicate it there.

### 3.4 Dividers → PER-GUIDE SVG ORNAMENTS (no API calls, no static one-size PNGs)
- DO NOT generate dividers via image APIs. Zero runtime cost is the requirement.
- The ornament library already exists: `frontend/src/assets/ornaments/index.js`
  (24 bestiary glyphs, 20 corner styles, 12 divider strips, PAGE_ORNAMENT_CONFIG).
- Build `GUIDE_ORNAMENT_CONFIG` alongside PAGE_ORNAMENT_CONFIG and wire the spell
  renderer to pull the active guide's set instead of the shared static PNGs.
  See §4 for the full mapping. Add new SVG variants where a guide's vocabulary in
  `spell_prompts.py` isn't yet covered (e.g. botanical sprig strip for Shigg,
  needle-and-thread strip for Katherine) — same stroke language: 1–2px gold lines,
  bilateral symmetry, transparent background.
- Each guide gets 3 divider variants; the renderer cycles them in order down the
  page so the three section breaks differ.
- Apply candle-flicker animation (subtle brightness pulse, 3s ease-in-out) to
  divider strokes on the live page; static in print.

### 3.5 Quick tier → RICHER CSS, STILL ZERO API CALLS
- The zero-image promise stands: no generation, no delay.
- Render the already-defined-but-dead fields from `image_style_matrix.py`:
  - `header_pattern` → CSS/SVG medallion (from the medallion generator pattern)
    behind the title zone only, guide-tinted, 12–15% opacity, slow rotation
    (90s cycle). Tight radial warm glow centred on the title, quick falloff.
  - `divider_style` → the guide's SVG divider set (§3.4).
- Replace the placeholder icon with the guide's woodcut icon
  (`/frontend/public/icons/guides/guide-<name>.png`), gold-tinted, 48–64px,
  inside a thin gold ring.
- Net effect: a Quick working looks like a pocket charm from the same book —
  modest, but unmistakably Crowlands.

### 3.6 PDF / print grimoire → IMAGES PROMOTED
- Header plate = chapter opener: top third of page one, full content width,
  double-rule gold frame, title set below it.
- Tarot card = half-page plate on its own leaf (or large right-column placement
  if single-column flow), vellum mat + gold frame, caption with card name.
- Sigil = FULL-PAGE closing plate: final page of the working, centred circular
  seal at ~60% page width on navy ground with gold ring, "The Seal of This
  Working" beneath in Cinzel Decorative, then guide attribution line.
- Guide SVG dividers print between sections (static, no animation).
- Print palette: Oxblood ≈ 35C/90M/70Y/40K, Gold ≈ 15C/30M/80Y/5K (CMYK refs).
- Add/extend print stylesheet so ornaments and frames survive PDF export.

### 3.7 Loading screen → SPELLCOMICS ROTATION (shipped, commit `878dadf` — maintain, don't rebuild)
The generation wait (RESEARCH / PLAN / WRITE / POLISH stepper) cycles curated
comic panels and clips. This is live; future work maintains and extends it.
- Assets: `frontend/public/spell_comics/` — 47 curated files (30 WebP stills,
  17 muted H.264 videos, all ≤6.5 MB), assignments in its `MANIFEST.md`.
- Component: `frontend/src/components/spell/SpellComicsRotation.jsx`.
- Behaviour: pull from the ACTIVE GUIDE's pool first, then shared rotation.
  Stills crossfade ~8s; videos play once, muted, then advance. Lazy-load only
  on the generation screen — never in the main bundle.
- Text-heavy instructional panels (sc33, sc37, sc29) need ≥700px display width;
  zoom-crop on mobile rather than shrinking text to illegibility.
- Optional polish: stage matching (sc30 typewriter clip suits WRITE; sc45/46
  "pick your guide" pages suit pre-generation).
- New panels: curate via the Cowork asset pass (see §6 caveat), update
  MANIFEST.md, keep videos ≤4 MB / stills WebP ≤1600px.

---
## 4. PER-GUIDE VISUAL DNA & ORNAMENT CONFIG
Never mix guide characteristics. Tints are accents within the brand palette —
they tint glyphs, glows, and divider strokes; they never replace gold linework
as the primary ornament colour and never become background fills.

| Guide | Tint family | Corner style | Divider set (3 variants) | Glyphs (accent / secondary) | Visual tokens for image prompts |
|-------|------------|--------------|--------------------------|------------------------------|--------------------------------|
| **Shigg** | Amber/copper | `floral` | botanical-sprig, teacup-and-steam, bird-on-branch | robin / wren (full parliament available: robin, magpie, crow, dove, sparrow, wren, owl, blackbird, goldfinch, starling, zebra finch) | hearth, copper kettle, tea leaves, dawn light, herbs (rosemary, lavender, thyme, bay, mint), Rubáiyát manuscript pages |
| **Cathleen** | Teal/emerald | `celtic` | celtic-knot, feather-and-note, talisman-chain | triquetra / raven | singing bowl, sheet music, silver rabbit, lucky button, pins near heart, Morrigan crow, emerald fire, parachute silk |
| **Katherine** | Violet (ONLY guide permitted violet) | `occult` | needle-and-thread, stitched-seam, pin-and-pentacle | thread / mirror | needle, black silk, red/white thread, scissors, séance table, red lamp, mirrors, Spitalfields weave |
| **Theresa** | Oxblood/red-thread | `geometric` (precise, drafted) | red-thread-line, magnifier-and-dots, map-contour | key / compass | notebook, magnifying glass, red thread, photographs, maps, family tree, archive boxes, threshold doorways |
| **Brenda** | Warm gold/sepia | `scroll` | envelope-seam, recipe-card-rule, feather-quill | feather / crow | letters, wax seals, family photographs, heirlooms, recipe cards, crow feathers, kitchen table |

```js
// frontend/src/assets/ornaments/index.js — add:
export const GUIDE_ORNAMENT_CONFIG = {
  shigg:     { corner: 'floral',    dividers: ['botanicalSprig','teacupSteam','birdBranch'],   accentGlyph: 'robin',     secondaryGlyph: 'wren',    tint: 'amber'   },
  cathleen:  { corner: 'celtic',    dividers: ['celtic','featherNote','talismanChain'],        accentGlyph: 'triquetra', secondaryGlyph: 'raven',   tint: 'teal'    },
  katherine: { corner: 'occult',    dividers: ['needleThread','stitchedSeam','pinPentacle'],   accentGlyph: 'thread',    secondaryGlyph: 'mirror',  tint: 'violet'  },
  theresa:   { corner: 'geometric', dividers: ['redThreadLine','magnifierDots','mapContour'],  accentGlyph: 'key',       secondaryGlyph: 'compass', tint: 'oxblood' },
  brenda:    { corner: 'scroll',    dividers: ['envelopeSeam','recipeRule','featherQuill'],    accentGlyph: 'feather',   secondaryGlyph: 'crow',    tint: 'sepia'   },
};
```
Reuse existing SVG strips where named; author the missing ones in the same
1–2px gold stroke language. Brenda currently has NO custom border assets —
authoring her set closes that known gap.

---
## 5. IMAGE GENERATION — PROMPT SYSTEM RULES
Provider routing (unchanged): Headers → Gemini (std) / FAL Flux Pro (premium).
Tarot → OpenAI GPT Image 1. Sigils → OpenAI (std) / Ideogram (premium).
Dividers → NEVER generated (see §3.4). Guide portraits → curated, never auto.

Prompts assemble from five layers (already implemented in `build_style_layer()` —
preserve this):
1. CROWLANDS_BASE_STYLE (universal)
2. GUIDE_VISUAL_DNA (motifs + atmosphere from §4 tokens)
3. Artist style by emotional register (gentle/practical/intense — 15 combinations)
4. Asset composition (header = panoramic plate; tarot = emblematic vertical;
   sigil = radial geometric medallion)
5. Visual tokens extracted from the working's own text (a rosemary working shows
   rosemary, not generic herbs)

Universal style suffix (append to every prompt):
```
Art Nouveau occult illustration, Victorian copper-plate engraving, antique
botanical manuscript, candlelit, archival museum quality, aged parchment
texture, deep navy ground, antique gold linework only (never filled),
symmetrical composition, fine crosshatching, ceremonial
```
Universal negative (every model that supports it):
```
digital, modern, minimalist, flat design, bright colors, neon, photorealistic,
3D render, gradient, cartoon, anime, contemporary, glassmorphism, pastel,
stock photo, UI mockup, text, watermark
```
Hard prompt rules: never photorealistic faces; dark ground always; gold as line
never fill; sigils get bilateral/radial symmetry; generate in parallel after
spell text completes; every asset has a fallback chain (primary provider →
secondary provider → static library §6).

### Operational notes (verified live, June 10 2026)
- **FAL queue API:** poll using the `status_url` / `response_url` returned by the
  submit response — never hand-build the poll URL (FAL strips the model-version
  segment; a hand-built URL returns non-JSON 404). Fixed in `image_provider.py`.
- **FAL exhausted balance** returns `403 "User is locked. Reason: Exhausted
  balance."` The FAL → Gemini fallback handles this cleanly (verified in prod
  logs). If premium headers silently come back in Gemini's style, check the FAL
  balance at fal.ai/dashboard/billing before debugging code.
- Premium generation benchmark: ~95–115s end-to-end with all three images.

---
## 6. STATIC FALLBACK LIBRARIES — POPULATE (currently empty `[]`)
`STATIC_HEADERS`, `STATIC_TAROT`, `STATIC_SIGILS` must never be empty in
production. Curate from existing assets — do not generate new ones at runtime:
- Source pools:
  - The 19-asset engraving inventory (crow engravings, landscape scenes, gothic
    symbol grid, textures) + the 73 woodcut icons + ornament SVGs.
  - **The pack library** cataloged in `design_assets/CATALOG.md` — 11 purchased
    packs, ~4,000 files, including 765 recolorable SVG vectors. Highlights:
    Mystic Symbols v2 + Ornaments Vol 05 (dividers, corners, sigil-format
    medallions), Vintage Celestial (headers, tarot-format emblems),
    witch-trial woodcuts (Timeline + lore vignettes).
  - **CAVEAT for cold sessions:** the raw packs live ONLY in
    `design_assets/inbox/` on Theresa's machine and are **gitignored** (15 GB).
    Claude Code cannot see them. Pack curation happens in Cowork sessions;
    only processed selections get committed (pattern: SpellComics →
    `frontend/public/spell_comics/`).
- Per guide, curate: 1 header (landscape/scene engraving, navy-treated, framed
  per §3.1), 1 tarot-format emblem (vertical crop of a crow/portrait engraving
  in a gold frame), 1 sigil (gothic-symbol-grid extraction or medallion SVG
  render in the guide's geometry).
- Store as `{guide_id: url}` maps so a failed generation degrades to something
  on-brand and guide-correct, never to a broken image or empty slot.
- Known motif gaps in the pack library: Shigg (domestic/tea/hearth) and
  Cathleen (Celtic knotwork, song) have little pack-native art — cover their
  structure with recolored ornaments; flag motif art for purchase/generation.

---
## 7. ACCEPTANCE CRITERIA / QA CHECKLIST
Layout
- [ ] Header renders as framed plate at full opacity; 14% background treatment removed
- [ ] Tarot frontispiece 320–360px in header zone, vellum mat, flip intact
- [ ] Sigil seal renders inline after closing words AND in printables
- [ ] Three section dividers per page, all from the active guide's set, all differ
- [ ] Each of the 5 guides shows a visibly distinct ornament system (side-by-side check)
- [ ] Quick tier renders header_pattern medallion + guide icon + guide dividers, zero API calls
- [ ] No body text sits over any image, gradient, or texture anywhere
- [ ] No gold fills introduced; corners ≤2px; no emoji
- [ ] Deprecated hexes purged from tailwind.config.js, index.css, App.css, components
- [ ] SpellComics rotation shows the active guide's pool during generation; videos muted; no bundle bloat

Pipeline
- [ ] Shigg gentle / Shigg intense headers visibly differ (artist-register check)
- [ ] A rosemary working's header/tarot show rosemary (token extraction check)
- [ ] Provider failure → secondary provider → static fallback; nothing breaks
- [ ] STATIC_HEADERS / STATIC_TAROT / STATIC_SIGILS populated for all 5 guides
- [ ] Images generate in parallel post-text; progress UI shows during generation
- [ ] Saved spell Mongo docs stay small (~tens of KB) — no base64 in `spell_data`; GridFS refs present
- [ ] Grimoire reload returns images in BOTH `asset_plan.generated_assets` and `spell_data.generated_images`

Print/PDF
- [ ] Header = chapter opener, tarot = half-page plate, sigil = full-page closing seal
- [ ] Guide dividers and gold frames survive PDF export
- [ ] Saved grimoire entries retain all images

Mobile
- [ ] Plate ≤300px, tarot stacks under title, seal 180px, dividers scale cleanly
- [ ] SpellComics text panels zoom-crop rather than shrink below legibility

---
## 8. IMPLEMENTATION ORDER
1. **Palette purge** — canonical variables in, deprecated hexes out (touches
   tailwind.config.js, index.css, App.css, scattered components). Low risk, do first.
2. **GUIDE_ORNAMENT_CONFIG + missing SVG strips** — ornaments/index.js,
   OrnateElements.js, spell renderer wiring. Authors Brenda's missing set.
3. **Spell page layout** — SpellHeader (plate + tarot frontispiece), inline sigil
   seal block, divider cycling. SpellBlockRenderer.jsx / GrimoirePage.
4. **Quick tier visuals** — render header_pattern + divider_style + guide icon.
5. **Static fallback curation** — populate the three libraries per guide
   (pack curation via Cowork, see §6 caveat).
6. **PDF layout** — chapter opener / half-page tarot / full-page seal + print CSS.
7. **QA pass** against §7, all five guides × three tiers.

(§3.7 SpellComics rotation is already shipped — touch only for the QA items and
stage-matching polish.)

---
## 9. FILES TO TOUCH (reference map)
| Change | Files |
|--------|-------|
| Palette | `frontend/tailwind.config.js`, `frontend/src/index.css`, `App.css` |
| Ornaments | `frontend/src/assets/ornaments/index.js`, `frontend/src/components/OrnateElements.js` |
| Spell layout | `frontend/src/components/SpellBlockRenderer.jsx`, `GrimoirePage`, `SpellBookView`, `FlippableTarotCard`, SpellHeader |
| Loading rotation | `frontend/src/components/spell/SpellComicsRotation.jsx`, `frontend/public/spell_comics/` |
| Quick tier | `backend/image_style_matrix.py` (fields exist), frontend Quick renderer |
| Fallbacks | `backend/image_provider.py` (STATIC_* maps), `frontend/src/assets/brandAssets.js` |
| Prompts | `backend/spell_prompts.py`, `backend/image_style_matrix.py` |
| PDF | grimoire PDF export path + print stylesheet |
| Image persistence | `backend/server.py` (grimoire save/load), `backend/image_storage.py` (GridFS) |

---
## 10. HOUSEKEEPING (do alongside, not optional)
- Remove `PERMANENT_PRO_ACCESS_THERESA.md` and `PREMIUM_USER_THERESA_TAYLER.md`
  from the repo/docs folder — they contain plaintext credentials. Move account
  details to `.env`-style secrets; recommend rotating the password they expose.
- **Fix the premium-tier gating bug:** `generate_spell_v3` in `server.py` checks
  `is_paid = tier in ('pro','paid')` but the tier vocabulary everywhere else is
  `premium`/`founding` — so premium subscribers still hit the free 3-spell limit.
  Align the vocabulary (decide the canonical set, then sweep).
- **Test accounts:** the Atlas DB did not contain the documented test accounts;
  `sub_test@test.com / test123` was re-created June 10 and set to `premium` tier
  directly in Mongo. `free_test@test.com` may still be missing — recreate before
  relying on it.
- **Licenses:** only 2 of the 11 purchased asset packs shipped license docs.
  Add `design_assets/inbox/LICENSES.txt` noting where each pack was purchased
  so usage rights stay traceable (required before §6 curation ships).
- Update the repo `CLAUDE.md` Quick Reference colours to §0 of this brief so the
  two documents never disagree again. Also refresh its "Working vs Gaps" list —
  image generation, SpellComics rotation, and grimoire image persistence are
  now WORKING; FAL fix and visual-brief items are merged.
- Delete or archive superseded design docs (COLOR_SCHEME_UPDATE.md,
  BRAND_INTEGRATION_PLAN.md parchment direction, DESIGN_CUSTOMIZATION_GUIDE.md,
  and `design_assets/VISUAL_BRIEF.md`) into a `/docs/archive/` folder with a
  one-line deprecation header each, so future sessions don't treat them as
  current.

*End of brief. When in doubt: candlelit, archival, symmetrical, gold as line —
and the darkness is part of the aesthetic.*
