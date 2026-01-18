# QA Blocks - Validation for Blocks-Based Spells
# Validates blocks structure, required blocks, and content

from typing import Tuple, List, Dict
from .hard_limits import HARD_LIMITS, validate_hard_limits
from .belief_modes import validate_belief_compliance
from .writer import WRITER_CONTRACTS


# === TABOO KEYWORD MAP (V1.2) ===
# Expanded keywords for each taboo theme, per persona
TABOO_KEYWORDS_MAP = {
    "shigg": {
        "modern crystal shop language": ["crystal grid", "charging crystals", "crystal healing", "chakra stones", "crystal energy"],
        "neon cyber occult aesthetics": ["neon", "cyber", "digital sigil", "tech magic", "cyber witch"],
        "new age manifestation talk": ["manifest your", "manifestation", "law of attraction", "abundance mindset", "raise your vibration", "high vibration"],
        "Instagram witch aesthetic": ["witchy vibes", "witch aesthetic", "cottagecore witch", "#witchesofinstagram"],
        "generic spirituality clichés": ["the universe wants", "everything happens for a reason", "your truth", "live your best life"]
    },
    "cathleen": {
        "kitchen-witch domestic aesthetics": ["kitchen witch", "hearth magic", "domestic goddess", "cozy kitchen"],
        "teacups and cozy domesticity": ["teacup reading", "tea leaves", "cozy kitchen", "kettle charm", "tea ritual"],
        "new age love-and-light bypassing": ["love and light", "good vibes only", "positive vibes", "toxic positivity", "just be positive"],
        "tailoring and sewing imagery": ["needle and thread", "stitch", "measuring tape", "scissors", "hemming"]
    },
    "katherine": {
        "cozy domestic teacup imagery": ["teacup", "tea leaves", "kettle sings", "cozy kitchen", "warm hearth"],
        "warm kitchen aesthetics": ["kitchen witch", "hearth magic", "domestic magic", "cozy corner", "warm kitchen"],
        "bird oracle work": ["bird omen", "bird oracle", "what the birds say", "feathered messenger", "sparrow says"],
        "vague intuition-based practice": ["just feel it", "trust your gut", "intuition says", "vibe check", "feels right"],
        "devotional hymn styling": ["blessed be", "so mote it be", "praise the", "glory to"]
    }
}


def run_qa_blocks_validation(
    spell_output: dict, 
    guide_id: str, 
    belief_mode: str
) -> Tuple[bool, dict]:
    """
    Run QA validation for blocks-based spell output.
    Returns (is_valid, validation_report)
    """
    
    report = {
        "checks_passed": [],
        "checks_failed": [],
        "violations": [],
        "verdict": "APPROVED",
        "rewrite_instructions": None
    }
    
    # === CRITICAL CHECKS (any failure = REWRITE_REQUIRED) ===
    
    # 1. Check required blocks exist
    _check_required_blocks(spell_output, report)
    
    # 2. Check choice block has valid options
    _check_choice_block(spell_output, report)
    
    # 3. Check lore_vignette meets requirements
    _check_lore_vignette(spell_output, report)
    
    # 4. Check persona_lock is valid
    _check_persona_lock(spell_output, report)
    
    # 5. Check blocks match template
    _check_template_match(spell_output, guide_id, report)
    
    # === HIGH CHECKS ===
    
    # 6. Check stepper steps have 'why'
    _check_stepper_whys(spell_output, report)
    
    # 7. Check canon_anchor is present
    _check_canon_anchor(spell_output, report)
    
    # 8. Hard limits check
    hard_ok, hard_violations = validate_hard_limits(spell_output)
    if not hard_ok:
        for v in hard_violations:
            report["violations"].append({
                "check": "hard_limits",
                "severity": "CRITICAL" if "COERCION" in v or "FORBIDDEN" in v else "HIGH",
                "issue": v,
                "fix_instruction": "Remove or rephrase the violating content"
            })
            report["checks_failed"].append(f"hard_limits: {v}")
    else:
        report["checks_passed"].append("hard_limits")
    
    # 9. Belief mode compliance
    belief_ok, belief_violations = validate_belief_compliance(spell_output, belief_mode)
    if not belief_ok:
        for v in belief_violations:
            report["violations"].append({
                "check": "belief_mode",
                "severity": "HIGH",
                "issue": v,
                "fix_instruction": f"Adjust language to match {belief_mode} framing"
            })
            report["checks_failed"].append(f"belief_mode: {v}")
    else:
        report["checks_passed"].append("belief_mode")
    
    # 10. Guide voice check
    _check_guide_voice(spell_output, guide_id, report)
    
    # === DETERMINE VERDICT ===
    critical_count = sum(1 for v in report["violations"] if v["severity"] == "CRITICAL")
    high_count = sum(1 for v in report["violations"] if v["severity"] == "HIGH")
    
    if critical_count > 0:
        report["verdict"] = "REWRITE_REQUIRED"
        report["rewrite_instructions"] = _build_rewrite_instructions(report["violations"])
    elif high_count >= 2:
        report["verdict"] = "REWRITE_REQUIRED"
        report["rewrite_instructions"] = _build_rewrite_instructions(report["violations"])
    
    return report["verdict"] == "APPROVED", report


def _check_required_blocks(spell: dict, report: dict):
    """Check that all required blocks are present"""
    blocks = spell.get("blocks", [])
    block_types = [b.get("block_type") for b in blocks]
    
    required = ["choice", "lore_vignette", "cold_open", "stepper", "closing"]
    
    for req in required:
        if req not in block_types:
            report["violations"].append({
                "check": "required_blocks",
                "severity": "CRITICAL",
                "issue": f"Missing required block: {req}",
                "fix_instruction": f"Add a {req} block to the spell"
            })
            report["checks_failed"].append(f"required_blocks: {req}")
    
    if all(r in block_types for r in required):
        report["checks_passed"].append("required_blocks")


def _check_choice_block(spell: dict, report: dict):
    """Validate choice block has genuine options"""
    blocks = spell.get("blocks", [])
    choice_blocks = [b for b in blocks if b.get("block_type") == "choice"]
    
    if not choice_blocks:
        # Already caught by required_blocks
        return
    
    for cb in choice_blocks:
        content = cb.get("content", {})
        options = content.get("options", [])
        
        if len(options) < 2:
            report["violations"].append({
                "check": "choice_block",
                "severity": "CRITICAL",
                "issue": f"Choice block has insufficient options: {len(options)} (need 2+)",
                "fix_instruction": "Add at least 2 meaningful options to the choice block"
            })
            report["checks_failed"].append("choice_block: insufficient_options")
        elif not content.get("prompt"):
            report["violations"].append({
                "check": "choice_block",
                "severity": "HIGH",
                "issue": "Choice block missing prompt",
                "fix_instruction": "Add a clear prompt/question to the choice block"
            })
            report["checks_failed"].append("choice_block: missing_prompt")
        else:
            report["checks_passed"].append("choice_block")


def _check_lore_vignette(spell: dict, report: dict):
    """Validate lore_vignette block meets requirements"""
    blocks = spell.get("blocks", [])
    lore_blocks = [b for b in blocks if b.get("block_type") == "lore_vignette"]
    
    if not lore_blocks:
        # Already caught by required_blocks
        return
    
    for lb in lore_blocks:
        content = lb.get("content", {})
        narrative = content.get("narrative", "")
        
        if len(narrative) < 100:
            report["violations"].append({
                "check": "lore_vignette",
                "severity": "CRITICAL",
                "issue": f"Lore vignette too short: {len(narrative)} chars (need 100+)",
                "fix_instruction": "Expand the lore vignette narrative to at least 100 words"
            })
            report["checks_failed"].append("lore_vignette: too_short")
        elif not content.get("canon_anchor_id"):
            report["violations"].append({
                "check": "lore_vignette",
                "severity": "HIGH",
                "issue": "Lore vignette missing canon_anchor_id connection",
                "fix_instruction": "Link the lore vignette to the canon_anchor"
            })
            report["checks_failed"].append("lore_vignette: missing_anchor")
        else:
            report["checks_passed"].append("lore_vignette")


def _check_persona_lock(spell: dict, report: dict):
    """Validate persona_lock is properly defined"""
    lock = spell.get("persona_lock", {})
    
    errors = []
    
    props = lock.get("props", [])
    if not props or len(props) < 2:
        errors.append("Missing or insufficient props (need 2-3)")
    
    if not lock.get("sensory_cue"):
        errors.append("Missing sensory_cue")
    
    if not lock.get("signature_move"):
        errors.append("Missing signature_move")
    
    if errors:
        report["violations"].append({
            "check": "persona_lock",
            "severity": "CRITICAL",
            "issue": f"Persona lock invalid: {', '.join(errors)}",
            "fix_instruction": "Complete the persona_lock with 2-3 props, sensory_cue, and signature_move"
        })
        report["checks_failed"].append("persona_lock")
    else:
        report["checks_passed"].append("persona_lock")


def _check_template_match(spell: dict, guide_id: str, report: dict):
    """Check that blocks match the guide's template"""
    from .planner_blocks import BLOCK_TEMPLATES
    
    template = BLOCK_TEMPLATES.get(guide_id, BLOCK_TEMPLATES["shigg"])
    required_types = [b["type"] for b in template["required_blocks"] if b["required"]]
    
    blocks = spell.get("blocks", [])
    block_types = [b.get("block_type") for b in blocks]
    
    missing = [r for r in required_types if r not in block_types]
    
    if missing:
        # Don't double-report choice/lore_vignette
        missing = [m for m in missing if m not in ["choice", "lore_vignette", "cold_open", "stepper", "closing"]]
        if missing:
            report["violations"].append({
                "check": "template_match",
                "severity": "HIGH",
                "issue": f"Missing template blocks for {guide_id}: {missing}",
                "fix_instruction": f"Add missing blocks: {missing}"
            })
            report["checks_failed"].append(f"template_match: {missing}")
    
    if not missing:
        report["checks_passed"].append("template_match")


def _check_stepper_whys(spell: dict, report: dict):
    """Check that stepper steps have 'why' explanations"""
    blocks = spell.get("blocks", [])
    stepper_blocks = [b for b in blocks if b.get("block_type") == "stepper"]
    
    missing_whys = []
    
    for sb in stepper_blocks:
        steps = sb.get("content", {}).get("steps", [])
        for i, step in enumerate(steps):
            why = step.get("why", "")
            if not why or len(why) < 20:
                missing_whys.append(i + 1)
    
    if missing_whys:
        report["violations"].append({
            "check": "stepper_whys",
            "severity": "HIGH",
            "issue": f"Steps missing 'why' explanation: {missing_whys}",
            "fix_instruction": "Add 'why' explanations (20+ chars) to all steps"
        })
        report["checks_failed"].append(f"stepper_whys: {missing_whys}")
    else:
        report["checks_passed"].append("stepper_whys")


def _check_canon_anchor(spell: dict, report: dict):
    """Check that canon_anchor is present and valid"""
    anchor = spell.get("canon_anchor", {})
    
    if not anchor.get("id"):
        report["violations"].append({
            "check": "canon_anchor",
            "severity": "HIGH",
            "issue": "Missing canon_anchor.id",
            "fix_instruction": "Add a canon_anchor with id, type, title, and relevance"
        })
        report["checks_failed"].append("canon_anchor: missing_id")
    elif not anchor.get("relevance"):
        report["violations"].append({
            "check": "canon_anchor",
            "severity": "MEDIUM",
            "issue": "Canon anchor missing relevance explanation",
            "fix_instruction": "Add relevance field to canon_anchor"
        })
        report["checks_failed"].append("canon_anchor: missing_relevance")
    else:
        report["checks_passed"].append("canon_anchor")


def _check_guide_voice(spell: dict, guide_id: str, report: dict):
    """Check guide voice compliance"""
    contract = WRITER_CONTRACTS.get(guide_id, WRITER_CONTRACTS["shigg"])
    
    text = _extract_all_text(spell)
    
    # Check for forbidden phrases
    for phrase in contract["voice"]["never_says"]:
        if phrase.lower() in text.lower():
            report["violations"].append({
                "check": "guide_voice",
                "severity": "HIGH",
                "issue": f"Uses forbidden phrase: '{phrase}'",
                "fix_instruction": f"Remove or rephrase '{phrase}'"
            })
            report["checks_failed"].append(f"guide_voice: {phrase}")
            return
    
    report["checks_passed"].append("guide_voice")


def _extract_all_text(obj, depth=0) -> str:
    """Extract all text from nested structure"""
    if depth > 10:
        return ""
    if isinstance(obj, str):
        return obj + " "
    elif isinstance(obj, list):
        return " ".join(_extract_all_text(item, depth+1) for item in obj)
    elif isinstance(obj, dict):
        return " ".join(_extract_all_text(v, depth+1) for v in obj.values())
    return ""


def _build_rewrite_instructions(violations: list) -> str:
    """Build rewrite instructions from violations"""
    instructions = ["Fix the following issues:\n"]
    
    critical = [v for v in violations if v["severity"] == "CRITICAL"]
    high = [v for v in violations if v["severity"] == "HIGH"]
    
    for v in critical:
        instructions.append(f"[CRITICAL] {v['check']}: {v['fix_instruction']}")
    
    for v in high:
        instructions.append(f"[HIGH] {v['check']}: {v['fix_instruction']}")
    
    return "\n".join(instructions)
