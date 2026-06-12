# WHERE THE CROWLANDS - AI Assistant Guide

## Quick Reference

```
STACK:        React 18 + FastAPI + MongoDB + Multi-LLM
GUIDES:       Shigg (amber), Cathleen (teal), Katherine (violet), Theresa (investigator), Brenda (chronicler)
AI TEXT:      DeepSeek (research) → Claude Sonnet (writing) → direct Anthropic/DeepSeek clients
AI IMAGES:    Gemini (std headers) → FAL Flux Pro (premium headers) → OpenAI GPT Image 1 (tarot/sigils) → Ideogram (premium sigils) → per-guide SVG ornaments (dividers, zero API)
COLORS:       Deep Navy (#0C1D2E), Primary Navy (#102534), Card Teal (#123A3F), Vellum (#F3EFE8), Gold (#C8A44D), Ember Pink (#B94E6A), Oxblood (#8B2232)
VISUAL BRIEF: design_assets/VISUAL_SYSTEM_BRIEF.md (canonical — read before touching any visual/image code)
INDEPENDENCE: Site uses YOUR API keys only — zero Emergent dependencies
```

---

## Project Overview

**Where The Crowlands** (also "nOcult") is a full-stack web application for creating AI-generated DIY rituals and spellwork guided by ancestral archetypes. It blends documented occult history, folklore, and myth with AI-powered personalization.

**Core Concept:** Users interact with one of five ancestral "Guides" (AI personas) who help craft personalized workings based on intentions. Magic is treated as psychological/narrative tool for self-reflection, not supernatural claims.

**Target Audience:** Modern witches, pagans, secular spiritualists, folklore enthusiasts, ritual-as-meaning-making practitioners.

---

## The Five Guides (AI Personas)

**CRITICAL: Never mix guide characteristics. Each has distinct voice, colors, and taboos.**

### SHIGG (Amber/Copper)
- **Archetype:** Kitchen witch, domestic magic, grief tender
- **Voice:** Warm, cozy, food/tea/bird metaphors
- **Specialty:** Morning rituals, comfort spells, grief work, bird oracles
- **Signature:** Tea ceremony, bird messages, copper kettles, dawn light
- **Taboos:** Never cold/clinical, never shadow/darkness language
- **Colors:** `amber-600`, `amber-500`, `amber-900/15`

### CATHLEEN (Teal/Emerald)
- **Archetype:** Irish hedge witch, voice/song magic, protector
- **Voice:** Fierce, poetic, music/voice metaphors
- **Specialty:** Protection wards, courage spells, song prompts
- **Signature:** Singing bowls, protective wards, emerald fire, Irish folklore
- **Taboos:** Never meek/quiet, never precision/analytical language
- **Colors:** `teal-600`, `teal-400`, `teal-900/15`

### KATHERINE (Violet/Purple)
- **Archetype:** Victorian spiritualist, shadow worker, evidence-based
- **Voice:** Precise, academic, thread/pattern metaphors
- **Specialty:** Shadow integration, truth revealing, sigil work
- **Signature:** Mirrors, black thread, Victorian seance, evidence cards
- **Taboos:** Never fluffy/warm, never domestic/cozy language
- **Colors:** `violet-600`, `violet-400`, `violet-900/15`

### THERESA (Investigator)
- **Archetype:** Seer-Archivist, pattern breaker, truth seeker
- **Voice:** Direct, investigative, evidence/pattern metaphors
- **Specialty:** Family secrets, genealogical magic, pattern breaking, truth seeking
- **Signature:** Notebooks, magnifying glass, red thread, photographs, maps
- **Taboos:** Never vague/mystical, never domestic/cozy language
- **Anchors:** Notebook & Pen, Photograph, Map/Family Tree, Red Thread, Magnifying Glass

### BRENDA (Chronicler)
- **Archetype:** Family chronicler, memory keeper, crow communer
- **Voice:** Warm, nostalgic, letter/memory/family metaphors
- **Specialty:** Memory keeping, letter spells, crow communion, family stories
- **Signature:** Letters, family photos, heirlooms, recipe cards, crow feathers
- **Taboos:** Never clinical/analytical, never impersonal
- **Anchors:** Letter/Envelope, Family Photo, Heirloom/Keepsake, Recipe Card, Crow Feather

---

## Technical Architecture

### Stack
```
Frontend:  React 18 + Tailwind CSS + Shadcn/UI
Backend:   FastAPI (Python) + Motor (async MongoDB)
Database:  MongoDB Atlas + GridFS (for spell images)
AI Text:   Anthropic Claude + DeepSeek (direct SDKs, YOUR keys)
AI Images: Google Gemini + OpenAI GPT Image 1 (direct SDKs, YOUR keys)
Payments:  Stripe (direct SDK, YOUR key)
Hosting:   TBD (migrating from Emergent to Railway/Render)
```

### AI Model Architecture

**Research Layer (DeepSeek)**
- Model: `deepseek-chat`
- Purpose: Factual research, source finding, tradition context
- Used in: Archivist stage of spell generation

**Creative Layer (Claude Sonnet - Primary)**
- Model: `claude-sonnet-4-20250514`
- Purpose: Guide voices, narrative writing, persona expression
- Fallback: `gpt-4o` if Claude unavailable

**Tiered System (spell_tiers.py)**
```
QUICK (15-25s):    DeepSeek → Claude Sonnet (800 tokens)
STANDARD (30-45s): DeepSeek → Claude Sonnet (2500 tokens)
DEEP (60-90s):     DeepSeek → Claude Opus reasoning → Claude Sonnet (3500 tokens)
```

### Spell Generation Pipeline (4-Stage)
```
Stage 1: ARCHIVIST (DeepSeek)  → Research facts, sources
Stage 2: PLANNER (GPT-4o)      → Block structure, template selection
Stage 3: WRITER (Claude)       → Full content in guide voice
Stage 4: QA (Programmatic)     → Validation, auto-rewrite if fails
```

### Image Generation Pipeline (Tier-Aware Per-Asset Routing)
```
STANDARD TIER:
  Headers   → Google Gemini (GOOGLE_API_KEY)        — atmospheric scenes, fast
  Tarot     → OpenAI GPT Image 1 (OPENAI_API_KEY)   — precise symmetry
  Sigils    → OpenAI GPT Image 1 (OPENAI_API_KEY)   — clean geometry
  Dividers  → Per-guide SVG ornaments (zero API)     — instant, from ornaments/index.js

PREMIUM TIER:
  Headers   → FAL Flux Pro (FAL_API_KEY)             — cinematic detail (fallback → Gemini)
  Tarot     → OpenAI GPT Image 1 (OPENAI_API_KEY)   — precise symmetry
  Sigils    → Ideogram V2 (IDEOGRAM_API_KEY)         — geometric design (fallback → OpenAI)
  Dividers  → Per-guide SVG ornaments (zero API)     — instant

QUICK TIER: Zero image API calls — CSS gradients + guide icon + SVG dividers
```

Style is driven by `image_style_matrix.py`:
- 5 guides x 3 emotional registers (gentle/practical/intense) = 15 artist styles
- 10 working categories (protection, healing, clarity, etc.) = visual modifiers
- Spell-specific tokens extracted from content = unique per spell
- Combined via `build_style_layer()` in spell_prompts.py

---

## Directory Structure

```
├── backend/
│   ├── server.py              # Main FastAPI app (6600+ lines)
│   ├── prompts/               # AI prompt system
│   │   ├── pipeline_blocks.py # V3 4-stage pipeline
│   │   ├── archivist.py       # Research prompts
│   │   ├── planner_blocks.py  # Block structure planning
│   │   ├── writer_blocks.py   # Guide voice writing
│   │   ├── qa_blocks.py       # Validation
│   │   └── belief_modes.py    # Secular/Spiritual/Practitioner
│   ├── spell_tiers.py         # Tiered AI selection logic
│   ├── llm_providers.py       # Multi-LLM abstraction (Anthropic + DeepSeek direct)
│   ├── image_provider.py      # Multi-provider image generation (Gemini + OpenAI direct)
│   ├── image_style_matrix.py  # Artist styles, category modifiers, quick spell visuals
│   ├── spell_prompts.py       # Spell-specific image prompts + style layer integration
│   ├── persona_config.py      # Guide configurations (5 guides)
│   ├── timeline_service.py    # Timeline API
│   ├── timeline_events_expanded.py  # 94 historical events
│   └── .env                   # API keys (NEVER commit)
│
├── frontend/
│   ├── src/
│   │   ├── pages/             # Route components
│   │   ├── components/
│   │   │   ├── OrnateElements.js   # Design system
│   │   │   ├── SpellBlockRenderer.jsx
│   │   │   └── ui/            # Shadcn components
│   │   └── assets/
│   │       └── brandAssets.js # Logo/image exports
│   └── tailwind.config.js     # Color tokens
│
└── memory/
    ├── PRD.md                 # Product requirements
    └── STYLE_BIBLE.md         # Design system docs
```

---

## Design System

### Color Palette (MANDATORY — matches VISUAL_SYSTEM_BRIEF.md §0)
```css
--wtc-bg:          #0C1D2E;  /* Deep Navy — page backgrounds */
--wtc-bg-primary:  #102534;  /* Primary Navy — secondary containers, nav, footers */
--wtc-card-dark:   #123A3F;  /* Celestial Blue/Teal — cards on dark */
--wtc-surface:     #F3EFE8;  /* Vellum — ALL body-text containers */
--wtc-gold:        #C8A44D;  /* Antique Gold — strokes/linework ONLY, never fill */
--wtc-gold-faded:  #A89872;  /* Faded Gold — tags, metadata */
--wtc-cta:         #B94E6A;  /* Ember Pink — buttons, CTAs, drop caps */
--wtc-oxblood:     #8B2232;  /* Oxblood — pull quotes, headings on vellum */
--wtc-ink:         #1A1A1A;  /* Ink Black — body on vellum */
--wtc-grey-warm:   #5A524E;  /* Warm Grey — captions on vellum */
```

### Typography
```
Accent/Titles: TC Phantasmagoria (loaded via <style> tag)
Section Heads: Cinzel Decorative
Body: Crimson Text
UI/Labels: Montserrat
```

### Visual Rules

**MANDATORY:**
1. Reading surfaces MUST be solid - no opacity under text
2. Minimum contrast 4.5:1 for body, 3:1 for headings
3. Gold is stroke-only - never flat fills
4. One atmospheric image per page maximum

**FORBIDDEN:**
- Emojis in code/UI
- Purple/violet gradients (except Katherine)
- `transition: all` (breaks transforms)
- Generic card grids

---

## Key Files Reference

| Task | Files |
|------|-------|
| Spell generation | `prompts/pipeline_blocks.py`, `spell_tiers.py` |
| Image generation | `image_provider.py`, `image_style_matrix.py`, `spell_prompts.py` |
| Guide personas | `persona_config.py` |
| LLM routing | `llm_providers.py` |
| Payments | `server.py` (lines 6458+), direct `stripe` SDK |
| Design components | `OrnateElements.js` |
| Timeline | `Timeline.js`, `timeline_service.py` |
| API client | `frontend/src/utils/api.js` |
| Color tokens | `tailwind.config.js` |

---

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://...          # Your MongoDB Atlas cluster
DB_NAME=webapp
JWT_SECRET=...
ANTHROPIC_API_KEY=sk-ant-...     # All spell writing, guide voices
DEEPSEEK_API_KEY=sk-...          # Research/archivist stage
GOOGLE_API_KEY=AIza...           # Gemini image generation (headers, /ai-image)
OPENAI_API_KEY=sk-proj-...       # GPT Image 1 (tarot cards, sigils)
STRIPE_API_KEY=sk_test_...       # Payments (direct SDK)
STRIPE_WEBHOOK_SECRET=whsec_... # Optional: webhook signature verification
```

### API Independence Rule
**The site uses ONLY your API keys. Zero Emergent dependencies.**
- `emergentintegrations` package has been fully removed
- All LLM calls go through direct Anthropic/DeepSeek SDKs
- All image generation goes through direct Google GenAI/OpenAI SDKs
- All payments go through direct Stripe SDK

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://...
```

---

## API Endpoints

### Spell Generation
```
POST /api/ai/generate-spell-v3
GET  /api/ai/spell-config-v3
```

### Timeline
```
GET /api/timeline/v2/events
GET /api/timeline/v2/stats
GET /api/timeline/v2/graph
```

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/users/me
```

### Grimoire
```
GET  /api/grimoire/spells
POST /api/grimoire/save
```

---

## Test Accounts
```
Pro User:  sub_test@test.com / test123
Free User: free_test@test.com / test123
```

---

## Common Commands

```bash
# Local development
cd frontend && npm start          # React dev server (port 3000)
cd backend && uvicorn server:app --reload --port 8000  # FastAPI dev server

# Syntax check after edits
python3 -c "import py_compile; py_compile.compile('backend/server.py')"

# Verify no Emergent dependencies
grep -r "emergentintegrations" backend/*.py  # Should return nothing
```

---

## What's Working vs Gaps

### Working
- Spell generation (V3 blocks system) — all 5 guides
- My Grimoire (save/retrieve) with GridFS image persistence
- Interactive Timeline (94 events, 3 views)
- User authentication (JWT)
- Invisible Helpers portal
- Stripe payments (direct SDK, test mode)
- Image provider routing: Gemini + FAL + OpenAI + Ideogram + static fallbacks (45 curated WebPs, all 5 guides)
- Artist style matrix (150 combinations)
- Tier-aware image generation (standard/premium) in parallel — sync AND async paths in parity
- SpellComics loading screen rotation (47 curated assets, guide-specific)
- Palette purge complete — canonical 10-color system, guide tint tokens in tailwind.config.js, zero deprecated hexes, zero transition-all
- GUIDE_ORNAMENT_CONFIG — per-guide SVG corners + 3-variant divider cycling, all 5 guides incl. Brenda (§4)
- Spell page layout — framed header plate w/ guide corner ornaments + caption, tarot frontispiece (340px, vellum mat), inline sigil seal w/ ink-reveal (§3.1–3.4)
- Quick tier visuals — CSS medallion header + guide icon + guide dividers, zero API calls (§3.5)
- PDF/print layout — chapter-opener plate, half-page tarot, full-page closing seal, static dividers (§3.6 print CSS; html2canvas path forces seal visible)
- FAL queue API fix (PR #27) + premium tier gating fix (PAID_TIERS)
- Image data flow: GridFS save, dual-path reconstruction on load

### Gaps / Next Up
- ~35/94 timeline events have rich narratives
- 98 broken connection references in timeline
- Static fallback images live on main (commit 946b298) — merge with visual-recovery branch
- SpellComics stage-matching polish (sc30 → WRITE step, sc45/46 → pre-generation) — optional
- Licenses: add design_assets/inbox/LICENSES.txt noting pack purchase sources (local-only task)
- Deploy to Railway/Render (migrate off Emergent hosting)

---

## Brand Voice

**Tone:** Reverent but accessible, warm but not saccharine, historically grounded

**Use:** "Working" (not spell), "Practice", "Intention", "Guide", "The tradition holds..."

**Avoid:** "Manifest", "Universe" as agent, "High vibes", certainty language, medical claims
