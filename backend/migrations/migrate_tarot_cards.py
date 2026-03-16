#!/usr/bin/env python3
"""
TAROT CARD MIGRATION SCRIPT
===========================
Backfills tarot_card field for existing spells that lack it.

Rules:
- ADDITIVE ONLY: Only adds tarot_card where missing
- NON-DESTRUCTIVE: Does NOT modify any existing fields
- IDEMPOTENT: Safe to run multiple times (skips if tarot_card exists)
- REVERSIBLE: Companion rollback script available
- AUDITED: Outputs detailed report

Usage:
  python migrate_tarot_cards.py --dry-run    # Preview changes
  python migrate_tarot_cards.py              # Execute migration
  python migrate_tarot_cards.py --rollback   # Undo migration
"""

import os
import sys
import json
import asyncio
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')

# Migration metadata marker
MIGRATION_MARKER = "tarot_card_migration_v1"

def generate_tarot_card_from_spell(spell: dict) -> dict:
    """
    Generate a tarot_card object from existing spell content.
    
    This is ADDITIVE - it reads existing content but does NOT modify it.
    If content is sparse, returns a minimal safe version.
    """
    title = spell.get('title', 'Untitled Spell')
    
    # Extract key info from spell
    introduction = spell.get('introduction', '')
    guide_id = spell.get('guide_id') or spell.get('archetype', {}).get('id', '')
    
    # Try to get the working/steps for key action
    the_working = spell.get('the_working', {})
    steps = the_working.get('steps', []) if isinstance(the_working, dict) else []
    if not steps:
        # Try blocks format
        blocks = spell.get('blocks', [])
        for block in blocks:
            if block.get('block_type') == 'stepper':
                steps = block.get('content', {}).get('steps', [])
                break
    
    # Get first meaningful step as key_action
    key_action = "Follow the ritual steps mindfully"
    if steps and len(steps) > 0:
        first_step = steps[0]
        if isinstance(first_step, dict):
            key_action = first_step.get('action', first_step.get('instruction', key_action))[:80]
        elif isinstance(first_step, str):
            key_action = first_step[:80]
    
    # Try to find spoken words for incantation
    spoken_words = spell.get('spoken_words', {})
    incantation = "So it is spoken, so it shall be"
    if isinstance(spoken_words, dict):
        main = spoken_words.get('main_incantation', spoken_words.get('opening', ''))
        if main:
            incantation = main[:60] if len(main) > 60 else main
    elif isinstance(spoken_words, str) and spoken_words:
        incantation = spoken_words[:60]
    
    # Guide-specific symbols
    symbols = {
        'shigg': '🫖',
        'shiggy': '🫖',
        'cathleen': '🪶',
        'kathleen': '🪶',
        'katherine': '⚗️',
        'theresa': '🔮',
    }
    symbol = symbols.get(guide_id.lower(), '✨')
    
    # Create essence from introduction or title
    essence = introduction[:60] if introduction else f"A working of {title.lower()}"
    if len(essence) > 60:
        essence = essence[:57] + "..."
    
    # Determine timing based on spell content
    timing = "Any quiet moment"
    title_lower = title.lower()
    if 'morning' in title_lower or 'dawn' in title_lower:
        timing = "Dawn or early morning"
    elif 'night' in title_lower or 'moon' in title_lower:
        timing = "Evening or under moonlight"
    elif 'protection' in title_lower or 'ward' in title_lower:
        timing = "When you feel called"
    
    # Create the tarot card
    tarot_card = {
        "title": title[:40] if len(title) > 40 else title,
        "symbol": symbol,
        "essence": essence,
        "key_action": key_action,
        "incantation": incantation,
        "timing": timing,
        "warning": None,
        "_migrated": True,
        "_migration_id": MIGRATION_MARKER,
        "_migrated_at": datetime.now(timezone.utc).isoformat()
    }
    
    return tarot_card


async def run_migration(dry_run: bool = False):
    """Execute the migration."""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    report = {
        "started_at": datetime.now(timezone.utc).isoformat(),
        "dry_run": dry_run,
        "spells_processed": 0,
        "spells_updated": 0,
        "spells_skipped": 0,
        "sparse_content_flags": [],
        "failures": [],
        "updated_ids": []
    }
    
    print("=" * 60)
    print("TAROT CARD MIGRATION")
    print(f"Mode: {'DRY RUN (no changes)' if dry_run else 'LIVE EXECUTION'}")
    print(f"Database: {DB_NAME}")
    print("=" * 60)
    print()
    
    # Find all spells missing tarot_card
    cursor = db.user_spells.find({
        "$or": [
            {"tarot_card": {"$exists": False}},
            {"tarot_card": None}
        ]
    })
    
    async for spell in cursor:
        report["spells_processed"] += 1
        spell_id = str(spell.get('_id', 'unknown'))
        title = spell.get('title', 'Untitled')
        
        print(f"Processing: {spell_id[:8]}... - {title[:40]}")
        
        try:
            # Generate tarot card from existing content
            tarot_card = generate_tarot_card_from_spell(spell)
            
            # Check if content was sparse
            is_sparse = (
                tarot_card["essence"] == f"A working of {title.lower()}" or
                tarot_card["incantation"] == "So it is spoken, so it shall be"
            )
            
            if is_sparse:
                report["sparse_content_flags"].append({
                    "spell_id": spell_id,
                    "title": title,
                    "reason": "Limited source content - using defaults"
                })
                print(f"  ⚠️  Sparse content - using minimal defaults")
            
            if not dry_run:
                # ADDITIVE UPDATE ONLY - uses $set which only adds/updates specified field
                result = await db.user_spells.update_one(
                    {"_id": spell["_id"]},
                    {"$set": {"tarot_card": tarot_card}}
                )
                
                if result.modified_count > 0:
                    report["spells_updated"] += 1
                    report["updated_ids"].append(spell_id)
                    print(f"  ✅ Updated")
                else:
                    report["failures"].append({
                        "spell_id": spell_id,
                        "reason": "Update returned 0 modified"
                    })
                    print(f"  ❌ Failed to update")
            else:
                report["spells_updated"] += 1
                report["updated_ids"].append(spell_id)
                print(f"  🔍 Would update (dry run)")
                print(f"     tarot_card.title: {tarot_card['title']}")
                print(f"     tarot_card.symbol: {tarot_card['symbol']}")
                
        except Exception as e:
            report["failures"].append({
                "spell_id": spell_id,
                "reason": str(e)
            })
            print(f"  ❌ Error: {e}")
    
    # Check for already-migrated spells
    already_migrated = await db.user_spells.count_documents({
        "tarot_card": {"$exists": True, "$ne": None}
    })
    report["spells_skipped"] = already_migrated - report["spells_updated"] if not dry_run else 0
    
    report["completed_at"] = datetime.now(timezone.utc).isoformat()
    
    # Print summary
    print()
    print("=" * 60)
    print("MIGRATION REPORT")
    print("=" * 60)
    print(f"Spells Processed: {report['spells_processed']}")
    print(f"Spells Updated: {report['spells_updated']}")
    print(f"Spells Skipped (already had tarot_card): {report['spells_skipped']}")
    print(f"Sparse Content Flags: {len(report['sparse_content_flags'])}")
    print(f"Failures: {len(report['failures'])}")
    print()
    
    if report["sparse_content_flags"]:
        print("Spells with sparse content:")
        for item in report["sparse_content_flags"]:
            print(f"  - {item['spell_id'][:8]}... {item['title'][:30]}")
    
    if report["failures"]:
        print("Failed updates:")
        for item in report["failures"]:
            print(f"  - {item['spell_id'][:8]}... : {item['reason']}")
    
    # Save report to file
    report_path = f"/app/backend/migrations/migration_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2, default=str)
    print(f"\nReport saved to: {report_path}")
    
    client.close()
    return report


async def run_rollback():
    """Rollback the migration - removes tarot_card ONLY from migrated records."""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("=" * 60)
    print("TAROT CARD MIGRATION ROLLBACK")
    print("=" * 60)
    print()
    
    # Find only records that were migrated by this script
    cursor = db.user_spells.find({
        "tarot_card._migration_id": MIGRATION_MARKER
    })
    
    rolled_back = 0
    async for spell in cursor:
        spell_id = str(spell.get('_id', 'unknown'))
        title = spell.get('title', 'Untitled')
        
        print(f"Rolling back: {spell_id[:8]}... - {title[:40]}")
        
        # Remove ONLY the tarot_card field
        result = await db.user_spells.update_one(
            {"_id": spell["_id"]},
            {"$unset": {"tarot_card": ""}}
        )
        
        if result.modified_count > 0:
            rolled_back += 1
            print(f"  ✅ Removed tarot_card")
        else:
            print(f"  ⚠️  No change")
    
    print()
    print(f"Rolled back {rolled_back} spells")
    
    client.close()


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Tarot Card Migration Script")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without executing")
    parser.add_argument("--rollback", action="store_true", help="Undo the migration")
    args = parser.parse_args()
    
    if args.rollback:
        asyncio.run(run_rollback())
    else:
        asyncio.run(run_migration(dry_run=args.dry_run))
