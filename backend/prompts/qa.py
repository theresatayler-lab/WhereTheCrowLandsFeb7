# QA Prompt - Stage 4 of Pipeline
# Validates spell output, triggers rewrite if violations found

import json
from typing import Dict, List, Tuple
from .hard_limits import HARD_LIMITS, validate_hard_limits
from .belief_modes import validate_belief_compliance
from .writer import WRITER_CONTRACTS

QA_RULES = {
    "structure_checks": [
        "title_length",          # 5-100 chars
        "intent_testable",       # Contains measurable outcome
        "step_count",            # 3-7 steps
        "material_count",        # 2-7 materials
        "source_count",          # 2-5 sources
        "why_per_step",          # Every step has why
        "closing_complete",      # All closing elements present
        "persona_lock_valid"     # Props + sensory + signature
    ],
    
    "content_checks": [
        "no_forbidden_phrases",  # From hard limits
        "belief_mode_compliance",# Framing matches mode
        "guide_voice_match",     # Uses signature phrases, avoids forbidden
        "no_coercion",           # No controlling others
        "no_certainty_claims",   # No guarantees
        "safety_present",        # Safety/ethics statement exists
        "sources_cited"          # References research packet sources
    ],
    
    "quality_checks": [
        "why_uses_facts",        # Why explanations cite research
        "persona_identifiable",  # Guide identifiable in first 3 lines
        "structure_lock_followed", # Matches guide's required structure
        "variations_practical"   # Variations are actually useful
    ]
}


def build_qa_prompt(spell_output: dict, guide_id: str, belief_mode: str, research_packet: dict) -> str:
    """
    Stage 4: QA Prompt
    Validates spell and triggers rewrite if needed.
    """
    
    contract = WRITER_CONTRACTS.get(guide_id, WRITER_CONTRACTS["shigg"])
    
    # Pre-validate with our functions
    hard_limit_ok, hard_violations = validate_hard_limits(spell_output)
    belief_ok, belief_violations = validate_belief_compliance(spell_output, belief_mode)
    
    # Build violations report for LLM QA
    pre_violations = hard_violations + belief_violations
    
    prompt = f"""## SPELL QA - STAGE 4

You are the Quality Assurance agent for Crowlands spells.
Your job is to validate the spell output and either APPROVE or REWRITE.

## SPELL TO VALIDATE
```json
{json.dumps(spell_output, indent=2)}
```

## GUIDE CONTRACT: {contract['name']}
Required structure: {contract['structure']}
Required elements: {', '.join(contract['required_elements'])}
Forbidden elements: {', '.join(contract['forbidden_elements'])}
Never says: {', '.join(contract['voice']['never_says'])}

## BELIEF MODE: {belief_mode}

## PRE-VALIDATION RESULTS
{f"HARD LIMIT VIOLATIONS: {', '.join(pre_violations)}" if pre_violations else "No pre-validation violations detected."}

## RESEARCH FACTS (check if 'why' references these)
{_format_facts_for_qa(research_packet.get('facts', []))}

## QA CHECKLIST
Run each check and report pass/fail:

### Structure Checks
- [ ] title_length: 5-100 characters?
- [ ] intent_testable: Contains measurable/observable outcome?
- [ ] step_count: 3-7 steps?
- [ ] material_count: 2-7 materials?
- [ ] source_count: 2-5 sources?
- [ ] why_per_step: Every step has 'why' field with 20+ chars?
- [ ] closing_complete: license_to_depart, unseal_action, physical_action all present?
- [ ] persona_lock_valid: 2-3 props, sensory_cue, signature_move?

### Content Checks
- [ ] no_forbidden_phrases: None from hard limits?
- [ ] belief_mode_compliance: Framing matches {belief_mode}?
- [ ] guide_voice_match: Uses signature phrases, avoids forbidden?
- [ ] no_coercion: No controlling/binding others without consent?
- [ ] no_certainty_claims: No "will definitely", "guaranteed"?
- [ ] safety_present: safety_ethics field exists and is meaningful?
- [ ] sources_cited: References sources from research packet?

### Quality Checks
- [ ] why_uses_facts: 'Why' explanations reference research facts?
- [ ] persona_identifiable: Guide identifiable in first 3 lines?
- [ ] structure_lock_followed: Matches {contract['name']}'s required structure?

## OUTPUT FORMAT
Return ONLY this JSON:

{{
    "verdict": "APPROVED" or "REWRITE_REQUIRED",
    "checks_passed": ["list of passed checks"],
    "checks_failed": ["list of failed checks"],
    "violations": [
        {{
            "check": "check_name",
            "severity": "CRITICAL|HIGH|MEDIUM|LOW",
            "issue": "description of problem",
            "fix_instruction": "how to fix it"
        }}
    ],
    "rewrite_instructions": "If REWRITE_REQUIRED, detailed instructions for Writer to fix issues. Otherwise null.",
    "confidence": 0.0-1.0
}}

## VERDICT RULES
- Any CRITICAL violation → REWRITE_REQUIRED
- 3+ HIGH violations → REWRITE_REQUIRED
- Otherwise → APPROVED

CRITICAL violations:
- Coercion/harm content
- Medical claims
- Missing required sections
- Completely wrong guide voice

HIGH violations:
- Missing 'why' on steps
- Wrong belief mode framing
- Forbidden phrases present
- Not enough sources"""

    return prompt


def _format_facts_for_qa(facts: list) -> str:
    """Format research facts for QA to check against"""
    if not facts:
        return "No research facts provided."
    
    formatted = ""
    for i, fact in enumerate(facts[:6]):
        formatted += f"{i+1}. {fact.get('claim', 'Unknown claim')}\n"
    return formatted


def run_qa_validation(spell_output: dict, guide_id: str, belief_mode: str) -> Tuple[bool, dict]:
    """
    Run programmatic QA validation (before/instead of LLM QA).
    Returns (is_valid, validation_report)
    """
    
    report = {
        "checks_passed": [],
        "checks_failed": [],
        "violations": [],
        "verdict": "APPROVED"
    }
    
    # Structure checks
    _check_structure(spell_output, report)
    
    # Hard limit checks
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
    
    # Belief mode checks
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
    
    # Guide voice checks
    _check_guide_voice(spell_output, guide_id, report)
    
    # Determine verdict
    critical_count = sum(1 for v in report["violations"] if v["severity"] == "CRITICAL")
    high_count = sum(1 for v in report["violations"] if v["severity"] == "HIGH")
    
    if critical_count > 0 or high_count >= 3:
        report["verdict"] = "REWRITE_REQUIRED"
        report["rewrite_instructions"] = _build_rewrite_instructions(report["violations"])
    
    return report["verdict"] == "APPROVED", report


def _check_structure(spell: dict, report: dict):
    """Check structural requirements"""
    
    # Title length
    title = spell.get("title", "")
    if 5 <= len(title) <= 100:
        report["checks_passed"].append("title_length")
    else:
        report["checks_failed"].append(f"title_length: {len(title)} chars")
        report["violations"].append({
            "check": "title_length",
            "severity": "MEDIUM",
            "issue": f"Title length {len(title)} not in 5-100 range",
            "fix_instruction": "Adjust title length"
        })
    
    # Step count
    steps = spell.get("steps", [])
    if 3 <= len(steps) <= 7:
        report["checks_passed"].append("step_count")
    else:
        report["checks_failed"].append(f"step_count: {len(steps)}")
        report["violations"].append({
            "check": "step_count",
            "severity": "HIGH",
            "issue": f"Step count {len(steps)} not in 3-7 range",
            "fix_instruction": "Adjust to 3-7 steps"
        })
    
    # Material count
    materials = spell.get("materials", [])
    if 2 <= len(materials) <= 7:
        report["checks_passed"].append("material_count")
    else:
        report["checks_failed"].append(f"material_count: {len(materials)}")
        report["violations"].append({
            "check": "material_count",
            "severity": "MEDIUM",
            "issue": f"Material count {len(materials)} not in 2-7 range",
            "fix_instruction": "Adjust to 2-7 materials"
        })
    
    # Source count
    sources = spell.get("sources", [])
    if 2 <= len(sources) <= 5:
        report["checks_passed"].append("source_count")
    else:
        report["checks_failed"].append(f"source_count: {len(sources)}")
        report["violations"].append({
            "check": "source_count",
            "severity": "HIGH",
            "issue": f"Source count {len(sources)} not in 2-5 range",
            "fix_instruction": "Ensure 2-5 sources are cited"
        })
    
    # Why per step
    missing_why = []
    for i, step in enumerate(steps):
        if not step.get("why") or len(step.get("why", "")) < 20:
            missing_why.append(i + 1)
    
    if not missing_why:
        report["checks_passed"].append("why_per_step")
    else:
        report["checks_failed"].append(f"why_per_step: missing on steps {missing_why}")
        report["violations"].append({
            "check": "why_per_step",
            "severity": "HIGH",
            "issue": f"Steps {missing_why} missing 'why' explanation",
            "fix_instruction": "Add why explanation (20+ chars) to each step"
        })


def _check_guide_voice(spell: dict, guide_id: str, report: dict):
    """Check guide voice compliance"""
    contract = WRITER_CONTRACTS.get(guide_id, WRITER_CONTRACTS["shigg"])
    
    text = _extract_text(spell)
    
    # Check for forbidden phrases
    for phrase in contract["voice"]["never_says"]:
        if phrase.lower() in text.lower():
            report["checks_failed"].append(f"guide_voice: uses '{phrase}'")
            report["violations"].append({
                "check": "guide_voice",
                "severity": "HIGH",
                "issue": f"Uses forbidden phrase: '{phrase}'",
                "fix_instruction": f"Remove or rephrase '{phrase}'"
            })
            return
    
    report["checks_passed"].append("guide_voice")


def _extract_text(obj) -> str:
    """Extract all text from nested structure"""
    if isinstance(obj, str):
        return obj + " "
    elif isinstance(obj, list):
        return " ".join(_extract_text(item) for item in obj)
    elif isinstance(obj, dict):
        return " ".join(_extract_text(v) for v in obj.values())
    return ""


def _build_rewrite_instructions(violations: list) -> str:
    """Build rewrite instructions from violations"""
    instructions = ["Please fix the following issues:\n"]
    
    for v in violations:
        if v["severity"] in ["CRITICAL", "HIGH"]:
            instructions.append(f"- {v['check']}: {v['fix_instruction']}")
    
    return "\n".join(instructions)
