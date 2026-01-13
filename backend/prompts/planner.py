# Planner Prompt - Stage 2 of Pipeline
# Receives Archivist research, creates spell structure plan

import json
import random
from typing import Dict, List, Any


# Text variation tokens for uniqueness
TEXT_VARIATION_TOKENS = {
    "setting_detail": [
        "desk by rain-streaked window", "kitchen before dawn", "blackout-curtained room",
        "corner by the fire", "chair near an open window", "bed with rumpled sheets",
        "bath with candles burning", "garden bench at dusk", "floor with cushions"
    ],
    "sensory_detail": [
        "smell of iron and cloth", "kettle-steam rising", "beeswax and paper",
        "rain on stone", "dust motes in lamplight", "wool and smoke",
        "ink and old pages", "salt and candlewax", "bread cooling"
    ],
    "gesture_detail": [
        "pinning clockwise", "knotting three times", "tracing a circle with thumb",
        "pressing palm flat", "folding precisely", "stirring counterclockwise"
    ],
    "metaphor_detail": [
        "seam-ripping a bad story", "setting a pot to simmer", 
        "tuning a bell until it rings true", "unraveling a tangled thread",
        "clearing ash from the grate", "polishing a mirror to see clearly"
    ]
}


# Procedural variation tokens
VARIATION_KNOBS = {
    "time_of_day": ["dawn", "morning", "noon", "dusk", "evening", "midnight", "whenever needed"],
    "gesture_type": ["circular motion", "linear gesture", "tapping three times", "breath work", "stillness"],
    "repetition_pattern": ["three times", "seven times", "once with intention", "until it feels complete"],
    "material_placement": ["in center", "at edges", "carried close", "given to water", "left in moonlight"],
    "closing_action": ["extinguish candle", "bow head", "speak thanks", "deep exhale", "fold paper"],
    "energy_direction": ["inward (receiving)", "outward (projecting)", "grounding (down)", "circular (containing)"]
}


def build_planner_prompt_v2(
    spell_spec: dict,
    guide_config: dict,
    research_packet: dict,
    belief_mode: str = "SPIRITUAL"
) -> str:
    """
    Stage 2: Planner Prompt
    Creates spell structure from research packet.
    """
    
    guide_id = spell_spec.get("persona_id", "shigg")
    
    # Generate variation tokens
    variation_tokens = {k: random.choice(v) for k, v in VARIATION_KNOBS.items()}
    text_tokens = {k: random.choice(v) for k, v in TEXT_VARIATION_TOKENS.items()}
    
    # Extract research facts for planner context
    facts_summary = ""
    for fact in research_packet.get("facts", [])[:5]:
        facts_summary += f"- [{fact.get('claim_type', 'folklore')}] {fact.get('claim', '')}\n"
    
    # Extract sources
    sources_list = ""
    for src in research_packet.get("sources", [])[:4]:
        sources_list += f"- [{src.get('source_id')}] {src.get('author', 'Unknown')}: {src.get('work', 'Unknown')}\n"
    
    # Get structure lock for this guide
    structure_lock = _get_guide_structure_lock(guide_id)
    
    prompt = f"""## SPELL PLANNER - STAGE 2

You are planning a spell for {guide_config.get('name', 'Guide')}, {guide_config.get('title', '')}.

## SEEKER'S REQUEST
- Query: "{spell_spec.get('user_query', 'No specific query')}"
- Desired Feeling: {spell_spec.get('desired_feeling', 'calm')}
- Time Available: {spell_spec.get('time', '10_min')}
- Belief Mode: {belief_mode}
- Anchor Object: {spell_spec.get('anchor_object', 'candle')}
- Setting: {spell_spec.get('setting', 'home_quiet')}
- Name: {spell_spec.get('user_name', 'Seeker')}
- Avoid: {spell_spec.get('avoid', 'None')}

## RESEARCH PACKET (from Archivist - use these facts)
{facts_summary}

## AVAILABLE SOURCES (cite by source_id)
{sources_list}

## TRADITION CONTEXT
Primary: {research_packet.get('tradition_context', {}).get('primary_tradition', 'british_folk_magic')}
Related: {', '.join(research_packet.get('tradition_context', {}).get('related_traditions', []))}

## GUIDE STRUCTURE LOCK (must follow this structure)
{structure_lock['description']}
Required sections: {', '.join(structure_lock['sections'])}

## VARIATION TOKENS (use ALL for uniqueness)
Procedural:
- time_of_day: {variation_tokens['time_of_day']}
- gesture_type: {variation_tokens['gesture_type']}
- repetition_pattern: {variation_tokens['repetition_pattern']}
- closing_action: {variation_tokens['closing_action']}

Textual:
- setting_detail: {text_tokens['setting_detail']}
- sensory_detail: {text_tokens['sensory_detail']}
- gesture_detail: {text_tokens['gesture_detail']}
- metaphor_detail: {text_tokens['metaphor_detail']}

## OUTPUT FORMAT
Return ONLY this JSON:

{{
    "spell_title": "Evocative title (5-100 chars)",
    "spell_subtitle": "Poetic tagline",
    "guide_id": "{guide_id}",
    "belief_mode": "{belief_mode}",
    "structure_template": "{structure_lock['template_id']}",
    "section_order": {json.dumps(structure_lock['sections'])},
    "variation_tokens": {json.dumps(variation_tokens)},
    "text_tokens": {json.dumps(text_tokens)},
    "selected_facts": [
        {{"fact_index": 0, "usage": "How this fact informs the spell"}}
    ],
    "selected_sources": [
        {{"source_id": "...", "usage": "How this source is cited"}}
    ],
    "materials_plan": [
        {{"name": "material", "purpose": "why", "substitution": "alternative"}}
    ],
    "step_outline": [
        {{"step_num": 1, "action_type": "opening|working|closing", "brief": "what happens"}}
    ],
    "persona_lock": {{
        "props": ["prop1", "prop2"],
        "sensory_cue": "one sensory detail",
        "signature_move": "guide's signature action"
    }},
    "timeline_links": [
        {{"event_id": "...", "relevance": "..."}}
    ],
    "tradition_tags": ["tag1", "tag2"],
    "safety_notes": ["any safety adaptations needed"]
}}

## RULES
1. MUST use the structure lock sections for this guide
2. MUST cite only from available sources
3. MUST use all variation tokens
4. Materials: 2-7 items max
5. Steps: 3-7 items max
6. Include persona_lock for guide identification
7. Link to relevant timeline events if available"""

    return prompt


def _get_guide_structure_lock(guide_id: str) -> dict:
    """Get the required spell structure for each guide"""
    
    structures = {
        "shigg": {
            "template_id": "shigg_comfort_ritual",
            "description": "Shigg's structure: comfort → historical stitch → tiny practice → journaling → bird oracle",
            "sections": [
                "warm_greeting",
                "comfort_acknowledgment", 
                "historical_stitch",
                "tiny_practice",
                "spoken_words",
                "journaling_prompt",
                "bird_oracle",
                "closing_warmth"
            ]
        },
        "cathleen": {
            "template_id": "cathleen_voice_ritual",
            "description": "Cathleen's structure: hush/threshold → voice activation → ward → clean close",
            "sections": [
                "threshold_opening",
                "voice_activation",
                "the_working",
                "ward_creation",
                "closing_song",
                "talisman_suggestion"
            ]
        },
        "katherine": {
            "template_id": "katherine_ceremonial",
            "description": "Katherine's structure: precision setup → boundary/discernment → working → results log/refine",
            "sections": [
                "title",
                "intent",
                "setting",
                "materials",
                "safety_ethics",
                "opening_boundary",
                "invocation",
                "working",
                "closing",
                "record_prompts",
                "empowerment_line"
            ]
        },
        "theresa": {
            "template_id": "theresa_investigation",
            "description": "Theresa's structure: question → evidence pull → Known/Likely/Lore → why → 24h action → bird log",
            "sections": [
                "the_question",
                "evidence_gathering",
                "known_facts",
                "likely_connections",
                "lore_speculation",
                "why_this_matters",
                "twenty_four_hour_action",
                "bird_log_entry"
            ]
        }
    }
    
    return structures.get(guide_id, structures["shigg"])


def validate_planner_output(output: dict) -> tuple[bool, list[str]]:
    """Validate planner output"""
    errors = []
    
    required = ["spell_title", "guide_id", "section_order", "materials_plan", "step_outline"]
    for field in required:
        if field not in output:
            errors.append(f"MISSING_FIELD: {field}")
    
    # Check materials count
    materials = output.get("materials_plan", [])
    if len(materials) < 2 or len(materials) > 7:
        errors.append(f"MATERIALS_COUNT: {len(materials)} (need 2-7)")
    
    # Check steps count
    steps = output.get("step_outline", [])
    if len(steps) < 3 or len(steps) > 7:
        errors.append(f"STEPS_COUNT: {len(steps)} (need 3-7)")
    
    # Check persona lock
    if not output.get("persona_lock", {}).get("props"):
        errors.append("MISSING_PERSONA_LOCK_PROPS")
    
    return len(errors) == 0, errors
