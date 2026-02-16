# Where The Crowlands - Product Requirements Document

## Original Problem Statement
Build "Where The Crowlands," a spell-generation platform with AI archetypes. Dual-AI: DeepSeek (research) + Claude (writing).

## Architecture
- Frontend: React + Tailwind + Shadcn/UI | Backend: FastAPI + Python | DB: MongoDB + GridFS
- AI: DeepSeek research (~40s), GPT-4o-mini planner (~10s), Claude Sonnet writer (~22s)

---

## Implemented (Feb 16, 2026 - Fork 2)

### Bug Fix 1: Stage Progress Indicator
- Backend writes `current_stage` + `stage_message` to MongoDB between each pipeline stage
- `on_stage_change` callback passed from server.py to pipeline's `generate_spell()`
- Polling returns `current_stage`/`stage_message` during processing
- Frontend shows 4 connected dots (Research → Plan → Write → Polish) with active one pulsing gold

### Bug Fix 2: Reset Loading State
- Clears selectedGuide/currentStage/stageMessage on new spell generation

### Bug Fix 3: Loading Screen Guide Reveal
- Backend stores persona_id/name/title early, polling returns during processing

### Bug Fix 4: Narrative Spell Display
- SpellBlockRenderer.jsx rewritten: no headers, no icons, no inputs, flowing prose

### Bug Fix 5: Research Button Timeout
- 120s timeout, V2 format rendering, ID normalization

### Feature: Archivist Now LIVE
- `_run_archivist` calls `research_query_v2()` for real DeepSeek research

### Feature: Phase 7 Tarot Card Preview
- `_build_tarot_card()` from spell blocks, TarotCardView activates automatically

### Feature: Unique Guide Interaction Models
- Shigg: Enhanced bird oracle directions (folk tradition framing)
- Cathleen: Enhanced song prompt (specific phrases, Celtic vocal tradition, empowerment)
- Katherine: Enhanced evidence card (case record tone, Victorian investigation)
- Theresa: Enhanced observation task (investigative assignment, evidence-gathering)
- Brenda: Letter framing (cold_open as letter opening, closing as letter sign-off)

### Feature: Grimoire PDF Export
- GET /api/grimoire/export/pdf — reportlab-based PDF of saved spells
- Export button in MyGrimoire page

### Feature: Admin Stats Dashboard
- GET /api/admin/stats — users, spell counts, guide popularity, pipeline performance
- /admin page with stat cards and performance metrics
- Restricted to admin_emails list

### UX Overhaul (Phases 0-6) — Previous sessions
- Alchemize This 8 categories, guide profiles, loading experience, narrative layout

---

## Prioritized Backlog
### P1: Stripe Integration (awaiting API keys)
### P2: Spell counter merge, unique guide interaction models (deeper)
### P3: Early Access Gate, security hardening

---

## Key Files
- `frontend/src/components/SpellBlockRenderer.jsx` — Narrative prose renderer
- `frontend/src/pages/SpellRequest.js` — Stage progress + guide loading
- `frontend/src/pages/Admin.js` — Admin dashboard
- `frontend/src/pages/MyGrimoire.js` — PDF export button
- `backend/server.py` — All API routes including admin, PDF export, stage updates
- `backend/prompts/pipeline_blocks.py` — Pipeline with on_stage_change + live archivist
- `backend/prompts/writer_blocks.py` — Guide-specific narrative prompts
- `backend/research_service.py` — DeepSeek + OpenAI research service
