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
  - Claude Opus: Deep reasoning (Deep tier only)
  - GPT-4o: Fallback only (when Claude unavailable)

## AI Tier System (Implemented Feb 2025)
- **Quick Mode**: DeepSeek → Claude Sonnet (~20s, ~$0.02/spell)
- **Standard Mode**: DeepSeek → Claude Sonnet storytelling → Claude Sonnet writing (~40s, ~$0.05/spell)
- **Deep Mode**: DeepSeek → Opus reasoning → Claude Sonnet storytelling → Claude Sonnet writing (~75s, ~$0.15/spell)

---

## What's Been Implemented

### Session: February 16, 2026 - Major UX Overhaul ✅

#### Phase 1: Homepage Cleanup ✅
- Removed "Meet Your Guides" button from homepage hero
- Added "Meet Your Guides" as first item in Explore dropdown
- Homepage now has single CTA: "We've Got a Spell for That"

#### Phase 2: Backend Narrative Prompts ✅
- Updated `writer_blocks.py` with richer directions for all 5 guides
- Added historical anecdotes, WHY explanations, and narrative flow requirements
- Each guide now has sensory scene-setting in openings
- Stepper blocks now include tradition references embedded in instructions

#### Phase 3: "Alchemize This" Categories ✅
- Replaced 7 feelings (calm, brave, clear, etc.) with 8 spell categories:
  1. Protection - Wards, shields, boundaries (→ Cathleen)
  2. Baneful Justice - Binding, truth-revealing (→ Katherine)
  3. Comfort & Healing - Grief, loss, support (→ Shigg)
  4. Clarity & Truth - Discernment, revelation (→ Theresa)
  5. Releasing & Letting Go - Breaking patterns (→ Theresa)
  6. Ancestral Work - Family patterns, lineage (→ Brenda)
  7. Domestic Magic - Home blessing, hearth craft (→ Shigg)
  8. Courage & Strength - Empowerment, voice (→ Cathleen)
- Backend routing updated to auto-select guide based on category
- Legacy feelings preserved for backward compatibility

#### Phase 4: Guide Profiles at Bottom ✅
- Removed persona picker from Step 1 (AI auto-selects guide)
- Added "Meet Your Guides" section at bottom of spell-request page
- 5 guide profile cards with emojis, names, and titles
- Clicking a card navigates to `/guides/{id}`

#### Phase 5: Loading Experience ✅
- Added `selectedGuide` state to track guide during generation
- Loading overlay now shows:
  - Initial: "Finding Your Guide" with animated sparkle
  - After selection: Guide avatar, name, title, and "why this guide" explanation
- Reset on new spell

#### Phase 6: Spell Display Narrative Layout ✅
- Updated StepperBlock: Flowing prose paragraphs instead of checkboxes
- Updated MaterialsBlock: Clean list with WHY explanations
- Updated ColdOpenBlock: Immersive blockquote presentation
- Updated LoreVignetteBlock: Embedded narrative style with border separators
- Added `learn_more_url` support to FurtherReadingBlock

### Previous Session: February 16, 2025 - Theresa Fix + Speed Optimization ✅

#### Theresa Spell Generation Pipeline Fix (P0) ✅
- Implemented complete blocks-based spell system across 4 files:
  - `backend/prompts/planner_blocks.py` - Working types, block templates, deterministic planning
  - `backend/prompts/pipeline_blocks.py` - BlocksSpellPipeline class, JSON repair, tier config
  - `backend/prompts/writer_blocks.py` - Content directions, validation, fallback content
  - `backend/spell_tiers.py` - Tier definitions with proper token budgets
- Added `transform_blocks_to_array()` function for frontend compatibility
- All 5 guides generating complete spells

#### Speed Optimization for QUICK Tier ✅
- QUICK tier skips LLM planner (uses deterministic plan)
- STANDARD tier planner uses gpt-4o-mini (faster)

---

## Prioritized Backlog

### P0 (Blocking)
- None currently

### P1 (High Priority)
- Stripe Integration - Code ready, awaiting API keys from user
- Phase 7: Tarot Card Preview (optional) - Card preview before full spell reveal

### P2 (Medium Priority)
- Spell counter merge decision (anon vs. registered)
- Unique guide interaction models (Bird Oracle, Kitchen Magic NLP, Letter UI)
- Archivist stage using real DeepSeek calls instead of hardcoded research

### P3 (Low Priority)
- Re-enable Early Access Gate
- Generate images for older spells
- Premium PDF spell book compiler
- Admin Interface
- Security hardening (Prompt Injection, JWT, Rate Limiting)

---

## Key Files Reference

### Frontend
- `frontend/src/pages/Home.js` - Homepage with single CTA
- `frontend/src/pages/SpellRequest.js` - Main spell creation flow with Alchemize categories
- `frontend/src/pages/GuidePortal.js` - Guide conversation portals
- `frontend/src/components/SpellBlockRenderer.jsx` - Narrative spell display
- `frontend/src/components/Navigation.js` - Nav with Explore dropdown

### Backend
- `backend/server.py` - Main FastAPI app with routing
- `backend/prompts/writer_blocks.py` - Rich narrative prompts
- `backend/prompts/pipeline_blocks.py` - Spell generation pipeline
- `backend/prompts/planner_blocks.py` - Working types and block templates
- `backend/spell_tiers.py` - Tier system configuration
- `backend/persona_config.py` - Guide personas and configuration

---

## DO NOT TOUCH
- Timeline page (`frontend/src/pages/Timeline.js`)
- MyGrimoire page (`frontend/src/pages/MyGrimoire.js`)
- Auth system (`frontend/src/pages/Auth.js`)
- Guide Portal spell generation (working correctly)
- Payment/Stripe endpoints (waiting on keys)
- Dual ID system (shigg/shiggy) - handled by id_map
