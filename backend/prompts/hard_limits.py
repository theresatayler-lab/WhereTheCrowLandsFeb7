# Hard Limits - Universal Constraints
# These rules apply to ALL personas and ALL spell outputs

HARD_LIMITS = {
    "forbidden_content": [
        "coercion_magic",      # Magic targeting someone without consent
        "harm_curses",         # Curses, hexes intended to harm
        "medical_claims",      # Diagnoses, treatment promises
        "certainty_claims",    # "This WILL work" guarantees
        "malevolent_entities", # Contact with demons, harmful spirits
        "controlling_others",  # Magic to control another's will
        "death_magic",         # Rituals invoking death
        "blood_magic",         # Requires blood (beyond symbolic pricks)
        "binding_without_consent"  # Binding another person
    ],
    
    "required_safety": {
        "open_flames": "Always offer LED candle alternative",
        "smoke_incense": "Always offer essential oil or visualization alternative",
        "sharp_objects": "Always offer blunt alternatives",
        "ingestion": "External use only, never ingest",
        "trance_states": "Always include grounding instructions",
        "spirit_contact": "Always include protection and closing"
    },
    
    "forbidden_phrases": [
        "this will definitely",
        "guaranteed to",
        "you must do exactly",
        "without this step it won't work",
        "the spirits demand",
        "you have no choice",
        "align your vibration",
        "raise your frequency",
        "manifest your destiny",
        "the universe will provide"
    ],
    
    "required_elements": {
        "every_spell": [
            "clear_intent",
            "safety_note",
            "closing_ritual",
            "ethics_statement"
        ],
        "spirit_work": [
            "protection_opening",
            "discernment_clause",
            "closing_dismissal"
        ],
        "shadow_work": [
            "grounding_before",
            "grounding_after",
            "emotional_safety_note"
        ]
    },
    
    "validation_rules": {
        "max_steps": 7,
        "min_steps": 3,
        "max_materials": 7,
        "min_materials": 2,
        "max_sources": 5,
        "min_sources": 2,
        "required_why_per_step": True,
        "required_substitutions": True
    }
}

def validate_hard_limits(spell_output: dict) -> tuple[bool, list[str]]:
    """
    Validate spell output against hard limits.
    Returns (is_valid, list_of_violations)
    Supports both flat (V2) and blocks-based (V3) spell structures.
    """
    violations = []
    
    # Detect if this is a blocks-based spell
    is_blocks = "blocks" in spell_output and isinstance(spell_output.get("blocks"), list)
    
    # Check for forbidden phrases in all text content
    text_content = _extract_all_text(spell_output)
    for phrase in HARD_LIMITS["forbidden_phrases"]:
        if phrase.lower() in text_content.lower():
            violations.append(f"FORBIDDEN_PHRASE: '{phrase}'")
    
    if is_blocks:
        # BLOCKS VALIDATION
        blocks = spell_output.get("blocks", [])
        
        # Extract steps from stepper block
        stepper_blocks = [b for b in blocks if b.get("block_type") == "stepper"]
        steps = []
        for sb in stepper_blocks:
            steps.extend(sb.get("content", {}).get("steps", []))
        
        # Extract materials from materials block
        materials_blocks = [b for b in blocks if b.get("block_type") == "materials"]
        materials = []
        for mb in materials_blocks:
            materials.extend(mb.get("content", {}).get("items", []))
        
        # Check step count
        if len(steps) < HARD_LIMITS["validation_rules"]["min_steps"]:
            violations.append(f"TOO_FEW_STEPS: {len(steps)} < {HARD_LIMITS['validation_rules']['min_steps']}")
        if len(steps) > HARD_LIMITS["validation_rules"]["max_steps"]:
            violations.append(f"TOO_MANY_STEPS: {len(steps)} > {HARD_LIMITS['validation_rules']['max_steps']}")
        
        # Check materials count
        if len(materials) < HARD_LIMITS["validation_rules"]["min_materials"]:
            violations.append(f"TOO_FEW_MATERIALS: {len(materials)}")
        if len(materials) > HARD_LIMITS["validation_rules"]["max_materials"]:
            violations.append(f"TOO_MANY_MATERIALS: {len(materials)}")
        
        # Check why per step
        if HARD_LIMITS["validation_rules"]["required_why_per_step"]:
            for i, step in enumerate(steps):
                if not step.get("why"):
                    violations.append(f"MISSING_WHY: step {i+1}")
        
        # Check required blocks exist (basic)
        block_types = [b.get("block_type") for b in blocks]
        if "closing" not in block_types:
            violations.append("MISSING_REQUIRED: closing_block")
        
    else:
        # FLAT (V2) VALIDATION
        steps = spell_output.get("steps", [])
        if len(steps) < HARD_LIMITS["validation_rules"]["min_steps"]:
            violations.append(f"TOO_FEW_STEPS: {len(steps)} < {HARD_LIMITS['validation_rules']['min_steps']}")
        if len(steps) > HARD_LIMITS["validation_rules"]["max_steps"]:
            violations.append(f"TOO_MANY_STEPS: {len(steps)} > {HARD_LIMITS['validation_rules']['max_steps']}")
        
        materials = spell_output.get("materials", [])
        if len(materials) < HARD_LIMITS["validation_rules"]["min_materials"]:
            violations.append(f"TOO_FEW_MATERIALS: {len(materials)}")
        if len(materials) > HARD_LIMITS["validation_rules"]["max_materials"]:
            violations.append(f"TOO_MANY_MATERIALS: {len(materials)}")
        
        if HARD_LIMITS["validation_rules"]["required_why_per_step"]:
            for i, step in enumerate(steps):
                if not step.get("why"):
                    violations.append(f"MISSING_WHY: step {i+1}")
        
        for element in HARD_LIMITS["required_elements"]["every_spell"]:
            field_map = {
                "clear_intent": "intent",
                "safety_note": "safety_ethics",
                "closing_ritual": "closing",
                "ethics_statement": "ethics_statement"
            }
            if not spell_output.get(field_map.get(element, element)):
                violations.append(f"MISSING_REQUIRED: {element}")
    
    # Check sources count (same for both)
    sources = spell_output.get("sources", [])
    if len(sources) < HARD_LIMITS["validation_rules"]["min_sources"]:
        violations.append(f"TOO_FEW_SOURCES: {len(sources)}")
    if len(sources) > HARD_LIMITS["validation_rules"]["max_sources"]:
        violations.append(f"TOO_MANY_SOURCES: {len(sources)}")
    
    # Check for coercion indicators
    coercion_indicators = [
        "make them", "force them", "without their knowledge",
        "control their", "bind them to", "against their will"
    ]
    for indicator in coercion_indicators:
        if indicator.lower() in text_content.lower():
            violations.append(f"COERCION_DETECTED: '{indicator}'")
    
    return len(violations) == 0, violations
    if len(sources) > HARD_LIMITS["validation_rules"]["max_sources"]:
        violations.append(f"TOO_MANY_SOURCES: {len(sources)}")
    
    # Check why_per_step requirement
    if HARD_LIMITS["validation_rules"]["required_why_per_step"]:
        for i, step in enumerate(steps):
            if not step.get("why"):
                violations.append(f"MISSING_WHY: step {i+1}")
    
    # Check required elements
    for element in HARD_LIMITS["required_elements"]["every_spell"]:
        field_map = {
            "clear_intent": "intent",
            "safety_note": "safety_ethics",
            "closing_ritual": "closing",
            "ethics_statement": "ethics_statement"
        }
        if not spell_output.get(field_map.get(element, element)):
            violations.append(f"MISSING_REQUIRED: {element}")
    
    # Check for coercion indicators
    coercion_indicators = [
        "make them", "force them", "without their knowledge",
        "control their", "bind them to", "against their will"
    ]
    for indicator in coercion_indicators:
        if indicator.lower() in text_content.lower():
            violations.append(f"COERCION_DETECTED: '{indicator}'")
    
    return len(violations) == 0, violations


def _extract_all_text(obj, depth=0) -> str:
    """Recursively extract all text from nested structure"""
    if depth > 10:  # Prevent infinite recursion
        return ""
    
    if isinstance(obj, str):
        return obj + " "
    elif isinstance(obj, list):
        return " ".join(_extract_all_text(item, depth+1) for item in obj)
    elif isinstance(obj, dict):
        return " ".join(_extract_all_text(v, depth+1) for v in obj.values())
    return ""


def get_safety_substitution(material: str) -> str:
    """Get safe substitution for potentially hazardous materials"""
    substitutions = {
        "candle": "LED candle or visualization of flame",
        "incense": "essential oil diffuser or visualization of smoke rising",
        "knife": "butter knife, wooden letter opener, or finger tracing",
        "athame": "blunt ritual knife, wand, or pointed crystal",
        "fire": "LED candle, red cloth, or visualization",
        "blood": "red ink, pomegranate juice, or red thread",
        "sharp needle": "blunt tapestry needle or toothpick",
        "alcohol": "grape juice or water blessed with intention"
    }
    
    material_lower = material.lower()
    for key, sub in substitutions.items():
        if key in material_lower:
            return sub
    
    return None
