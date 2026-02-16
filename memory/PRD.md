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

## Backlog
### P1: Stripe Integration (awaiting keys)
### P2: Library book cover woodcut designs
### P3: Security hardening, spell counter merge
