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

### Session: February 16, 2026 - Fork 2: Full Fix Round

#### Archivist Now LIVE (was mocked)
- `_run_archivist` in `pipeline_blocks.py` now calls `research_query_v2()` from `research_service.py`
- Makes real DeepSeek API call (~40s) for intention-specific research
- Returns real facts, sources, tradition context specific to the user's query
- Graceful fallback if DeepSeek fails
- Spell writer (Claude) now gets REAL historical research to draw from

#### Bug Fix #1: Loading Screen Guide Info
- Backend stores persona_id/name/title early in spell_jobs during processing
- Polling endpoint returns persona info during `processing` status
- Frontend reads persona_id from processing status and shows guide info

#### Bug Fix #2: Narrative Spell Display
- SpellBlockRenderer.jsx completely rewritten (900→417 lines)
- Removed: All uppercase section headers, icons, input fields, card borders
- Now renders flowing narrative prose: blockquotes, prose paragraphs, inline lists

#### Bug Fix #3: Research Button Timeout
- Added 120s timeout to axios call (API takes ~50s)
- Fixed V2 format rendering, normalized archetype ID mapping

#### Phase 7: Tarot Card Preview
- `_build_tarot_card()` generates tarot preview from spell blocks
- TarotCardView activates automatically for all new spells

### Previous: UX Overhaul (Phases 0-6)
- Phase 1: Homepage cleanup
- Phase 2: Enriched writer prompts
- Phase 3: "Alchemize This" 8 categories
- Phase 4: Guide profiles at bottom
- Phase 5: Loading experience
- Phase 6: Narrative layout

---

## Timing Metrics (Real Pipeline)
- Archivist (DeepSeek): ~40s
- Planner (GPT-4o-mini): ~10s
- Writer (Claude Sonnet): ~22s
- Total spell generation: ~70-75s
- Research button (/api/combined): ~50s

---

## Prioritized Backlog

### P1 (High Priority)
- Stripe Integration: Code ready, awaiting API keys

### P2 (Medium Priority)
- Spell counter merge decision
- Unique guide interaction models

### P3 (Low Priority)
- Re-enable Early Access Gate
- Generate images for older spells
- PDF spell book compiler, Admin Interface
- Security hardening

---

## Key Files
- `frontend/src/components/SpellBlockRenderer.jsx` - Narrative prose renderer
- `frontend/src/components/GrimoirePage.js` - TarotCardView + research V2
- `frontend/src/pages/SpellRequest.js` - Spell flow with guide loading
- `frontend/src/utils/api.js` - API client (120s research timeout)
- `backend/server.py` - Spell generation + early persona info
- `backend/prompts/pipeline_blocks.py` - Pipeline + LIVE archivist + transform + tarot
- `backend/research_service.py` - DeepSeek + OpenAI research service
