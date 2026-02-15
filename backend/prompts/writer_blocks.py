# Writer V2 - Blocks-Based Spell Writing
# Outputs blocks[] array with typed content

import json
from typing import Dict, Any

from .writer import WRITER_CONTRACTS  # Reuse voice contracts


def build_writer_prompt_blocks(
    spell_spec: dict,
    guide_config: dict,
    research_packet: dict,
    plan: dict,
    belief_mode: str = "SPIRITUAL"
) -> str:
    """
    Stage 3: Writer Prompt (Blocks Version)
    Outputs blocks[] array with full content for each block.
    """
    
    guide_id = spell_spec.get("persona_id", "shigg")
    contract = WRITER_CONTRACTS.get(guide_id, WRITER_CONTRACTS["shigg"])
    
    # Build facts for Writer
    facts_for_writer = ""
    for i, fact in enumerate(research_packet.get("facts", [])[:6]):
        hedge = " (use hedging language)" if fact.get("hedging_required") else ""
        facts_for_writer += f"{i+1}. [{fact.get('claim_type')}]{hedge}: {fact.get('claim')}\n"
        if fact.get("why_it_works"):
            facts_for_writer += f"   WHY: {fact.get('why_it_works')}\n"
    
    # Build sources list
    sources_text = ""
    for src in research_packet.get("sources", [])[:4]:
        sources_text += f"- [{src.get('source_id')}] {src.get('author')}: \"{src.get('work')}\" ({src.get('year', 'n.d.')})\n"
    
    # Get canon anchor from plan
    canon_anchor = plan.get("canon_anchor", {})
    
    # Get block sequence from plan
    block_sequence = plan.get("block_sequence", [])
    block_sequence_json = json.dumps(block_sequence, indent=2)
    
    # === V1.2: Get micro_lore, text_tokens, and taboos from plan ===
    micro_lore_selected = plan.get("micro_lore_selected", [])
    text_tokens = plan.get("text_tokens", {})
    taboos = plan.get("taboos", [])
    
    # Get belief framing
    belief_framing = _get_belief_framing_blocks(belief_mode)
    
    # Time guidance
    time_guidance = _get_time_guidance_blocks(spell_spec.get("time", "10_min"))
    
    prompt = f"""## SPELL WRITER - BLOCKS VERSION

You ARE {contract['name']}, {contract['title']}.

## YOUR VOICE CONTRACT
Role: {contract['voice']['role']}
Tone: {', '.join(contract['voice']['tone'])}
Sentence style: {contract['voice']['sentence_style']}

Signature phrases (use 2-3 naturally):
{chr(10).join('- "' + p + '"' for p in contract['voice']['signature_phrases'])}

Address style: {contract['voice']['address_style']}

NEVER say:
{chr(10).join('- ' + p for p in contract['voice']['never_says'])}

## FORBIDDEN THEMES/IMAGERY (TABOOS)
Do NOT include any of these themes or visual motifs - they are wrong for this guide:
{chr(10).join('- ' + t for t in taboos) if taboos else '- (none specified)'}
If the seeker explicitly asks for something taboo, gently reframe to an allowed analogue.

## MICRO-LORE DETAILS (MUST INCLUDE)
You MUST weave at least TWO of these lived details into your spell (in cold_open or lore_vignette):
{chr(10).join('- "' + ml + '"' for ml in micro_lore_selected) if micro_lore_selected else '- (none specified)'}
These are authentic details that make your voice unique. Include them naturally, not forced.

## TEXT VARIATION TOKENS (USE THESE)
Incorporate these specific details to make this spell unique:
- Setting: {text_tokens.get('setting_detail', 'quiet corner')}
- Sensory: {text_tokens.get('sensory_detail', 'warmth')}
- Gesture: {text_tokens.get('gesture_detail', 'gentle motion')}

## SEEKER CONTEXT
Name: {spell_spec.get('user_name', 'Seeker')}
Query: "{spell_spec.get('user_query', '')}"
Feeling sought: {spell_spec.get('desired_feeling', 'calm')}
Setting: {spell_spec.get('setting', 'home_quiet')}
Anchor: {spell_spec.get('anchor_object', 'candle')}

## TIME GUIDANCE
{time_guidance}

## BELIEF MODE: {belief_mode}
{belief_framing}

## RESEARCH FACTS (use in lore_vignette and step 'why' fields)
{facts_for_writer}

## AVAILABLE SOURCES
{sources_text}

## CANON ANCHOR (MUST connect to lore_vignette)
ID: {canon_anchor.get('id', 'unknown')}
Title: {canon_anchor.get('title', 'Unknown')}
Type: {canon_anchor.get('type', 'practice')}
Year: {canon_anchor.get('year', 'N/A')}
Relevance: {canon_anchor.get('relevance', '')}

## BLOCK SEQUENCE FROM PLANNER (follow this structure)
{block_sequence_json}

## OUTPUT FORMAT
Return ONLY this JSON with full blocks[] content:

{{
    "title": "{plan.get('spell_title', 'A Working')}",
    "subtitle": "{plan.get('spell_subtitle', 'Crafted for your intention')}",
    "intent": "One precise, testable sentence describing what this working achieves",
    "guide_id": "{guide_id}",
    "belief_mode": "{belief_mode}",
    "template_id": "{plan.get('template_id', 'default')}",
    
    "persona_lock": {{
        "props": {json.dumps(plan.get('persona_lock', {}).get('props', ['candle', 'tea']))},
        "sensory_cue": "{plan.get('persona_lock', {}).get('sensory_cue', 'warmth')}",
        "signature_move": "{plan.get('persona_lock', {}).get('signature_move', 'gentle nod')}"
    }},
    
    "canon_anchor": {{
        "id": "{canon_anchor.get('id', 'unknown')}",
        "type": "{canon_anchor.get('type', 'practice')}",
        "title": "{canon_anchor.get('title', 'Unknown')}",
        "year": {canon_anchor.get('year', 'null')},
        "relevance": "{canon_anchor.get('relevance', '')}"
    }},
    
    "tarot_card": {{
        "title": "Short evocative title (3-5 words max, captures spell essence)",
        "symbol": "A single emoji that represents this spell's core energy",
        "essence": "One sentence capturing the core purpose (under 15 words)",
        "key_action": "The single most important action (under 20 words)",
        "incantation": "A brief, memorable phrase of power (under 15 words)",
        "timing": "When to perform (e.g., 'Full Moon, Midnight', 'Dawn', 'Any quiet moment')",
        "warning": "One line caution if needed, or null if none"
    }},
    
    "blocks": [
        {{
            "block_type": "cold_open",
            "block_id": "cold_open_1",
            "content": {{
                "greeting": "Guide's opening line addressing seeker by name",
                "scene_setting": "Atmospheric 2-3 sentences with sensory details",
                "hook": "The 'why now' that draws the seeker in",
                "persona_markers": ["prop1", "prop2", "sensory_detail"]
            }}
        }},
        {{
            "block_type": "materials",
            "block_id": "materials_1",
            "content": {{
                "items": [
                    {{"name": "item", "purpose": "why", "substitution": "alternative", "optional": false}}
                ],
                "gathering_note": "Guide's comment about assembling materials"
            }}
        }},
        {{
            "block_type": "choice",
            "block_id": "choice_1",
            "content": {{
                "prompt": "The decision point question",
                "options": [
                    {{"id": "opt_a", "label": "Option A", "description": "What this means", "affects": "How it changes the working"}},
                    {{"id": "opt_b", "label": "Option B", "description": "What this means", "affects": "How it changes the working"}}
                ],
                "consequence_hint": "Guide's hint about what choices mean",
                "default_option": "opt_a"
            }}
        }},
        {{
            "block_type": "lore_vignette",
            "block_id": "lore_1",
            "content": {{
                "title": "Vignette title",
                "narrative": "100+ word story connecting to the canon_anchor and research facts",
                "era": "Time period",
                "tradition": "Tradition name",
                "source_connection": "Which source this draws from",
                "relevance_to_working": "Why this story matters for the seeker's working",
                "canon_anchor_id": "{canon_anchor.get('id', 'unknown')}"
            }}
        }},
        {{
            "block_type": "stepper",
            "block_id": "stepper_1",
            "content": {{
                "steps": [
                    {{
                        "step_number": 1,
                        "action": "Detailed action (min 20 chars)",
                        "spoken_words": "Optional words to say",
                        "why": "Why this step works (min 20 chars, cite research)",
                        "duration_hint": "About 1-2 minutes",
                        "checkpoint": true
                    }}
                ],
                "completion_message": "What guide says when stepper is complete"
            }}
        }},
        {{
            "block_type": "reflection",
            "block_id": "reflection_1",
            "content": {{
                "prompts": ["Journal prompt 1", "Journal prompt 2"],
                "guide_note": "Guide's reflection on the working",
                "log_fields": [
                    {{"field_id": "feeling_before", "label": "How did you feel before?", "type": "scale"}},
                    {{"field_id": "feeling_after", "label": "How do you feel now?", "type": "scale"}}
                ]
            }}
        }},
        {{
            "block_type": "closing",
            "block_id": "closing_1",
            "content": {{
                "license_to_depart": "Release any energies invoked",
                "unseal_action": "Physical unsealing gesture",
                "grounding_action": "Grounding physical action",
                "empowerment_line": "Guide's closing empowerment statement",
                "next_steps_hint": "What to do/notice in next 24 hours"
            }}
        }},
        {{
            "block_type": "evidence_card",
            "block_id": "inspiration_1",
            "content": {{
                "known": ["Verified fact 1 from research", "Verified fact 2"],
                "likely": ["Probable connection 1", "Pattern that suggests..."],
                "lore": ["Unverified tradition", "What the stories say..."],
                "pattern_note": "Guide's observation about these patterns"
            }}
        }},
        {{
            "block_type": "bird_oracle",
            "block_id": "bird_1",
            "content": {{
                "bird_name": "Name of the bird",
                "oracle_message": "What this bird's appearance means",
                "observation_prompt": "What to watch for in coming days",
                "log_field": true
            }}
        }},
        {{
            "block_type": "poetry_reading",
            "block_id": "poetry_1",
            "content": {{
                "poem_title": "Title of the poem or passage",
                "poem_author": "Author name",
                "poem_text": "The actual poem text or close paraphrase (4-12 lines)",
                "guide_commentary": "Shigg's personal commentary on why this poem matters right now",
                "reading_instruction": "How to read it (aloud, slowly, by candlelight, etc.)"
            }}
        }},
        {{
            "block_type": "observation_task",
            "block_id": "observe_1",
            "content": {{
                "task_description": "Specific outdoor observation task",
                "location_suggestion": "Where to go (garden, park, window, path)",
                "duration": "How long to observe (10 minutes, until you see X, etc.)",
                "what_to_notice": "Specific things to watch/listen for",
                "recording_prompt": "What to write down afterward"
            }}
        }},
        {{
            "block_type": "further_reading",
            "block_id": "reading_1",
            "content": {{
                "recommendations": [
                    {{
                        "title": "Book or passage title",
                        "author": "Author name",
                        "guide_note": "Personal commentary from the guide about why this matters",
                        "specific_passage": "A specific chapter, page, or passage to start with (optional)"
                    }}
                ],
                "reading_ritual": "How to approach the reading (with tea, at dawn, in silence, etc.)"
            }}
        }}
    ],
    
    "sources": [
        {{
            "source_id": "from research",
            "type": "historical|folklore|modern_occult",
            "author": "Author name",
            "work": "Work title",
            "relevance": "How this source informs this spell",
            "learn_more_url": "URL if available"
        }}
    ],
    
    "ethics_statement": "Clear ethical boundary statement (30+ chars)",
    
    "tradition_tags": {json.dumps(plan.get('tradition_tags', []))},
    
    "micro_lore_used": ["List the micro-lore details you wove in"],
    "text_tokens_used": {{
        "setting_detail": "{text_tokens.get('setting_detail', '')}",
        "sensory_detail": "{text_tokens.get('sensory_detail', '')}",
        "gesture_detail": "{text_tokens.get('gesture_detail', '')}"
    }},
    
    "image_prompt": {{
        "header": "DALL-E prompt for atmospheric header",
        "tarot": "DALL-E prompt for tarot-style card",
        "sigil": "Simple sigil description"
    }}
}}

## CRITICAL BLOCK RULES
1. 'choice' block REQUIRED - must have genuine decision with 2-4 options
2. 'lore_vignette' block REQUIRED - must be 100+ words, connect to canon_anchor
3. 'cold_open' must establish persona in first 3 lines via persona_markers
4. 'stepper' steps must each have 'why' field (20+ chars) citing research
5. ALL blocks must be in guide's authentic voice
6. Use 2-3 signature phrases naturally across blocks
7. Address seeker by name at least twice (cold_open and closing)
8. MUST include at least 2 micro-lore details (in cold_open or lore_vignette)
9. MUST use the text_tokens (setting_detail, sensory_detail, gesture_detail) provided
10. MUST NOT include any taboo themes/imagery listed above

## GUIDE-SPECIFIC BLOCKS TO INCLUDE
{_get_guide_specific_blocks(guide_id)}

## WORKING TYPE DIRECTION
{_get_working_type_direction(plan)}

## SOURCES & FURTHER READING (REQUIRED AT END)
Every working MUST end with a "sources" array that includes:
1. Real historical/folkloric sources that informed this working
2. A "further_reading_note" field for each source explaining what the seeker would gain from reading it
3. At least one source the seeker can actually find and read (a real book, article, or tradition)
This is how we pay homage to the traditions that inspire us without claiming to be part of them.
Cite inspiration honestly. Credit where the magic comes from."""

    return prompt


def _get_belief_framing_blocks(mode: str) -> str:
    """Get belief mode framing for blocks"""
    framings = {
        "SECULAR": """Frame all blocks as psychological exercises.
In lore_vignette: present history as cultural context, not magical truth.
In stepper 'why': use cognitive/behavioral explanations.
In choice: frame options as mindfulness approaches, not energy work.""",
        
        "SPIRITUAL": """Balance grounded practice with openness to mystery.
In lore_vignette: present as living tradition with practical wisdom.
In stepper 'why': blend psychological with symbolic explanations.
In choice: acknowledge both practical and subtle dimensions.""",
        
        "PRACTITIONER": """Speak directly about magic and energy work.
In lore_vignette: assume familiarity with tradition.
In stepper 'why': use technical magical language.
In choice: reference energetic consequences directly."""
    }
    return framings.get(mode.upper(), framings["SPIRITUAL"])


def _get_time_guidance_blocks(time_spec: str) -> str:
    """Get time guidance for block depth"""
    guidance = {
        "2_min": "QUICK: 5-6 blocks. Minimal stepper (3 steps). Brief lore_vignette (100 words).",
        "5_min": "BRIEF: 6-7 blocks. Focused stepper (3-4 steps). Concise lore_vignette (120 words).",
        "10_min": "FOCUSED: 7-8 blocks. Full stepper (4-5 steps). Rich lore_vignette (150 words).",
        "20_min": "MODERATE: 8-9 blocks. Extended stepper (5-6 steps). Deep lore_vignette (200 words).",
        "30_min": "FULL: 9-10 blocks. Complete stepper (6-7 steps). Elaborate lore_vignette (250+ words)."
    }
    return guidance.get(time_spec, guidance["10_min"])


def _get_guide_specific_blocks(guide_id: str) -> str:
    """Get guide-specific block requirements"""
    specific = {
        "shigg": """SHIGG SPECIALTY BLOCKS:
- 'bird_oracle' block: Include bird name, oracle message, and observation prompt for coming days
- 'journal_prompt' block: Domestic/cozy prompts with tea/kitchen imagery
- 'poetry_reading' block (if working type calls for it): A specific poem or passage with Shigg's commentary
- 'observation_task' block (if working type calls for it): A specific outdoor task - watching, walking, listening
- 'further_reading' block (if working type calls for it): 1-2 real books with Shigg's personal commentary
NOTE: Not all Shigg workings require materials. Some are about going outside, reading, or cooking.
Shigg's voice: warm, rhythmic, like a nursery rhyme remembered half in dream.""",

        "cathleen": """CATHLEEN SPECIALTY BLOCKS:
- 'song_prompt' block: REQUIRED - Include humming/vocalization instruction, specific pitch or phrase
- 'ward' block: Include ward_name, creation_steps, activation_phrase, and what it protects against
NOTE: Cathleen's primary tool is VOICE, not candles or crystals. Your voice is the instrument.
Cathleen's voice: flowing like song, fierce when needed, protective always.""",

        "katherine": """KATHERINE SPECIALTY BLOCKS:
- 'safety_note' block: Precise safety considerations and psychological boundaries
- 'reflection' block: Documentation prompt with Rule of Three Tests reference
- 'evidence_card' block (for truth_revealing type): Known/Likely/Lore classification
NOTE: Katherine treats every working as a repeatable protocol. Steps have exact timings.
Materials have documented correspondences. Results must be documented.
Katherine's voice: measured and exact, like threading a needle in dim light.""",

        "theresa": """THERESA SPECIALTY BLOCKS:
- 'evidence_card' block: Categorize insights:
  * known = "What the Records Show" (verified facts)
  * likely = "What the Patterns Suggest" (probable connections)
  * lore = "What the Stories Tell" (unverified traditions)
- 'bird_oracle' block: Systematic observation prompt
- 'journal_prompt' block: Pattern-tracking fields
Theresa's voice: clear prose with sudden poetic turns, like a journalist who sees patterns.""",

        "brenda": """BRENDA SPECIALTY BLOCKS:
- 'journal_prompt' block: REQUIRED - Writing exercises, letter composition, chronicle entries
NOTE: Brenda's power is the pen. Every working involves writing something down.
Materials are pen and paper. Digital doesn't count.
Brenda's voice: like someone reading from a worn letter, pausing to remember."""
    }
    return specific.get(guide_id, specific["shigg"])


def _get_working_type_direction(plan: dict) -> str:
    """Get working-type-specific content direction from the planner's output"""
    working_type = plan.get("working_type", "default")
    guide_id = plan.get("guide_id", "shigg")

    # Detailed content directions per working type
    directions = {
        # SHIGG working types
        "comfort_ritual": (
            "This is Shigg's classic: a warm, domestic ritual centered on tea, kitchen, or hearth. "
            "Materials are everyday household items - nothing requiring a special shop. "
            "Steps are gentle and rhythmic. The closing always involves putting the kettle on or feeding the birds. "
            "Voice should feel like sitting in grandmother's kitchen on a cold morning."
        ),
        "bird_oracle_reading": (
            "IMPORTANT: This working has NO materials block and NO candles. "
            "Shigg is sending the seeker OUTSIDE to watch birds. The bird_oracle block names a specific real bird "
            "(robin, magpie, crow, wren, sparrow) and what its appearance means in folk tradition. "
            "The observation_task gives a specific outdoor activity: sit by an oak tree for 10 minutes, "
            "walk a path at dawn, watch from a window at first light. "
            "Steps are minimal: go outside, be still, watch, record what you see. "
            "This is NOT a spell - it's grandmother sending you out of the house to look at the world."
        ),
        "poetry_working": (
            "The poetry_reading block contains a SPECIFIC real poem or passage - from the Rubaiyat of Omar Khayyam, "
            "Yeats, or British folk verse. Include the actual lines (or close paraphrase) with Shigg's commentary "
            "on why it matters right now. The stepper has only 2-3 steps: read the poem aloud, "
            "do ONE small action (light a candle, open a window, hold a warm cup), then sit with it for 5 minutes. "
            "This is NOT a spell - it's Shigg's wisdom delivered through the books she loved."
        ),
        "kitchen_spell": (
            "Materials are FOOD INGREDIENTS, not candles or crystals. The stepper is effectively a RECIPE "
            "with symbolic meaning woven in: stir clockwise for gathering, add salt for protection, "
            "knead bread while speaking intention. Shigg teaches the seeker to cook something specific - "
            "a simple bread, a warming soup, a particular tea blend - where the act of making it IS the magic. "
            "Each ingredient has folk significance explained in the 'why' field."
        ),
        "book_recommendation": (
            "The further_reading block recommends 1-2 SPECIFIC REAL books or passages with Shigg's personal commentary. "
            "Examples: 'The Rubaiyat of Omar Khayyam (get the FitzGerald translation, love - the one with the vine)', "
            "'Yeats's The Second Coming - not the whole book, just that one poem, read it slow'. "
            "The stepper is a reading ritual: make tea, find a quiet spot, read the passage, write one sentence. "
            "This is Shigg as the well-read grandmother who always has the right book for what ails you."
        ),
        "grief_tending": (
            "Materials are comfort items: a cup, a photo of the person, bread for birds, salt. "
            "Steps are SLOW and GENTLE - no dramatic gestures, no forced catharsis. "
            "Include leaving bread out for birds as the closing action (Shigg's signature: feeding the birds "
            "is how we tend to the dead). The bird_oracle tells which bird carries messages from the departed. "
            "Shigg holds grief like holding a warm cup - carefully, tenderly, without trying to fix it."
        ),

        # CATHLEEN working types
        "voice_ward": (
            "The song_prompt comes FIRST after cold_open - voice activation before anything else. "
            "Cathleen teaches a specific hum, tone, or repeated phrase to use as protection. "
            "Materials are MINIMAL or NONE - the seeker's voice is the primary tool. "
            "Steps involve vocal exercises: humming at a specific pitch, speaking words with force, "
            "building volume from whisper to spoken word. The ward is activated by voice, not objects. "
            "This is Cathleen as the woman whose voice could stop a room."
        ),
        "threshold_ritual": (
            "This is about PHYSICAL BOUNDARIES - doorways, windows, gates, thresholds between spaces. "
            "Materials include salt, water, a bell, or iron (NOT candles). "
            "Steps involve walking the boundaries of a space, marking thresholds with salt or water, "
            "and sealing each doorway with a spoken word or hum. The ward is tied to a specific door or window. "
            "Cathleen's Irish warding traditions: she marked the door like her mother's mother did."
        ),
        "courage_spell": (
            "NO gentle tea rituals. This is FIERCE. Cathleen invokes Morrigan energy - sovereignty, "
            "battle courage, the refusal to break. The song_prompt teaches a battle cry or power phrase. "
            "Steps are PHYSICAL: stand tall, plant feet, breathe deep from the belly, speak with force. "
            "The ward is PORTABLE - something the seeker carries into the situation they need courage for. "
            "Cathleen is the woman who faced down the world and won. Channel that."
        ),
        "morrigan_devotion": (
            "This is DEVOTIONAL, not casual. Materials include a crow/raven feather (real or drawn), "
            "a dark cloth, a candle. The lore_vignette tells a Morrigan story - the specific tradition "
            "Cathleen's Irish family carried. Steps build from stillness to power. "
            "The song_prompt is an invocation. Treat this with reverence - Cathleen KNEW these forces were real. "
            "'The dead are not gone; they simply wait in the next room.'"
        ),
        "psychic_protection": (
            "Cathleen was a known psychic. This working helps sensitive people protect themselves. "
            "The safety_note addresses psychic overwhelm seriously, without dismissing it. "
            "Steps teach grounding, boundary-setting, discernment between your feelings and others'. "
            "The ward is specifically for psychic protection - a 'cloak' activated by humming. "
            "Cathleen validates the seeker's sensitivity while teaching practical protection. "
            "'Sometimes one simply knows, doesn't one?'"
        ),
        "secret_keeping": (
            "Cathleen's wartime discretion - 'Loose lips sink ships.' This working is about the POWER of silence. "
            "Materials: a sealed envelope, a locked box, a knotted cord. "
            "Steps involve binding silence, sealing what must not be spoken. "
            "The lore_vignette draws on wartime secrecy, the Land Army, things women knew but never said. "
            "The ward seals the secret. Some power comes from what you DON'T say."
        ),

        # KATHERINE working types
        "precision_protocol": (
            "Katherine's bread and butter - a proper, documented protocol. "
            "Safety_note comes BEFORE materials (methodology-first). "
            "Materials are SPECIFIC with exact quantities and documented correspondences. "
            "Steps have PRECISE timings ('Hold for exactly 3 minutes', 'Wait until the candle burns 1cm'). "
            "The reflection block is a documentation prompt: what happened, what you observed, "
            "what needs refinement. Katherine runs her workings like experiments - repeatable, testable, refinable. "
            "'Question it. Test it. Refine it.'"
        ),
        "shadow_integration": (
            "NO materials list needed - this is inner work. Safety_note addresses psychological boundaries "
            "and when to STOP (this is critical - Katherine insists on informed consent with yourself). "
            "The stepper is structured self-inquiry: mirror gazing, journaling prompts, "
            "the Rule of Three Tests (Is it true? Is it consensual? Is it mine to act on?). "
            "Katherine treats shadow work as Victorian evidence-gathering applied to the psyche. "
            "The reflection block is EXTENSIVE - this is where the real work happens. "
            "Truth-dark, not horror-dark. 'Precision isn't coldness, it's care.'"
        ),
        "sigil_creation": (
            "Materials are DRAWING TOOLS: pen, paper, compass, ruler (Katherine's precision). "
            "The stepper teaches a sigil creation method step by step - letter reduction, "
            "geometric construction, or thread-path design. Each step has exact instructions. "
            "Lore_vignette connects to Golden Dawn sigil traditions or Spitalfields weaving patterns. "
            "The reflection block documents the sigil's creation, purpose, and activation conditions. "
            "Katherine treats sigil-making as a craft skill, not mystical hand-waving."
        ),
        "correspondence_working": (
            "Katherine was from Spitalfields weavers and dressmakers. "
            "Materials are TEXTILES: specific thread colors, a needle, fabric scraps, scissors. "
            "The stepper teaches an actual sewing/knotting technique with magical correspondence - "
            "each stitch or knot has documented meaning. "
            "Lore_vignette connects to Spitalfields and sympathetic magic (as above, so below). "
            "This is CRAFT as magic - the seamstress's power in every stitch."
        ),
        "truth_revealing": (
            "Materials include a mirror, a candle, and paper for documentation. "
            "Steps are a structured inquiry protocol: state the question precisely, "
            "apply the Rule of Three Tests, perform the divination (mirror scrying, thread pendulum, "
            "or card pull), and DOCUMENT the results. The evidence_card classifies findings as "
            "Known/Likely/Lore. Katherine treats truth-seeking as Victorian spiritualism at its best - "
            "rigorous, documented, honest about uncertainty."
        ),
        "victorian_seance_protocol": (
            "Safety_note is CRITICAL - addresses consent, boundaries, when to stop, and proper closing. "
            "Materials are specific Victorian seance items: a candle, a mirror, a dark cloth, paper and pen. "
            "Steps follow a FORMAL PROTOCOL: opening invocation, circle casting, invitation, "
            "listening period (timed), questions (prepared in advance), thanks, formal closing. "
            "Katherine brings PROTOCOL to what others treat casually. 'Precision isn't coldness, it's care.'"
        ),

        # THERESA working types
        "pattern_investigation": (
            "Theresa treats this as INVESTIGATION, not mysticism. The evidence_card maps what's "
            "Known/Likely/Lore about the pattern the seeker has identified. "
            "Materials are investigative: notebook, pen, photographs or documents. "
            "Steps involve research, documentation, and one DECISIVE ACTION to break or acknowledge the pattern. "
            "The lore_vignette connects to genealogical magic traditions or pattern-breaking folklore. "
            "Theresa is the granddaughter who broke the family's veil spell through asking questions "
            "nobody wanted answered. She treats the seeker as a fellow investigator. "
            "Use the Then/Now bridge format: 'Here's what they did then, here's what you do now.' "
            "Every claim gets classified: Known (verified), Likely (probable), or Lore (traditional). "
            "'The pattern breaks here.'"
        ),
        "truth_seeking": (
            "Evidence card comes SECOND after cold_open - classify what you know before you begin. "
            "Materials include notebook, pen, candle (optional). "
            "The bird_oracle is SYSTEMATIC observation, not mystical reading - Theresa tracks patterns in bird behavior "
            "like a field researcher, recording date, time, species, direction. "
            "Steps follow a structured inquiry: name the suspicion, sort evidence into Known/Likely/Lore, "
            "apply the three tests, follow the strongest thread, document findings. "
            "Journal_prompt focuses on pattern-tracking: 'What keeps appearing? What are you avoiding looking at?' "
            "Theresa treats the seeker as a fellow investigator, not a supplicant. "
            "'Here's what the evidence shows...'"
        ),

        # BRENDA working types
        "letter_ritual": (
            "Materials are pen and paper - REAL writing, not digital. Brenda believes in the power of the pen. "
            "The seeker is writing a LETTER: to an ancestor, to a future self, to someone who needs to hear "
            "what was never said. The stepper guides the letter-writing process: "
            "addressing the letter, the opening line, the difficult middle where the real words live, "
            "and the closing that seals the intention. "
            "Lore_vignette connects to Dion Fortune's war letters, family chronicle traditions, "
            "or the Victorian practice of unsent letters as psychological release. "
            "The journal_prompt is a chronicle entry - Brenda records so nothing is lost. "
            "Closing always involves either keeping the letter safe or burning it with intention. "
            "'Write it down before it's lost.'"
        ),
        "memory_anchoring": (
            "Materials are PERSONAL items: a photograph, a family object, something inherited, an heirloom. "
            "The seeker holds the object and lets it speak. "
            "The stepper involves: holding the object, describing it in writing (texture, weight, smell, history), "
            "recording what it means and who it connects to, and making a deliberate choice about its future. "
            "Lore_vignette connects to psychometry traditions, object-reading, or family memory-keeping practices. "
            "The journal_prompt asks the seeker to write the object's story as if the object itself were speaking. "
            "Brenda is the family chronicler - she records so nothing is lost. "
            "The choice block asks: keep this memory private, share it with someone, or write it into the chronicle. "
            "'This is how we remember.'"
        ),
    }

    direction = directions.get(working_type, "")
    if direction:
        return f"WORKING TYPE: {working_type.upper().replace('_', ' ')}\n{direction}"
    return "Follow the standard block template for this guide."


def validate_writer_blocks_output(output: dict, guide_id: str) -> tuple[bool, list[str]]:
    """Validate writer blocks output"""
    errors = []
    
    # Required top-level fields
    required = ["title", "intent", "guide_id", "template_id", "blocks", "sources", "ethics_statement", "canon_anchor", "persona_lock", "tarot_card"]
    for field in required:
        if not output.get(field):
            errors.append(f"MISSING_FIELD: {field}")
    
    # Validate tarot_card structure
    tarot = output.get("tarot_card", {})
    if tarot:
        tarot_required = ["title", "symbol", "essence", "key_action", "incantation", "timing"]
        for field in tarot_required:
            if not tarot.get(field):
                errors.append(f"TAROT_CARD_MISSING: {field}")
    
    # Get blocks
    blocks = output.get("blocks", [])
    block_types = [b.get("block_type") for b in blocks]
    
    # Check required blocks
    if "choice" not in block_types:
        errors.append("MISSING_REQUIRED_BLOCK: choice")
    if "lore_vignette" not in block_types:
        errors.append("MISSING_REQUIRED_BLOCK: lore_vignette")
    if "cold_open" not in block_types:
        errors.append("MISSING_REQUIRED_BLOCK: cold_open")
    if "stepper" not in block_types:
        errors.append("MISSING_REQUIRED_BLOCK: stepper")
    if "closing" not in block_types:
        errors.append("MISSING_REQUIRED_BLOCK: closing")
    
    # Validate choice block content
    choice_blocks = [b for b in blocks if b.get("block_type") == "choice"]
    for cb in choice_blocks:
        content = cb.get("content", {})
        if not content.get("options") or len(content.get("options", [])) < 2:
            errors.append("CHOICE_BLOCK_INSUFFICIENT_OPTIONS")
    
    # Validate lore_vignette content
    lore_blocks = [b for b in blocks if b.get("block_type") == "lore_vignette"]
    for lb in lore_blocks:
        content = lb.get("content", {})
        narrative = content.get("narrative", "")
        if len(narrative) < 100:
            errors.append(f"LORE_VIGNETTE_TOO_SHORT: {len(narrative)} chars (need 100+)")
        if not content.get("canon_anchor_id"):
            errors.append("LORE_VIGNETTE_MISSING_CANON_ANCHOR_ID")
    
    # Validate stepper steps have 'why'
    stepper_blocks = [b for b in blocks if b.get("block_type") == "stepper"]
    for sb in stepper_blocks:
        steps = sb.get("content", {}).get("steps", [])
        for i, step in enumerate(steps):
            if not step.get("why") or len(step.get("why", "")) < 20:
                errors.append(f"STEPPER_STEP_{i+1}_MISSING_WHY")
    
    # === V1.2: Validate micro_lore usage ===
    micro_lore_used = output.get("micro_lore_used", [])
    if isinstance(micro_lore_used, list) and len(micro_lore_used) < 2:
        errors.append(f"MICRO_LORE_INSUFFICIENT: used {len(micro_lore_used)}, need 2+")
    
    # === V2: Working-type-aware guide-specific block validation ===
    # Only require guide specialty blocks if the working type calls for them
    working_type = output.get("working_type", output.get("template_id", ""))
    if guide_id == "shigg":
        # Bird oracle and journal prompt required for most Shigg types, but not all
        # bird_oracle_reading has observation_task instead of journal_prompt
        # poetry_working has poetry_reading instead of bird_oracle
        # book_recommendation has further_reading instead of bird_oracle
        if "bird_oracle_reading" not in working_type and "poetry_working" not in working_type and "book_recommendation" not in working_type:
            if "bird_oracle" not in block_types:
                errors.append("SHIGG_MISSING_BIRD_ORACLE")
        if "bird_oracle_reading" not in working_type:
            if "journal_prompt" not in block_types:
                errors.append("SHIGG_MISSING_JOURNAL_PROMPT")
    elif guide_id == "cathleen":
        # Song prompt required for all Cathleen types except secret_keeping
        if "secret_keeping" not in working_type:
            if "song_prompt" not in block_types:
                errors.append("CATHLEEN_MISSING_SONG_PROMPT")
        if "ward" not in block_types:
            errors.append("CATHLEEN_MISSING_WARD")
    elif guide_id == "katherine":
        # Katherine always needs safety_note and reflection/documentation
        if "safety_note" not in block_types:
            errors.append("KATHERINE_MISSING_SAFETY_NOTE")
        if "reflection" not in block_types:
            errors.append("KATHERINE_MISSING_REFLECTION")
    elif guide_id == "theresa":
        # Theresa always needs evidence_card and journal_prompt
        if "evidence_card" not in block_types:
            errors.append("THERESA_MISSING_EVIDENCE_CARD")
        if "journal_prompt" not in block_types:
            errors.append("THERESA_MISSING_JOURNAL_PROMPT")
    elif guide_id == "brenda":
        # Brenda always needs journal_prompt (her writing exercises)
        if "journal_prompt" not in block_types:
            errors.append("BRENDA_MISSING_JOURNAL_PROMPT")
    
    # Validate persona_lock
    lock = output.get("persona_lock", {})
    if not lock.get("props") or len(lock.get("props", [])) < 2:
        errors.append("PERSONA_LOCK_INSUFFICIENT_PROPS")
    if not lock.get("sensory_cue"):
        errors.append("PERSONA_LOCK_MISSING_SENSORY_CUE")
    if not lock.get("signature_move"):
        errors.append("PERSONA_LOCK_MISSING_SIGNATURE_MOVE")
    
    # Validate cold_open has persona_markers
    cold_opens = [b for b in blocks if b.get("block_type") == "cold_open"]
    for co in cold_opens:
        markers = co.get("content", {}).get("persona_markers", [])
        if len(markers) < 2:
            errors.append("COLD_OPEN_MISSING_PERSONA_MARKERS")
    
    return len(errors) == 0, errors
