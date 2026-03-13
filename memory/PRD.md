# Where The Crowlands - Product Requirements Document

## Original Problem Statement
Spell-generation platform with 5 AI archetypes. Dual-AI: DeepSeek (research) + Claude (writing).

## Architecture
Frontend: React + Tailwind | Backend: FastAPI | DB: MongoDB | AI: DeepSeek + Claude + GPT-4o

---

## Complete Session Report: February 16, 2026 (~10 hours)

### PHASE 1: Core Bug Fixes (Hours 1-3)
1. **Research Display Fix** — GrimoirePage updated from V1 format (answer/bullets) to V2 (summary/key_takeaways/sources as objects)
2. **Transform Function** — `transform_blocks_to_array` passes through structured dict content directly
3. **Phase 7: Tarot Card Preview** — `_build_tarot_card()` generates preview data from spell blocks; TarotCardView activates automatically

### PHASE 2: Three User-Reported Bugs (Hours 3-5)
4. **Loading Screen Guide Reveal** — Backend stores persona_id/name/title early in spell_jobs; polling returns during processing
5. **Narrative Spell Display** — SpellBlockRenderer.jsx completely rewritten (900-417 lines): no headers, no icons, no inputs, flowing prose
6. **Research Button Timeout** — Added 120s timeout to axios call; fixed ID normalization

### PHASE 3: Live DeepSeek Archivist (Hour 5)
7. **Archivist No Longer Mocked** — `_run_archivist` calls `research_query_v2()` for real DeepSeek research (~40s). Spells now contain genuine historical facts and sources.

### PHASE 4: EMERGENT_NEXT_STEPS.md Implementation (Hours 5-7)
8. **Stage Progress Indicator** — Backend writes `current_stage`/`stage_message` between pipeline stages; frontend shows 4 connected dots (Research-Plan-Write-Polish)
9. **Reset Loading State** — Clears selectedGuide/currentStage on new generation
10. **Unique Guide Interactions** — Enhanced writer prompts: Shigg bird oracle, Cathleen song prompt, Katherine evidence card, Theresa observation task, Brenda letter framing
11. **Grimoire PDF Export** — `GET /api/grimoire/export/pdf` with reportlab; Export button in MyGrimoire
12. **Admin Dashboard** — `GET /api/admin/stats` + `/admin` page with users, spells, guide popularity, performance

### PHASE 5: Custom Woodcut Icon System (Hours 7-10)
13. **Processed 28 user-uploaded icons** — transparent backgrounds, dual color variants (charcoal + gold), 48px
14. **Generated 17 additional icons** — 6 missing anchors (poetry, bell, compass, notebook, photograph, family photo), 8 alchemize categories, 5 UI icons (sparkles, crystal ball, grimoire, library books)
15. **Cropped 5 guide portraits** — circular crops from existing sketch images
16. **Complete emoji sweep** — replaced ALL user-facing emojis across SpellRequest.js, GrimoirePage.js, About.js, CorrieTarot.js, Library.js, MyGrimoire.js, AIImage.js, EarlyAccess.js, archetypes.js
17. **Icon Style Guide** — `/frontend/public/icons/ICON_STYLE_GUIDE.md` with generation prompts
18. **PageHeader iconSrc prop** — OrnateElements.js updated to support custom image icons

### Testing
- iteration_9.json: Pipeline + tarot card (100%)
- iteration_10.json: Bug fixes #1-3 (100%)
- iteration_11.json: Live archivist (100%)
- iteration_12.json: Stage progress + admin + PDF (100%)

---

## Timing Metrics
- Archivist (DeepSeek): ~40s
- Planner (GPT-4o-mini): ~10s
- Writer (Claude Sonnet): ~22s
- Total spell generation: ~70-75s

---

## Session Report: February 17, 2026 (PR Brief Implementation)
- PR BRIEF 1: Spell Presentation Layer
- PR BRIEF 2: Unique Tarot Images Per Spell
- PR BRIEF 3: Fix Tarot Front + Long Form Ritual

---

## Session Report: March 1, 2026 - LLM Migration Complete

### MIGRATION: OpenAI -> Anthropic + DeepSeek

**Model Mapping (Completed):**
| Previous (OpenAI) | Current (Anthropic) | Purpose |
|-------------------|---------------------|---------|
| gpt-4o (writer) | claude-sonnet-4-20250514 | Spell writing, persona voice |
| gpt-4o (planner) | claude-haiku-4-5-20251001 | Spell planning, structure |
| gpt-4o-mini (planner) | claude-haiku-4-5-20251001 | Fast planning |
| dall-e-3 (images) | Static library | No Anthropic image API |
| deepseek-chat | deepseek-chat | Research (unchanged) |

**Testing Results (iteration_14.json):**
- Anthropic configured: true
- DeepSeek configured: true
- Image provider: library
- OpenAI API calls: 0 (ZERO)
- 11 DeepSeek API calls for research
- 9 Anthropic API calls for writing
- 5 successful spell generations (8-11 blocks each)

**Known Limitation:**
- Synchronous `/api/ai/generate-spell-v3` times out (60s proxy limit)
- Use async endpoint `/api/ai/generate-spell-job` for frontend

---

## Session Report: March 11, 2026 - nOcult Timeline Update

### TIMELINE ENTRIES ADDED (5 new events)
1. **Helen Duncan Prosecution (1944)** — Last person prosecuted under Britain's Witchcraft Act 1735. Sources: National Geographic, JSTOR Daily, Historic UK, Wikipedia, Sky History, Vice, ICLR, Undiscovered Scotland (8 sources).
2. **Zora Neale Hurston - Mules and Men (1935)** — First major insider documentation of African-American hoodoo. Sources: Wikipedia, AAIHS, SpringerLink, Lit Pub Crawl (5 sources).
3. **Doreen Valiente Rewrites Wiccan Liturgy (1953)** — Transformed Gardner's fragments into coherent Wiccan liturgy. Sources: Doreen Valiente Foundation, Wikipedia, Cunning Folk Magazine, AnOther Magazine, Springer (5 sources).
4. **Greenham Common Women's Peace Camp (1981)** — 19-year all-female peace camp with ritual-infused resistance. Sources: Wikipedia, Official Greenham WPC Site, Academic Paper, Chatham House, Swarthmore, Sussex University (6 sources).
5. **Marsha P. Johnson & Sylvia Rivera Found STAR (1970)** — Street Transvestite Action Revolutionaries mutual aid network. Sources: Wikipedia, David Carter book (2 sources).

### TIMELINE ENTRIES ADDED (3 additional from manifesto cross-reference)
6. **Society for Psychical Research Founded (1882)** — First academic body for systematic paranormal investigation. Sources: Wikipedia, SPR Official Site.
7. **Mass Observation Begins Documenting British Folk Practices (1937)** — Anthropological documentation of living folk magic. Sources: Mass Observation Archive, Wikipedia.
8. **Museum of Witchcraft Founded (1951)** — Cecil Williamson's institutional preservation of folk magical artifacts. Sources: Wikipedia, Official Museum Site.

### EXISTING ENTRIES ENRICHED (6+ updated)
- **W.I.T.C.H. (witch_1968)** — Added Vice article, Robin Morgan official site, Dig podcast, Western University academic paper
- **#MagicResistance (magic_resistance)** — Added Hughes' original Medium spell, academic paper, Religion News Service, Wild Hunt, The Mary Sue, BuzzFeed News, Goodreads book link
- **Reclaiming (reclaiming)** — Added Starhawk Wikipedia, Sun Magazine interview, Starhawk.org, WRDS academic profile + expanded learn_more_links
- **Helen Duncan** — Expanded from 3 to 8 sources with Wikipedia, Sky History, Vice, ICLR legal analysis, Undiscovered Scotland
- **Hurston** — Expanded with Wikipedia bio, Lit Pub Crawl + enriched expanded_context (Tell My Horse, fasting detail)
- **Valiente** — Expanded with AnOther Magazine, Springer academic chapter
- **Greenham Common** — Expanded from 3 to 6 sources with Chatham House, Swarthmore, Sussex University
- **Witchcraft Act Repeal** — Added expanded_context + learn_more_links
- **Georgiana Houghton Spirit Drawings** — Enriched significance (justice/equity angle), added expanded_context + learn_more_links
- **Charles Leland's Aradia** — Enriched description (witch as liberator), added expanded_context + learn_more_links

### MUSICIANS & ARTISTS IN OCCULT TRADITIONS (8 new events, 2 enriched)
**New entries:**
9. **Scriabin's Mysterium (1903)** — Russian composer-mystic, Theosophy, unfinished cosmic ritual
10. **Robert Johnson at the Crossroads (1936)** — Delta blues, hoodoo crossroads mythology
11. **Count Ossie & Nyabinghi (1960)** — Rastafarian sacred drumming, reggae foundation
12. **Lustmord & Dark Ambient (1980)** — Genre creation, Crowley/chaos magic influence
13. **Death In June / Neofolk (1981)** — Pagan revival music (controversy noted)
14. **Coil (1982)** — Thelema, sex magic, music as magical operation
15. **Current 93 / Apocalyptic Folk (1984)** — Gnostic Christianity, David Tibet
16. **Norwegian Black Metal (1991)** — Mayhem, church burnings, Satanism/Norse paganism

**Enriched existing:**
- **Salon de la Rose+Croix** — Added Satie's 2-year involvement, FSU thesis source, expanded_context + learn_more_links
- **TOPY** — Added Throbbing Gristle/Coil context, England's Hidden Reverse source, Genesis P-Orridge trajectory

**Skipped (per user's own document notes):**
- K-Pop (Narsha, SHINee) — "interpretation of symbolism rather than self-identification"
- Z'ev, Zoviet France, Ras Michael, Sol Invictus — secondary to stronger entries already added
- Individual BM figures (Ihsahn, Gaahl, Dead) — folded into Norwegian Black Metal scene entry

---

## Session Report: March 13, 2026 - Deity Modal Bug Fix

### BUG FIX: Deity Modal Click Handler (P2 → DONE)
- **Root cause 1:** Deities collection never seeded on startup — added startup seeding for deities (4), historical figures (4), sacred sites (3), rituals (5)
- **Root cause 2:** Frontend `Deities.js` referenced `associations` field but data uses `associated_practices`
- **Files changed:** `server.py` (startup seed), `Deities.js` (field fix + test ids), `OrnateElements.js` (props passthrough)
- **Tested:** Screenshot verified — 4 deity cards render, modal opens with full details

### FEATURE: Emotional Need Clusters (P0 → DONE)
- **Added `EMOTIONAL_NEED_CLUSTERS`** dict with 5 crisis clusters: heartbreak_loneliness, money_anxiety, protection_fear, burnout_exhaustion, grief_loss
- **Added helper functions:** `get_emotional_need_cluster()` (word-boundary trigger matching), `get_reality_check_for_guide()` (guide-specific reality check injection)
- **Updated CONTENT_DIRECTIONS:** Added EMOTIONAL HONESTY to 5 opening blocks, PRACTICAL MAGIC to 5 working blocks, AFTER THE SPELL to 5 closing blocks (all 5 guides)
- **Modified `build_block_writer_prompt()`** in `pipeline_blocks.py` to detect emotional clusters and inject reality check section into writer prompt
- **Fixed substring matching bug:** "ex" no longer falsely matches "exhausted" — uses regex word boundaries
- **Verified:** All 6 test cases pass (5 clusters + 1 no-match), backend starts cleanly

### VISUAL OVERHAUL: Site-Wide Color Correction (P0 → DONE)
- **Replaced ALL teal-green backgrounds** (#0a1628, #0E2A2F, #123A3F) → Deep Navy #0C1D2E + Celestial Blue #102534
- **Replaced old crimson** (#b82330) → Oxblood #8B2232
- **Replaced old muted brass** (#9E8438) → Faded Gold #A89872
- **Added WTC CSS variables** to `:root` in index.css (--wtc-bg-primary, --wtc-bg-secondary, --wtc-surface, --wtc-accent, etc.)
- **Updated Tailwind config** — all color tokens now point to corrected palette
- **Updated artNouveau.js, ornaments/index.js** — NOUVEAU_COLORS and COLORS constants corrected
- **Fixed Navigation.js, Footer.js, App.css** — solid backgrounds, no semi-transparent overlays
- **Eliminated ALL old rgba teal values** across entire frontend
- **Created design_guidelines.md** — mandatory rules for all new pages/components
- **Testing:** iteration_15.json — 100% pass (6 pages audited, all backgrounds confirmed Deep Navy, no teal found)

---

## Backlog
### P0: Multi-Provider Image Generation (GPT Image 1 + Gemini Nano Banana)
### P0: Implement Shigg Bibliomancy Expansion (user's implementation guide)
### P1: Switch Stripe to live mode (test mode working)
### P1: Complete timeline/reference export
### P1: Manifesto Integration (user finalizing)
### P2: Manual QA of spell presentation (post-generation)
### P2: Dynamic spell borders based on AI tarot card
### P2: Remaining emoji cleanup on secondary pages
### P3: Library book cover woodcut designs
### P3: PDF Grimoire export enhancements
### P3: Print-on-demand integration (Lulu.com, Blurb.com)
### P4: PWA support (service worker, manifest)
### P4: Community features (spell sharing, ratings)
### P4: Email service integration
### P4: Deprecate legacy V1/V2 spell generation pipeline
