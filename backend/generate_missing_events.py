#!/usr/bin/env python3
"""
Generate Missing Timeline Events
Uses DeepSeek to research and create events that are referenced but don't exist
"""
import asyncio
import os
import sys
import json
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
    handlers=[
        logging.FileHandler('/tmp/generate_missing_events.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

sys.path.insert(0, '/app/backend')
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from motor.motor_asyncio import AsyncIOMotorClient
from openai import AsyncOpenAI

# Event generation prompt
GENERATE_EVENT_PROMPT = """You are THE ARCHIVIST, creating timeline entries for occult history.

## TASK
Create a detailed timeline event for: {event_id}

Based on the ID, research and generate a complete event entry.

## OUTPUT SCHEMA (STRICT JSON)
{{
    "id": "{event_id}",
    "year": <integer year or null if uncertain>,
    "month": <integer 1-12 or null>,
    "title": "<Descriptive title, 5-10 words>",
    "description": "<2-3 sentence factual description>",
    "significance": "<1-2 sentences on why this matters to occult history>",
    "primary_category": "<One of: Publication, Organization, Person, Event, Practice, Place, Object>",
    "secondary_category": "<More specific subcategory>",
    "traditions": [<list of tradition tags like: "golden_dawn", "wicca", "thelema", "chaos_magic", "spiritualism", "folk_magic", "ceremonial", "feminist_spirituality", "druidry", "heathenry">],
    "figures_involved": [
        {{
            "name": "<Full name>",
            "role": "<Their role in this event>",
            "dates": "<birth-death if known>"
        }}
    ],
    "location": {{
        "name": "<City or place name>",
        "region": "<Country or region>"
    }},
    "sources": [
        {{
            "source_id": "<unique_id>",
            "author": "<Real author name>",
            "work": "<Real book/article title>",
            "year": <publication year>,
            "quality_tier": "<academic_primary|folk_archive|practitioner_primary|modern_scholar_practitioner>"
        }}
    ],
    "connections": {{
        "influenced_by": [<list of event_ids this was influenced by>],
        "influenced": [<list of event_ids this influenced>],
        "related_events": [<list of related event_ids>]
    }},
    "guide_relevance": {{
        "shigg": "<low|medium|high>",
        "cathleen": "<low|medium|high>",
        "katherine": "<low|medium|high>",
        "theresa": "<low|medium|high>"
    }},
    "confidence": "<high|medium|low>",
    "importance": <1-5 where 1 is most important>,
    "is_pivotal_moment": <true|false>,
    "taxonomy_categories": [<list of category numbers 1-10>],
    "lane_tags": [<list of visual/thematic tags>],
    "visual_tells": [<list of visual elements associated with this>],
    "glossary_terms": [<list of relevant occult terms>]
}}

## GUIDE RELEVANCE NOTES
- shigg: Domestic/kitchen witchcraft, folk magic, cozy practices
- cathleen: Bardic/Celtic traditions, sound/voice, poetry, ancestor work
- katherine: Academic occultism, historical research, grimoires, ceremonial
- theresa: Family traditions, matrilineal practices, practical wisdom

## RULES
1. Research thoroughly - use real historical facts
2. Only cite sources you're confident exist
3. If the event/topic is uncertain, set confidence to "low"
4. Connect to known events where appropriate
5. Year can be null if genuinely unknown

OUTPUT JSON ONLY - no markdown wrapping."""


async def generate_event(event_id: str, deepseek_client) -> dict:
    """Generate a single event using DeepSeek"""
    prompt = GENERATE_EVENT_PROMPT.format(event_id=event_id)
    
    try:
        response = await deepseek_client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "You are an occult history researcher. Output only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.6,
            max_tokens=1500,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        result["_generated"] = True
        result["_generated_at"] = datetime.utcnow().isoformat()
        result["_source"] = "deepseek_generation"
        
        # Set default image
        result["image_url"] = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800"
        
        return result
        
    except Exception as e:
        logger.error(f"Failed to generate {event_id}: {e}")
        return None


async def main():
    logger.info("=" * 60)
    logger.info("MISSING EVENT GENERATION STARTED")
    logger.info(f"Time: {datetime.now().isoformat()}")
    logger.info("=" * 60)
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    
    # Get all existing event IDs
    existing_events = await db.timeline_events_v2.find({}, {"_id": 0, "id": 1, "connections": 1}).to_list(500)
    existing_ids = set(e["id"] for e in existing_events)
    
    # Collect all referenced IDs
    referenced_ids = set()
    for event in existing_events:
        connections = event.get("connections", {})
        if isinstance(connections, dict):
            for key in ["influenced_by", "influenced", "related_events"]:
                refs = connections.get(key, [])
                if refs:
                    for ref in refs:
                        if isinstance(ref, str):
                            referenced_ids.add(ref)
                        elif isinstance(ref, dict) and "event_id" in ref:
                            referenced_ids.add(ref["event_id"])
    
    # Find missing IDs
    missing_ids = list(referenced_ids - existing_ids)
    logger.info(f"Found {len(missing_ids)} missing events to generate")
    
    if not missing_ids:
        logger.info("No missing events to generate!")
        return
    
    # Initialize DeepSeek client
    deepseek = AsyncOpenAI(
        api_key=os.environ.get('DEEPSEEK_API_KEY'),
        base_url="https://api.deepseek.com"
    )
    
    generated_count = 0
    error_count = 0
    
    for i, event_id in enumerate(missing_ids):
        logger.info(f"\n[{i+1}/{len(missing_ids)}] Generating: {event_id}")
        
        try:
            event = await generate_event(event_id, deepseek)
            
            if event:
                # Insert into database
                await db.timeline_events_v2.insert_one(event)
                generated_count += 1
                logger.info(f"  ✅ Generated: {event.get('title', 'Unknown')} ({event.get('year', '?')})")
            else:
                error_count += 1
                logger.error(f"  ❌ Failed to generate")
                
        except Exception as e:
            error_count += 1
            logger.error(f"  ❌ Error: {str(e)[:100]}")
        
        # Rate limiting
        await asyncio.sleep(2)
    
    logger.info("\n" + "=" * 60)
    logger.info(f"GENERATION COMPLETE")
    logger.info(f"Generated: {generated_count}/{len(missing_ids)}")
    logger.info(f"Errors: {error_count}")
    logger.info("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
