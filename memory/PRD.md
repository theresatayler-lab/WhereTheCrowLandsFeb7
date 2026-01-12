# Where The Crowlands - Product Requirements Document

## Original Problem Statement
Build "Where The Crowlands," a sophisticated full-stack application for creating DIY rituals guided by AI archetypes. The app features a dual-AI architecture with DeepSeek (research/factual) and OpenAI (persona voice).

## Core Architecture
- **Frontend**: React + Tailwind + Shadcn/UI
- **Backend**: FastAPI + Python
- **Database**: MongoDB
- **AI**: Dual-model (DeepSeek for research, OpenAI GPT-4o for persona voice)

## What's Been Implemented

### Session: January 12, 2026
- **TC Phantasmagoria Font Integration**
  - Custom OTF font installed at `/app/frontend/public/fonts/grimoire-accent.otf`
  - CSS utility classes: `.font-phantasmagoria`, `.ritual-title`, `.phantasmagoria-hero`, `.phantasmagoria-accent`
  - Applied to: Main title, page headers, spell titles, guide names
  
- **DeepSeek Research Pipeline V3 Enhancement**
  - 7 new research modes (10 total): cross_traditional_analysis, material_science_context, ritual_anatomy, historical_evolution, geographic_variants, transmission_analysis, contemporary_adaptation
  - 28 tradition tags taxonomy (expanded from 6)
  - 7 source quality tiers with confidence levels
  - 10 "Why This Works" framing patterns
  - Cross-persona connection points and tension mapping
  - Enhanced safety substitution categories (6 categories with subcategories)
  - 6-stage reading path pedagogy (Foundation → Integration)
  - New endpoint: `GET /api/research/config`

- **Navigation Verification**
  - Confirmed scroll-to-top behavior on all page transitions ✓

### Previous Sessions
- Dual-AI research pipeline (DeepSeek + OpenAI)
- Four ancestral guides: Shigg, Cathleen, Katherine, Theresa
- Spell generation with tarot cards and sigils
- User authentication (JWT)
- Subscription system (Stripe integration)
- My Grimoire spell saving
- Rich references system
- PDF export functionality

## Key Pages
- `/` - Home
- `/spell-request` - Guided spell creation
- `/guides` - Meet the Guides
- `/my-grimoire` - Saved spells (auth required)
- `/deities`, `/figures`, `/sites`, `/rituals`, `/timeline` - Archives
- `/ai-chat` - Research interface

## API Endpoints
- `POST /api/combined` - Dual-AI spell generation
- `GET /api/health/providers` - AI provider status
- `GET /api/research/config` - V3 research configuration
- `POST /api/auth/login`, `/api/auth/register` - Authentication
- `GET /api/spells/user` - User's saved spells

## Test Credentials
- Pro User: `sub_test@test.com` / `test123`
- Free User: `free_test@test.com` / `test123`

## Prioritized Backlog

### P0 - High Priority
- [ ] Visual Polish & Ornament Library (20 corners, 12 dividers, 24 glyphs)
- [ ] Session persistence verification (user testing pending)

### P1 - Medium Priority
- [ ] Back-compatibility for old spell references
- [ ] Theresa archetype enrichment
- [ ] Fix linting errors in server.py

### P2 - Future
- [ ] Re-enable Early Access Gate
- [ ] Premium PDF spell book compiler
- [ ] Live Stripe payments activation
- [ ] Print-on-Demand integration
- [ ] sitemap.xml for crawlers
- [ ] Refactor server.py into modular structure
- [ ] Faster image provider (Flux)

## Technical Notes
- EarlyAccessGate in App.js is currently commented out
- DeepSeek API key configured in backend/.env
- Font loaded via index.html style tag (not CSS import due to webpack)
