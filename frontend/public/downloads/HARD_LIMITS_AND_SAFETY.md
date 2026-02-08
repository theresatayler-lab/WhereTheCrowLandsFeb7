# WHERE THE CROWLANDS - Hard Limits, Safety & Validation System
## Copy-Paste Reference Document

> **Source files:** `backend/prompts/hard_limits.py`, `backend/prompts/belief_modes.py`, `backend/prompts/qa_blocks.py`

---

## HARD LIMITS (Universal Constraints)

These rules apply to ALL personas and ALL spell outputs. No exceptions.

### Forbidden Content Categories
| Category | Description |
|----------|-------------|
| coercion_magic | Magic targeting someone without consent |
| harm_curses | Curses, hexes intended to harm |
| medical_claims | Diagnoses, treatment promises |
| certainty_claims | "This WILL work" guarantees |
| malevolent_entities | Contact with demons, harmful spirits |
| controlling_others | Magic to control another's will |
| death_magic | Rituals invoking death |
| blood_magic | Requires blood (beyond symbolic pricks) |
| binding_without_consent | Binding another person |

### Forbidden Phrases
These must NEVER appear in spell output:
```
"this will definitely"
"guaranteed to"
"you must do exactly"
"without this step it won't work"
"the spirits demand"
"you have no choice"
"align your vibration"
"raise your frequency"
"manifest your destiny"
"the universe will provide"
```

### Coercion Indicators
Auto-detected and flagged:
```
"make them"
"force them"
"without their knowledge"
"control their"
"bind them to"
"against their will"
```

### Required Safety Substitutions
| Material | Safe Alternative |
|----------|-----------------|
| Candle | LED candle or visualization of flame |
| Incense | Essential oil diffuser or visualization of smoke rising |
| Knife | Butter knife, wooden letter opener, or finger tracing |
| Athame | Blunt ritual knife, wand, or pointed crystal |
| Fire | LED candle, red cloth, or visualization |
| Blood | Red ink, pomegranate juice, or red thread |
| Sharp needle | Blunt tapestry needle or toothpick |
| Alcohol | Grape juice or water blessed with intention |

### Required Safety Notes by Context
| Context | Required Element |
|---------|-----------------|
| Open flames | Always offer LED candle alternative |
| Smoke/incense | Always offer essential oil or visualization alternative |
| Sharp objects | Always offer blunt alternatives |
| Ingestion | External use only, never ingest |
| Trance states | Always include grounding instructions |
| Spirit contact | Always include protection and closing |

---

## VALIDATION RULES (Spell Structure)

| Rule | Min | Max |
|------|-----|-----|
| Steps per spell | 3 | 7 |
| Materials per spell | 2 | 7 |
| Sources cited | 2 | 5 |
| Why per step | Required | — |
| Substitutions | Required | — |

### Required Elements Per Spell
Every spell must include:
1. `clear_intent` — What the working achieves
2. `safety_note` — Safety considerations
3. `closing_ritual` — Proper closing/grounding
4. `ethics_statement` — Ethical boundary statement (30+ chars)

### Additional Requirements by Type
**Spirit work spells:**
- protection_opening
- discernment_clause
- closing_dismissal

**Shadow work spells:**
- grounding_before
- grounding_after
- emotional_safety_note

---

## BELIEF MODES

Three modes control framing language based on the seeker's worldview.

### SECULAR / Psychological

**Frame:** All practices as psychological exercises, habit-setting, or mindfulness techniques.

**Allowed claims:** psychological, historical, anthropological, symbolic

**Forbidden claims:** magical_efficacy, spirit_contact, energy_work

**Use phrases like:**
- "this creates a mental anchor"
- "ritual acts as psychological container"
- "the symbolic action helps focus intention"
- "this practice has been shown to reduce anxiety through..."
- "the repetitive action activates the parasympathetic nervous system"

**DO NOT use:**
- "the energy will..."
- "spirits/entities..."
- "magical power..."
- "the universe will..."

**Forbidden phrases in output:**
```
"the energy will"
"spirits will"
"magical power"
"the universe will provide"
"manifest destiny"
"raise your vibration"
```

---

### SPIRITUAL / Open

**Frame:** Balance grounded practice with openness to mystery.

**Allowed claims:** symbolic, energetic, traditional, experiential

**Forbidden claims:** guaranteed_outcomes, dramatic_supernatural

**Use phrases like:**
- "this practice helps align your intention with..."
- "the symbolic correspondence between X and Y..."
- "many practitioners find that..."
- "the tradition holds that..."
- "working with the energy of..."

**AVOID:**
- "this will summon..."
- "the spirits will definitely..."
- "guaranteed magical results..."

**Forbidden phrases in output:**
```
"this will definitely summon"
"guaranteed magical"
"the spirits demand"
```

---

### PRACTITIONER / Experienced

**Frame:** Speak directly about magic, energy work, and subtle realms.

**Allowed claims:** magical, energetic, spirit_contact, advanced_practice

**Forbidden claims:** harm, coercion, certainty, medical

**Use phrases like:**
- "the working..."
- "raising energy..."
- "the correspondence between..."
- "ancestral guidance..."
- "the liminal space..."

**Still NEVER claim:**
- Certainty about outcomes
- Ability to harm or coerce
- Medical benefits
- Contact with malevolent entities

**Forbidden phrases in output:**
```
"this will definitely"
"guaranteed to harm"
"you have no choice"
```

---

### Claim Adaptation Function

When adapting Archivist facts for different belief modes:

**SECULAR prefix options:**
- "From a symbolic perspective, "
- "Historically, practitioners believed "
- "The psychological function of this is "
- "As a meditative focus, "

**SPIRITUAL adaptation:**
- Replace "will" with "may"
- Speculative claims: prefix with "Some traditions suggest that "

**PRACTITIONER:**
- Direct language allowed; no softening needed

---

## QA VALIDATION SYSTEM (Stage 4)

### Full Check List

| # | Check | Severity | Trigger |
|---|-------|----------|---------|
| 1 | Required blocks exist | CRITICAL | Missing cold_open, choice, lore_vignette, stepper, or closing |
| 2 | Choice block valid | CRITICAL | < 2 options or missing prompt |
| 3 | Lore vignette meets requirements | CRITICAL | < 100 chars narrative or missing canon_anchor_id |
| 4 | Persona lock valid | CRITICAL | < 2 props, missing sensory_cue or signature_move |
| 5 | Template match | HIGH | Missing guide-specific required blocks |
| 6 | Stepper whys present | HIGH | Steps missing 'why' (20+ chars) |
| 7 | Canon anchor present | HIGH/MEDIUM | Missing anchor ID or relevance |
| 8 | Hard limits | CRITICAL/HIGH | Forbidden phrases, coercion detected |
| 9 | Belief mode compliance | HIGH | Mode-specific forbidden phrases |
| 10 | Guide voice compliance | HIGH | Guide's "never_says" phrases detected |
| 11 | Taboo keywords | HIGH | Guide-specific taboo terms detected |

### Verdict Logic
```
CRITICAL violations > 0        → REWRITE_REQUIRED
HIGH violations >= 2           → REWRITE_REQUIRED
Otherwise                      → APPROVED
```

### Guide-Specific Validations

**Shigg:** Must include `journal_prompt` AND `bird_oracle` blocks
**Cathleen:** Must include `song_prompt` AND `ward` blocks
**Katherine:** Must include `safety_note` AND `reflection` blocks
**Theresa:** Must include `evidence_card`, `bird_oracle`, AND `journal_prompt` blocks

### Micro-Lore Validation
- Must use at least 2 micro-lore details
- Checked via `micro_lore_used` array in output

### Rewrite Process
1. QA identifies violations and builds fix instructions
2. Writer is called again with original prompt + fix instructions appended
3. QA re-validates the rewrite
4. Maximum 1 retry; if still fails, fallback spell returned

---

## TABOO KEYWORD ENFORCEMENT

### How It Works
1. All text is extracted from the spell output (recursively, all nested fields)
2. Text is checked against guide-specific keyword map
3. Any match → HIGH severity violation
4. Multiple violations trigger REWRITE_REQUIRED

### Shigg Taboo Themes
- Modern crystal shop language
- Neon cyber occult aesthetics
- New age manifestation talk
- Instagram witch aesthetic
- Generic spirituality clichés

### Cathleen Taboo Themes
- Kitchen-witch domestic aesthetics
- Teacups and cozy domesticity
- New age love-and-light bypassing
- Tailoring and sewing imagery

### Katherine Taboo Themes
- Cozy domestic teacup imagery
- Warm kitchen aesthetics
- Bird oracle work
- Vague intuition-based practice
- Devotional hymn styling

---

*Generated from backend/prompts/hard_limits.py, belief_modes.py, qa_blocks.py*
