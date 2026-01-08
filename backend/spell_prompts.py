# Spell Generation Prompts - Two-stage prompt system (Planner + Writer)
# 1. Planner - selects scenario, format, sources, generates variation_tokens, builds AssetPlan
# 2. Spell Writer - writes the actual spell content with strict citations

import json
import random
from typing import Dict, List, Any
from persona_config import (
    get_persona_config, select_scenario_for_spell, get_format_for_scenario,
    get_practices_for_scenario, get_micro_icons_for_persona,
    BELIEF_BOUNDARY_DESCRIPTIONS, ASSET_TYPES,
    CROWLANDS_ART_BIBLE, ASSET_ROLE_LOCKS, get_art_bible_prompt_suffix
)

# ============================================================================
# VARIATION KNOBS - These drive procedural variety
# ============================================================================

VARIATION_KNOBS = {
    "time_of_day": ["dawn", "morning", "noon", "dusk", "evening", "midnight", "whenever needed"],
    "gesture_type": ["circular motion", "linear gesture", "tapping three times", "breath work", "stillness", "swaying"],
    "repetition_pattern": ["three times", "seven times", "once with intention", "until it feels complete", "in rhythm with breath"],
    "material_placement": ["in center", "at edges", "carried close", "buried", "burned", "given to water", "left in moonlight"],
    "closing_action": ["extinguish candle", "bow head", "speak thanks", "ring bell", "clap hands", "deep exhale", "fold paper"],
    "energy_direction": ["inward (receiving)", "outward (projecting)", "grounding (down)", "lifting (up)", "circular (containing)"]
}

# ============================================================================
# TAROT COMPOSITION LIBRARY - Prevents repetitive imagery
# ============================================================================

TAROT_COMPOSITIONS = {
    "shigg": [
        {"focal": "single crow on branch", "framing": "circular wreath border", "symbols": ["tea leaves", "morning star"]},
        {"focal": "open window with birds", "framing": "rectangular frame with corners", "symbols": ["kettle steam", "feather"]},
        {"focal": "teacup from above", "framing": "octagonal seal", "symbols": ["bird silhouettes", "herb sprig"]},
        {"focal": "three birds in flight formation", "framing": "Art Nouveau curves", "symbols": ["nest", "key"]},
        {"focal": "windowsill with offerings", "framing": "simple line border", "symbols": ["breadcrumbs", "rose"]},
        {"focal": "single feather detailed", "framing": "mandala pattern", "symbols": ["star points", "steam wisps"]}
    ],
    "cathleen": [
        {"focal": "Land Army woman with candle in blackout window", "framing": "wartime poster border with Celtic knot corners", "symbols": ["moon through curtain", "raven silhouette"]},
        {"focal": "WRENS women forming protective circle", "framing": "signal flag bunting frame", "symbols": ["morse lamp", "sisterhood hands"]},
        {"focal": "woman singing by firelight in uniform", "framing": "arched Anderson shelter doorway", "symbols": ["sound waves", "protective ward"]},
        {"focal": "hands holding talisman over ration book", "framing": "medallion with uniform buttons", "symbols": ["celtic brooch", "candle flame"]},
        {"focal": "raven messenger on wartime allotment fence", "framing": "victory garden border", "symbols": ["moon phases", "dig for victory"]},
        {"focal": "silhouette of women at dawn, arms linked", "framing": "simple wartime frame with brass corners", "symbols": ["threshold", "strength in unity"]}
    ],
    "katherine": [
        {"focal": "hand mirror reflecting shadow", "framing": "Victorian oval frame", "symbols": ["candle", "wax seal"]},
        {"focal": "needle piercing fabric", "framing": "square geometric grid", "symbols": ["thread lines", "key"]},
        {"focal": "sealed letter with wax", "framing": "rectangular document border", "symbols": ["clock hands", "ink drops"]},
        {"focal": "salt line at threshold", "framing": "doorway arch", "symbols": ["shadow figure", "keyhole"]},
        {"focal": "open notebook with writing", "framing": "simple ruled border", "symbols": ["candle", "pen nib"]},
        {"focal": "eye reflected in mirror", "framing": "double circle (eye shape)", "symbols": ["thread pattern", "seal"]}
    ]
}

def select_tarot_composition(persona_id: str, used_compositions: List[str] = None) -> dict:
    """Select a tarot composition, avoiding recently used ones"""
    if used_compositions is None:
        used_compositions = []
    
    persona_comps = TAROT_COMPOSITIONS.get(persona_id, TAROT_COMPOSITIONS["shigg"])
    
    # Try to find unused composition
    for comp in persona_comps:
        if comp["focal"] not in used_compositions:
            return comp
    
    # If all used, return random
    return random.choice(persona_comps)


def generate_variation_tokens() -> dict:
    """Generate random variation tokens for spell variety"""
    return {
        "time_of_day": random.choice(VARIATION_KNOBS["time_of_day"]),
        "gesture_type": random.choice(VARIATION_KNOBS["gesture_type"]),
        "repetition_pattern": random.choice(VARIATION_KNOBS["repetition_pattern"]),
        "material_placement": random.choice(VARIATION_KNOBS["material_placement"]),
        "closing_action": random.choice(VARIATION_KNOBS["closing_action"]),
        "energy_direction": random.choice(VARIATION_KNOBS["energy_direction"])
    }


# ============================================================================
# STAGE 1: PLANNER PROMPT
# ============================================================================

def build_planner_prompt(spell_spec: dict, persona_config: dict, scenario: dict) -> str:
    """
    Stage 1: Planner Prompt
    Generates: variation_tokens, tarot_constraints, source selections, asset_plan
    CRITICAL: Only cites from allowed_sources
    """
    
    belief_guidance = BELIEF_BOUNDARY_DESCRIPTIONS.get(
        spell_spec.get("belief_boundary", "spiritual_grounded"),
        BELIEF_BOUNDARY_DESCRIPTIONS["spiritual_grounded"]
    )
    
    # Build allowed sources text with IDs
    allowed_sources_text = "\n".join([
        f"- [{s['source_id']}] {s['author']}: \"{s['work']}\" ({s['year'] or 'Traditional'}) — {s['reference_class']}"
        for s in persona_config.get("allowed_sources", [])
    ])
    
    # Get practices linked to this scenario
    practices = get_practices_for_scenario(
        spell_spec.get("persona_id", "shigg"), 
        scenario["scenario_id"]
    )
    practices_text = "\n".join([
        f"- [{p['practice_id']}]: {p['name']} — {p['description']}"
        for p in practices
    ])
    
    # Get format for this scenario
    linked_format = get_format_for_scenario(
        spell_spec.get("persona_id", "shigg"),
        scenario["scenario_id"]
    )
    format_section_order = linked_format["section_order"] if linked_format else scenario.get("required_sections", [])
    
    # Generate variation tokens
    variation_tokens = generate_variation_tokens()
    
    # Select tarot composition constraints
    tarot_comp = select_tarot_composition(spell_spec.get("persona_id", "shigg"))
    
    prompt = f"""You are the Spell Planner for {persona_config['name']}, {persona_config['title']}.

## YOUR TASK
Create a detailed spell plan. You MUST:
1. Use the provided variation_tokens to ensure uniqueness
2. Select sources ONLY from allowed_sources (cite by source_id)
3. Follow the tarot_constraints to ensure distinct imagery
4. Create an asset_plan for exactly 6 generated images

## SEEKER'S REQUEST (SpellSpec)
- Query: "{spell_spec.get('user_query', 'No specific query')}"
- Desired Feeling: {spell_spec.get('desired_feeling', 'calm')}
- Time Available: {spell_spec.get('time', '10_min')}
- Tone: {spell_spec.get('tone', 'practical')}
- Belief Boundary: {spell_spec.get('belief_boundary', 'spiritual_grounded')}
- Anchor Object: {spell_spec.get('anchor_object', 'candle')}
- Setting: {spell_spec.get('setting', 'bedroom')}
- Name/Nickname: {spell_spec.get('user_name', 'Seeker')}
- Things to Avoid: {spell_spec.get('avoid', 'None specified')}

## BELIEF BOUNDARY GUIDANCE
{belief_guidance}

## SELECTED SCENARIO
Scenario ID: {scenario['scenario_id']}
Name: {scenario['name']}
Description: {scenario['description']}
Best For: {', '.join(scenario['best_for'])}

## SECTION ORDER (from linked format)
{', '.join(format_section_order)}

## LINKED PRACTICES (incorporate 1-2 of these)
{practices_text if practices_text else "No specific practices linked - use general approach"}

## VARIATION TOKENS (USE THESE for uniqueness)
- time_of_day: {variation_tokens['time_of_day']}
- gesture_type: {variation_tokens['gesture_type']}
- repetition_pattern: {variation_tokens['repetition_pattern']}
- material_placement: {variation_tokens['material_placement']}
- closing_action: {variation_tokens['closing_action']}
- energy_direction: {variation_tokens['energy_direction']}

## TAROT CONSTRAINTS (to prevent image repetition)
- FOCAL ELEMENT: {tarot_comp['focal']}
- FRAMING STYLE: {tarot_comp['framing']}
- SUPPORTING SYMBOLS: {', '.join(tarot_comp['symbols'])}
The tarot card image MUST use these constraints. Do NOT deviate.

## ALLOWED SOURCES (cite ONLY by source_id from this list)
{allowed_sources_text}

## PERSONA VOICE STYLE
{persona_config['section_grammar']['voice_style']}

## VISUAL DNA
Primary Motif: {persona_config['visual_dna']['constants']['primary_motif']}
Art Style: {persona_config['visual_dna']['constants']['art_style']}
AVOID in visuals: {', '.join(persona_config['visual_dna']['avoid'])}

## OUTPUT FORMAT
Return ONLY this JSON (no markdown, no explanation):
{{
    "spell_title": "A unique, evocative title",
    "spell_subtitle": "A short poetic line",
    "format_id": "{linked_format['format_id'] if linked_format else 'general'}",
    "section_order": {json.dumps(format_section_order)},
    "variation_tokens": {json.dumps(variation_tokens)},
    "selected_practices": ["practice_id_1", "practice_id_2"],
    "selected_sources": [
        {{"source_id": "...", "usage": "How this source informs this spell"}}
    ],
    "personalization_hooks": {{
        "name_usage": "How/where to use seeker's name",
        "anchor_integration": "How anchor object is central",
        "setting_details": "Specific setting adaptations",
        "feeling_arc": "How spell moves toward desired feeling"
    }},
    "tarot_constraints": {{
        "focal_element": "{tarot_comp['focal']}",
        "framing_style": "{tarot_comp['framing']}",
        "supporting_symbols": {json.dumps(tarot_comp['symbols'])}
    }},
    "asset_plan": {{
        "header_image": {{
            "scene_description": "Detailed scene (NOT the tarot focal)",
            "mood": "...",
            "key_elements": ["..."]
        }},
        "tarot_card_image": {{
            "must_include_focal": "{tarot_comp['focal']}",
            "must_use_framing": "{tarot_comp['framing']}",
            "must_include_symbols": {json.dumps(tarot_comp['symbols'])}
        }},
        "sigil": {{
            "design_concept": "Simple black/white geometric design",
            "elements": ["..."]
        }},
        "dividers": [
            {{"placement": "after_introduction", "motif": "simple motif 1"}},
            {{"placement": "after_working", "motif": "different motif 2"}},
            {{"placement": "before_closing", "motif": "different motif 3"}}
        ]
    }}
}}

STRICT RULES:
1. selected_sources MUST only contain source_ids from ALLOWED SOURCES list
2. tarot_card_image MUST use the tarot_constraints provided
3. header_image MUST be different from tarot (scene vs emblem)
4. Use variation_tokens to make this spell unique
"""
    return prompt


# ============================================================================
# STAGE 2: SPELL WRITER PROMPT
# ============================================================================

def build_spell_writer_prompt(spell_spec: dict, persona_config: dict, scenario: dict, plan: dict) -> str:
    """
    Stage 2: Spell Writer Prompt
    Takes the plan and writes the full spell content
    CRITICAL: Only cites from selected_sources in plan
    """
    
    belief_guidance = BELIEF_BOUNDARY_DESCRIPTIONS.get(
        spell_spec.get("belief_boundary", "spiritual_grounded"),
        BELIEF_BOUNDARY_DESCRIPTIONS["spiritual_grounded"]
    )
    
    time_guidance = {
        "2_min": "QUICK spell: 3-4 steps maximum. No setup. Immediate action.",
        "10_min": "FOCUSED spell: 5-6 steps. Brief setup, clear working.",
        "30_min": "FULL ritual: 7-9 steps. Proper setup, deep working, thorough closing."
    }.get(spell_spec.get("time", "10_min"), "5-6 steps, focused.")
    
    tone_guidance = {
        "gentle": "Soft, nurturing language. Invitation, not instruction.",
        "practical": "Clear, direct. Focus on what to do. Efficient.",
        "intense": "Powerful, evocative. Don't shy from darkness."
    }.get(spell_spec.get("tone", "practical"), "Clear and grounded.")
    
    # Build selected sources reference
    selected_sources = plan.get("selected_sources", [])
    sources_text = "\n".join([
        f"- [{s['source_id']}]: {s.get('usage', 'General reference')}"
        for s in selected_sources
    ])
    
    # Get variation tokens from plan
    variation_tokens = plan.get("variation_tokens", {})
    
    prompt = f"""You ARE {persona_config['name']}, {persona_config['title']}.

## YOUR VOICE
{persona_config['section_grammar']['voice_style']}

## THE SPELL YOU ARE WRITING
Title: {plan.get('spell_title', 'Untitled')}
Subtitle: {plan.get('spell_subtitle', '')}
Format: {plan.get('format_id', 'general')}

## SEEKER DETAILS
- Name: {spell_spec.get('user_name', 'Seeker')}
- Their Need: "{spell_spec.get('user_query', '')}"
- Desired Feeling: {spell_spec.get('desired_feeling', 'calm')}
- Anchor Object: {spell_spec.get('anchor_object', 'candle')}
- Setting: {spell_spec.get('setting', 'bedroom')}
- Things to Avoid: {spell_spec.get('avoid', 'None')}

## BELIEF BOUNDARY
{belief_guidance}

## TIME CONSTRAINT: {spell_spec.get('time', '10_min')}
{time_guidance}

## TONE: {spell_spec.get('tone', 'practical')}
{tone_guidance}

## VARIATION TOKENS (USE THESE for uniqueness)
- Time of Day: {variation_tokens.get('time_of_day', 'any')}
- Gesture Type: {variation_tokens.get('gesture_type', 'as feels right')}
- Repetition: {variation_tokens.get('repetition_pattern', 'three times')}
- Material Placement: {variation_tokens.get('material_placement', 'as guided')}
- Closing Action: {variation_tokens.get('closing_action', 'as feels complete')}
- Energy Direction: {variation_tokens.get('energy_direction', 'as needed')}

## SECTION ORDER (follow this exactly)
{json.dumps(plan.get('section_order', []))}

## PERSONALIZATION HOOKS (from planner)
{json.dumps(plan.get('personalization_hooks', {}))}

## ALLOWED SOURCES FOR THIS SPELL (cite ONLY these by source_id)
{sources_text if sources_text else "No specific sources - draw from persona's general knowledge"}

## OUTPUT FORMAT
Return ONLY this JSON (no markdown, no explanation):
{{
    "title": "{plan.get('spell_title', 'Untitled')}",
    "subtitle": "{plan.get('spell_subtitle', '')}",
    "format_id": "{plan.get('format_id', 'general')}",
    "scenario_id": "{scenario['scenario_id']}",
    "introduction": "Personal introduction acknowledging seeker by name and their situation. 2-3 sentences in {persona_config['name']}'s voice.",
    "timing": {{
        "time_of_day": "{variation_tokens.get('time_of_day', 'whenever needed')}",
        "moon_phase": "optional or Any",
        "day": "optional or Any",
        "note": "Any timing notes"
    }},
    "tarot_card": {{
        "title": "Short evocative title",
        "symbol": "Single emoji",
        "essence": "One sentence core meaning",
        "key_action": "Single most important action",
        "incantation": "Short memorable phrase from spoken_words",
        "timing": "Best time to perform"
    }},
    "materials": [
        {{"name": "Material", "icon": "emoji", "note": "Preparation note"}}
    ],
    "preparation": {{
        "description": "How to prepare (brief)",
        "steps": ["Prep step 1", "Prep step 2"]
    }},
    "the_working": {{
        "description": "The main body",
        "steps": [
            {{"step": 1, "title": "Step title", "instruction": "Detailed instruction using variation_tokens", "spoken_words": "Words to say or null", "duration": "optional"}}
        ]
    }},
    "spoken_words": {{
        "invocation": "Opening invocation",
        "main_incantation": "Primary words of power (memorable, specific)",
        "closing": "Closing words",
        "repetitions": 3,
        "delivery_notes": "How to speak (whisper/speak/sing)"
    }},
    "closing": {{
        "description": "How to close",
        "steps": ["Closing step using {variation_tokens.get('closing_action', 'as feels right')}"],
        "final_words": "Final phrase"
    }},
    "aftercare": {{
        "immediate": "What to do right after",
        "ongoing": "Any ongoing practices"
    }},
    "inspired_by": [
        {{
            "source_id": "MUST be from selected_sources",
            "source_type": "book/tradition/practice",
            "name": "Source name",
            "author": "Author if applicable",
            "connection": "How this connects to the spell",
            "archive_link": "/library or /rituals etc"
        }}
    ],
    "variations": [
        "Alternative approach 1",
        "Alternative approach 2"
    ]
}}

## STRICT CITATION RULE ⚠️
You may ONLY cite sources that appear in ALLOWED SOURCES above.
Every source_id in "inspired_by" MUST match a source_id from that list.
Do NOT invent sources. Do NOT cite sources not in the list.
If in doubt, cite fewer sources rather than hallucinate.

## CRITICAL RULES
1. Use seeker's name ({spell_spec.get('user_name', 'Seeker')}) at least TWICE
2. Anchor object ({spell_spec.get('anchor_object', 'candle')}) must be CENTRAL
3. Use variation_tokens in instructions for uniqueness
4. spoken_words.main_incantation must be MEMORABLE and SPECIFIC
5. Follow the section_order from plan
6. Match TIME constraint: {time_guidance}
"""
    return prompt


# ============================================================================
# IMAGE PROMPT BUILDERS
# ============================================================================

def build_image_prompt(asset_type: str, asset_plan: dict, persona_config: dict, spell_title: str) -> str:
    """
    Build DALL-E prompt for each asset type
    CRITICAL: Always inject CROWLANDS_ART_BIBLE tokens for consistent scarf/tapestry aesthetic
    Rules: "No text", print-friendly linework, hard art style rules
    """
    
    base_style = persona_config['visual_dna']['constants']['art_style']
    dall_e_rules = persona_config['visual_dna'].get('dall_e_rules', 'pen-and-ink illustration, NO text')
    avoid_list = persona_config['visual_dna']['avoid']
    
    # Get the global art bible suffix - this is CRITICAL for consistent scarf/tapestry aesthetic
    art_bible_suffix = get_art_bible_prompt_suffix()
    
    # Get asset role lock constraints
    role_lock = ASSET_ROLE_LOCKS.get(asset_type.split("_")[0], ASSET_ROLE_LOCKS.get("header", {}))
    role_suffix = role_lock.get('prompt_suffix', '')
    
    if asset_type == "header_image":
        asset_info = asset_plan.get("header_image", {})
        # Use persona-specific header_scene if available
        header_scene = persona_config['visual_dna'].get('header_scene', asset_info.get('scene_description', 'mystical scene'))
        
        prompt = f"""{base_style}, {header_scene}, 
{asset_info.get('mood', 'contemplative')} mood, 
featuring {', '.join(asset_info.get('key_elements', ['candle']))},
{role_suffix},
{dall_e_rules},
{art_bible_suffix},
AVOID: {', '.join(avoid_list)}"""

    elif asset_type == "tarot_card_image":
        asset_info = asset_plan.get("tarot_card_image", {})
        # Use persona-specific tarot_emblem if available
        tarot_emblem = persona_config['visual_dna'].get('tarot_emblem', '')
        focal = asset_info.get('must_include_focal', 'mystical emblem')
        framing = asset_info.get('must_use_framing', 'circular border')
        symbols = asset_info.get('must_include_symbols', ['star'])
        
        prompt = f"""{base_style}, SYMBOLIC EMBLEM (NOT a scene),
{tarot_emblem if tarot_emblem else f'FOCAL ELEMENT: {focal}'},
FRAMING: {framing},
SUPPORTING SYMBOLS: {', '.join(symbols)},
centered composition, suitable for tarot/oracle card,
medallion or seal style, symmetrical,
{role_suffix},
{dall_e_rules},
{art_bible_suffix},
MUST be visually DISTINCT from header image,
AVOID: {', '.join(avoid_list)}"""

    elif asset_type == "sigil":
        asset_info = asset_plan.get("sigil", {})
        prompt = f"""High contrast BLACK AND WHITE sigil design,
{asset_info.get('design_concept', 'mystical protective symbol')},
elements: {', '.join(asset_info.get('elements', ['circle', 'line']))},
geometric and organic lines combined,
PRINTABLE at small size, clear bold lines,
magical seal or protective mark style,
ultra-detailed engraved linework, symmetrical medallion,
BLACK AND WHITE ONLY, no color, no grey, no shading,
NO text, NO letters, NO words, NO signatures, NO watermarks"""

    elif asset_type.startswith("divider"):
        # Get the specific divider from the plan
        divider_idx = int(asset_type.split("_")[1]) - 1 if "_" in asset_type else 0
        dividers = asset_plan.get("dividers", [{}])
        divider_info = dividers[divider_idx] if divider_idx < len(dividers) else dividers[0] if dividers else {}
        
        prompt = f"""{base_style}, HORIZONTAL decorative divider,
ornamental border featuring {divider_info.get('motif', 'scrollwork')},
HORIZONTAL orientation (wide, not tall), symmetrical,
suitable for separating text sections in a book,
elegant, art nouveau filigree, engraved texture,
{dall_e_rules},
{art_bible_suffix},
AVOID: {', '.join(avoid_list)}"""

    else:
        prompt = f"{base_style}, mystical illustration, {art_bible_suffix}"
    
    return prompt.replace("\n", " ").strip()


def generate_all_image_prompts(asset_plan: dict, persona_config: dict, spell_title: str) -> dict:
    """Generate prompts for all 6 required assets"""
    prompts = {
        "header_image": build_image_prompt("header_image", asset_plan, persona_config, spell_title),
        "tarot_card_image": build_image_prompt("tarot_card_image", asset_plan, persona_config, spell_title),
        "sigil": build_image_prompt("sigil", asset_plan, persona_config, spell_title),
    }
    
    # Generate 3 divider prompts
    for i in range(3):
        prompts[f"divider_{i+1}"] = build_image_prompt(f"divider_{i+1}", asset_plan, persona_config, spell_title)
    
    return prompts


# ============================================================================
# SESSION TRACKING FOR SCENARIO ROTATION
# ============================================================================

_used_scenarios_cache = {}

def get_used_scenarios(session_id: str) -> list:
    """Get list of recently used scenario IDs for this session"""
    return _used_scenarios_cache.get(session_id, [])

def record_used_scenario(session_id: str, scenario_id: str):
    """Record that a scenario was used in this session"""
    if session_id not in _used_scenarios_cache:
        _used_scenarios_cache[session_id] = []
    _used_scenarios_cache[session_id].append(scenario_id)
    # Keep only last 5
    _used_scenarios_cache[session_id] = _used_scenarios_cache[session_id][-5:]
