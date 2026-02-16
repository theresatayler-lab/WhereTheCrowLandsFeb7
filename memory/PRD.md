# Where The Crowlands - Product Requirements Document

## Original Problem Statement
Build "Where The Crowlands," a sophisticated full-stack application for creating DIY rituals guided by AI archetypes. The app features a dual-AI architecture with DeepSeek (research/factual) and Claude (creative writing/persona voice).

## Core Architecture
- **Frontend**: React + Tailwind + Shadcn/UI
- **Backend**: FastAPI + Python
- **Database**: MongoDB + GridFS (for images)
- **AI**: Tiered dual-model system (DeepSeek research, Claude Sonnet writing, GPT-4o planning/fallback)

---

## What's Been Implemented

### Session: February 16, 2026 - Bug Fixes (Fork 2)

#### Bug Fix #1: Loading Screen Guide Info (P0)
- Backend now stores `persona_id`, `persona_name`, `persona_title`, `routing_reason` in spell_jobs early during processing
- Polling endpoint `GET /api/ai/spell-job/{job_id}` returns these fields during `processing` status
- Frontend polling reads `statusData.persona_id` (not just from `statusData.result`)
- Loading overlay now transitions from "Finding Your Guide" → guide name, title, and "why this guide" explanation

#### Bug Fix #2: Narrative Spell Display (P0)
- **SpellBlockRenderer.jsx completely rewritten** for flowing narrative prose
- Removed: All uppercase section headers (REFLECTION, JOURNAL, CLOSING etc.)
- Removed: All icons before section labels
- Removed: All input fields/textareas from reflection and journal blocks
- Removed: Progress indicators and step counters
- Now renders: Cold open as blockquote, stepper as flowing prose paragraphs, materials as simple inline list, reflection/journal as just the guide's quoted text, closing as elegant farewell prose
- Subtle diamond dividers between sections instead of boxed headers

#### Bug Fix #3: Research Button Timeout (P1)
- Research API call (`POST /api/combined`) takes ~50 seconds (DeepSeek + OpenAI)
- Added 120-second timeout to axios call in `api.js`
- Fixed research display to render V2 format (summary, key_takeaways, why_this_works_facts, sources as objects)
- Normalized archetype ID mapping in research fetch (shiggy→shigg, kathleen→cathleen)

### Previous Session: Phase 7 + Fixes

#### Phase 7: Tarot Card Preview
- `_build_tarot_card()` function generates tarot preview from spell blocks
- TarotCardView activates automatically for all new spells
- Flippable card with "View Full Ritual" button

#### Research Display V2 Fix
- GrimoirePage uses V2 API format (summary, key_takeaways, sources as objects)

#### Transform Function Robustness
- `transform_blocks_to_array` passes through dict content directly

### Previous Sessions: UX Overhaul (Phases 0-6)
- Phase 1: Homepage cleanup (removed Meet Your Guides button)
- Phase 2: Enriched writer prompts with narrative flow
- Phase 3: "Alchemize This" 8 categories replacing feelings
- Phase 4: Guide profiles at bottom of spell-request page
- Phase 5: Loading experience shows selected guide
- Phase 6: Spell display narrative layout

---

## Prioritized Backlog

### P1 (High Priority)
- Stripe Integration: Code ready, awaiting API keys
- Archivist research: Replace hardcoded data with dynamic DeepSeek calls

### P2 (Medium Priority)
- Spell counter merge decision
- Unique guide interaction models

### P3 (Low Priority)
- Re-enable Early Access Gate
- Generate images for older spells
- PDF spell book compiler, Admin Interface
- Security hardening

---

## Key Files Reference
- `frontend/src/components/SpellBlockRenderer.jsx` - REWRITTEN for narrative prose
- `frontend/src/components/GrimoirePage.js` - TarotCardView + research V2
- `frontend/src/pages/SpellRequest.js` - Spell flow with guide loading
- `frontend/src/utils/api.js` - API client with research timeout
- `backend/server.py` - Spell generation + polling with early persona info
- `backend/prompts/pipeline_blocks.py` - Pipeline + transform + tarot builder

### MOCKED
- `_run_archivist` in `pipeline_blocks.py` returns hardcoded research packet
