# INVISIBLE HELPERS — MAGICAL BATTLE CRY INTENTION
## Full Briefing Document for LLM Chat Sessions

**Feature:** Invisible Helpers Portal
**Page Route:** `/invisible-helpers`
**Status:** Fully functional
**Last Updated:** March 2026

---

## 1. WHAT THIS FEATURE IS

The **Invisible Helpers** portal is a standalone page where users generate personalized **"Magical Battle Cry Intention"** workings — structured, ethical, nonviolent protective rituals. The concept is directly inspired by **Dion Fortune's wartime group meditation practices** from WWII-era Britain, where occultists performed coordinated inner work to support the war effort through visualization and collective will.

### Core Framing
- Magic as psychological/narrative tool — not supernatural claims
- **"Return to law"** — misused power returns to impersonal law, never to harm individuals
- **Transmutation** — returned force becomes awareness, restraint, conscience (never suffering)
- Every working pairs inner ritual with a **real-world action pledge**
- This is NOT a curse. It names no enemies. It harms no one.

### Who Uses It
Modern witches, secular ritualists, activist-minded practitioners who want ethical protective workings paired with material-world action commitments.

---

## 2. USER FLOW (3 Steps)

### Step 1: Form
User fills out a structured form with these fields:

| Field | Type | Options |
|-------|------|---------|
| **Personal Intention** | Textarea (optional) | Free text — what they want to protect/strengthen |
| **Beneficiaries** | Multi-select chips | Community/neighbors, Vulnerable people, Journalists/truth-tellers, Legal advocates, Families/children, Mutual aid networks |
| **Primary Quality** | Single-select | Clarity, Restraint, Courage, Protection, Conscience, Truth |
| **Practice Style** | Single-select | Quiet/secular, Prayerful/devotional, Folk/hearth magic, Ceremonial/formal |
| **Time Horizon** | Single-select | Today, This week, This moon cycle, Ongoing practice |

### Step 2: Email Capture (Lead Gen)
- Name (required)
- Email (required)
- Auto-generated action pledge: *"I commit to channeling this intention toward benevolent outcomes and peace."*

### Step 3: Result Display
- Talisman-framed output with gold borders and ornate corner marks
- Full working displayed with all sections (see Output Schema below)
- Action buttons: **Create Another**, **Copy**, **Download PDF**
- A background video (`/videos/silent-army-spells.mp4`) plays during generation

**Limit:** 3 free generations per email address.

---

## 3. AI GENERATION PIPELINE

### Model
- **Primary:** Claude Sonnet 4 (`claude-sonnet-4-20250514`) via Emergent routing
- **Fallback:** GPT-4o if Claude unavailable
- **Temperature:** 0.7 (initial), 0.2 (repair attempts)
- **Max tokens:** 1800
- **Purpose key:** `invisible_helpers_writer`

### Generation Flow
```
User submits form
  ↓
Input sanitization (prompt injection stripping, entity obfuscation)
  ↓
Banned terms check (strict phrases + absolute terms)
  ↓
User prompt constructed with variation seed (random number for distinctness)
  ↓
Claude generates JSON via system prompt
  ↓
JSON parsed → Schema validated
  ├── Pass → Return working, increment count
  └── Fail → Repair attempt (1 max, lower temp 0.2)
       ├── Pass → Return repaired working
       └── Fail → Return safe fallback (pre-written canonical working)
```

### Silent Interpretation (Hidden from Output)
The AI silently selects ONE archetype and ONE symbol set based on user inputs:

**10 Archetypes:**
1. Shield of Quiet — overwhelm/anxiety
2. Threshold Ward — intrusion/boundaries
3. Lamp of Clear Sight — confusion/manipulation fog
4. Steady Heart — fear/conflict
5. Home Tempering — household safety/calm
6. Community Lantern — collective care/morale
7. Grief Lantern — loss, mourning, tenderness
8. Nervous System Shelter — panic/insomnia
9. Truth-Speaking Spine — advocacy, boundary + calm courage
10. Workplace Boundary — meetings/inbox/overreach

**Symbol Sets:** lamp, threshold, cloak, mirror, stone, water, braid

**Time Horizon Affects Cadence:**
- **Today:** Immediate grounding, short, direct
- **This week:** Repeatable daily rhythm, small daily action
- **This moon cycle:** Layered practice + weekly renewal note
- **Ongoing:** Sustained practice structure

---

## 4. OUTPUT SCHEMA (JSON)

Every generated working MUST match this exact structure:

```json
{
  "title": "Magical Battle Cry Intention",
  "before_you_begin": "Brief optional setup — posture, candle, small object. Non-dramatic.",
  "intention": "1-2 line personalized intention using the user's primary quality",
  "anchor_phrase": "Clarity in the mind.\nRestraint in the hand.\nProtection in the world.\nWhat is misused returns to law — transmuted, not weaponized.",
  "ethical_frame": "This working is not a curse. It names no enemies and harms no one. It returns only misused authorization, coercive momentum, and distortion to impersonal law, to be transmuted into restraint, conscience, and accountability.",
  "guided_working": [
    {
      "step": 1,
      "title": "Ground + Seal",
      "duration": "1 min",
      "instructions": "1-3 sentences. No-blowback protection.",
      "spoken_words": "String or null"
    },
    {
      "step": 2,
      "title": "Call the Lamp of Clarity",
      "duration": "1 min",
      "instructions": "Discernment visualization.",
      "spoken_words": "String or null"
    },
    {
      "step": 3,
      "title": "Name the Patterns",
      "duration": "1-2 min",
      "instructions": "Name patterns (coercion, dehumanization, distortion) — NOT people.",
      "spoken_words": "String or null"
    },
    {
      "step": 4,
      "title": "Return to Law",
      "duration": "2 min",
      "instructions": "Impersonal law receives misused force.",
      "spoken_words": "String or null"
    },
    {
      "step": 5,
      "title": "Transmutation Clause",
      "duration": "1-2 min",
      "instructions": "Force becomes awareness/restraint, not suffering.",
      "spoken_words": "String or null"
    },
    {
      "step": 6,
      "title": "Benevolent Directive + Close",
      "duration": "1-2 min",
      "instructions": "Protection for beneficiaries, circuit closed.",
      "spoken_words": "String or null"
    }
  ],
  "action_pledge": "Today, I will: [user's action] — to support justice in the material world.",
  "after_the_spell": "Brief grounding suggestion. Non-dramatic.",
  "closing_truth": "2-3 sentence EXPLANATORY paragraph (see Closing Truth section below)"
}
```

### Validation Rules
- All required keys must be present: title, intention, anchor_phrase, ethical_frame, guided_working, action_pledge, closing_truth
- `guided_working` must contain 5-7 step objects (target: exactly 6)
- Each step requires: step number, title, duration, instructions
- `spoken_words` is optional — string or null
- `before_you_begin` and `after_the_spell` are optional but recommended

---

## 5. CLOSING TRUTH FIELD (Special Instructions)

The `closing_truth` must be a **2-3 sentence EXPLANATORY paragraph** (not ritual language) that:
1. Briefly explains how the spell was assembled from the user's inputs, needs, and time horizon
2. Notes inspiration from Dion Fortune's "Invisible Helpers" and Psychic Self-Defence concepts
3. Clarifies that "helpers" are understood as principles, qualities, or orientations — not literal entities

**Rotate among 4 explanation styles** (vary naturally, don't label):
- **Construction-focused:** How the spell was assembled from inputs + timing, then Fortune's defensive logic
- **Lineage-focused:** Lead with Fortune/Invisible Helpers inspiration, then clarify modern adaptation
- **Interpretive-focused:** Explain that the system interpreted inputs and selected structure/symbols accordingly
- **Ethical-focused:** Emphasize ethical intent and non-harm first, then reference Fortune

**Use phrases like:** "inspired by", "draws from", "echoes the defensive logic of", "informed by"
**Avoid:** Claims of historical authenticity, mystical authority, or channeling

---

## 6. SAFETY & CONTENT MODERATION

### Hard Safety Rules (Non-Negotiable)
- No harm, revenge, domination, coercion, binding, obsession, or targeting any person/group/institution
- Do not name enemies. Avoid adversarial "they/them" framing
- No "return to sender", "send it back", "blowback", "backfire", or harm-returning framing
- Consequence/accountability = restraint, clarity, conscience, de-escalation — **never suffering**

### Banned Terms (Strict Phrase Matching)
**Direct harm:** kill them, hurt them, punish them, ruin them, destroy them, curse them, hex them, bind them, death to, make them suffer, cause them pain, torture them, revenge on, attack them, strike them, smite them, damn them, condemn them, annihilate them, obliterate them, crush them

**Curse/hex intent:** put a curse on, cast a curse, place a curse, i want to curse, i will curse, put a hex on, cast a hex, place a hex, i want to hex, i will hex

**Coercion/control:** make them love, make them obey, control them, force them, bind them to me, obsess over me, dominate them, enslave them, compel them, coerce them

### Banned Terms (Absolute — Word-Boundary Matched)
hex, kill, murder, assassinate, maim, torture

### Soft Replacements (Entity Obfuscation)
User input naming specific entities gets silently replaced:

| User Input | Replaced With |
|-----------|---------------|
| ice | coercive enforcement systems |
| police | enforcement authority |
| military | state force |
| trump | misused executive authority |
| biden | political leadership |
| government | governing systems |
| regime | authoritarian structures |
| dictator | autocratic power |
| fascist | authoritarian ideology |
| nazi | dehumanizing ideology |
| republican | political forces |
| democrat | political forces |
| congress | legislative power |
| supreme court | judicial authority |
| fbi | investigative authority |
| cia | intelligence authority |
| dhs | security apparatus |
| cbp | border enforcement |

---

## 7. TONE & VOICE

- **Calm, disciplined, reverent.** "Quiet chapel" — not sensational.
- Grounded, steady, protective. Not paranoid, not dramatic.
- Simple, vivid imagery in the Crowlands tone: lamp, threshold, cloak, mirror, circle, stone, water, braid, wind
- Concise language — no essays
- The `before_you_begin` and `after_the_spell` sections must be: optional, non-dramatic, non-theatrical, aligned with Dion Fortune's wartime discipline (simple, repeatable, ethically contained)
- No complex props or ritual tools

### Guide Association
- This portal is aligned with **Brenda (Chronicler)** — warm, nostalgic, family-protection energy
- Brenda's atmospheric images appear in the background
- However, the generated working itself uses a **unified protective voice** (not Brenda's personal voice)

---

## 8. CANONICAL ANCHOR TEXT (Never Change)

**Anchor Phrase:**
> Clarity in the mind.
> Restraint in the hand.
> Protection in the world.
> What is misused returns to law — transmuted, not weaponized.

**Ethical Frame:**
> This working is not a curse. It names no enemies and harms no one. It returns only misused authorization, coercive momentum, and distortion to impersonal law, to be transmuted into restraint, conscience, and accountability.

**Closing Truth (default):**
> Inner work does not replace resistance. It steadies those who resist.

---

## 9. API ENDPOINTS

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/invisible-helpers/capture-and-generate` | Main endpoint — captures lead + generates working |
| POST | `/api/invisible-helpers/battle-cry/generate` | Direct generation (internal) |
| GET | `/api/invisible-helpers/check-limit` | Check remaining free generations by email |
| POST | `/api/invisible-helpers/join` | Legacy waitlist signup (deprecated) |
| GET | `/api/admin/leads` | Admin: retrieve leads (requires admin_key) |
| GET | `/api/admin/leads/export` | Admin: export leads as CSV |

---

## 10. DATABASE COLLECTIONS (MongoDB)

### `invisible_helpers` — Generation Tracking
```json
{
  "email": "user@example.com",
  "generation_count": 2,
  "last_generated_at": "2026-03-11T...",
  "source": "invisible-helpers"
}
```

### `invisible_helpers_leads` — Lead Capture
```json
{
  "email": "user@example.com",
  "name": "Jane",
  "personal_intention": "Protection for my family...",
  "beneficiaries": ["families", "community"],
  "primary_quality": "protection",
  "practice_style": "folk",
  "time_horizon": "week",
  "source": "invisible_helpers",
  "created_at": "2026-03-11T...",
  "updated_at": "2026-03-11T...",
  "generation_count": 2,
  "generations": [
    {"timestamp": "...", "intention": "..."}
  ],
  "email_sent": false
}
```

---

## 11. SAFE FALLBACK WORKING

If AI generation fails completely, this pre-written canonical working is returned:

**Title:** Magical Battle Cry Intention
**Intention:** "I seek clarity, protection, and the steady resolve to act with conscience."

**6 Steps:**
1. **Ground + Seal** (1 min) — Feet on floor, protective boundary visualization
2. **Call the Lamp of Clarity** (1 min) — Calm, steady lamp reveals truth without burning
3. **Name the Patterns** (1-2 min) — Acknowledge coercion, dehumanization, distortion (no individuals)
4. **Return to Law** (2 min) — Misused force flows back to source via impersonal law
5. **Transmutation Clause** (1-2 min) — Returned force transforms into awareness and restraint
6. **Benevolent Directive + Close** (1-2 min) — Send protection, close circuit

**Closing:** "Inner work does not replace resistance. It steadies those who resist."

---

## 12. KEY FILES

| File | Lines | Purpose |
|------|-------|---------|
| `frontend/src/pages/InvisibleHelpers.js` | 1-1017 | Full UI — form, email capture, result display, PDF export |
| `backend/server.py` | 846-894 | Banned terms, soft replacements, content filters |
| `backend/server.py` | 1185-1330 | System prompts (both GPT and Claude versions) |
| `backend/server.py` | 1332-1343 | Check generation limit endpoint |
| `backend/server.py` | 1995-2160+ | Battle cry generation function + validation + repair + fallback |
| `backend/server.py` | 1900-1992 | Admin leads endpoints (retrieve + CSV export) |
| `backend/llm_providers.py` | — | LLM abstraction layer, `invisible_helpers_writer` config |

---

## 13. DESIGN & UI

- **Visual system:** Crowlands design (navy/cream/gold/crimson)
- **Font:** TC Phantasmagoria for accent text
- **Layout:** Talisman-framed output with ElaborateCorner, BorderFrame, CornerFlourish components
- **Atmospheric images:** Brenda (Chronicler) and family photos fade into background
- **Loading state:** Silent Army spell video plays during generation
- **Icons:** Pentagram, protective circle sigil in hero header
- **Components used:** DarkSection, LightSection, GrandDivider, LightOrnateCard from OrnateElements.js
