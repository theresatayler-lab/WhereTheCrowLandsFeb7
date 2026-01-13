# Belief Boundary System
# Controls framing language based on seeker's worldview

BELIEF_MODES = {
    "SECULAR": {
        "id": "SECULAR",
        "label": "Secular / Psychological",
        "description": "Approaches practice from a secular/psychological framework",
        "framing_guidance": """Frame all practices as psychological exercises, habit-setting, or mindfulness techniques.
Avoid supernatural claims. Use phrases like:
- "this creates a mental anchor"
- "ritual acts as psychological container"
- "the symbolic action helps focus intention"
- "this practice has been shown to reduce anxiety through..."
- "the repetitive action activates the parasympathetic nervous system"

DO NOT use:
- "the energy will..."
- "spirits/entities..."
- "magical power..."
- "the universe will..."

Frame sources in terms of anthropological/psychological value, not magical efficacy.""",
        "allowed_claims": ["psychological", "historical", "anthropological", "symbolic"],
        "forbidden_claims": ["magical_efficacy", "spirit_contact", "energy_work"]
    },
    
    "SPIRITUAL": {
        "id": "SPIRITUAL",
        "label": "Spiritual / Open",
        "description": "Spiritually open but values grounded practices",
        "framing_guidance": """You may reference energy, intention, and subtle influence, but stay practical.
Frame magic as focused intention + symbolic action. Use phrases like:
- "this practice helps align your intention with..."
- "the symbolic correspondence between X and Y..."
- "many practitioners find that..."
- "the tradition holds that..."
- "working with the energy of..."

AVOID dramatic supernatural claims like:
- "this will summon..."
- "the spirits will definitely..."
- "guaranteed magical results..."

Balance between psychological grounding and openness to mystery.""",
        "allowed_claims": ["symbolic", "energetic", "traditional", "experiential"],
        "forbidden_claims": ["guaranteed_outcomes", "dramatic_supernatural"]
    },
    
    "PRACTITIONER": {
        "id": "PRACTITIONER",
        "label": "Experienced Practitioner",
        "description": "Experienced practitioner who accepts magical frameworks",
        "framing_guidance": """You may speak directly about magic, energy work, and subtle realms.
Use the language of practice:
- "the working..."
- "raising energy..."
- "the correspondence between..."
- "ancestral guidance..."
- "the liminal space..."

Still NEVER claim:
- Certainty about outcomes
- Ability to harm or coerce
- Medical benefits
- Contact with malevolent entities

Assume familiarity with basic concepts. Include advanced elements.
Reference tradition-specific terminology where appropriate.""",
        "allowed_claims": ["magical", "energetic", "spirit_contact", "advanced_practice"],
        "forbidden_claims": ["harm", "coercion", "certainty", "medical"]
    }
}


def get_belief_framing(mode: str) -> dict:
    """Get framing guidance for a belief mode"""
    return BELIEF_MODES.get(mode.upper(), BELIEF_MODES["SPIRITUAL"])


def validate_belief_compliance(spell_output: dict, mode: str) -> tuple[bool, list[str]]:
    """
    Check if spell output complies with belief mode restrictions.
    Returns (is_compliant, list_of_issues)
    """
    issues = []
    # Get belief config for potential future use with forbidden_claims
    _ = BELIEF_MODES.get(mode.upper(), BELIEF_MODES["SPIRITUAL"])
    
    text_content = _extract_text(spell_output)
    
    # Mode-specific forbidden phrases
    forbidden_phrases = {
        "SECULAR": [
            "the energy will",
            "spirits will",
            "magical power",
            "the universe will provide",
            "manifest destiny",
            "raise your vibration"
        ],
        "SPIRITUAL": [
            "this will definitely summon",
            "guaranteed magical",
            "the spirits demand"
        ],
        "PRACTITIONER": [
            "this will definitely",
            "guaranteed to harm",
            "you have no choice"
        ]
    }
    
    for phrase in forbidden_phrases.get(mode.upper(), []):
        if phrase.lower() in text_content.lower():
            issues.append(f"BELIEF_MODE_VIOLATION ({mode}): '{phrase}'")
    
    return len(issues) == 0, issues


def _extract_text(obj) -> str:
    """Extract all text from nested structure"""
    if isinstance(obj, str):
        return obj + " "
    elif isinstance(obj, list):
        return " ".join(_extract_text(item) for item in obj)
    elif isinstance(obj, dict):
        return " ".join(_extract_text(v) for v in obj.values())
    return ""


def adapt_claim_for_mode(claim: str, claim_type: str, mode: str) -> str:
    """
    Adapt a claim's language for the specified belief mode.
    Used by the Writer to reframe Archivist facts.
    """
    mode_upper = mode.upper()
    
    if mode_upper == "SECULAR":
        # Add psychological framing
        prefixes = [
            "From a symbolic perspective, ",
            "Historically, practitioners believed ",
            "The psychological function of this is ",
            "As a meditative focus, "
        ]
        import random
        return random.choice(prefixes) + claim
    
    elif mode == "SPIRITUAL":
        # Soften certainty
        if "will" in claim:
            claim = claim.replace(" will ", " may ")
        if claim_type == "speculative":
            claim = "Some traditions suggest that " + claim
        return claim
    
    else:  # PRACTITIONER
        # Can use direct language
        return claim
