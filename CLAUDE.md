# WHERE THE CROWLANDS - AI Assistant Guide

## Quick Reference

```
STACK:        React 18 + FastAPI + MongoDB + Multi-LLM
GUIDES:       Shigg (amber), Cathleen (teal), Katherine (violet) - Theresa NOT implemented
AI ROUTING:   DeepSeek (research) → Claude Sonnet (writing) → GPT-4o (fallback)
COLORS:       Navy (#0a1628), Cream (#F3EFE8), Gold (#C8A44D), Crimson (#8b2232)
```

---

## Project Overview

**Where The Crowlands** (also "nOcult") is a full-stack web application for creating AI-generated DIY rituals and spellwork guided by ancestral archetypes. It blends documented occult history, folklore, and myth with AI-powered personalization.

**Core Concept:** Users interact with one of three ancestral "Guides" (AI personas) who help craft personalized workings based on intentions. Magic is treated as psychological/narrative tool for self-reflection, not supernatural claims.

**Target Audience:** Modern witches, pagans, secular spiritualists, folklore enthusiasts, ritual-as-meaning-making practitioners.

---

## The Three Guides (AI Personas)

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

### THERESA - NOT IMPLEMENTED
Theresa appears in design docs as "Appalachian grandmother" but does NOT exist in `persona_config.py`. Only 3 guides are functional.

---

## Technical Architecture

### Stack
```
Frontend:  React 18 + Tailwind CSS + Shadcn/UI
Backend:   FastAPI (Python) + Motor (async MongoDB)
Database:  MongoDB + GridFS (for spell images)
AI:        Multi-model orchestration (see below)
Hosting:   Emergent Platform (Kubernetes)
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

---

## Directory Structure

```
/app/
├── backend/
│   ├── server.py              # Main FastAPI app (4000+ lines)
│   ├── prompts/               # AI prompt system
│   │   ├── pipeline_blocks.py # V3 4-stage pipeline
│   │   ├── archivist.py       # Research prompts
│   │   ├── planner_blocks.py  # Block structure planning
│   │   ├── writer_blocks.py   # Guide voice writing
│   │   ├── qa_blocks.py       # Validation
│   │   └── belief_modes.py    # Secular/Spiritual/Practitioner
│   ├── spell_tiers.py         # Tiered AI selection logic
│   ├── llm_providers.py       # Multi-LLM abstraction
│   ├── persona_config.py      # Guide configurations (3 guides)
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

### Color Palette (MANDATORY)
```css
--navy-dark: #0a1628      /* Deep navy - main backgrounds */
--navy-mid: #0E2A2F       /* Midnight teal - section backgrounds */
--cream: #F3EFE8          /* Vellum - text/reading surfaces */
--gold: #C8A44D           /* Antique gold - accents, icons */
--crimson: #8b2232        /* Deep crimson - CTAs */
--crimson-bright: #B94E6A /* Ember pink - highlights */
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
| Guide personas | `persona_config.py` |
| Design components | `OrnateElements.js` |
| Timeline | `Timeline.js`, `timeline_service.py` |
| API client | `frontend/src/utils/api.js` |
| Color tokens | `tailwind.config.js` |

---

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://...
DB_NAME=webapp
JWT_SECRET=...
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_API_KEY=sk_test_...
```

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
# Check backend status
sudo supervisorctl status

# View backend logs
tail -100 /var/log/supervisor/backend.err.log

# Restart after .env changes
sudo supervisorctl restart backend

# Test API
API_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)
curl -s "$API_URL/api/timeline/v2/stats"
```

---

## What's Working vs Gaps

### Working
- Spell generation (V3 blocks system)
- My Grimoire (save/retrieve)
- Interactive Timeline (94 events, 3 views)
- User authentication (JWT)
- Invisible Helpers portal

### Gaps
- Theresa guide NOT implemented
- ~35/94 timeline events have rich narratives
- 98 broken connection references in timeline
- Stripe payments BLOCKED (needs valid key)

---

## Brand Voice

**Tone:** Reverent but accessible, warm but not saccharine, historically grounded

**Use:** "Working" (not spell), "Practice", "Intention", "Guide", "The tradition holds..."

**Avoid:** "Manifest", "Universe" as agent, "High vibes", certainty language, medical claims
