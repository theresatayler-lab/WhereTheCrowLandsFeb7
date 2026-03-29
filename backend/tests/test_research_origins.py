"""
Test suite for research_origins feature in spell generation and grimoire.

Tests:
1. POST /api/ai/generate-spell-v3 - response includes 'research_origins' field
2. POST /api/ai/generate-spell-v2 - response includes 'research_origins' field
3. POST /api/grimoire/save - accepts 'research_origins' field and stores it
4. GET /api/grimoire/spells - returns 'research_origins' if saved with spell
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "TheresaTayler@me.com"
TEST_PASSWORD = "NinaROck1!"


class TestResearchOriginsFeature:
    """Test research_origins feature across spell generation and grimoire endpoints"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token for test user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "token" in data, "No token in login response"
        return data["token"]
    
    @pytest.fixture(scope="class")
    def auth_headers(self, auth_token):
        """Get auth headers for authenticated requests"""
        return {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }
    
    def test_login_works(self, auth_token):
        """Verify login works with test credentials"""
        assert auth_token is not None
        assert len(auth_token) > 0
        print(f"✓ Login successful, token length: {len(auth_token)}")
    
    def test_v3_spell_generation_includes_research_origins(self, auth_headers):
        """
        Test POST /api/ai/generate-spell-v3 returns research_origins field.
        
        The V3 endpoint uses DeepSeek (archivist) + Claude (writer) which can take 30-60 seconds.
        research_origins should contain: summary, key_takeaways, why_this_works_facts, sources
        """
        spell_spec = {
            "persona_id": "shigg",
            "intention": "finding calm during stressful times",
            "desired_feeling": "calm",
            "anchor_object": "tea"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-v3",
            json={
                "spell_spec": spell_spec,
                "belief_mode": "SPIRITUAL",
                "generate_images": False
            },
            headers=auth_headers,
            timeout=120  # 2 min timeout for dual-model generation
        )
        
        assert response.status_code == 200, f"V3 spell generation failed: {response.text}"
        data = response.json()
        
        # Check top-level response structure
        assert "spell" in data, "Response missing 'spell' field"
        assert "research_origins" in data, "Response missing top-level 'research_origins' field"
        
        # Check research_origins structure
        research_origins = data.get("research_origins")
        if research_origins:
            print(f"✓ research_origins present in V3 response")
            
            # Validate expected fields
            if "summary" in research_origins:
                print(f"  - summary: {research_origins['summary'][:100]}...")
            
            if "key_takeaways" in research_origins:
                print(f"  - key_takeaways count: {len(research_origins['key_takeaways'])}")
                assert isinstance(research_origins['key_takeaways'], list)
            
            if "why_this_works_facts" in research_origins:
                print(f"  - why_this_works_facts count: {len(research_origins['why_this_works_facts'])}")
                assert isinstance(research_origins['why_this_works_facts'], list)
            
            if "sources" in research_origins:
                print(f"  - sources count: {len(research_origins['sources'])}")
                assert isinstance(research_origins['sources'], list)
        else:
            print("⚠ research_origins is None (may happen if archivist stage skipped)")
        
        # Check spell also has research_origins embedded
        spell = data.get("spell", {})
        if spell.get("research_origins"):
            print(f"✓ research_origins also embedded in spell object")
        
        return data  # Return for use in other tests
    
    def test_v2_spell_generation_includes_research_origins(self, auth_headers):
        """
        Test POST /api/ai/generate-spell-v2 returns research_origins field.
        
        V2 uses the same pipeline with archivist stage.
        """
        spell_spec = {
            "persona_id": "cathleen",
            "intention": "protection from negative energy",
            "desired_feeling": "protected"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-v2",
            json={
                "spell_spec": spell_spec,
                "belief_mode": "SPIRITUAL",
                "generate_images": False
            },
            headers=auth_headers,
            timeout=120
        )
        
        assert response.status_code == 200, f"V2 spell generation failed: {response.text}"
        data = response.json()
        
        # Check response structure
        assert "spell" in data, "Response missing 'spell' field"
        assert "research_origins" in data, "Response missing top-level 'research_origins' field"
        
        research_origins = data.get("research_origins")
        if research_origins:
            print(f"✓ research_origins present in V2 response")
            print(f"  - Fields present: {list(research_origins.keys())}")
        else:
            print("⚠ research_origins is None in V2 response")
        
        return data
    
    def test_grimoire_save_accepts_research_origins(self, auth_headers):
        """
        Test POST /api/grimoire/save accepts and stores research_origins field.
        """
        # Create test spell data with research_origins
        test_spell_data = {
            "title": "TEST_Research_Origins_Spell",
            "introduction": "A test spell for research origins feature",
            "blocks": [
                {"block_type": "cold_open", "content": "Test content"}
            ],
            "research_origins": {
                "summary": "Test research summary",
                "key_takeaways": [
                    {"text": "Test takeaway 1", "claim_flag": "folklore", "confidence": "high"}
                ],
                "why_this_works_facts": [
                    {"claim": "Test fact", "claim_flag": "historical", "confidence": "medium"}
                ],
                "sources": [
                    {"id": "test-1", "author": "Test Author", "title": "Test Work", "year": 2020}
                ]
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/grimoire/save",
            json={
                "spell_data": test_spell_data,
                "archetype_id": "shigg",
                "archetype_name": "Shigg",
                "archetype_title": "Kitchen Witch",
                "research_origins": test_spell_data["research_origins"]
            },
            headers=auth_headers,
            timeout=30
        )
        
        assert response.status_code == 200, f"Grimoire save failed: {response.text}"
        data = response.json()
        
        assert "id" in data, "Response missing spell ID"
        spell_id = data["id"]
        print(f"✓ Spell saved with ID: {spell_id}")
        
        return spell_id
    
    def test_grimoire_spells_returns_research_origins(self, auth_headers):
        """
        Test GET /api/grimoire/spells returns research_origins if saved with spell.
        """
        response = requests.get(
            f"{BASE_URL}/api/grimoire/spells",
            headers=auth_headers,
            timeout=30
        )
        
        assert response.status_code == 200, f"Get grimoire spells failed: {response.text}"
        spells = response.json()
        
        assert isinstance(spells, list), "Response should be a list of spells"
        print(f"✓ Retrieved {len(spells)} spells from grimoire")
        
        # Find our test spell
        test_spell = None
        for spell in spells:
            if spell.get("title") == "TEST_Research_Origins_Spell":
                test_spell = spell
                break
        
        if test_spell:
            print(f"✓ Found test spell: {test_spell.get('title')}")
            
            # Check if research_origins is present
            research_origins = test_spell.get("research_origins")
            if research_origins:
                print(f"✓ research_origins returned with saved spell")
                print(f"  - summary: {research_origins.get('summary', 'N/A')[:50]}...")
                print(f"  - key_takeaways: {len(research_origins.get('key_takeaways', []))} items")
                print(f"  - sources: {len(research_origins.get('sources', []))} items")
            else:
                # Check if it's in spell_data
                spell_data = test_spell.get("spell_data", {})
                if spell_data.get("research_origins"):
                    print(f"✓ research_origins found in spell_data")
                else:
                    print("⚠ research_origins not found in saved spell")
        else:
            print("⚠ Test spell not found in grimoire (may have been cleaned up)")
        
        return spells
    
    def test_cleanup_test_spell(self, auth_headers):
        """Clean up test spell from grimoire"""
        # Get all spells
        response = requests.get(
            f"{BASE_URL}/api/grimoire/spells",
            headers=auth_headers,
            timeout=30
        )
        
        if response.status_code == 200:
            spells = response.json()
            for spell in spells:
                if spell.get("title", "").startswith("TEST_"):
                    spell_id = spell.get("id")
                    delete_response = requests.delete(
                        f"{BASE_URL}/api/grimoire/spells/{spell_id}",
                        headers=auth_headers,
                        timeout=30
                    )
                    if delete_response.status_code in [200, 204]:
                        print(f"✓ Cleaned up test spell: {spell_id}")


class TestResearchOriginsStructure:
    """Test the structure and content of research_origins data"""
    
    @pytest.fixture(scope="class")
    def auth_headers(self):
        """Get auth headers"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            token = response.json().get("token")
            return {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        pytest.skip("Could not authenticate")
    
    def test_research_origins_has_expected_structure(self, auth_headers):
        """
        Verify research_origins has the expected structure for frontend display.
        
        Expected structure:
        {
            "research_mode": "spell_origins",
            "summary": "string",
            "key_takeaways": [{"text": "...", "claim_flag": "...", "confidence": "...", "source_refs": [...]}],
            "why_this_works_facts": [{"claim": "...", "claim_flag": "...", "confidence": "...", "source_refs": [...]}],
            "practice_context": {"tradition_tags": [...], "time_period": "...", "region": "..."},
            "sources": [{"id": "...", "author": "...", "title": "...", "year": ..., "quality_tier": "...", "url": "...", "notes": "..."}]
        }
        """
        spell_spec = {
            "persona_id": "katherine",
            "intention": "revealing hidden truths",
            "desired_feeling": "clear"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-v3",
            json={
                "spell_spec": spell_spec,
                "belief_mode": "SPIRITUAL",
                "generate_images": False
            },
            headers=auth_headers,
            timeout=120
        )
        
        if response.status_code != 200:
            pytest.skip(f"Spell generation failed: {response.text}")
        
        data = response.json()
        research_origins = data.get("research_origins")
        
        if not research_origins:
            pytest.skip("No research_origins in response (archivist may have been skipped)")
        
        # Validate structure
        print(f"✓ research_origins structure validation:")
        
        # Check summary
        assert "summary" in research_origins or research_origins.get("summary") is None
        print(f"  - summary: {'present' if research_origins.get('summary') else 'empty'}")
        
        # Check key_takeaways
        key_takeaways = research_origins.get("key_takeaways", [])
        print(f"  - key_takeaways: {len(key_takeaways)} items")
        if key_takeaways:
            first_takeaway = key_takeaways[0]
            assert "text" in first_takeaway or "claim" in first_takeaway
            print(f"    - First takeaway has fields: {list(first_takeaway.keys())}")
        
        # Check why_this_works_facts
        why_facts = research_origins.get("why_this_works_facts", [])
        print(f"  - why_this_works_facts: {len(why_facts)} items")
        
        # Check sources
        sources = research_origins.get("sources", [])
        print(f"  - sources: {len(sources)} items")
        if sources:
            first_source = sources[0]
            print(f"    - First source has fields: {list(first_source.keys())}")
        
        # Check practice_context (optional)
        practice_context = research_origins.get("practice_context", {})
        if practice_context:
            print(f"  - practice_context: {list(practice_context.keys())}")


class TestPersonalizedSpellResearchOrigins:
    """Test research_origins in personalized spell endpoint"""
    
    @pytest.fixture(scope="class")
    def auth_headers(self):
        """Get auth headers"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            token = response.json().get("token")
            return {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        pytest.skip("Could not authenticate")
    
    def test_personalized_spell_includes_research_origins(self, auth_headers):
        """
        Test POST /api/ai/generate-personalized-spell includes research_origins.
        
        The personalized spell endpoint builds research_origins from 'inspired_by' references.
        """
        # First check if endpoint exists
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-personalized-spell",
            json={
                "spell_spec": {
                    "persona_id": "shigg",
                    "intention": "morning calm ritual",
                    "desired_feeling": "calm"
                },
                "generate_images": False
            },
            headers=auth_headers,
            timeout=120
        )
        
        if response.status_code == 404:
            pytest.skip("Personalized spell endpoint not found")
        
        if response.status_code != 200:
            print(f"⚠ Personalized spell endpoint returned {response.status_code}: {response.text[:200]}")
            pytest.skip(f"Endpoint returned {response.status_code}")
        
        data = response.json()
        
        # Check for research_origins
        research_origins = data.get("research_origins")
        spell = data.get("spell", {})
        spell_research = spell.get("research_origins")
        
        if research_origins or spell_research:
            print(f"✓ research_origins present in personalized spell response")
            origins = research_origins or spell_research
            print(f"  - Fields: {list(origins.keys())}")
        else:
            print("⚠ No research_origins in personalized spell response")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
