"""
Spell Generation API Tests
Tests: POST /api/ai/generate-spell-job, GET /api/ai/spell-job/{job_id}, POST /api/combined

Key features being tested:
- Spell generation API creates job and returns job_id
- Tarot card data is generated with symbol, title, essence, key_action, incantation
- Research API returns spellbook_response, research_origins with V2 format
"""
import pytest
import requests
import time
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestSpellGenerationAPI:
    """Test the async spell generation pipeline"""
    
    def test_health_check(self):
        """Verify backend is accessible"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200, f"Health check failed: {response.text}"
        print("✓ Backend health check passed")
    
    def test_create_spell_job(self):
        """Test POST /api/ai/generate-spell-job creates job"""
        payload = {
            "spell_spec": {
                "persona_id": "shigg",
                "user_query": "I need protection from negative energy in my home",
                "user_name": "Test Seeker"
            },
            "belief_mode": "spiritual_grounded",
            "generate_images": False,
            "tier_preference": "quick"
        }
        
        response = requests.post(f"{BASE_URL}/api/ai/generate-spell-job", json=payload)
        
        assert response.status_code == 200, f"Failed to create spell job: {response.status_code} - {response.text}"
        
        data = response.json()
        assert "job_id" in data, "Response missing job_id"
        assert "status" in data, "Response missing status"
        assert "poll_url" in data, "Response missing poll_url"
        assert data["status"] == "pending", f"Expected status 'pending', got '{data['status']}'"
        
        print(f"✓ Spell job created with id: {data['job_id']}")
        return data["job_id"]
    
    def test_poll_spell_job_until_complete(self):
        """Test spell generation completes with blocks and tarot_card data"""
        # Create a spell job
        payload = {
            "spell_spec": {
                "persona_id": "shigg",
                "user_query": "I need comfort after a difficult loss",
                "user_name": "Test Seeker"
            },
            "belief_mode": "spiritual_grounded",
            "generate_images": False,
            "tier_preference": "quick"
        }
        
        response = requests.post(f"{BASE_URL}/api/ai/generate-spell-job", json=payload)
        assert response.status_code == 200, f"Failed to create job: {response.text}"
        job_id = response.json()["job_id"]
        
        # Poll until complete (max 120 seconds)
        max_attempts = 40  # 40 * 3s = 120s max
        result = None
        
        for attempt in range(max_attempts):
            poll_response = requests.get(f"{BASE_URL}/api/ai/spell-job/{job_id}")
            assert poll_response.status_code == 200, f"Poll failed: {poll_response.text}"
            
            poll_data = poll_response.json()
            status = poll_data.get("status")
            
            print(f"  Attempt {attempt + 1}: status={status}")
            
            if status == "complete":
                result = poll_data.get("result")
                break
            elif status == "failed":
                pytest.fail(f"Spell generation failed: {poll_data.get('error')}")
            
            time.sleep(3)
        
        assert result is not None, "Spell generation timed out after 120 seconds"
        
        # Verify blocks array
        assert "blocks" in result, "Result missing 'blocks'"
        assert isinstance(result["blocks"], list), "blocks should be an array"
        assert len(result["blocks"]) > 0, "blocks array should not be empty"
        
        print(f"✓ Spell has {len(result['blocks'])} blocks")
        
        # Verify block structure
        for block in result["blocks"]:
            assert "block_type" in block, f"Block missing block_type: {block}"
            assert "block_id" in block, f"Block missing block_id: {block}"
            assert "content" in block, f"Block missing content: {block}"
        
        # Check for expected block types
        block_types = [b["block_type"] for b in result["blocks"]]
        print(f"  Block types: {block_types}")
        
        # Verify tarot_card data
        assert "tarot_card" in result, "Result missing 'tarot_card'"
        tarot = result["tarot_card"]
        
        expected_tarot_fields = ["symbol", "title", "essence", "key_action", "incantation"]
        for field in expected_tarot_fields:
            assert field in tarot, f"tarot_card missing '{field}'"
            assert tarot[field], f"tarot_card.{field} is empty"
        
        print(f"✓ Tarot card data present:")
        print(f"  symbol: {tarot['symbol']}")
        print(f"  title: {tarot['title']}")
        print(f"  essence: {tarot['essence'][:50]}...")
        print(f"  key_action: {tarot['key_action'][:50]}...")
        print(f"  incantation: {tarot['incantation'][:50]}...")
        
        return result
    
    def test_job_not_found(self):
        """Test GET /api/ai/spell-job/{invalid_id} returns 404"""
        response = requests.get(f"{BASE_URL}/api/ai/spell-job/nonexistent-job-id")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✓ Invalid job_id returns 404")


class TestResearchAPI:
    """Test the /api/combined research endpoint"""
    
    def test_combined_endpoint(self):
        """Test POST /api/combined returns V2 format"""
        payload = {
            "user_request": "Tell me about protection spells and their history",
            "persona": "shigg",
            "tone": "gentle",
            "context": None
        }
        
        response = requests.post(f"{BASE_URL}/api/combined", json=payload, timeout=60)
        assert response.status_code == 200, f"Combined endpoint failed: {response.status_code} - {response.text}"
        
        data = response.json()
        
        # Verify spellbook_response
        assert "spellbook_response" in data, "Missing spellbook_response"
        assert data["spellbook_response"], "spellbook_response is empty"
        print(f"✓ spellbook_response present ({len(data['spellbook_response'])} chars)")
        
        # Verify research_origins V2 format
        assert "research_origins" in data, "Missing research_origins"
        origins = data["research_origins"]
        
        # V2 format should have 'summary' not 'answer'
        assert "summary" in origins, "research_origins missing 'summary' (V2 format)"
        print(f"✓ research_origins.summary: {origins['summary'][:100]}...")
        
        # V2 format should have 'key_takeaways' not 'bullets'
        assert "key_takeaways" in origins, "research_origins missing 'key_takeaways' (V2 format)"
        assert isinstance(origins["key_takeaways"], list), "key_takeaways should be array"
        print(f"✓ research_origins.key_takeaways: {len(origins['key_takeaways'])} items")
        
        # V2 format: sources should be objects with author/title
        assert "sources" in origins, "research_origins missing 'sources'"
        if origins["sources"]:
            first_source = origins["sources"][0]
            if isinstance(first_source, dict):
                print(f"✓ Sources are objects: {first_source.get('author', 'N/A')} - {first_source.get('title', 'N/A')}")
            else:
                print(f"  Sources are strings (acceptable): {first_source[:50]}...")
        
        return data


class TestAlchemizeCategories:
    """Test that spell generation works for each Alchemize category"""
    
    @pytest.mark.parametrize("category,persona", [
        ("protection", "cathleen"),
        ("baneful_justice", "katherine"),
        ("comfort_healing", "shigg"),
        ("clarity_truth", "theresa"),
    ])
    def test_category_spell_generation(self, category, persona):
        """Test spell job creation for each category"""
        payload = {
            "spell_spec": {
                "persona_id": persona,
                "user_query": f"I need help with {category.replace('_', ' ')}",
                "user_name": "Test Seeker",
                "category": category
            },
            "belief_mode": "spiritual_grounded",
            "generate_images": False,
            "tier_preference": "quick"
        }
        
        response = requests.post(f"{BASE_URL}/api/ai/generate-spell-job", json=payload)
        assert response.status_code == 200, f"Category {category} failed: {response.text}"
        
        data = response.json()
        assert "job_id" in data
        print(f"✓ Category '{category}' with guide '{persona}' - job created: {data['job_id']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
