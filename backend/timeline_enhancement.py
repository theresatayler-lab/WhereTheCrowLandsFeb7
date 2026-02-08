# Timeline Enhancement Service
# Uses DeepSeek for research + Claude Sonnet for narrative polish
# Preserves existing structure and taxonomy

import os
import json
import logging
import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

# =============================================================================
# DEEPSEEK RESEARCH PROMPT FOR TIMELINE
# =============================================================================

TIMELINE_RESEARCH_PROMPT = """## TIMELINE EVENT RESEARCH ENHANCEMENT

You are THE ARCHIVIST researching historical occult events.

EVENT TO RESEARCH:
- Title: {title}
- Year: {year}
- Current Description: {current_description}
- Current Category: {category}
- Current Traditions: {traditions}

## YOUR TASK
Enhance this event with verified research. Output STRICT JSON.

## OUTPUT SCHEMA
{{
    "enhanced_facts": [
        {{
            "fact": "Specific factual claim about this event",
            "source_ref": "source_id",
            "confidence": "high|medium|low",
            "claim_type": "historical|academic|folklore"
        }}
    ],
    "figures_involved": [
        {{
            "name": "Person's full name",
            "role": "Their role in this event",
            "dates": "birth-death if known",
            "significance": "Why they matter"
        }}
    ],
    "sources": [
        {{
            "source_id": "unique_id",
            "author": "Author name",
            "work": "Book/article title",
            "year": 1900,
            "quality_tier": "academic_primary|folk_archive|practitioner_primary|modern_scholar_practitioner",
            "url": "URL if available, null if not"
        }}
    ],
    "connections": {{
        "influenced_by": ["event_ids this was influenced by"],
        "influenced": ["event_ids this influenced"],
        "related_traditions": ["tradition tags"],
        "thematic_links": ["thematic keywords"]
    }},
    "guide_relevance": {{
        "shigg": "low|medium|high",
        "cathleen": "low|medium|high",
        "katherine": "low|medium|high",
        "theresa": "low|medium|high"
    }},
    "location_details": {{
        "city": "City name",
        "country": "Country",
        "significance": "Why this location matters"
    }},
    "accuracy_notes": "Any caveats or uncertainties about this event"
}}

## RULES
1. Only include facts you can source
2. Mark confidence levels honestly
3. If information is uncertain, say so in accuracy_notes
4. Focus on what makes this event significant to occult history
5. Consider which of our 4 guides would find this relevant and why

OUTPUT JSON ONLY - no markdown, no explanation."""


# =============================================================================
# CLAUDE NARRATIVE PROMPT FOR TIMELINE
# =============================================================================

TIMELINE_NARRATIVE_PROMPT = """## TIMELINE NARRATIVE ENHANCEMENT

Transform researched facts into engaging prose.

EVENT: {title} ({year})

VERIFIED FACTS FROM RESEARCH:
{facts_json}

KEY FIGURES:
{figures_json}

SOURCES AVAILABLE:
{sources_json}

## YOUR TASK
Write three description versions:

1. **factual_description** (2-3 sentences)
   - Encyclopedic, precise, suitable for researchers
   - Include key dates and names
   - No embellishment

2. **narrative_description** (3-4 sentences)
   - Evocative, atmospheric, draws readers in
   - Connect to human stories
   - Hint at magical significance
   - Make readers want to learn more

3. **one_liner** (1 sentence, max 100 characters)
   - Punchy summary for list views
   - Capture the essence

## OUTPUT SCHEMA
{{
    "factual_description": "...",
    "narrative_description": "...",
    "one_liner": "..."
}}

## RULES
1. NEVER invent facts beyond what's provided
2. Use hedging ("it is said", "tradition holds") for folklore claims
3. Cite sources naturally ("As Regardie documented...")
4. Create atmosphere through word choice, not invented details

OUTPUT JSON ONLY."""


# =============================================================================
# ENHANCEMENT FUNCTIONS
# =============================================================================

async def enhance_timeline_event_research(
    event: Dict[str, Any],
    deepseek_client
) -> Dict[str, Any]:
    """
    Stage 1: Use DeepSeek to research and expand a timeline event.
    Returns enhanced research data.
    """
    prompt = TIMELINE_RESEARCH_PROMPT.format(
        title=event.get("title", "Unknown Event"),
        year=event.get("year", "Unknown"),
        current_description=event.get("description", "No description"),
        category=event.get("primary_category", "Unknown"),
        traditions=", ".join(event.get("traditions", []))
    )
    
    try:
        response = await deepseek_client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a research archivist. Output only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.6,
            max_tokens=1500,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        result["_research_timestamp"] = datetime.utcnow().isoformat()
        result["_research_model"] = "deepseek-chat"
        return result
        
    except Exception as e:
        logger.error(f"DeepSeek research failed for {event.get('id')}: {e}")
        return {"error": str(e), "enhanced_facts": [], "sources": []}


async def enhance_timeline_event_narrative(
    event: Dict[str, Any],
    research: Dict[str, Any],
    claude_client
) -> Dict[str, Any]:
    """
    Stage 2: Use Claude to create beautiful narrative descriptions.
    """
    import anthropic
    
    prompt = TIMELINE_NARRATIVE_PROMPT.format(
        title=event.get("title", "Unknown Event"),
        year=event.get("year", "Unknown"),
        facts_json=json.dumps(research.get("enhanced_facts", []), indent=2),
        figures_json=json.dumps(research.get("figures_involved", []), indent=2),
        sources_json=json.dumps(research.get("sources", []), indent=2)
    )
    
    try:
        response = claude_client.messages.create(
            model="claude-sonnet-4-20250514",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800
        )
        
        # Parse JSON from response
        content = response.content[0].text
        # Handle potential markdown wrapping
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
            
        result = json.loads(content)
        result["_narrative_timestamp"] = datetime.utcnow().isoformat()
        result["_narrative_model"] = "claude-sonnet-4"
        return result
        
    except Exception as e:
        logger.error(f"Claude narrative failed for {event.get('id')}: {e}")
        return {
            "error": str(e),
            "factual_description": event.get("description", ""),
            "narrative_description": event.get("description", ""),
            "one_liner": event.get("title", "")[:100]
        }


async def enhance_timeline_event_full(
    event: Dict[str, Any],
    deepseek_client,
    claude_client
) -> Dict[str, Any]:
    """
    Full enhancement pipeline: DeepSeek research → Claude narrative.
    Returns merged enhanced event.
    """
    # Stage 1: Research
    research = await enhance_timeline_event_research(event, deepseek_client)
    
    if research.get("error"):
        logger.warning(f"Research failed for {event.get('id')}, using original data")
        research = {"enhanced_facts": [], "sources": [], "figures_involved": []}
    
    # Stage 2: Narrative
    narrative = await enhance_timeline_event_narrative(event, research, claude_client)
    
    # Merge everything
    enhanced_event = {
        **event,  # Keep all original fields
        
        # Add research enhancements
        "enhanced_facts": research.get("enhanced_facts", []),
        "figures_involved": research.get("figures_involved", event.get("figures_involved", [])),
        "sources": research.get("sources", event.get("sources", [])),
        "connections": research.get("connections", {}),
        "guide_relevance": research.get("guide_relevance", event.get("guide_relevance", {})),
        "accuracy_notes": research.get("accuracy_notes"),
        
        # Add narrative enhancements
        "description_factual": narrative.get("factual_description", event.get("description")),
        "description_narrative": narrative.get("narrative_description", event.get("description")),
        "description_short": narrative.get("one_liner", event.get("title", "")[:100]),
        
        # Keep original description as backup
        "description_original": event.get("description"),
        
        # Metadata
        "_enhanced": True,
        "_enhanced_at": datetime.utcnow().isoformat(),
        "_research_model": "deepseek-chat",
        "_narrative_model": "claude-sonnet-4"
    }
    
    return enhanced_event


async def batch_enhance_timeline_events(
    events: List[Dict[str, Any]],
    deepseek_client,
    claude_client,
    batch_size: int = 5
) -> List[Dict[str, Any]]:
    """
    Enhance multiple timeline events with rate limiting.
    """
    enhanced = []
    
    for i in range(0, len(events), batch_size):
        batch = events[i:i + batch_size]
        logger.info(f"Enhancing batch {i//batch_size + 1}: {len(batch)} events")
        
        # Process batch concurrently
        tasks = [
            enhance_timeline_event_full(event, deepseek_client, claude_client)
            for event in batch
        ]
        
        batch_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for result in batch_results:
            if isinstance(result, Exception):
                logger.error(f"Batch enhancement error: {result}")
            else:
                enhanced.append(result)
        
        # Rate limiting pause between batches
        if i + batch_size < len(events):
            await asyncio.sleep(2)
    
    return enhanced


# =============================================================================
# SINGLE EVENT QUICK ENHANCEMENT (for on-demand)
# =============================================================================

async def quick_enhance_event(
    event: Dict[str, Any],
    deepseek_client,
    claude_client
) -> Dict[str, Any]:
    """
    Quick enhancement for a single event (used when user views an event).
    Lighter weight than full enhancement.
    """
    # Just get narrative enhancement if we already have basic data
    if event.get("sources") and len(event.get("sources", [])) > 0:
        # Already have research, just polish narrative
        narrative = await enhance_timeline_event_narrative(
            event, 
            {"enhanced_facts": [], "sources": event.get("sources", []), "figures_involved": event.get("figures_involved", [])},
            claude_client
        )
        event["description_narrative"] = narrative.get("narrative_description", event.get("description"))
        event["description_short"] = narrative.get("one_liner")
        return event
    else:
        # Need full enhancement
        return await enhance_timeline_event_full(event, deepseek_client, claude_client)
