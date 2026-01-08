# Spell Generation Prompts - Three-stage prompt system
# 1. Planner - selects scenario, format, sources, builds AssetPlan
# 2. Spell Writer - writes the actual spell content
# 3. Image Prompt Generator - creates prompts for each asset

import json
from typing import Dict, List, Any
from persona_config import (
    get_persona_config, select_scenario_for_spell, 
    BELIEF_BOUNDARY_DESCRIPTIONS, ASSET_TYPES
)

def build_planner_prompt(spell_spec: dict, persona_config: dict, scenario: dict) -> str:
    """
    Stage 1: Planner Prompt
    Selects the specific approach, sources to cite, and builds the AssetPlan
    """
    
    belief_guidance = BELIEF_BOUNDARY_DESCRIPTIONS.get(
        spell_spec.get("belief_boundary", "spiritual_grounded"),
        BELIEF_BOUNDARY_DESCRIPTIONS["spiritual_grounded"]
    )
    
    allowed_sources_text = "\n".join([
        f"- {s['author']}: \"{s['work']}\" ({s['year'] or 'Traditional'})"
        for s in persona_config.get("allowed_sources", [])
    ])
    
    prompt = f"""You are the Spell Planner for {persona_config['name']}, {persona_config['title']}.

## YOUR TASK
Create a detailed spell plan based on the seeker's needs. You must:
1. Adapt the scenario to their specific situation
2. Select 2-3 sources to cite from the allowed list ONLY
3. Create an AssetPlan for visual elements
4. Ensure the spell feels PERSONAL and UNIQUE

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
Scenario: {scenario['name']}
Description: {scenario['description']}
Best For: {', '.join(scenario['best_for'])}
Required Sections: {', '.join(scenario['required_sections'])}

## ALLOWED SOURCES (cite ONLY from this list)
{allowed_sources_text}

## PERSONA VOICE STYLE
{persona_config['section_grammar']['voice_style']}

## VISUAL DNA FOR ASSETS
Primary Motif: {persona_config['visual_dna']['constants']['primary_motif']}
Secondary Motif: {persona_config['visual_dna']['constants']['secondary_motif']}
Art Style: {persona_config['visual_dna']['constants']['art_style']}
Motif Library: {', '.join(persona_config['visual_dna']['motif_library'][:8])}
AVOID in visuals: {', '.join(persona_config['visual_dna']['avoid'])}

## OUTPUT FORMAT
Return a JSON object with this structure:
{{
    "spell_title": "A unique, evocative title for this specific spell",
    "spell_subtitle": "A short poetic line that captures the essence",
    "personalization_hooks": {{
        "name_usage": "How/where to use the seeker's name",
        "anchor_integration": "How the anchor object is central to the working",
        "setting_details": "Specific details about performing in their setting",
        "feeling_arc": "How the spell moves them toward their desired feeling"
    }},
    "selected_sources": [
        {{"author": "...", "work": "...", "usage": "How this source informs this spell"}}
    ],
    "section_plan": [
        {{"section_name": "...", "purpose": "...", "key_elements": ["..."]}}
    ],
    "asset_plan": {{
        "header_image": {{
            "scene_description": "Detailed description of the header scene",
            "composition": "scene/portrait/still_life",
            "mood": "...",
            "key_elements": ["motif1", "motif2", "motif3"]
        }},
        "tarot_card_image": {{
            "symbol_description": "Symbolic/emblematic image - DIFFERENT from header",
            "composition": "emblem/sigil_plate/diagram",
            "central_symbol": "...",
            "supporting_elements": ["..."]
        }},
        "sigil": {{
            "design_description": "Simple geometric/organic design for the sigil",
            "elements": ["..."]
        }},
        "dividers": [
            {{"placement": "after_section_name", "motif": "..."}},
            {{"placement": "after_section_name", "motif": "..."}}
        ],
        "micro_icons": [
            {{"for_section": "materials", "icon": "..."}},
            {{"for_section": "the_working", "icon": "..."}},
            {{"for_section": "spoken_words", "icon": "..."}},
            {{"for_section": "closing", "icon": "..."}},
            {{"for_section": "inspired_by", "icon": "..."}}
        ]
    }},
    "variation_notes": "What makes THIS spell different from others using the same scenario"
}}

CRITICAL RULES:
1. The tarot_card_image MUST be visually distinct from header_image (different composition, different focus)
2. Only cite sources from the ALLOWED SOURCES list
3. Personalize heavily based on the seeker's name, anchor object, and setting
4. The spell must feel like it was created specifically for THIS person and THIS moment
"""
    return prompt


def build_spell_writer_prompt(spell_spec: dict, persona_config: dict, scenario: dict, plan: dict) -> str:
    """
    Stage 2: Spell Writer Prompt
    Takes the plan and writes the full spell content
    """
    
    belief_guidance = BELIEF_BOUNDARY_DESCRIPTIONS.get(
        spell_spec.get("belief_boundary", "spiritual_grounded"),
        BELIEF_BOUNDARY_DESCRIPTIONS["spiritual_grounded"]
    )
    
    time_guidance = {
        "2_min": "This is a QUICK spell. 3-4 steps maximum. No elaborate setup. Something they can do right now.",
        "10_min": "This is a focused spell. 5-6 steps. Some setup but not elaborate. Clear and purposeful.",
        "30_min": "This is a full ritual. 7-9 steps. Allow for proper setup, working, and closing. Can include meditation."
    }.get(spell_spec.get("time", "10_min"), "5-6 steps, focused and clear.")
    
    tone_guidance = {
        "gentle": "Use soft, nurturing language. Offer reassurance. Frame everything as invitation, not instruction.",
        "practical": "Be clear and direct. Focus on what to do, not elaborate explanation. Efficient and grounded.",
        "intense": "Use powerful, evocative language. Don't shy from darkness or difficulty. This is serious work."
    }.get(spell_spec.get("tone", "practical"), "Clear and grounded.")
    
    prompt = f"""You are {persona_config['name']}, {persona_config['title']}.

## YOUR VOICE
{persona_config['section_grammar']['voice_style']}

## THE SPELL YOU ARE WRITING
Title: {plan.get('spell_title', 'Untitled Spell')}
Subtitle: {plan.get('spell_subtitle', '')}

## SEEKER DETAILS
- Name: {spell_spec.get('user_name', 'Seeker')}
- Their Need: "{spell_spec.get('user_query', '')}"
- Desired Feeling: {spell_spec.get('desired_feeling', 'calm')}
- Anchor Object: {spell_spec.get('anchor_object', 'candle')}
- Setting: {spell_spec.get('setting', 'bedroom')}
- Things to Avoid: {spell_spec.get('avoid', 'None')}

## BELIEF BOUNDARY
{belief_guidance}

## TIME CONSTRAINT
{time_guidance}

## TONE
{tone_guidance}

## SECTION PLAN FROM PLANNER
{json.dumps(plan.get('section_plan', []), indent=2)}

## PERSONALIZATION HOOKS FROM PLANNER
{json.dumps(plan.get('personalization_hooks', {}), indent=2)}

## SOURCES TO CITE
{json.dumps(plan.get('selected_sources', []), indent=2)}

## OUTPUT FORMAT
Return a JSON object with this exact structure:
{{
    "title": "{plan.get('spell_title', 'Untitled')}",
    "subtitle": "{plan.get('spell_subtitle', '')}",
    "introduction": "A personal, warm introduction that acknowledges the seeker by name and their specific situation. 2-3 sentences.",
    "tarot_card": {{
        "title": "Short evocative title for the tarot representation",
        "symbol": "Single emoji that represents this spell",
        "essence": "One sentence capturing the spell's core meaning",
        "key_action": "The single most important action in this spell",
        "incantation": "A short, memorable phrase from the spoken words",
        "timing": "Best time to perform (morning/evening/midnight/whenever needed)"
    }},
    "materials": [
        {{"name": "Material name", "icon": "emoji", "note": "Why this material, how to prepare it"}}
    ],
    "preparation": {{
        "description": "How to prepare yourself and space",
        "steps": ["Step 1", "Step 2"]
    }},
    "the_working": {{
        "description": "The main body of the spell",
        "steps": [
            {{"step": 1, "instruction": "Detailed instruction", "spoken_words": "Any words to say (or null)"}}
        ]
    }},
    "spoken_words": {{
        "primary_incantation": "The main words of power for this spell",
        "repetitions": 3,
        "delivery_notes": "How to speak these words (whispered/spoken/sung)"
    }},
    "closing": {{
        "description": "How to close the working",
        "steps": ["Step 1", "Step 2"],
        "final_words": "Closing phrase or gesture"
    }},
    "aftercare": {{
        "immediate": "What to do right after",
        "ongoing": "Any ongoing practices or observations"
    }},
    "inspired_by": [
        {{
            "source_type": "book/tradition/practice/figure/deity",
            "name": "Name of source",
            "author": "Author if applicable",
            "connection": "How this source connects to the spell",
            "archive_link": "/library or /rituals or /figures or /deities or /timeline"
        }}
    ],
    "variations": [
        "Alternative approach 1 for different circumstances",
        "Alternative approach 2"
    ]
}}

CRITICAL RULES:
1. Use the seeker's name ({spell_spec.get('user_name', 'Seeker')}) at least twice - in introduction and at a key moment
2. The anchor object ({spell_spec.get('anchor_object', 'candle')}) must be CENTRAL to the working, not just mentioned
3. Include specific details for their setting ({spell_spec.get('setting', 'bedroom')})
4. AVOID: {spell_spec.get('avoid', 'Nothing specified')}
5. Only cite sources from the SELECTED SOURCES list provided
6. The spoken_words should be memorable and specific to THIS spell, not generic
7. Match the TIME constraint - {spell_spec.get('time', '10_min')} means {time_guidance}
"""
    return prompt


def build_image_prompt(asset_type: str, asset_plan: dict, persona_config: dict, spell_title: str) -> str:
    """
    Stage 3: Image Prompt Generator
    Creates a DALL-E prompt for each asset in the AssetPlan
    """
    
    base_style = persona_config['visual_dna']['constants']['art_style']
    avoid_list = persona_config['visual_dna']['avoid']
    palette = persona_config['visual_dna']['palette_variants'].get('practical', [])
    
    if asset_type == "header_image":
        asset_info = asset_plan.get("header_image", {})
        prompt = f"""{base_style}, {asset_info.get('scene_description', 'mystical scene')}, 
{asset_info.get('mood', 'contemplative')} mood, 
featuring {', '.join(asset_info.get('key_elements', ['candle', 'shadow']))},
{asset_info.get('composition', 'scene')} composition,
color palette: {', '.join(palette)},
highly detailed, atmospheric, no text or words,
for a spell titled "{spell_title}",
AVOID: {', '.join(avoid_list)}, no text, no letters, no words"""

    elif asset_type == "tarot_card_image":
        asset_info = asset_plan.get("tarot_card_image", {})
        # Enforce different composition from header
        prompt = f"""{base_style}, SYMBOLIC EMBLEM style (NOT a scene),
{asset_info.get('symbol_description', 'mystical emblem')},
centered {asset_info.get('composition', 'emblem')} composition,
central symbol: {asset_info.get('central_symbol', 'mystical symbol')},
supporting elements: {', '.join(asset_info.get('supporting_elements', ['stars']))},
suitable for a tarot card or oracle card,
medallion or seal style, symmetrical where appropriate,
color palette: {', '.join(palette)},
MUST BE DIFFERENT FROM HEADER - emblematic not narrative,
no text, no letters, no words,
AVOID: {', '.join(avoid_list)}"""

    elif asset_type == "sigil":
        asset_info = asset_plan.get("sigil", {})
        prompt = f"""High contrast black and white sigil design,
{asset_info.get('design_description', 'mystical sigil')},
geometric and organic lines combined,
elements: {', '.join(asset_info.get('elements', ['circle', 'line']))},
printable at small size, clear lines,
magical seal or protective mark style,
BLACK AND WHITE ONLY, no color, no grey,
no text, no letters, no words"""

    elif asset_type == "divider":
        divider_info = asset_plan.get("dividers", [{}])[0]
        prompt = f"""{base_style}, horizontal decorative divider,
ornamental border element featuring {divider_info.get('motif', 'scrollwork')},
horizontal orientation, symmetrical,
color palette: {', '.join(palette[:2])},
elegant and subtle, not overwhelming,
suitable for separating text sections,
no text, no letters, no words,
AVOID: {', '.join(avoid_list)}"""

    elif asset_type == "micro_icon":
        icon_info = asset_plan.get("micro_icons", [{}])[0]
        prompt = f"""Simple iconic symbol, {icon_info.get('icon', 'mystical symbol')},
single motif only, works at small size,
{base_style} aesthetic but simplified,
clear silhouette, minimal detail,
suitable for 32x32px display,
no text, no letters, no words"""

    else:
        prompt = f"{base_style}, mystical illustration, no text"
    
    return prompt.replace("\n", " ").strip()


def generate_all_image_prompts(asset_plan: dict, persona_config: dict, spell_title: str) -> dict:
    """Generate prompts for all assets in the plan"""
    prompts = {
        "header_image": build_image_prompt("header_image", asset_plan, persona_config, spell_title),
        "tarot_card_image": build_image_prompt("tarot_card_image", asset_plan, persona_config, spell_title),
        "sigil": build_image_prompt("sigil", asset_plan, persona_config, spell_title),
    }
    
    # Generate divider prompts
    dividers = asset_plan.get("dividers", [])
    for i, divider in enumerate(dividers[:3]):  # Max 3 dividers
        prompts[f"divider_{i+1}"] = build_image_prompt("divider", {"dividers": [divider]}, persona_config, spell_title)
    
    # Generate micro icon prompts
    micro_icons = asset_plan.get("micro_icons", [])
    for i, icon in enumerate(micro_icons[:6]):  # Max 6 micro icons
        prompts[f"micro_icon_{i+1}"] = build_image_prompt("micro_icon", {"micro_icons": [icon]}, persona_config, spell_title)
    
    return prompts


# Tracking recently used scenarios per user session
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
