# Where The Crowlands - Product Requirements Document

## Original Problem Statement
Spell-generation platform with AI archetypes. Dual-AI: DeepSeek (research) + Claude (writing).

## Architecture
Frontend: React + Tailwind | Backend: FastAPI | DB: MongoDB | AI: DeepSeek + Claude + GPT-4o

---

## Latest: Custom Woodcut Icon System (Feb 16, 2026)

### Icons Implemented (73 total files)
- **25 anchor object icons** — dark charcoal + gold variants, transparent PNG, 48px
- **5 setting icons** — cottage, tree, briefcase, train, sun eclipse
- **8 alchemize category icons** — shield, scales, rose, eye, hands, tree, hearth, torch (AI-generated)
- **5 guide portraits** — circular crops from sketch images
- **5 UI icons** — sparkles, crystal ball, grimoire, library books (AI-generated, 3 color variants each)
- **All emojis replaced** on: SpellRequest.js, About.js, CorrieTarot.js, Library.js, MyGrimoire.js, GrimoirePage.js
- **Icon Style Guide** at `/frontend/public/icons/ICON_STYLE_GUIDE.md`
- **PageHeader** component updated with `iconSrc` prop for custom images

### Color Variants
- `/icons/[category]/` — dark charcoal (#2A2A2A) for light backgrounds
- `/icons/[category]/gold/` — gold (#C8A44D) for dark backgrounds
- `/icons/ui/cream/` — cream (#F3EFE8) for very dark backgrounds

### Previous Features (This Session)
- Stage progress indicator (Research → Plan → Write → Polish)
- Live DeepSeek archivist research
- Narrative spell display (no boxes/headers)
- Loading screen guide reveal
- Tarot card preview
- Admin dashboard, PDF export
- Unique guide interaction prompts

---

## Backlog
### P1: Stripe Integration (awaiting keys)
### P2: Book cover woodcut designs for Library page
### P3: Security, spell counter merge

## Key Files
- `/frontend/public/icons/` — all icon assets
- `/frontend/public/icons/ICON_STYLE_GUIDE.md` — generation prompts + rules
- `SpellRequest.js` — ANCHORS, SETTINGS, ALCHEMIZE_OPTIONS, PERSONAS with icon paths
- `OrnateElements.js` — PageHeader with iconSrc prop
