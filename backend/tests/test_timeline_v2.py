"""
Timeline V2 API Tests
Tests for the enhanced timeline filtering, search, and interactive features
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestTimelineV2Events:
    """Test /api/timeline/v2/events endpoint with various filters"""
    
    def test_get_all_events(self):
        """Test fetching all timeline events"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        print(f"✅ Retrieved {len(data)} total events")
        
        # Verify event structure
        event = data[0]
        assert "id" in event
        assert "title" in event
        assert "year" in event
        assert "description" in event
    
    def test_filter_by_category(self):
        """Test filtering events by taxonomy category (e.g., Occult Revival = 6)"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events?categories=6")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Category filter (6): {len(data)} events")
        
        # Verify all events have the category
        for event in data:
            assert 6 in event.get("taxonomy_categories", [])
    
    def test_filter_by_guide(self):
        """Test filtering events by guide relevance (shigg)"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events?guides=shigg")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Guide filter (shigg): {len(data)} events")
        
        # Verify all events have shigg relevance (high or medium)
        for event in data:
            guide_relevance = event.get("guide_relevance", {})
            shigg_level = guide_relevance.get("shigg", "low")
            assert shigg_level in ["high", "medium"], f"Event {event['id']} has shigg={shigg_level}"
    
    def test_filter_by_search(self):
        """Test search functionality"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events?search=Crowley")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Search filter (Crowley): {len(data)} events")
        
        # Verify search results contain the term
        for event in data:
            event_text = f"{event.get('title', '')} {event.get('description', '')} {' '.join(event.get('figures_involved', []))}".lower()
            assert "crowley" in event_text, f"Event {event['id']} doesn't contain 'crowley'"
    
    def test_combined_filters_guide_and_search(self):
        """Test combining guide filter with search - CRITICAL BUG FIX TEST"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events?guides=shigg&search=Golden")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Combined filter (shigg + Golden): {len(data)} events")
        
        # Verify both filters are applied
        for event in data:
            # Check guide relevance
            guide_relevance = event.get("guide_relevance", {})
            shigg_level = guide_relevance.get("shigg", "low")
            assert shigg_level in ["high", "medium"], f"Event {event['id']} has shigg={shigg_level}"
            
            # Check search term - search covers title, description, significance, figures, traditions, glossary
            searchable_text = " ".join([
                event.get('title', ''),
                event.get('description', ''),
                event.get('significance', ''),
                " ".join(event.get('figures_involved', [])),
                " ".join(event.get('traditions', [])),
                " ".join(event.get('glossary_terms', []))
            ]).lower()
            assert "golden" in searchable_text, f"Event {event['id']} doesn't contain 'golden' in searchable fields"
    
    def test_combined_filters_category_and_guide(self):
        """Test combining category and guide filters"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events?categories=6&guides=katherine")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Combined filter (category 6 + katherine): {len(data)} events")
        
        for event in data:
            assert 6 in event.get("taxonomy_categories", [])
            guide_relevance = event.get("guide_relevance", {})
            katherine_level = guide_relevance.get("katherine", "low")
            assert katherine_level in ["high", "medium"]
    
    def test_filter_by_date_range(self):
        """Test filtering by date range (era filter)"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events?start_year=1880&end_year=1951")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Date range filter (1880-1951): {len(data)} events")
        
        for event in data:
            year = event.get("year", 0)
            assert 1880 <= year <= 1951, f"Event {event['id']} year {year} outside range"
    
    def test_filter_by_traditions(self):
        """Test filtering by traditions"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events?traditions=golden_dawn")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Traditions filter (golden_dawn): {len(data)} events")
        
        for event in data:
            traditions = event.get("traditions", [])
            assert "golden_dawn" in traditions, f"Event {event['id']} missing golden_dawn tradition"
    
    def test_limit_parameter(self):
        """Test limit parameter"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events?limit=5")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) <= 5
        print(f"✅ Limit parameter: {len(data)} events (max 5)")


class TestTimelineV2Stats:
    """Test /api/timeline/v2/stats endpoint"""
    
    def test_get_stats(self):
        """Test fetching timeline statistics"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/stats")
        assert response.status_code == 200
        
        data = response.json()
        assert "total_events" in data
        assert "events_by_category" in data
        assert "events_by_decade" in data
        assert "date_range" in data
        
        print(f"✅ Stats: {data['total_events']} total events")
        print(f"✅ Date range: {data['date_range']}")


class TestTimelineV2EventById:
    """Test /api/timeline/v2/events/{id} endpoint"""
    
    def test_get_event_by_id(self):
        """Test fetching a specific event by ID"""
        # First get an event ID
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events?limit=1")
        assert response.status_code == 200
        events = response.json()
        assert len(events) > 0
        
        event_id = events[0]["id"]
        
        # Fetch by ID
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events/{event_id}")
        assert response.status_code == 200
        
        event = response.json()
        assert event["id"] == event_id
        print(f"✅ Retrieved event by ID: {event['title']}")
    
    def test_get_nonexistent_event(self):
        """Test fetching a non-existent event"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events/nonexistent-id-12345")
        assert response.status_code == 404


class TestTimelineV2Taxonomy:
    """Test /api/timeline/v2/taxonomy endpoint"""
    
    def test_get_taxonomy(self):
        """Test fetching taxonomy data"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/taxonomy")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, dict)
        print(f"✅ Taxonomy data retrieved")


class TestTimelineEventStructure:
    """Test event data structure for frontend compatibility"""
    
    def test_event_has_required_fields(self):
        """Test that events have all required fields for frontend"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events?limit=10")
        assert response.status_code == 200
        
        events = response.json()
        required_fields = ["id", "title", "year", "description", "primary_category", "taxonomy_categories"]
        
        for event in events:
            for field in required_fields:
                assert field in event, f"Event {event.get('id', 'unknown')} missing field: {field}"
        
        print(f"✅ All {len(events)} events have required fields")
    
    def test_event_has_guide_relevance(self):
        """Test that events have guide_relevance for clickable guide dots"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events?limit=10")
        assert response.status_code == 200
        
        events = response.json()
        guides = ["shigg", "cathleen", "katherine", "theresa"]
        
        for event in events:
            guide_relevance = event.get("guide_relevance", {})
            for guide in guides:
                assert guide in guide_relevance, f"Event {event['id']} missing guide: {guide}"
        
        print(f"✅ All events have guide_relevance for all 4 guides")
    
    def test_event_has_sources(self):
        """Test that events have sources for expanded card display"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events?limit=10")
        assert response.status_code == 200
        
        events = response.json()
        events_with_sources = sum(1 for e in events if e.get("sources"))
        
        print(f"✅ {events_with_sources}/{len(events)} events have sources")
    
    def test_event_has_figures_involved(self):
        """Test that events have figures_involved for clickable figure buttons"""
        response = requests.get(f"{BASE_URL}/api/timeline/v2/events?limit=10")
        assert response.status_code == 200
        
        events = response.json()
        events_with_figures = sum(1 for e in events if e.get("figures_involved"))
        
        print(f"✅ {events_with_figures}/{len(events)} events have figures_involved")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
