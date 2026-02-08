#!/usr/bin/env python3
"""
Batch Timeline Enhancement Script
Runs DeepSeek + Claude enhancement on all un-enhanced events
"""
import asyncio
import os
import sys
import logging
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
    handlers=[
        logging.FileHandler('/tmp/batch_enhancement.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

sys.path.insert(0, '/app/backend')
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from motor.motor_asyncio import AsyncIOMotorClient
from timeline_enhancement import enhance_timeline_event_full
from openai import AsyncOpenAI
import anthropic

async def main():
    logger.info("=" * 60)
    logger.info("BATCH TIMELINE ENHANCEMENT STARTED")
    logger.info(f"Time: {datetime.now().isoformat()}")
    logger.info("=" * 60)
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    
    # Get un-enhanced events
    events = await db.timeline_events_v2.find(
        {"_enhanced": {"$ne": True}},
        {"_id": 0}
    ).to_list(200)
    
    logger.info(f"Found {len(events)} events to enhance")
    
    if not events:
        logger.info("No events to enhance - all done!")
        return
    
    # Initialize AI clients
    deepseek = AsyncOpenAI(
        api_key=os.environ.get('DEEPSEEK_API_KEY'),
        base_url="https://api.deepseek.com"
    )
    claude = anthropic.Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))
    
    enhanced_count = 0
    error_count = 0
    
    for i, event in enumerate(events):
        logger.info(f"\n[{i+1}/{len(events)}] {event.get('title', 'Unknown')} ({event.get('year', '?')})")
        
        try:
            enhanced = await enhance_timeline_event_full(event, deepseek, claude)
            
            await db.timeline_events_v2.update_one(
                {"id": event["id"]},
                {"$set": enhanced}
            )
            
            enhanced_count += 1
            logger.info(f"  ✅ Enhanced! Sources: {len(enhanced.get('sources', []))}")
            
        except Exception as e:
            error_count += 1
            logger.error(f"  ❌ Error: {str(e)[:100]}")
        
        # Rate limiting - wait between events
        await asyncio.sleep(3)
    
    logger.info("\n" + "=" * 60)
    logger.info(f"BATCH COMPLETE")
    logger.info(f"Enhanced: {enhanced_count}/{len(events)}")
    logger.info(f"Errors: {error_count}")
    logger.info("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
