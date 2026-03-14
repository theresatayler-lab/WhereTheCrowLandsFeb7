"""
Spell Quality Comparison Testing
Validates Claude-generated spells meet quality benchmarks
"""

import asyncio
import json
import time
import statistics
from typing import Dict, List, Any
import httpx

API_URL = "https://text-extraction-6.preview.emergentagent.com"

# Quality benchmarks based on historical GPT-4o performance
QUALITY_BENCHMARKS = {
    "min_blocks": 6,
    "max_blocks": 15,
    "min_total_words": 800,
    "max_total_words": 3000,
    "min_words_per_block": 50,
    "required_block_types": ["cold_open", "materials", "stepper", "closing"],
    "min_materials": 3,
    "min_steps": 4,
}

# Test intentions covering different spell types
TEST_INTENTIONS = [
    {"intention": "a calming ritual for anxiety", "persona_id": "shigg", "name": "Shigg - Calming"},
    {"intention": "protection spell for my home", "persona_id": "cathleen", "name": "Cathleen - Protection"},
    {"intention": "ritual for clarity and decision making", "persona_id": "katherine", "name": "Katherine - Clarity"},
    {"intention": "spell to connect with ancestors", "persona_id": "brenda", "name": "Brenda - Ancestors"},
    {"intention": "investigation ritual to uncover truth", "persona_id": "theresa", "name": "Theresa - Truth"},
]


def count_words(text: str) -> int:
    """Count words in text"""
    if not text:
        return 0
    return len(text.split())


def analyze_spell_quality(spell: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze quality metrics of a generated spell"""
    blocks = spell.get("blocks", [])
    
    # Basic metrics
    block_count = len(blocks)
    block_types = [b.get("block_type", "unknown") for b in blocks]
    
    # Word counts
    total_words = 0
    block_word_counts = []
    for block in blocks:
        content = block.get("content", "")
        if isinstance(content, str):
            words = count_words(content)
        elif isinstance(content, dict):
            # Handle structured content (materials, steps, etc.)
            words = count_words(json.dumps(content))
        elif isinstance(content, list):
            words = sum(count_words(str(item)) for item in content)
        else:
            words = 0
        total_words += words
        block_word_counts.append(words)
    
    # Materials analysis
    materials_block = next((b for b in blocks if b.get("block_type") == "materials"), None)
    materials_count = 0
    if materials_block:
        content = materials_block.get("content", {})
        if isinstance(content, dict):
            materials_count = len(content.get("items", []))
        elif isinstance(content, list):
            materials_count = len(content)
    
    # Steps analysis
    stepper_block = next((b for b in blocks if b.get("block_type") == "stepper"), None)
    steps_count = 0
    if stepper_block:
        content = stepper_block.get("content", {})
        if isinstance(content, dict):
            steps_count = len(content.get("steps", []))
        elif isinstance(content, list):
            steps_count = len(content)
    
    # Check required block types
    required_present = [bt for bt in QUALITY_BENCHMARKS["required_block_types"] if bt in block_types]
    required_missing = [bt for bt in QUALITY_BENCHMARKS["required_block_types"] if bt not in block_types]
    
    return {
        "spell_title": spell.get("spell_title", "Untitled"),
        "block_count": block_count,
        "block_types": block_types,
        "total_words": total_words,
        "avg_words_per_block": total_words / block_count if block_count > 0 else 0,
        "min_block_words": min(block_word_counts) if block_word_counts else 0,
        "max_block_words": max(block_word_counts) if block_word_counts else 0,
        "materials_count": materials_count,
        "steps_count": steps_count,
        "required_blocks_present": required_present,
        "required_blocks_missing": required_missing,
        "has_title": bool(spell.get("spell_title")),
        "has_subtitle": bool(spell.get("spell_subtitle")),
    }


def evaluate_against_benchmarks(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """Evaluate metrics against quality benchmarks"""
    issues = []
    passes = []
    
    # Block count check
    if metrics["block_count"] < QUALITY_BENCHMARKS["min_blocks"]:
        issues.append(f"Too few blocks: {metrics['block_count']} < {QUALITY_BENCHMARKS['min_blocks']}")
    elif metrics["block_count"] > QUALITY_BENCHMARKS["max_blocks"]:
        issues.append(f"Too many blocks: {metrics['block_count']} > {QUALITY_BENCHMARKS['max_blocks']}")
    else:
        passes.append(f"Block count OK: {metrics['block_count']}")
    
    # Word count check
    if metrics["total_words"] < QUALITY_BENCHMARKS["min_total_words"]:
        issues.append(f"Too few words: {metrics['total_words']} < {QUALITY_BENCHMARKS['min_total_words']}")
    elif metrics["total_words"] > QUALITY_BENCHMARKS["max_total_words"]:
        issues.append(f"Too many words: {metrics['total_words']} > {QUALITY_BENCHMARKS['max_total_words']}")
    else:
        passes.append(f"Word count OK: {metrics['total_words']}")
    
    # Required blocks check
    if metrics["required_blocks_missing"]:
        issues.append(f"Missing required blocks: {metrics['required_blocks_missing']}")
    else:
        passes.append("All required blocks present")
    
    # Materials check
    if metrics["materials_count"] < QUALITY_BENCHMARKS["min_materials"]:
        issues.append(f"Too few materials: {metrics['materials_count']} < {QUALITY_BENCHMARKS['min_materials']}")
    else:
        passes.append(f"Materials count OK: {metrics['materials_count']}")
    
    # Steps check
    if metrics["steps_count"] < QUALITY_BENCHMARKS["min_steps"]:
        issues.append(f"Too few steps: {metrics['steps_count']} < {QUALITY_BENCHMARKS['min_steps']}")
    else:
        passes.append(f"Steps count OK: {metrics['steps_count']}")
    
    return {
        "passes": passes,
        "issues": issues,
        "score": len(passes) / (len(passes) + len(issues)) * 100 if (passes or issues) else 0
    }


async def generate_spell_async(client: httpx.AsyncClient, intention: str, persona_id: str) -> Dict[str, Any]:
    """Generate a spell using the async job endpoint"""
    # Start the job
    response = await client.post(
        f"{API_URL}/api/ai/generate-spell-job",
        json={
            "spell_spec": {
                "intention": intention,
                "persona_id": persona_id
            },
            "belief_mode": "SPIRITUAL",
            "tier_preference": "quick"
        },
        timeout=30.0
    )
    
    if response.status_code != 200:
        return {"error": f"Failed to start job: {response.status_code}"}
    
    job_data = response.json()
    job_id = job_data.get("job_id")
    
    if not job_id:
        return {"error": "No job_id returned"}
    
    # Poll for completion
    max_polls = 30  # 150 seconds max
    for _ in range(max_polls):
        await asyncio.sleep(5)
        
        poll_response = await client.get(
            f"{API_URL}/api/ai/spell-job/{job_id}",
            timeout=10.0
        )
        
        if poll_response.status_code != 200:
            continue
        
        poll_data = poll_response.json()
        status = poll_data.get("status")
        
        if status == "completed":
            return poll_data.get("result", {})
        elif status == "failed":
            return {"error": poll_data.get("error", "Job failed")}
    
    return {"error": "Job timed out"}


async def run_quality_tests():
    """Run quality tests on Claude-generated spells"""
    print("=" * 60)
    print("SPELL QUALITY COMPARISON TESTING")
    print("Validating Claude-generated content meets quality benchmarks")
    print("=" * 60)
    print()
    
    results = []
    
    async with httpx.AsyncClient() as client:
        for test in TEST_INTENTIONS:
            print(f"\n--- Testing: {test['name']} ---")
            print(f"Intention: {test['intention']}")
            
            start_time = time.time()
            spell = await generate_spell_async(client, test["intention"], test["persona_id"])
            generation_time = time.time() - start_time
            
            if "error" in spell:
                print(f"ERROR: {spell['error']}")
                results.append({
                    "test": test["name"],
                    "error": spell["error"],
                    "generation_time_s": generation_time
                })
                continue
            
            # Analyze quality
            metrics = analyze_spell_quality(spell)
            evaluation = evaluate_against_benchmarks(metrics)
            
            print(f"Title: {metrics['spell_title']}")
            print(f"Generation time: {generation_time:.1f}s")
            print(f"Blocks: {metrics['block_count']} | Words: {metrics['total_words']}")
            print(f"Materials: {metrics['materials_count']} | Steps: {metrics['steps_count']}")
            print(f"Quality Score: {evaluation['score']:.0f}%")
            
            if evaluation["issues"]:
                print(f"Issues: {evaluation['issues']}")
            
            results.append({
                "test": test["name"],
                "spell_title": metrics["spell_title"],
                "generation_time_s": generation_time,
                "metrics": metrics,
                "evaluation": evaluation
            })
    
    # Summary
    print("\n" + "=" * 60)
    print("QUALITY TEST SUMMARY")
    print("=" * 60)
    
    successful = [r for r in results if "error" not in r]
    failed = [r for r in results if "error" in r]
    
    if successful:
        avg_score = statistics.mean([r["evaluation"]["score"] for r in successful])
        avg_time = statistics.mean([r["generation_time_s"] for r in successful])
        avg_words = statistics.mean([r["metrics"]["total_words"] for r in successful])
        avg_blocks = statistics.mean([r["metrics"]["block_count"] for r in successful])
        
        print(f"\nSuccessful generations: {len(successful)}/{len(results)}")
        print(f"Average quality score: {avg_score:.0f}%")
        print(f"Average generation time: {avg_time:.1f}s")
        print(f"Average word count: {avg_words:.0f}")
        print(f"Average block count: {avg_blocks:.1f}")
        
        # Overall pass/fail
        if avg_score >= 80:
            print("\n✅ QUALITY CHECK PASSED - Claude spells meet quality benchmarks")
        elif avg_score >= 60:
            print("\n⚠️ QUALITY CHECK PARTIAL - Some metrics below benchmark")
        else:
            print("\n❌ QUALITY CHECK FAILED - Significant quality issues")
    
    if failed:
        print(f"\nFailed generations: {len(failed)}")
        for f in failed:
            print(f"  - {f['test']}: {f['error']}")
    
    # Save results
    report = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "provider": "anthropic",
        "model": "claude-sonnet-4-20250514",
        "benchmarks": QUALITY_BENCHMARKS,
        "results": results,
        "summary": {
            "total_tests": len(results),
            "successful": len(successful),
            "failed": len(failed),
            "avg_quality_score": statistics.mean([r["evaluation"]["score"] for r in successful]) if successful else 0,
            "avg_generation_time_s": statistics.mean([r["generation_time_s"] for r in successful]) if successful else 0
        }
    }
    
    with open("/app/test_reports/spell_quality_report.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"\nReport saved to /app/test_reports/spell_quality_report.json")
    
    return report


if __name__ == "__main__":
    asyncio.run(run_quality_tests())
