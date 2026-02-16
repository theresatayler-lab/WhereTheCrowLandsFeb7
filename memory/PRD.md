# Where The Crowlands - Product Requirements Document

## Original Problem Statement
Build "Where The Crowlands," a sophisticated full-stack application for creating DIY rituals guided by AI archetypes. The app features a dual-AI architecture with DeepSeek (research/factual) and Claude (creative writing/persona voice).

## Core Architecture
- **Frontend**: React + Tailwind + Shadcn/UI
- **Backend**: FastAPI + Python
- **Database**: MongoDB + GridFS (for images)
- **AI**: Tiered dual-model system
  - DeepSeek: Research, facts, source verification
  - Claude Sonnet: Creative writing, storytelling, guide voices (PRIMARY)
  - GPT-4o: Planner + Fallback

## AI Tier System
- **Quick Mode**: DeepSeek -> Claude Sonnet (~20s, ~$0.02/spell)
- **Standard Mode**: DeepSeek -> Claude Sonnet storytelling -> Claude Sonnet writing (~40s, ~$0.05/spell)
- **Deep Mode**: DeepSeek -> Opus reasoning -> Claude Sonnet storytelling -> Claude Sonnet writing (~75s, ~$0.15/spell)

---

## What's Been Implemented

### Session: February 16, 2026 - Bug Fixes & Phase 7

#### Research Display Fix (P0)
- Fixed GrimoirePage.js research display to use V2 API format
- Changed `research_origins.answer` -> `research_origins.summary`
- Changed `research_origins.bullets` -> `research_origins.key_takeaways` (renders objects with .text, .claim_flag)
- Added `why_this_works_facts` display section
- Changed `sources` rendering from plain strings to structured objects (author, title, year, url)

#### Transform Function Robustness Fix
- Updated `transform_blocks_to_array` to pass through dict content directly when AI returns structured objects
- Previously was always running `_build_structured_content` which could lose structure

#### Phase 7: Tarot Card Preview (P1)
- Added `_build_tarot_card()` function in `pipeline_blocks.py`
- Automatically generates tarot card preview data from spell blocks:
  - symbol: Guide-specific emoji
  - essence: From cold_open greeting
  - key_action: From first stepper step
  - incantation: From closing empowerment_line or ward activation_phrase
  - warning: From safety_note if present
- TarotCardView in GrimoirePage now activates automatically for all new spells
- Card is flippable with gold Art Nouveau border design
- "View Full Ritual" button reveals the full grimoire spell

### Previous Session: UX Overhaul (Phases 0-6)

#### Phase 1: Homepage Cleanup
- Removed "Meet Your Guides" button from homepage hero
- Added "Meet Your Guides" as first item in Explore dropdown

#### Phase 2: Backend Narrative Prompts
- Updated `writer_blocks.py` with richer directions for all 5 guides
- Added historical anecdotes, WHY explanations, and narrative flow requirements

#### Phase 3: "Alchemize This" Categories
- Replaced 7 feelings with 8 spell categories:
  1. Protection (-> Cathleen)
  2. Baneful Justice (-> Katherine)
  3. Comfort & Healing (-> Shigg)
  4. Clarity & Truth (-> Theresa)
  5. Releasing & Letting Go (-> Theresa)
  6. Ancestral Work (-> Brenda)
  7. Domestic Magic (-> Shigg)
  8. Courage & Strength (-> Cathleen)

#### Phase 4: Guide Profiles at Bottom
- Removed persona picker from Step 1 (AI auto-selects)
- Added 5 guide profile cards at bottom of spell-request page

#### Phase 5: Loading Experience
- Shows selected guide name, title, and "why this guide" during generation

#### Phase 6: Spell Display Narrative Layout
- StepperBlock: Flowing prose paragraphs
- MaterialsBlock: Clean list with WHY
- ColdOpenBlock: Immersive blockquote
- LoreVignetteBlock: Embedded narrative style

---

## Prioritized Backlog

### P1 (High Priority)
- Stripe Integration: Code ready, awaiting API keys
- Archivist research: Replace hardcoded data with dynamic DeepSeek calls

### P2 (Medium Priority)
- Spell counter merge decision (anon vs. registered)
- Unique guide interaction models (Bird Oracle, Kitchen Magic, Letter UI)

### P3 (Low Priority)
- Re-enable Early Access Gate
- Generate images for older spells
- Premium PDF spell book compiler
- Admin Interface
- Security hardening (Prompt Injection, JWT, Rate Limiting)
- Dual ID system refactor (shiggy/shigg)

---

## Key Files Reference

### Frontend
- `frontend/src/pages/SpellRequest.js` - Main spell creation flow
- `frontend/src/components/GrimoirePage.js` - Spell display with TarotCardView + research
- `frontend/src/components/SpellBlockRenderer.jsx` - Narrative block rendering
- `frontend/src/utils/api.js` - API client

### Backend
- `backend/server.py` - FastAPI app with routing
- `backend/prompts/pipeline_blocks.py` - Spell pipeline + transform + tarot card builder
- `backend/prompts/writer_blocks.py` - Rich narrative prompts
- `backend/research_service.py` - DeepSeek + OpenAI research service
- `backend/persona_config.py` - Guide configuration

### MOCKED
- `_run_archivist` in `pipeline_blocks.py` returns hardcoded research packet instead of calling DeepSeek

---

## DO NOT TOUCH
- MongoDB schema: users, user_spells, spell_jobs, invisible_helpers_leads
- Authentication flow: JWT tokens in localStorage
- Subscription tier logic in server.py
