# EMERGENT: Complete Fix & Design Implementation Guide
## Where The Crowlands - February 15, 2026

**IMPORTANT: Read this entire document before making any changes. It contains both BUG FIXES (must do first) and DESIGN SPECIFICATIONS (do second).**

---

# PART 1: CRITICAL BUG FIXES (DO THESE FIRST)

## Step 0: Pull Latest from GitHub

```bash
cd /home/user/WhereTheCrowLandsFeb7 && git pull origin main
```

---

## BUG FIX 1: GuidePortal Block Rendering is BROKEN (CRITICAL)

**Problem:** `SpellBlockRenderer` expects a `spell` object (the entire spell), but GuidePortal line 436-438 iterates over individual blocks and passes them one at a time with a `block` prop that doesn't exist in the component signature. This means spell blocks don't render at all in the Guide Portal result view.

**File:** `frontend/src/pages/GuidePortal.js`

**Find this code (around line 435-438):**
```javascript
{spellResult.blocks ? (
  spellResult.blocks.map((block, i) => (
    <SpellBlockRenderer key={i} block={block} guideId={guideId} />
  ))
) : (
```

**Replace with:**
```javascript
{spellResult.blocks ? (
  <SpellBlockRenderer
    spell={spellResult}
    archetypeStyle={{
      borderColor: `border-${guide.colors.border}`,
      accentColor: `text-${guide.colors.accent}`,
      bgAccent: 'bg-[#F3EFE8]',
      textMuted: 'text-stone-600'
    }}
  />
) : (
```

**Why:** `SpellBlockRenderer` (line 68-73 of SpellBlockRenderer.jsx) expects:
- `spell` - the entire spell object with `blocks`, `persona_lock`, `canon_anchor`
- `archetypeStyle` - color configuration object
It does NOT accept `block` or `guideId` props.

---

## BUG FIX 2: Sync Spell Endpoint Missing Theresa & Brenda Routing

**Problem:** The synchronous `/api/ai/generate-spell-v3` endpoint's keyword routing (line 4917-4921) only has Shigg, Cathleen, Katherine. If "choose_for_me" hits this endpoint, Theresa and Brenda can never be auto-selected.

**File:** `backend/server.py`

**Find this code (around line 4917-4921):**
```python
            keyword_routes = {
                'shigg': ['tea', 'kettle', 'bird', 'morning', 'domestic', 'kitchen', 'gentle', 'cozy', 'grief', 'loss'],
                'cathleen': ['protect', 'voice', 'song', 'courage', 'brave', 'shield', 'guard', 'strength', 'power'],
                'katherine': ['hidden', 'shadow', 'truth', 'reveal', 'pattern', 'thread', 'bind', 'sigil', 'precision', 'secret']
            }
```

**Replace with:**
```python
            keyword_routes = {
                'shigg': ['tea', 'kettle', 'bird', 'morning', 'domestic', 'kitchen', 'gentle', 'cozy', 'grief', 'loss'],
                'cathleen': ['protect', 'voice', 'song', 'courage', 'brave', 'shield', 'guard', 'strength', 'power'],
                'katherine': ['hidden', 'shadow', 'truth', 'reveal', 'pattern', 'thread', 'bind', 'sigil', 'precision', 'secret'],
                'theresa': ['family', 'secret', 'pattern', 'break', 'investigate', 'genealog', 'ancestor'],
                'brenda': ['memory', 'remember', 'letter', 'ancestor', 'chronicle', 'family', 'heirloom']
            }
```

**Also add feeling-based routes for Theresa & Brenda.** Find the `feeling_routes` dict immediately after (around line 4932-4941):

```python
                feeling_routes = {
                    'calm': 'shigg',
                    'softened': 'shigg',
                    'protected': 'cathleen',
                    'brave': 'cathleen',
                    'energized': 'cathleen',
                    'clear': 'katherine',
                    'hidden': 'katherine',
                    'revealed': 'katherine'
                }
```

**Replace with:**
```python
                feeling_routes = {
                    'calm': 'shigg',
                    'softened': 'shigg',
                    'protected': 'cathleen',
                    'brave': 'cathleen',
                    'energized': 'cathleen',
                    'clear': 'katherine',
                    'hidden': 'katherine',
                    'revealed': 'katherine',
                    'connected': 'brenda',
                    'remembered': 'brenda',
                    'understood': 'theresa',
                    'liberated': 'theresa'
                }
```

---

## BUG FIX 3: Dual ID System (IMPORTANT - Understand But Don't Refactor Yet)

**Problem:** Two ID systems exist simultaneously:

| Guide | Legacy ID (archetypes.js, old server routes) | New ID (GuidePortal, persona_config, pipeline) |
|-------|------|------|
| Shigg | `shiggy` | `shigg` |
| Cathleen | `kathleen` | `cathleen` |
| Katherine | `catherine` | `katherine` |
| Theresa | `theresa` | `theresa` |
| Brenda | `brenda` | `brenda` |

**Current mitigation:** Backend has `id_map` translation at 4 places in server.py (lines 4391, 4736, 4906, 5136). This works but is fragile.

**DO NOT refactor this now.** Just be aware that:
- `frontend/src/data/archetypes.js` uses legacy IDs (`shiggy`, `kathleen`, `catherine`)
- `frontend/src/pages/GuidePortal.js` GUIDE_CONFIGS uses new IDs (`shigg`, `cathleen`, `katherine`)
- Any new code must handle BOTH formats or use the id_map pattern
- The `getArchetypeById()` function in archetypes.js will NOT find guides if you pass new IDs

---

## After Bug Fixes: Rebuild & Restart

```bash
# Rebuild frontend
cd /home/user/WhereTheCrowLandsFeb7/frontend && npm run build

# Restart backend
sudo supervisorctl restart backend

# Verify
sudo supervisorctl status
```

---

# PART 2: SPELL FORMAT VISUAL DESIGN SPECIFICATIONS
## Where The Crowlands - One-Pager Grimoire Pages
**Prepared for: Claude Code (Emergent) + Design Team**
**Date: February 15, 2026 (REVISED)**
**Purpose: Complete visual design specifications for spell one-pager format across all five guide personas**

**CRITICAL: This document uses the ESTABLISHED Where The Crowlands design system. No new design systems introduced.**

---

## CORE DESIGN PRINCIPLES (ALL GUIDES)

### 1. ONE-PAGER PHILOSOPHY

**What This Means:**
- User receives single scrollable page (digital) or single printed page (physical)
- No clicking through sections, no expanding accordions, no tabs
- Complete spell readable top-to-bottom in one flow
- Like reading a page torn from an ancient grimoire

**Digital Specifications:**
- Single HTML page, vertically scrolling
- Max width: 800px (readable line length)
- Centered on screen with margins
- No navigation elements within spell content
- Print button/save button outside main content area

**Print Specifications:**
- Designed for standard 8.5" x 11" (US Letter) or A4 paper
- Margins: 0.75" all sides minimum
- Safe print area ensures nothing critical cuts off
- Black ink-friendly (no large color blocks that waste ink)
- Grayscale-friendly for non-color printers

---

## TYPOGRAPHY SYSTEM (ESTABLISHED - USE WHAT'S IN THE CODE)

**IMPORTANT: The fonts below are what's ACTUALLY loaded in the site. Use these, not others.**

### Fonts Currently Loaded (from index.css and tailwind.config.js):
- **Cinzel Decorative** (`font-cinzel`) - Headings, section titles, button labels
- **Crimson Text** (`font-crimson-text`) - Body text, form inputs, reading content
- **Montserrat** (`font-montserrat`) - UI labels, form fields, small text
- **Playfair Display** (`font-playfair`) - Secondary display text
- **Italiana** (`font-italiana`) - Accent display text

### Typography Scale (Spell Pages):

**Spell Title:**
- Font: Cinzel Decorative (`font-cinzel`)
- Size: 28-32px / 22-26pt print
- Weight: 700 (bold)
- Color: Navy Dark (#0a1628) on light backgrounds, Bone (#f5f0e6) on dark
- Letter-spacing: 1px

**Section Headers (e.g., "The Working", "Your Bird", "Materials"):**
- Font: Cinzel Decorative (`font-cinzel`)
- Size: 20-22px / 15-17pt print
- Weight: 600 (semibold)
- Color: Antique Gold (#C8A44D)
- Letter-spacing: 0.5px

**Body Text:**
- Font: Crimson Text (`font-crimson-text`)
- Size: 17px / 11-12pt print
- Weight: 400 (regular)
- Line height: 1.85
- Color: Stone-800 on light backgrounds, Bone Dim (#e8dcc8) on dark
- Max line length: 65-75 characters

**Emphasis:**
- Italic: Crimson Text Italic (for poetic lines, quoted text, guide voice asides)
- Bold/Strong: Shift to stronger color rather than bold weight where possible
- Small caps: Letter-spacing 2px, uppercase, 13-14px for ritual phrases

**Attribution/Footnotes:**
- Font: Crimson Text (`font-crimson-text`)
- Size: 14-15px / 9-10pt print
- Color: Ink Fade / stone-500
- Style: Slightly condensed line-height (1.6)

**Links:**
- Font: Crimson Text
- Color: Antique Gold (#C8A44D)
- Underline or border-bottom (1px)
- Hover: Brighter gold

**Labels/Metadata:**
- Font: Montserrat (`font-montserrat`)
- Size: 12-13px
- Weight: 500
- Used for: block type labels, timing info, belief mode badges

---

## COLOR PALETTE (ESTABLISHED - FROM TAILWIND CONFIG)

### Core Palette (DO NOT DEVIATE):
```css
--midnight-teal: #0E2A2F;     /* Primary dark background */
--celestial-blue: #123A3F;     /* Card backgrounds */
--vellum: #F3EFE8;             /* Reading surfaces - ALWAYS SOLID, NEVER TRANSPARENT */
--antique-gold: #C8A44D;       /* Accents, borders, section headers */
--muted-brass: #9E8438;        /* Subdued gold accents */
--ember-pink: #B94E6A;         /* Primary CTAs, focus rings */
--rose-clay: #C26A5A;          /* Alternate accent */
--oxblood: #8b2232;            /* Deep crimson accent */

/* Legacy aliases also available: */
--navy-dark: #0a1628;
--cream: #F3EFE8;
--gold: #C8A44D;
--crimson: #8b2232;
```

### Guide-Specific Colors (from GuidePortal GUIDE_CONFIGS):

| Guide | Accent | Border | Background Tint | Text |
|-------|--------|--------|-----------------|------|
| **Shigg** | amber-500 | amber-600 | amber-900/15 | amber-400 |
| **Cathleen** | teal-500 | teal-600 | teal-900/15 | teal-400 |
| **Katherine** | violet-500 | violet-600 | violet-900/15 | violet-400 |
| **Theresa** | rose-500 | rose-600 | rose-900/15 | rose-400 |
| **Brenda** | indigo-500 | indigo-600 | indigo-900/15 | indigo-400 |

### Spell Block Rendering Colors (from SpellBlockRenderer):

**CRITICAL RULE: All reading surface backgrounds are locked to `#F3EFE8` (vellum) - NEVER colored backgrounds under text.**

```javascript
archetypeStyle = {
  borderColor: "border-{guide-color}-600",   // Guide's border color
  accentColor: "text-{guide-color}-700",      // For icons and accent elements
  bgAccent: "bg-[#F3EFE8]",                  // ALWAYS VELLUM - contrast locked
  textMuted: "text-stone-600"                 // Muted secondary text
}
```

### Dark vs Light Background Spells:

**Light Background (default for spell pages):**
- Background: Vellum (#F3EFE8)
- Body text: stone-800 or navy-dark (#0a1628)
- Headers: Guide accent color or Antique Gold (#C8A44D)
- Dividers: Guide accent color at 30-40% opacity

**Dark Background (grimoire view, portal pages):**
- Background: Midnight Teal (#0E2A2F) or Navy Dark (#0a1628)
- Body text: Bone Dim (#e8dcc8)
- Headers: Antique Gold (#C8A44D)
- Accent elements: Guide-specific color

---

## LAYOUT STRUCTURES BY GUIDE

### SHIGG - KITCHEN TABLE FORMAT

```
+-----------------------------------------------+
|                                                 |
|          [BIRD IMAGE - LARGE]                   |
|            Centered, 300px                      |
|                                                 |
|-------------------------------------------------|
|                                                 |
|      The Robin Oracle                           |
|      (Spell Title - centered)                   |
|                                                 |
|  "Right then. Here's what we're going           |
|   to do..."                                     |
|  (Shigg's opening - conversational)             |
|                                                 |
|  [BODY TEXT - Left-aligned prose]               |
|  - The Working (instructions)                   |
|  - What to notice                               |
|  - How to document                              |
|  - Timeline                                     |
|                                                 |
|  [POETRY EXCERPT - Indented/Italics]            |
|  "The Moving Finger writes..."                  |
|                                                 |
|  [MATERIALS - Inline list in prose]             |
|  "You'll need: tea, window, notebook"           |
|                                                 |
|  [ATTRIBUTION - Prose paragraph]                |
|  "This draws from British bird folklore..."     |
|                                                 |
|  [INLINE LINKS throughout text]                 |
|  "...ancient augury (timeline)..."              |
|                                                 |
+-----------------------------------------------+
```

**Visual Elements:**
- Bird image: Illustration style (watercolor or vintage field guide, NOT photo)
- Warm earth tones (browns, greens, soft blues)
- Background: Vellum (#F3EFE8)
- Text: Dark brown/navy
- Accent: Amber-600 borders, Amber-700 icons
- Decorative elements: Subtle corner flourishes (botanical), NO heavy ornamentation

**Special Features:**
- Poetry excerpts indented and italicized (Crimson Text Italic)
- Direct quotes from Shigg in her conversational voice
- Bird name appears multiple times (reinforcement)

**Block types used:** cold_open, bird_oracle, materials, stepper, poetry_reading, observation_task, journal_prompt, closing, further_reading

---

### CATHLEEN - VIGIL DOCUMENT FORMAT

```
+-----------------------------------------------+
|                                                 |
|      Protection Vigil                           |
|      Three-Night Working                        |
|      (Title - centered or left)                 |
|                                                 |
|  "Right. You're frightened. That's              |
|   honest. Now we deal with it."                 |
|  (Cathleen's direct opening)                    |
|                                                 |
|  [BODY TEXT - Clean prose blocks]               |
|                                                 |
|  The Working:                                   |
|  Tonight, and for the next two nights...        |
|                                                 |
|  [Instructions in clear paragraphs]             |
|                                                 |
|  Materials: Candle, paper, pen, matches         |
|  (Inline, not separate section)                 |
|                                                 |
|  Timeframe: 3 nights                            |
|  Safety: Never leave candle unattended          |
|                                                 |
|  [ATTRIBUTION - Brief, grounded]                |
|  "This draws from British spiritualist          |
|  circle protection..."                          |
|                                                 |
+-----------------------------------------------+
```

**Visual Elements:**
- Minimal imagery: Maybe single candle or shield icon at top, or none
- Background: Vellum (#F3EFE8)
- Text: Dark charcoal (stone-800)
- Accent: Teal-600 borders, Teal-700 icons
- Decorative elements: Minimal. Simple horizontal rules. Three dots as divider possible.
- This is FUNCTIONAL magic - utilitarian, not decorative

**Special Features:**
- Safety warnings in bold bordered box (fire safety critical)
- Completion phrases emphasized ("The work is done")
- Feels like a wartime document - essential info only

**Block types used:** cold_open, ward, song_prompt, materials, stepper, safety_note, closing

---

### KATHERINE - DIAGNOSTIC PRESCRIPTION FORMAT

```
+-----------------------------------------------+
|                                                 |
|  [SMALL SCISSORS/THREAD ICON - top right]       |
|                                                 |
|      Diagnostic: Betrayal                       |
|      Thread Cutting Ritual                      |
|      (Title - formal but not stuffy)            |
|                                                 |
|  "You've been betrayed. I can see it.           |
|   Now we deal with it properly."                |
|  (Katherine's immediate assessment)             |
|                                                 |
|  [BODY TEXT - Precise prose]                    |
|                                                 |
|  The Working:                                   |
|  (Instructions with sewing metaphors)           |
|                                                 |
|  WARNING: This is binding work                  |
|  (If baneful - clearly marked box/rule)         |
|                                                 |
|  [Documentation section emphasized]             |
|  "Write down: [specifics]"                      |
|                                                 |
|  Materials: Thread, scissors, paper             |
|  Timeframe: 3 days decision period              |
|                                                 |
|  [ATTRIBUTION - Victorian precision]            |
|  "Inspired by Spitalfields cunning              |
|  craft, Victorian occult societies..."          |
|                                                 |
+-----------------------------------------------+
```

**Visual Elements:**
- Small iconic imagery: Scissors, needle, thread (line art, precise)
- Background: Vellum (#F3EFE8)
- Text: Deep ink-blue or sepia (stone-800)
- Accent: Violet-600 borders, Violet-700 icons
- Decorative elements: Corner elements with botanical motifs (ivy, blackthorn)

**Special Features:**
- Baneful warnings in bordered box (visually set apart)
- Katherine's diagnostic assessment at top (her voice)
- Documentation requirements clearly listed
- "Measure twice, cut once" aesthetic

**Block types used:** cold_open, evidence_card, safety_note, materials, stepper, reflection, closing

---

### THERESA - THEN/NOW BRIDGE FORMAT

```
+-----------------------------------------------+
|                                                 |
|      The Shuffle Oracle                         |
|      Music as Modern Bibliomancy                |
|      (Title - clean, contemporary)              |
|                                                 |
|  +-------------+---------------------+          |
|  |    THEN     |        NOW          |          |
|  +-------------+---------------------+          |
|  | In ancient  | Your music library  |          |
|  | Rome, prac- | is your sacred text.|          |
|  | titioners...| The shuffle func... |          |
|  +-------------+---------------------+          |
|  (Two-column layout for Then/Now)               |
|                                                 |
|  OR (on mobile):                                |
|                                                 |
|  Then:                                          |
|  [Historical context paragraph]                 |
|                                                 |
|  Now:                                           |
|  [Modern adaptation paragraph]                  |
|                                                 |
|  Instructions:                                  |
|  [Clear numbered or prose steps]                |
|                                                 |
|  You may find further inspiration in:           |
|  - [Timeline: John Cage, 1951]                  |
|  - [Timeline: Surrealist Automatism]            |
|  - [External: I Ching History]                  |
|                                                 |
+-----------------------------------------------+
```

**Visual Elements:**
- Minimal, modern imagery: Abstract symbols, timeline arrow
- Background: Vellum (#F3EFE8)
- Text: Dark grey (stone-800)
- Accent: Rose-600 borders, Rose-700 icons
- Then/Now sections have subtle background color difference
- Links clearly distinguished

**Special Features:**
- Then/Now split visually clear (border, color, or column)
- Multiple timeline links embedded throughout
- "You may find further inspiration" section with bullet list
- Modern, accessible, scholarly but not stuffy

**Block types used:** cold_open, evidence_card, lore_vignette, bird_oracle, journal_prompt, stepper, closing, further_reading

---

### BRENDA - EPISTOLARY LETTER FORMAT

```
+-----------------------------------------------+
|                                                 |
|      Dear Friend,                               |
|                                                 |
|  I have received your letter about the          |
|  uncertainty you're carrying...                 |
|                                                 |
|  [BODY TEXT - Letter format prose]              |
|  (Epistolary throughout)                        |
|                                                 |
|  Today: Grounding in Malkuth                    |
|  (The Kingdom)                                  |
|                                                 |
|  Malkuth represents the physical world...       |
|                                                 |
|  Your meditation for today:                     |
|  [Meditation instructions in prose]             |
|                                                 |
|  Do this for 10 minutes. Morning or             |
|  evening - your choice. Same time each day.     |
|                                                 |
|  Tomorrow, I'll write again.                    |
|                                                 |
|      Yours in the work,                         |
|      Brenda                                     |
|                                                 |
+-----------------------------------------------+
```

**Visual Elements:**
- Letter aesthetics: Wider margins (as if handwritten letter)
- Background: Vellum (#F3EFE8)
- Text: Dark brown/sepia (stone-800)
- Accent: Indigo-600 borders, Indigo-700 icons
- Decorative elements: Minimal. Possible wax seal icon near signature.

**Special Features:**
- ENTIRE format is epistolary (letter conventions throughout)
- "Dear Friend," opening ALWAYS
- "Yours in the work, Brenda" closing ALWAYS
- Meditation instructions embedded in letter prose
- Sequence number if multi-letter (Letter 1 of 7, etc.)

**Block types used:** cold_open, journal_prompt, lore_vignette, stepper, closing

---

## UNIVERSAL DESIGN ELEMENTS (ALL GUIDES)

### 1. Source Attribution Section

**Placement:** Bottom of spell, after main content
**Format:** Prose paragraph, not bullet list
**Styling:** Crimson Text, 14-15px, stone-500 color

**How it currently works:** The sources are already returned by the backend as an array. They display in GuidePortal.js lines 455-481 and GrimoirePage.js. The format per source:

```
AUTHOR - WORK (YEAR)
Relevance: Why this matters
[Learn more link]
```

### 2. Materials Section

NOT a separate bordered box - integrated into prose flow.
Currently rendered as grid of vellum boxes in SpellBlockRenderer (MaterialsBlock). This is fine for the blocks format.

### 3. Safety Warnings

Currently rendered as amber box with alert triangle (safety_note block type). This is working correctly in SpellBlockRenderer.

For baneful/binding work (Katherine especially), the warning should have a stronger border:
```css
border-2 border-amber-500 bg-[#F3EFE8] p-4 rounded
```

### 4. Timeline/Link Integration

Inline links are preferred. The backend already generates `learn_more_url` fields on sources.

---

## APPROVED MOTIF FAMILIES (FROM EXISTING ORNAMENTAL SYSTEM)

### Already Built in OrnateElements.js:

**Corner Ornaments:**
- `HaloCorner` / `HaloCornerElaborate` - Art Nouveau arc corners
- `ElaborateCorner` - Gold/rose-clay variants
- `CornerFlourish` - Simplified version

**Dividers:**
- `GrandDivider` - Variants: moon, eye, crow/ouroboros, pentagram, sparkle
- `MysticalDivider` - Smaller version
- `SectionDivider` - Star, moon, bird, or simple

**Glyphs:**
- `BestiaryGlyph` - Crow/raven via SVG, others via fallback
- `OccultGlyph` - Sun, moon, eye, star via SVG

**Frames:**
- `SpellBorderFrame` - Grimoire-specific with elaborate corners
- `TarotCardFrame` - Double-border with inset decoration
- `LightOrnateCard` / `OrnateCard` - Card components

### Hard Negatives (NEVER INCLUDE):
- NO text/letters/words/watermarks in decorative elements
- NO photorealism, neon colors, modern logos
- NO messy collage, 3D render look, clipart, cartoon style

---

## RESPONSIVE DESIGN

**Desktop (800px+ width):** Full layout as designed
**Tablet (600-800px):** Slightly narrower margins, two-column becomes single column if needed
**Mobile (320-600px):** Single column only, images scale down, 44px minimum link targets
**Print:** Forces single column, images grayscale option, margins 0.75"

---

## PRINT STYLES (MUST BE ADDED - CURRENTLY MISSING)

**Add to `frontend/src/index.css`:**

```css
@media print {
  /* Force readable colors for print */
  body {
    background: white !important;
    color: black !important;
  }

  /* Hide all UI chrome */
  nav, header, footer,
  .navigation, .buttons, .ui-elements,
  button, [role="navigation"] {
    display: none !important;
  }

  /* Spell content formatting */
  .spell-content, [data-testid="spell-block-renderer"] {
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Ensure images print */
  img {
    max-width: 100% !important;
    page-break-inside: avoid;
  }

  /* Prevent awkward page breaks */
  h2, h3 { page-break-after: avoid; }
  .spell-block { page-break-inside: avoid; }

  /* Show link URLs */
  a[href]:after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }

  /* Page margins */
  @page { margin: 0.75in; }
}
```

---

## ACCESSIBILITY REQUIREMENTS

**Contrast:** All combinations must meet WCAG AA (4.5:1 minimum for body text, 3:1 for large headings)

**Current concern:** Some blocks use `text-stone-600` on vellum (`#F3EFE8`) background. Verify this passes 4.5:1. If not, darken to `text-stone-700`.

**Screen Reader:**
- Semantic HTML (proper heading hierarchy h1 > h2 > h3)
- Links descriptive ("Timeline: Roman Augury" not "click here")
- Image alt text includes context
- Warning boxes marked with `role="alert"`

**Keyboard:** All links accessible via Tab, visible focus indicators, no keyboard traps.

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Bug Fixes (Do First)
- [ ] Fix GuidePortal SpellBlockRenderer props (Bug Fix 1)
- [ ] Add Theresa & Brenda to sync endpoint routing (Bug Fix 2)
- [ ] Rebuild frontend: `cd frontend && npm run build`
- [ ] Restart backend: `sudo supervisorctl restart backend`
- [ ] Test spell generation for each of the 5 guides
- [ ] Verify blocks render correctly in Guide Portal result view

### Phase 2: Print & Accessibility
- [ ] Add print stylesheet to index.css
- [ ] Test print from Chrome, Firefox, Safari
- [ ] Audit contrast ratios (stone-600 on vellum)
- [ ] Add `role="alert"` to safety_note blocks

### Phase 3: Guide-Specific Visual Polish
- [ ] Verify Shigg spells have bird oracle block and warm aesthetic
- [ ] Verify Cathleen spells are minimal/utilitarian
- [ ] Verify Katherine spells have diagnostic tone and safety warnings
- [ ] Verify Theresa spells have Then/Now structure
- [ ] Verify Brenda spells maintain epistolary format throughout
- [ ] Test with actual spell content (not dummy data)

### Phase 4: Future Enhancements (Not Now)
- [ ] PDF export option
- [ ] Font size accessibility toggle
- [ ] QR codes on printed spells
- [ ] Grimoire collection view with page-turn animation

---

## VERIFICATION COMMANDS

After all changes:

```bash
# Verify bug fix 1 (should NOT find "block={block}" in SpellBlockRenderer call)
grep -n "block={block}" frontend/src/pages/GuidePortal.js
# Should return nothing

# Verify bug fix 1 (should find "spell={spellResult}")
grep -n "spell={spellResult}" frontend/src/pages/GuidePortal.js
# Should return a match

# Verify bug fix 2 (should find theresa and brenda in keyword_routes near line 4917)
grep -A 5 "keyword_routes = {" backend/server.py | head -20
# Should show all 5 guides in both locations

# Verify print styles exist
grep -c "@media print" frontend/src/index.css
# Should return 1 or more

# Rebuild and restart
cd frontend && npm run build && cd .. && sudo supervisorctl restart backend

# Check status
sudo supervisorctl status
```

---

## KEY FILE REFERENCE

| What | File |
|------|------|
| Guide Portal (spell generation UI) | `frontend/src/pages/GuidePortal.js` |
| Spell Block Renderer | `frontend/src/components/SpellBlockRenderer.jsx` |
| Grimoire Page | `frontend/src/pages/GrimoirePage.js` |
| Guide archetype data | `frontend/src/data/archetypes.js` |
| Ornamental components | `frontend/src/components/OrnateElements.js` |
| Global CSS | `frontend/src/index.css` |
| Tailwind config (colors/fonts) | `frontend/tailwind.config.js` |
| Backend main server | `backend/server.py` |
| Guide persona configs | `backend/persona_config.py` |
| Writer voice contracts | `backend/prompts/writer_blocks.py` |
| QA validation | `backend/prompts/qa_blocks.py` |
| Spell tier routing | `backend/spell_tiers.py` |

---

**END OF DOCUMENT**
