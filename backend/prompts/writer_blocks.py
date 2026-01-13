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

## GUIDE-SPECIFIC BLOCKS TO INCLUDE
{_get_guide_specific_blocks(guide_id)}"""

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
- 'bird_oracle' block: Include bird name, message, and observation prompt
- 'journal_prompt' block: Domestic/cozy prompts with tea/kitchen imagery""",
        
        "cathleen": """CATHLEEN SPECIALTY BLOCKS:
- 'song_prompt' block: Include humming/vocalization instruction
- 'ward' block: Include ward_name, creation_steps, activation_phrase""",
        
        "katherine": """KATHERINE SPECIALTY BLOCKS:
- 'safety_note' block: Include precise safety considerations
- 'reflection' block: Include Rule of Three Tests reference""",
        
        "theresa": """THERESA SPECIALTY BLOCKS:
- 'evidence_card' block (displayed as "Inspiration"): Categorize insights poetically:
  * known = "What the Records Show" (verified facts)
  * likely = "What the Patterns Suggest" (probable connections)
  * lore = "What the Stories Tell" (unverified traditions)
- 'bird_oracle' block: Include systematic observation prompt
- 'journal_prompt' block: Include pattern-tracking fields"""
    }
    return specific.get(guide_id, specific["shigg"])


def validate_writer_blocks_output(output: dict, guide_id: str) -> tuple[bool, list[str]]:
    """Validate writer blocks output"""
    errors = []
    
    # Required top-level fields
    required = ["title", "intent", "guide_id", "template_id", "blocks", "sources", "ethics_statement", "canon_anchor", "persona_lock"]
    for field in required:
        if not output.get(field):
            errors.append(f"MISSING_FIELD: {field}")
    
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
