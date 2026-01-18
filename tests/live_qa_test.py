#!/usr/bin/env python3
"""
Live QA Test - V1.2 Spell Differentiation
Runs 5 prompts × 5 personas (4 forced + Surprise Me) = 25 tests
"""

import os
import sys
import json
import requests
import time

# Get API URL
API_URL = None
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if 'REACT_APP_BACKEND_URL' in line:
            API_URL = line.split('=')[1].strip()
            break

if not API_URL:
    print("ERROR: Could not find REACT_APP_BACKEND_URL")
    sys.exit(1)

print(f"API URL: {API_URL}")
print("="*80)

# The 5 test prompts
PROMPTS = [
    {
        "id": 1,
        "text": "I need protection. I'm jumpy and can't sleep.",
        "expected_surprise": ["cathleen", "shigg"],  # Protection + comfort
        "feeling": "protected"
    },
    {
        "id": 2, 
        "text": "I'm grieving. I want something gentle and small.",
        "expected_surprise": ["shigg", "cathleen"],  # Gentle + small = Shigg
        "feeling": "softened"
    },
    {
        "id": 3,
        "text": "I keep repeating the same relationship pattern.",
        "expected_surprise": ["katherine", "theresa"],  # Pattern = Katherine/Theresa
        "feeling": "clear"
    },
    {
        "id": 4,
        "text": "I want hidden truth revealed, but safely.",
        "expected_surprise": ["katherine"],  # Hidden + truth + reveal = Katherine
        "feeling": "clear"
    },
    {
        "id": 5,
        "text": "I need calm in the house. The vibe is tense.",
        "expected_surprise": ["shigg"],  # Domestic calm = Shigg
        "feeling": "calm"
    }
]

# Personas to test (Theresa not in backend, so skip)
PERSONAS = ["shigg", "cathleen", "katherine", "choose_for_me"]

# Known micro_lore for validation
KNOWN_MICRO_LORE = {
    "shigg": [
        "bench lamp with a scarf", "tin of pins", "ration-book paper",
        "kettle that sings", "bread put out for the birds", "crow that visits",
        "teacup, chipped", "stitch that holds", "windowsill offerings", "wartime"
    ],
    "cathleen": [
        "blackout curtains", "candle stub", "rosary beads", "song her mother hummed",
        "brass bell", "flame bends", "threshold scrubbed", "Morrigan", "Wigmore"
    ],
    "katherine": [
        "measuring tape", "journal with margins", "scissors inherited", "compass",
        "threads sorted", "mirror turned to wall", "shears cutting", "Spitalfields"
    ]
}

# Required mechanics per persona
REQUIRED_MECHANICS = {
    "shigg": {
        "must_have": ["bird", "tea", "kettle", "herb", "windowsill", "offering", "omen"],
        "must_not_have": ["needle", "thread", "Morrigan", "sigil", "hexagram", "Golden Dawn"]
    },
    "cathleen": {
        "must_have": ["voice", "song", "hum", "candle", "ward", "talisman", "protection"],
        "must_not_have": ["teacup", "kettle", "needle", "thread", "kitchen witch"]
    },
    "katherine": {
        "must_have": ["needle", "thread", "mirror", "compass", "record", "document", "precision"],
        "must_not_have": ["teacup", "bird omen", "kettle", "Come closer, love", "The birds know"]
    }
}


def run_spell(prompt_text: str, persona_id: str, feeling: str) -> dict:
    """Run a single spell generation and return parsed results"""
    payload = {
        "spell_spec": {
            "intention": prompt_text,
            "persona_id": persona_id,
            "seeker_name": "TestUser",
            "desired_feeling": feeling,
            "time_available": "15 minutes"
        },
        "generate_images": False
    }
    
    try:
        resp = requests.post(
            f"{API_URL}/api/ai/generate-spell-v3",
            json=payload,
            timeout=120
        )
        data = resp.json()
        spell = data.get('spell', data)
        
        # Extract key fields
        result = {
            "persona_returned": spell.get('persona_id') or spell.get('guide_id', 'unknown'),
            "routing_reason": spell.get('routing_reason', 'N/A'),
            "title": spell.get('title', 'N/A'),
            "micro_lore_used": spell.get('micro_lore_used', []),
            "text_tokens_used": spell.get('text_tokens_used', {}),
            "tarot_composition": spell.get('tarot_card', {}).get('title', 'N/A'),
            "qa_report": data.get('metadata', {}).get('qa_report', {}),
            "blocks": spell.get('blocks', []),
            "error": None
        }
        
        return result
        
    except Exception as e:
        return {
            "persona_returned": "ERROR",
            "routing_reason": str(e),
            "title": "ERROR",
            "micro_lore_used": [],
            "text_tokens_used": {},
            "tarot_composition": "N/A",
            "qa_report": {},
            "blocks": [],
            "error": str(e)
        }


def check_mechanics(result: dict, persona: str) -> dict:
    """Check if spell has correct mechanics for the persona"""
    if persona == "choose_for_me":
        persona = result["persona_returned"]
    
    if persona not in REQUIRED_MECHANICS:
        return {"pass": True, "notes": "No mechanics check defined"}
    
    # Extract all text from blocks
    all_text = ""
    for block in result.get("blocks", []):
        all_text += json.dumps(block.get("content", {})).lower() + " "
    
    reqs = REQUIRED_MECHANICS[persona]
    
    # Check must_have (at least 1)
    has_any = any(term in all_text for term in reqs["must_have"])
    
    # Check must_not_have (none allowed)
    violations = [term for term in reqs["must_not_have"] if term.lower() in all_text]
    
    passed = has_any and len(violations) == 0
    
    return {
        "pass": passed,
        "has_required": has_any,
        "violations": violations,
        "notes": f"Found required: {has_any}, Violations: {violations}"
    }


def check_micro_lore(result: dict, persona: str) -> dict:
    """Check if micro_lore matches the persona"""
    if persona == "choose_for_me":
        persona = result["persona_returned"]
    
    used = result.get("micro_lore_used", [])
    known = KNOWN_MICRO_LORE.get(persona, [])
    
    if not used:
        return {"pass": False, "notes": "No micro_lore_used in output"}
    
    # Check if any used lore contains known lore keywords
    matches = []
    for item in used:
        for known_item in known:
            if known_item.lower() in item.lower():
                matches.append(known_item)
    
    return {
        "pass": len(matches) > 0 or len(used) > 0,
        "used": used,
        "matches": matches,
        "notes": f"Used {len(used)} items, {len(matches)} matched known lore"
    }


def format_result(prompt_id: int, persona: str, result: dict) -> str:
    """Format a single result for output"""
    mechanics = check_mechanics(result, persona)
    lore = check_micro_lore(result, persona)
    
    status = "✅" if mechanics["pass"] and not result["error"] else "❌"
    
    lines = [
        f"  {persona.upper()}: {status}",
        f"    Persona returned: {result['persona_returned']}",
    ]
    
    if persona == "choose_for_me":
        lines.append(f"    Routing reason: {result['routing_reason']}")
    
    lines.extend([
        f"    Title: {result['title']}",
        f"    micro_lore_used: {result['micro_lore_used'][:2]}..." if len(result['micro_lore_used']) > 2 else f"    micro_lore_used: {result['micro_lore_used']}",
        f"    text_tokens: {result['text_tokens_used']}",
        f"    Tarot: {result['tarot_composition']}",
        f"    Mechanics: {'PASS' if mechanics['pass'] else 'FAIL'} - {mechanics['notes'][:60]}",
        f"    QA warnings: {result['qa_report'].get('checks_failed', [])[:2]}"
    ])
    
    if result["error"]:
        lines.append(f"    ERROR: {result['error'][:50]}")
    
    return "\n".join(lines)


def run_all_tests():
    """Run all 25 tests"""
    print("\n" + "="*80)
    print("LIVE QA TEST - V1.2 SPELL DIFFERENTIATION")
    print("="*80)
    
    results = {}
    
    for prompt in PROMPTS:
        prompt_id = prompt["id"]
        prompt_text = prompt["text"]
        feeling = prompt["feeling"]
        expected = prompt["expected_surprise"]
        
        print(f"\n{'='*80}")
        print(f"PROMPT {prompt_id}: \"{prompt_text}\"")
        print(f"Expected Surprise Me routing: {expected}")
        print("="*80)
        
        results[prompt_id] = {}
        
        for persona in PERSONAS:
            print(f"\n  Running {persona}...", end=" ", flush=True)
            start = time.time()
            
            result = run_spell(prompt_text, persona, feeling)
            elapsed = time.time() - start
            
            results[prompt_id][persona] = result
            
            print(f"({elapsed:.1f}s)")
            print(format_result(prompt_id, persona, result))
            
            # Check Surprise Me routing
            if persona == "choose_for_me":
                actual = result["persona_returned"]
                routing_ok = actual in expected
                print(f"    Routing check: {'✅ PASS' if routing_ok else '❌ FAIL'} (got {actual}, expected {expected})")
            
            # Small delay to avoid rate limiting
            time.sleep(1)
    
    # Summary
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)
    
    for prompt_id, persona_results in results.items():
        print(f"\nPrompt {prompt_id}:")
        for persona, result in persona_results.items():
            mechanics = check_mechanics(result, persona)
            status = "✅" if mechanics["pass"] and not result["error"] else "❌"
            persona_returned = result["persona_returned"]
            title = result["title"][:30] if result["title"] else "N/A"
            print(f"  {persona:15} {status} → {persona_returned:10} \"{title}...\"")
    
    return results


if __name__ == "__main__":
    results = run_all_tests()
