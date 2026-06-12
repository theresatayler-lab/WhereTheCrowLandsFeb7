# Timeline Service - API Endpoints for Interactive Occult Revival Timeline
# Handles filtering, connections, taxonomy, and guide integration

import logging
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from timeline_models import (
    TimelineEventEnhanced, TimelineFilterRequest, TimelineStatsResponse,
    ConnectionGraphResponse, TAXONOMY_DATA, TimelineSource, EventConnections,
    GuideRelevance
)
from timeline_events_expanded import EXPANDED_TIMELINE_EVENTS
import re

logger = logging.getLogger(__name__)

# Use all events including extended historical events
from timeline_events_expanded import ALL_TIMELINE_EVENTS
INITIAL_TIMELINE_EVENTS = ALL_TIMELINE_EVENTS
EXPECTED_EVENT_COUNT = len(ALL_TIMELINE_EVENTS)

# ============================================================================
# SERVICE FUNCTIONS
# ============================================================================

_ENRICHMENT_VERSION = 4  # Increment when enrichment data changes (v4: rich narratives for all 126 events)

async def seed_timeline_data(db: AsyncIOMotorDatabase):
    """Seed initial timeline events - reseed if count or enrichment version mismatches"""
    count = await db.timeline_events_v2.count_documents({"_meta": {"$exists": False}})
    
    # Check enrichment version marker
    version_doc = await db.timeline_meta.find_one({"key": "enrichment_version"})
    current_version = version_doc.get("version", 0) if version_doc else 0
    
    if count != EXPECTED_EVENT_COUNT or current_version < _ENRICHMENT_VERSION:
        logger.info(f"Timeline data needs update (count={count}/{EXPECTED_EVENT_COUNT}, version={current_version}/{_ENRICHMENT_VERSION}). Reseeding...")
        await db.timeline_events_v2.delete_many({})
        await db.timeline_events_v2.insert_many(INITIAL_TIMELINE_EVENTS)
        await db.timeline_meta.update_one(
            {"key": "enrichment_version"},
            {"$set": {"version": _ENRICHMENT_VERSION}},
            upsert=True
        )
        logger.info(f"Seeded {len(INITIAL_TIMELINE_EVENTS)} timeline events (enrichment v{_ENRICHMENT_VERSION})")
        return len(INITIAL_TIMELINE_EVENTS)
    
    return count

async def get_timeline_events(
    db: AsyncIOMotorDatabase,
    filters: Optional[TimelineFilterRequest] = None,
    limit: int = 200,
    skip: int = 0
) -> List[Dict[str, Any]]:
    """Get timeline events with optional filtering - FIXED: proper $and/$or logic"""
    query = {}
    and_conditions = []
    
    if filters:
        # Taxonomy category filter
        if filters.categories:
            and_conditions.append({"taxonomy_categories": {"$in": filters.categories}})
        
        # Primary category filter
        if filters.primary_categories:
            and_conditions.append({"primary_category": {"$in": filters.primary_categories}})
        
        # Tradition filter
        if filters.traditions:
            and_conditions.append({"traditions": {"$in": filters.traditions}})
        
        # Guide relevance filter - match ANY selected guide (OR within guides)
        if filters.guides:
            guide_conditions = []
            for guide in filters.guides:
                guide_conditions.append({f"guide_relevance.{guide}": {"$in": ["high", "medium"]}})
            if guide_conditions:
                and_conditions.append({"$or": guide_conditions})
        
        # Date range filter
        if filters.date_range:
            year_condition = {}
            if "start" in filters.date_range:
                year_condition["$gte"] = filters.date_range["start"]
            if "end" in filters.date_range:
                year_condition["$lte"] = filters.date_range["end"]
            if year_condition:
                and_conditions.append({"year": year_condition})
        
        # Importance filter
        if filters.importance:
            and_conditions.append({"importance": {"$in": filters.importance}})
        
        # Figures filter
        if filters.figures:
            and_conditions.append({"figures_involved": {"$in": filters.figures}})
        
        # Search filter - searches across multiple fields including sources (OR within search)
        if filters.search:
            search_regex = {"$regex": filters.search, "$options": "i"}
            and_conditions.append({
                "$or": [
                    {"title": search_regex},
                    {"description": search_regex},
                    {"description_narrative": search_regex},
                    {"description_factual": search_regex},
                    {"significance": search_regex},
                    {"figures_involved": search_regex},
                    {"figures_involved.name": search_regex},  # For object format
                    {"traditions": search_regex},
                    {"glossary_terms": search_regex},
                    {"sources.author": search_regex},  # Search source authors
                    {"sources.work": search_regex},    # Search source titles
                    {"sources.title": search_regex},   # Alternative field name
                    {"connections.related_figures": search_regex}  # Related figures
                ]
            })
    
    # Combine all conditions with $and
    if and_conditions:
        query = {"$and": and_conditions} if len(and_conditions) > 1 else and_conditions[0]
    
    events = await db.timeline_events_v2.find(query, {"_id": 0}).sort("year", 1).skip(skip).limit(limit).to_list(limit)
    return events

async def get_timeline_stats(db: AsyncIOMotorDatabase) -> TimelineStatsResponse:
    """Get statistics about the timeline"""
    # Total count
    total = await db.timeline_events_v2.count_documents({})
    
    # Events by primary category
    category_pipeline = [
        {"$group": {"_id": "$primary_category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    category_results = await db.timeline_events_v2.aggregate(category_pipeline).to_list(20)
    events_by_category = {r["_id"]: r["count"] for r in category_results if r["_id"]}
    
    # Events by decade
    decade_pipeline = [
        {"$project": {"decade": {"$subtract": ["$year", {"$mod": ["$year", 10]}]}}},
        {"$group": {"_id": "$decade", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    decade_results = await db.timeline_events_v2.aggregate(decade_pipeline).to_list(20)
    events_by_decade = {f"{r['_id']}s": r["count"] for r in decade_results if r["_id"]}
    
    # Events by taxonomy
    taxonomy_pipeline = [
        {"$unwind": "$taxonomy_categories"},
        {"$group": {"_id": "$taxonomy_categories", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    taxonomy_results = await db.timeline_events_v2.aggregate(taxonomy_pipeline).to_list(20)
    events_by_taxonomy = {str(r["_id"]): r["count"] for r in taxonomy_results if r["_id"]}
    
    # Date range
    min_year = await db.timeline_events_v2.find_one({}, {"year": 1}, sort=[("year", 1)])
    max_year = await db.timeline_events_v2.find_one({}, {"year": 1}, sort=[("year", -1)])
    
    # Top figures
    figures_pipeline = [
        {"$unwind": "$figures_involved"},
        {"$group": {"_id": "$figures_involved", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    figures_results = await db.timeline_events_v2.aggregate(figures_pipeline).to_list(10)
    top_figures = [{"name": r["_id"], "count": r["count"]} for r in figures_results if r["_id"]]
    
    return TimelineStatsResponse(
        total_events=total,
        events_by_category=events_by_category,
        events_by_decade=events_by_decade,
        events_by_taxonomy=events_by_taxonomy,
        date_range={
            "start": min_year.get("year", 1888) if min_year else 1888,
            "end": max_year.get("year", 1951) if max_year else 1951
        },
        top_figures=top_figures
    )

async def get_connection_graph(
    db: AsyncIOMotorDatabase,
    filters: Optional[TimelineFilterRequest] = None
) -> ConnectionGraphResponse:
    """Get network graph data for visualization"""
    events = await get_timeline_events(db, filters, limit=500)
    
    nodes = []
    edges = []
    figure_nodes = set()
    tradition_nodes = set()
    
    for event in events:
        # Add event node
        nodes.append({
            "id": event["id"],
            "type": "event",
            "label": event["title"],
            "year": event["year"],
            "category": event.get("primary_category", "Unknown"),
            "taxonomy": event.get("taxonomy_categories", []),
            "importance": event.get("importance", 2),
            "is_pivotal": event.get("is_pivotal_moment", False),
            "traditions": event.get("traditions", [])
        })
        
        # Add figure nodes - handle both string and dict formats
        for figure in event.get("figures_involved", []):
            # Extract figure name (handle both string and object format)
            if isinstance(figure, dict):
                figure_name = figure.get("name", "Unknown")
            else:
                figure_name = str(figure)
            
            figure_id = f"figure_{figure_name.lower().replace(' ', '_').replace('.', '')}"
            
            if figure_name not in figure_nodes:
                figure_nodes.add(figure_name)
                nodes.append({
                    "id": figure_id,
                    "type": "figure",
                    "label": figure_name
                })
            
            # Add edge from figure to event
            edges.append({
                "source": figure_id,
                "target": event["id"],
                "type": "involvement"
            })
        
        # Add tradition nodes and edges
        for tradition in event.get("traditions", []):
            tradition_id = f"tradition_{tradition.lower().replace(' ', '_')}"
            
            if tradition not in tradition_nodes:
                tradition_nodes.add(tradition)
                nodes.append({
                    "id": tradition_id,
                    "type": "tradition",
                    "label": tradition.replace("_", " ").title()
                })
            
            # Add edge from tradition to event
            edges.append({
                "source": tradition_id,
                "target": event["id"],
                "type": "tradition_link"
            })
        
        # Add connection edges
        connections = event.get("connections", {})
        if connections:
            for influenced_id in connections.get("influenced", []):
                edges.append({
                    "source": event["id"],
                    "target": influenced_id,
                    "type": "direct_influence"
                })
            for related_id in connections.get("related_events", []):
                edges.append({
                    "source": event["id"],
                    "target": related_id,
                    "type": "related"
                })
    
    return ConnectionGraphResponse(nodes=nodes, edges=edges)

async def get_event_by_id(db: AsyncIOMotorDatabase, event_id: str) -> Optional[Dict[str, Any]]:
    """Get a single event by ID"""
    event = await db.timeline_events_v2.find_one({"id": event_id}, {"_id": 0})
    return event

async def get_taxonomy_data() -> Dict[str, Any]:
    """Return full taxonomy data for frontend"""
    return TAXONOMY_DATA

async def add_timeline_event(db: AsyncIOMotorDatabase, event: Dict[str, Any]) -> Dict[str, Any]:
    """Add a new timeline event"""
    if "id" not in event:
        event["id"] = str(__import__("uuid").uuid4())
    await db.timeline_events_v2.insert_one(event)
    return event

async def update_timeline_event(db: AsyncIOMotorDatabase, event_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update an existing timeline event"""
    result = await db.timeline_events_v2.find_one_and_update(
        {"id": event_id},
        {"$set": updates},
        return_document=True
    )
    if result:
        result.pop("_id", None)
    return result

async def delete_timeline_event(db: AsyncIOMotorDatabase, event_id: str) -> bool:
    """Delete a timeline event"""
    result = await db.timeline_events_v2.delete_one({"id": event_id})
    return result.deleted_count > 0
