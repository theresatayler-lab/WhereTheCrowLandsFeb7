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
5. **Narrative Spell Display** — SpellBlockRenderer.jsx completely rewritten (900→417 lines): no headers, no icons, no inputs, flowing prose
6. **Research Button Timeout** — Added 120s timeout to axios call; fixed ID normalization

### PHASE 3: Live DeepSeek Archivist (Hour 5)
7. **Archivist No Longer Mocked** — `_run_archivist` calls `research_query_v2()` for real DeepSeek research (~40s). Spells now contain genuine historical facts and sources.

### PHASE 4: EMERGENT_NEXT_STEPS.md Implementation (Hours 5-7)
8. **Stage Progress Indicator** — Backend writes `current_stage`/`stage_message` between pipeline stages; frontend shows 4 connected dots (Research→Plan→Write→Polish)
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

### Files Modified (28 files)
**Backend:**
- `server.py` — stage progress, persona early store, PDF export, admin stats
- `prompts/pipeline_blocks.py` — on_stage_change, live archivist, tarot builder
- `prompts/writer_blocks.py` — guide-specific interaction prompts
- `research_service.py` — (unchanged, already working)

**Frontend:**
- `pages/SpellRequest.js` — ANCHORS/SETTINGS/ALCHEMIZE/PERSONAS with icon paths, stage UI
- `pages/MyGrimoire.js` — PDF export button, icon replacements
- `pages/Library.js` — woodcut library icon
- `pages/About.js` — guide portrait icons
- `pages/CorrieTarot.js` — crystal ball icon
- `pages/AIImage.js` — iconPath additions
- `pages/EarlyAccess.js` — emoji removal
- `pages/Admin.js` — NEW: admin dashboard
- `components/GrimoirePage.js` — research V2, archetype icons, emoji cleanup
- `components/SpellBlockRenderer.jsx` — complete narrative rewrite
- `components/OrnateElements.js` — PageHeader iconSrc prop
- `data/archetypes.js` — iconPath additions
- `utils/api.js` — 120s research timeout
- `App.js` — /admin route

**Assets Created:**
- 73 icon PNG files in `/frontend/public/icons/`
- Icon Style Guide markdown

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

### PR BRIEF 0: Pre-requisite Verification ✅
- Verified build passes
- No corrupted files found
- Icon fallbacks already correct

### PR BRIEF 1: Spell Presentation Layer ✅
1. **Vignette overlay** - Already removed (verified)
2. **CSS utilities** - Already added (spell-page-wrap, spell-block-frame, glow utilities)
3. **CrowlandsIcon** - Already exists
4. **Presentational components updated:**
   - `SpellPageFrame.jsx` - Updated with reading surface wrapper
   - `SpellHeader.jsx` - Simplified per PR brief spec
   - `TarotSummaryCard.jsx` - Fixed text truncation by removing fixed aspect ratio
5. **Integration** - Components already integrated in GuidePortal.js and GrimoirePage.js

### PR BRIEF 2: Unique Tarot Images Per Spell ✅
1. **New `extract_spell_visual_tokens()` function** in spell_prompts.py:
   - Analyzes spell title, essence, key_action, materials
   - Detects spell intent (protection, healing, clarity, etc.)
   - Selects spell-specific symbols from SPELL_SYMBOL_POOLS
   - Uses deterministic seed based on spell ID
   - Returns primary_motif, secondary_motifs, geometry, guide_signature, forbidden list

2. **Updated `build_image_prompt()`:**
   - Now accepts optional spell_data parameter
   - Tarot prompts now use spell-specific motifs instead of static persona emblem
   - Guide signature reduced to subtle corner detail

3. **Updated `generate_all_image_prompts()`:**
   - Passes spell_data to tarot prompt builder

4. **Updated server.py:**
   - Passes spell data when generating tarot card image

### PR BRIEF 3: Fix Tarot Front + Long Form Ritual ✅
1. **Text truncation fixed:**
   - TarotSummaryCard no longer uses fixed aspectRatio constraint
   - Content now flows naturally without cutoff

2. **Long form ritual intricacy:**
   - SpellBlockRenderer.jsx updated
   - Major blocks (materials, stepper, closing, ward, evidence_card, further_reading) wrapped in spell-block-frame
   - Frame adds gold border with rounded corners and proper spacing

**Files Modified:**
- `backend/spell_prompts.py` - New visual token extraction system
- `backend/server.py` - Pass spell data to image generation
- `frontend/src/components/spell/SpellPageFrame.jsx`
- `frontend/src/components/spell/SpellHeader.jsx`
- `frontend/src/components/spell/TarotSummaryCard.jsx`
- `frontend/src/components/SpellBlockRenderer.jsx`

**Testing Status:** Build passes, manual verification complete

---

## Backlog
### P0: User verification of spell presentation (post-generation)
### P1: Dynamic spell borders based on AI tarot card
### P2: Remaining emoji cleanup on secondary pages  
### P2: Switch Stripe to live mode (test mode working)
### P3: Library book cover woodcut designs
### P3: Deity modal click handler bug fix
### P3: PDF Grimoire export enhancements
### P3: Print-on-demand integration (Lulu.com, Blurb.com)
### P4: PWA support (service worker, manifest)
### P4: Community features (spell sharing, ratings)

---

## Session Report: March 1, 2026 - LLM Migration Complete

### MIGRATION: OpenAI → Anthropic + DeepSeek

**Goal:** Remove all OpenAI/GPT-4o dependency for text generation. Use Anthropic Claude models for all text generation. Keep DeepSeek for research. Image generation uses static library.

**Model Mapping (Completed):**
| Previous (OpenAI) | Current (Anthropic) | Purpose |
|-------------------|---------------------|---------|
| gpt-4o (writer) | claude-sonnet-4-20250514 | Spell writing, persona voice |
| gpt-4o (planner) | claude-haiku-4-5-20251001 | Spell planning, structure |
| gpt-4o-mini (planner) | claude-haiku-4-5-20251001 | Fast planning |
| dall-e-3 (images) | Static library | No Anthropic image API |
| deepseek-chat | deepseek-chat | Research (unchanged) |

**Files Modified:**
1. `backend/llm_providers.py` - Complete replacement with Anthropic routing
2. `backend/spell_tiers.py` - Replaced all gpt-4o model strings
3. `backend/prompts/pipeline_blocks.py` - Planner + writer use Anthropic
4. `backend/prompts/pipeline.py` - V2 pipeline migrated to Anthropic
5. `backend/research_service.py` - Persona voice switched to Anthropic
6. `backend/server.py` - emergent_chat_completion uses Anthropic, all model refs updated
7. `backend/.env` - Added ANTHROPIC_API_KEY, set IMAGE_PROVIDER=library

**Endpoint Fix:**
- `/api/ai/spell-config-v3` - Fixed KeyError by correcting BLOCK_TEMPLATES and CANON_ANCHORS dict comprehensions

**Testing Results (iteration_14.json):**
- ✅ Anthropic configured: true
- ✅ DeepSeek configured: true
- ✅ Image provider: library
- ✅ OpenAI API calls: 0 (ZERO)
- ✅ 11 DeepSeek API calls for research
- ✅ 9 Anthropic API calls for writing
- ✅ 5 successful spell generations (8-11 blocks each)

**Timing Metrics (Post-Migration):**
- Archivist (DeepSeek): ~48-50s
- Writer (Claude Sonnet): ~22s
- Total spell generation: ~70-75s

**Known Limitation:**
- Synchronous `/api/ai/generate-spell-v3` times out (60s proxy limit)
- Use async endpoint `/api/ai/generate-spell-job` for frontend

