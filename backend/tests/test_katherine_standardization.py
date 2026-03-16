"""
Tests for Katherine ID standardization (catherine -> katherine)
Verifies that all occurrences of 'catherine' have been replaced with 'katherine'
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestKatherineIDStandardization:
    """Tests for the Katherine guide ID standardization"""
    
    def test_archetypes_endpoint_returns_katherine_id(self):
        """Verify /api/archetypes returns 'katherine' as an ID (not 'catherine')"""
        response = requests.get(f"{BASE_URL}/api/archetypes")
        assert response.status_code == 200
        
        archetypes = response.json()
        archetype_ids = [a.get('id') for a in archetypes]
        
        # Verify 'katherine' is in the list
        assert 'katherine' in archetype_ids, f"'katherine' not found in archetype IDs: {archetype_ids}"
        
        # Verify 'catherine' is NOT in the list
        assert 'catherine' not in archetype_ids, f"'catherine' should not be in archetype IDs: {archetype_ids}"
        
        print(f"SUCCESS: Archetype IDs are: {archetype_ids}")
    
    def test_sample_spells_katherine_endpoint_works(self):
        """Verify /api/sample-spells/katherine returns successfully (may be empty but no 500 error)"""
        response = requests.get(f"{BASE_URL}/api/sample-spells/katherine")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        # Response should be a list (may be empty)
        assert isinstance(data, list), f"Expected list, got {type(data)}"
        
        print(f"SUCCESS: Katherine sample spells endpoint works, returned {len(data)} spells")
    
    def test_sample_spells_catherine_returns_empty_or_404(self):
        """Verify /api/sample-spells/catherine returns empty or 404 (not mapped)"""
        response = requests.get(f"{BASE_URL}/api/sample-spells/catherine")
        
        # Either 404 (not found) or 200 with empty list is acceptable
        # The key is it shouldn't return Katherine's spells under 'catherine' ID
        if response.status_code == 200:
            data = response.json()
            assert data == [] or data == {}, f"'catherine' should return empty, got: {data}"
            print("SUCCESS: catherine returns empty list as expected")
        else:
            assert response.status_code == 404, f"Expected 404 or empty list, got {response.status_code}"
            print("SUCCESS: catherine returns 404 as expected")


class TestKatherineArchetypeDetails:
    """Additional tests for Katherine archetype details"""
    
    def test_katherine_archetype_has_correct_details(self):
        """Verify Katherine archetype has expected fields"""
        response = requests.get(f"{BASE_URL}/api/archetypes")
        assert response.status_code == 200
        
        archetypes = response.json()
        katherine = next((a for a in archetypes if a.get('id') == 'katherine'), None)
        
        assert katherine is not None, "Katherine archetype not found"
        assert katherine.get('name') == 'Katherine', f"Expected name 'Katherine', got {katherine.get('name')}"
        assert 'Weaver' in katherine.get('title', ''), f"Expected 'Weaver' in title, got {katherine.get('title')}"
        
        print(f"SUCCESS: Katherine archetype details: {katherine}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
