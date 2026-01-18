# Release Notes: V1.2 Spell Differentiation System
**Date:** January 18, 2026

## Summary
V1.2 establishes the core spell differentiation system, ensuring each guide produces authentically unique spells with proper mechanics enforcement and graceful error handling.

## What Shipped

### Core Differentiation
- **Micro-lore Injection**: Each guide has 10 lived details; 2-3 are randomly selected and woven into each spell
- **Taboos Enforcement**: Forbidden themes/imagery enforced via prompt constraints + post-generation validation
- **Text Variation Tokens**: `setting_detail`, `sensory_detail`, `gesture_detail`, `metaphor_detail` vary per run
- **Tarot Composition Tracking**: 6 compositions per guide, tracked per session to prevent immediate repeats
- **Cross-Contamination Tests**: Ensures guides don't bleed into each other's domain

### Routing
- **Surprise Me**: Backend guide selection based on keywords + desired feeling
- **Keyword Routes**: protection→Cathleen, pattern/hidden/truth→Katherine, domestic/grief/gentle→Shigg
- **Routing Reasons**: Logged and returned to frontend for transparency

### Stability (P0 Fixes)
- **JSON Repair**: Single LLM repair pass on parse failures
- **Fallback Spell**: Graceful degradation if repair fails (no more UI crashes)
- **Shigg Required Blocks**: `journal_prompt` + `bird_oracle` enforced via validation + auto-rewrite

### UX Polish
- **Parliament Crow Avatar**: User profile now shows crow image
- **Spell Watermark**: Crow watermark at bottom of spell pages
- **Save Ward**: Button to save Cathleen's suggested wards to grimoire

### Testing
- **22 tests passing** in `/app/tests/test_spell_differentiation.py`
- Cache/seed regression tests
- Cross-contamination tests
- Taboo keyword enforcement tests

## Known Issues / Deferred

| Issue | Priority | Notes |
|-------|----------|-------|
| Theresa backend missing | P2 | Frontend has her, backend doesn't |
| Pipeline timeout (70-100s) | P1 | Cap at 2 LLM calls for non-debug |
| TOO_FEW_SOURCES warnings | P2 | Make warning-only, don't block |
| 47 old spells need images | P3 | Using fallback tarot plate |

## Files Changed

### Backend
- `/app/backend/prompts/planner_blocks.py` - micro_lore, taboos, tarot composition selection
- `/app/backend/prompts/writer_blocks.py` - micro_lore injection, taboos, guide-specific block requirements
- `/app/backend/prompts/pipeline_blocks.py` - JSON repair, fallback spell
- `/app/backend/prompts/qa_blocks.py` - taboo keyword validator
- `/app/backend/server.py` - enhanced Surprise Me routing with keyword matching

### Frontend
- `/app/frontend/src/assets/brandAssets.js` - NEW: Crow avatar + watermark URLs
- `/app/frontend/src/components/GrimoirePage.js` - Crow watermark, Save Ward button
- `/app/frontend/src/pages/Profile.js` - Crow avatar

### Tests
- `/app/tests/test_spell_differentiation.py` - NEW: 22 tests for differentiation system

## Test Credentials
- **Pro User**: `sub_test@test.com` / `test123`
- **Free User**: `free_test@test.com` / `test123`
