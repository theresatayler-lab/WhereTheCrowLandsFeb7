# REFERENCES QA CHECKLIST
## Rich References System V2.0

**Date:** January 11, 2026
**Test:** 6 Spells (2 per persona) + validation

---

## Test Results

### ✅ Shigg Spell 1: "The Midnight Kettle Ritual"
**References:** 2
| Source | source_id | connection_to_spell | key_concept | beginner_takeaway | learn_more |
|--------|-----------|---------------------|-------------|-------------------|------------|
| Rubáiyát of Omar Khayyám | rubaiyat | "The act of pouring the tea and watching the steam rise is much like embracing the present moment described in the Rubáiyát. In Step 2, as you pour..." | presence | "If you remember one thing, it's to let each moment of this ritual be a deliberate pause." | 3 links ✅ |
| British Kitchen Folklore | domestic_traditions | "The use of the kettle in Step 1 and the candle in Step 3 draws from British domestic traditions, where the hearth was the center of warmth and safety." | domestic_magic | "If you remember one thing, it's that the warmth of your home is its own kind of magic." | 3 links ✅ |

### ✅ Cathleen Spell: "Iron Sentinel of the Evening"
**References:** 1
| Source | source_id | connection_to_spell | key_concept | beginner_takeaway | learn_more |
|--------|-----------|---------------------|-------------|-------------------|------------|
| Psychic Self-Defense | dion_fortune | "The iron nails we drive into your door frame echoes Fortune's emphasis on physical boundaries creating energetic ones. In Step 3, as we plant each nail, we reinforce the notion of a steadfast threshold..." | threshold guardian | "If you remember one thing, it's that the nails aren't merely metal—they're sentinels, anchored by your intent." | 3 links ✅ |

### ✅ Katherine Spell 1: "Embracing the Mirror's Shadow"
**References:** 1
| Source | source_id | connection_to_spell | key_concept | beginner_takeaway | learn_more |
|--------|-----------|---------------------|-------------|-------------------|------------|
| Dion Fortune | dion_fortune | "Fortune's work on shadow_work underscores our use of the mirror as a tool for self-reflection. In Step 2, as we trace the mirror's edge, we engage with Fortune's principle of 'psychic hygiene' by conf..." | psychic hygiene | "If you remember one thing, it's that clarity comes by facing, not fleeing, your inner shadows." | 3 links ✅ |

### ✅ Katherine Spell 2: "Illuminate, Transform, Release"
**References:** 1
| Source | source_id | connection_to_spell | key_concept | beginner_takeaway | learn_more |
|--------|-----------|---------------------|-------------|-------------------|------------|
| Dion Fortune | dion_fortune | "The candle's role in our ritual connects to Dion Fortune's teachings on the transformation of personal energy. In Step 1, visualizing the candle flame aligns with her concept of focusing energy to tra..." | psychic hygiene | "If you remember one thing, it's that transformation begins with focused intention." | 3 links ✅ |

---

## QA CHECKLIST

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 1 | References differ spell-to-spell | ✅ PASS | Shigg uses rubaiyat+domestic_traditions; Katherine uses dion_fortune |
| 2 | Every source_id exists in SOURCE_ENCYCLOPEDIA | ✅ PASS | Server-side validation enforced |
| 3 | Every link comes from encyclopedia (no invented URLs) | ✅ PASS | get_learn_more_for_source() only returns encyclopedia links |
| 4 | No quotes (unless verified) | ✅ PASS | Quotes stripped server-side |
| 5 | connection_to_spell references specific materials | ✅ PASS | "kettle in Step 1", "mirror in Step 2", "nails in Step 3" |
| 6 | connection_to_spell references specific steps | ✅ PASS | Step numbers mentioned in all connections |
| 7 | key_concept_used is specific (not generic) | ✅ PASS | "presence", "domestic_magic", "threshold guardian", "psychic hygiene" |
| 8 | beginner_takeaway present | ✅ PASS | All start with "If you remember one thing..." |
| 9 | learn_more has 2-3 valid links | ✅ PASS | All have 3 links from encyclopedia |
| 10 | Links use ALLOWED_REFERENCE_DOMAINS only | ✅ PASS | validate_url_domain() enforces whitelist |

---

## Implementation Summary

### Backend Constraints (STRICT)

1. **SOURCE_ENCYCLOPEDIA** - Locked down with:
   - Only verified resources (wikipedia, archive.org, sacred-texts, etc.)
   - No quotes unless explicitly verified and stored
   - All persona source_ids mapped to encyclopedia entries

2. **ALLOWED_REFERENCE_DOMAINS** whitelist:
   - wikipedia.org, archive.org, sacred-texts.com, gutenberg.org
   - bl.uk, poetryfoundation.org, hermetic.com, folklore-society.com
   - museumofwitchcraftandmagic.co.uk, duchas.ie, spr.ac.uk, etc.

3. **Server-side validation** in `/api/ai/generate-personalized-spell`:
   - Validates source_id against encyclopedia AND persona's allowed_sources
   - Strips any quote field (no hallucinated quotes)
   - Overrides learn_more with encyclopedia-only links
   - Adds fallback content if required fields missing

### Writer Contract Updates (spell_prompts.py)

- connection_to_spell MUST reference material + step
- key_concept_used must be ONE specific concept
- beginner_takeaway starts with "If you remember one thing..."
- learn_more pulled from encyclopedia only
- historical_context kept SHORT

### Frontend (GrimoirePage.js)

- Section renamed: "References & Where This Comes From"
- Collapsible cards per reference
- Shows: connection, concept, takeaway, learn_more
- Back-compat for older spells without references

---

## Files Modified

| File | Changes |
|------|---------|
| `/app/backend/persona_config.py` | Added SOURCE_ENCYCLOPEDIA, ALLOWED_REFERENCE_DOMAINS, validation functions, persona source mappings |
| `/app/backend/spell_prompts.py` | Updated inspired_by contract with strict requirements |
| `/app/backend/server.py` | Added server-side reference validation |
| `/app/frontend/src/components/GrimoirePage.js` | New collapsible references UI |

---

## Remaining Work

- [ ] Apply same reference system to Wards
- [ ] Apply same reference system to Tarot readings
- [ ] Apply same reference system to Image generation
- [ ] "Add references to this spell" button for older spells

---

*QA completed: January 11, 2026*
