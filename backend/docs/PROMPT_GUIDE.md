# Quick Reference: Providing Prompts & JSONs to Emergent
# Use this format when requesting new features or changes

---

## FORMAT FOR NEW FEATURE REQUESTS

When you have an idea for a new feature, provide this information:

```
FEATURE: [Name of feature]
PURPOSE: [What problem does it solve?]
TIER: [Quick/Standard/Deep - or "auto" for system to decide]
PERSONA: [Which guide(s) if applicable]

INPUT DATA:
- What the user provides (intention, materials, etc.)

OUTPUT DATA:
- What we return to the user

RESEARCH NEEDS (DeepSeek):
- What facts need to be looked up?
- What sources should be cited?

CREATIVE NEEDS (Claude):
- What narrative/prose is needed?
- What voice/tone?

EXAMPLE:
[Show a real example of input → output]
```

---

## FORMAT FOR BUG REPORTS

```
BUG: [Short description]
EXPECTED: [What should happen]
ACTUAL: [What happens instead]
STEPS TO REPRODUCE:
1. ...
2. ...
AFFECTED COMPONENT: [Frontend/Backend/AI Pipeline]
```

---

## FORMAT FOR PROMPT IMPROVEMENTS

```
PROMPT TO IMPROVE: [DeepSeek Research / Claude Storytelling / Spell Writer]
CURRENT ISSUE: [What's wrong with current output?]
DESIRED OUTPUT: [What should it produce instead?]
EXAMPLE BAD OUTPUT: [Paste actual output]
EXAMPLE GOOD OUTPUT: [What you want to see]
```

---

## EXAMPLE: NEW SPELL BLOCK TYPE

```
FEATURE: Ancestral Memory Block
PURPOSE: Help users connect with family history in spells
TIER: Deep (requires research)
PERSONA: Theresa, Katherine

INPUT DATA:
- Family details user has shared
- Ancestral intention (honor, heal, connect)

OUTPUT DATA:
{
  "block_type": "ancestral_memory",
  "content": {
    "lineage_prompt": "What do you know of your grandmother's hands?",
    "memory_seed": "A phrase or image to carry through the working",
    "offering_suggestion": "What Theresa's family would have left",
    "timeline_connection": "Link to relevant historical event"
  }
}

RESEARCH NEEDS (DeepSeek):
- Historical ancestor veneration practices by region
- Safe/ethical boundaries for ancestral work
- Timeline events related to spiritualism/ancestor contact

CREATIVE NEEDS (Claude):
- Theresa's voice asking about family memories
- Poetic framing of ancestor connection
- Sensitive handling of grief/loss

EXAMPLE:
User: "I want to honor my Irish grandmother who passed last year"
Output: Block with Irish wake traditions, memory prompts, offering suggestions
```

---

## EXAMPLE: TIMELINE ENHANCEMENT REQUEST

```
FEATURE: Enhance all Spiritualism events
PURPOSE: Add richer sources and narrative to Victorian spiritualism timeline

BATCH CRITERIA:
- Events with taxonomy_category = 4 (Spiritualism)
- Year range: 1848-1920

DEEPSEEK RESEARCH GOALS:
- SPR (Society for Psychical Research) documentation
- Named mediums and their techniques
- Skeptical investigations and results
- Physical locations (addresses, venues)

CLAUDE NARRATIVE GOALS:
- Atmospheric Victorian prose
- Connect to Katherine's world
- Highlight the drama of investigations
- Make readers want to explore more

EXPECTED RESULTS:
- 20+ events enhanced
- Each with 3-5 sources
- Factual + narrative descriptions
- Guide relevance scores
```

---

## STANDARD JSON TEMPLATES

### For Spell Features:
```json
{
  "feature_name": "string",
  "block_type": "string",
  "applicable_guides": ["shigg", "cathleen", "katherine", "theresa"],
  "tier_requirement": "quick|standard|deep",
  "input_schema": {},
  "output_schema": {},
  "research_requirements": [],
  "narrative_requirements": []
}
```

### For Timeline Additions:
```json
{
  "event_id": "string",
  "title": "string",
  "year": 1888,
  "category_ids": [1, 6],
  "traditions": [],
  "initial_description": "string",
  "known_sources": [],
  "research_priority": "high|medium|low"
}
```

### For Guide Voice Updates:
```json
{
  "guide_id": "string",
  "update_type": "phrase_add|phrase_remove|tone_adjust|tradition_add",
  "current_state": "string",
  "desired_state": "string",
  "example_usage": "string"
}
```

---

## TIPS FOR BEST RESULTS

1. **Be specific** - "Make it better" doesn't help. "Add more hedging language for unverified folklore claims" does.

2. **Provide examples** - Show what you want, not just describe it.

3. **Specify the tier** - Quick features need different treatment than Deep features.

4. **Consider all guides** - Does this apply to all 4, or specific ones?

5. **Think about sources** - What would DeepSeek need to research?

6. **Think about voice** - How would Claude phrase this in each guide's voice?

---

## COPY-PASTE TEMPLATE

```
FEATURE: 
PURPOSE: 
TIER: 
PERSONA: 

INPUT:


OUTPUT:


RESEARCH (DeepSeek):


NARRATIVE (Claude):


EXAMPLE:

```
