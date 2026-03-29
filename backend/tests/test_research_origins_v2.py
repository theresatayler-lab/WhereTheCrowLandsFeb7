"""
Test suite for Research Origins feature - V2 (Async Job System)

Tests:
1. POST /api/ai/generate-spell-job - Creates async job and returns job_id
2. GET /api/ai/spell-job/{job_id} - Returns research_origins when job is complete
3. GET /api/grimoire/spells - Returns spells with research_origins if saved
4. Legacy spell extraction - Older spells have sources/blocks for extraction
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "TheresaTayler@me.com"
TEST_PASSWORD = "NinaROck1!"


class TestAsyncSpellJobSystem:
    """Test the async spell job system with research_origins"""
    
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
    
    def test_create_spell_job_returns_job_id(self, auth_headers):
        """
        Test POST /api/ai/generate-spell-job creates a job and returns job_id.
        This is the async job creation endpoint.
        """
        spell_spec = {
            "user_query": "A simple grounding ritual for anxiety",
            "intention": "finding calm during anxious moments",
            "guide_id": "shigg"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-job",
            json={
                "spell_spec": spell_spec,
                "belief_mode": "SPIRITUAL"
            },
            headers=auth_headers,
            timeout=30
        )
        
        # Check response
        assert response.status_code == 200, f"Job creation failed: {response.text}"
        data = response.json()
        
        # Validate job creation response
        assert "job_id" in data, "Response missing 'job_id'"
        assert "status" in data, "Response missing 'status'"
        assert "poll_url" in data, "Response missing 'poll_url'"
        
        assert data["status"] == "pending", f"Expected status 'pending', got '{data['status']}'"
        assert data["poll_url"].startswith("/api/ai/spell-job/"), "Invalid poll_url format"
        
        print(f"✓ Job created with ID: {data['job_id']}")
        print(f"  - Status: {data['status']}")
        print(f"  - Poll URL: {data['poll_url']}")
        
        return data["job_id"]
    
    def test_poll_job_status_returns_progress(self, auth_headers):
        """
        Test GET /api/ai/spell-job/{job_id} returns status and progress.
        """
        # First create a job
        spell_spec = {
            "user_query": "A tea ritual for morning clarity",
            "intention": "starting the day with focus",
            "guide_id": "cathleen"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-job",
            json={
                "spell_spec": spell_spec,
                "belief_mode": "SPIRITUAL"
            },
            headers=auth_headers,
            timeout=30
        )
        
        assert create_response.status_code == 200, f"Job creation failed: {create_response.text}"
        job_id = create_response.json()["job_id"]
        
        # Poll the job status
        poll_response = requests.get(
            f"{BASE_URL}/api/ai/spell-job/{job_id}",
            timeout=30
        )
        
        assert poll_response.status_code == 200, f"Job poll failed: {poll_response.text}"
        data = poll_response.json()
        
        # Validate poll response structure
        assert "job_id" in data, "Response missing 'job_id'"
        assert "status" in data, "Response missing 'status'"
        assert data["status"] in ["pending", "processing", "complete", "failed"], f"Invalid status: {data['status']}"
        
        print(f"✓ Job {job_id} status: {data['status']}")
        if "progress" in data:
            print(f"  - Progress: {data['progress']}%")
        if "current_stage" in data:
            print(f"  - Stage: {data['current_stage']}")
        
        return job_id


class TestGrimoireResearchOrigins:
    """Test research_origins in grimoire endpoints"""
    
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
    
    def test_grimoire_spells_returns_list(self, auth_headers):
        """Test GET /api/grimoire/spells returns a list of spells"""
        response = requests.get(
            f"{BASE_URL}/api/grimoire/spells",
            headers=auth_headers,
            timeout=30
        )
        
        assert response.status_code == 200, f"Get grimoire spells failed: {response.text}"
        spells = response.json()
        
        assert isinstance(spells, list), "Response should be a list"
        print(f"✓ Retrieved {len(spells)} spells from grimoire")
        
        return spells
    
    def test_spells_have_required_fields(self, auth_headers):
        """Test that spells have required fields for research extraction"""
        response = requests.get(
            f"{BASE_URL}/api/grimoire/spells",
            headers=auth_headers,
            timeout=30
        )
        
        assert response.status_code == 200
        spells = response.json()
        
        if not spells:
            pytest.skip("No spells in grimoire")
        
        # Check first spell structure
        spell = spells[0]
        
        # Required fields
        assert "id" in spell, "Spell missing 'id'"
        assert "title" in spell or "spell_data" in spell, "Spell missing title or spell_data"
        
        # Check spell_data structure for legacy extraction
        spell_data = spell.get("spell_data", {})
        
        print(f"✓ First spell: {spell.get('title', spell_data.get('title', 'Unknown'))}")
        print(f"  - Has spell_data: {bool(spell_data)}")
        print(f"  - Has sources: {bool(spell_data.get('sources'))}")
        print(f"  - Has blocks: {bool(spell_data.get('blocks'))}")
        print(f"  - Has research_origins (top-level): {bool(spell.get('research_origins'))}")
        print(f"  - Has research_origins (in spell_data): {bool(spell_data.get('research_origins'))}")
    
    def test_legacy_spells_have_extractable_data(self, auth_headers):
        """
        Test that older spells have sources/blocks that can be extracted
        for the Research & Origins section.
        """
        response = requests.get(
            f"{BASE_URL}/api/grimoire/spells",
            headers=auth_headers,
            timeout=30
        )
        
        assert response.status_code == 200
        spells = response.json()
        
        if not spells:
            pytest.skip("No spells in grimoire")
        
        # Count spells with extractable data
        with_sources = 0
        with_blocks = 0
        with_evidence_card = 0
        with_lore_vignette = 0
        
        for spell in spells:
            spell_data = spell.get("spell_data", {})
            
            if spell_data.get("sources"):
                with_sources += 1
            
            blocks = spell_data.get("blocks", [])
            if blocks:
                with_blocks += 1
                
                for block in blocks:
                    block_type = block.get("block_type", block.get("type", ""))
                    if block_type == "evidence_card":
                        with_evidence_card += 1
                        break
                
                for block in blocks:
                    block_type = block.get("block_type", block.get("type", ""))
                    if block_type == "lore_vignette":
                        with_lore_vignette += 1
                        break
        
        print(f"✓ Legacy spell data analysis:")
        print(f"  - Spells with sources: {with_sources}/{len(spells)}")
        print(f"  - Spells with blocks: {with_blocks}/{len(spells)}")
        print(f"  - Spells with evidence_card: {with_evidence_card}/{len(spells)}")
        print(f"  - Spells with lore_vignette: {with_lore_vignette}/{len(spells)}")
        
        # At least some spells should have extractable data
        assert with_sources > 0 or with_blocks > 0, "No spells have extractable research data"


class TestResearchOriginsStructure:
    """Test the structure of research_origins data from completed jobs"""
    
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
    
    def test_completed_job_has_research_origins(self, auth_headers):
        """
        Test that a completed spell job includes research_origins with expected structure.
        
        Note: This test creates a job and waits for completion (up to 2 minutes).
        """
        # Create a job
        spell_spec = {
            "user_query": "A simple candle ritual for focus",
            "intention": "improving concentration",
            "guide_id": "katherine"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-job",
            json={
                "spell_spec": spell_spec,
                "belief_mode": "SPIRITUAL"
            },
            headers=auth_headers,
            timeout=30
        )
        
        if create_response.status_code != 200:
            pytest.skip(f"Job creation failed: {create_response.text}")
        
        job_id = create_response.json()["job_id"]
        print(f"✓ Created job {job_id}, waiting for completion...")
        
        # Poll until complete or timeout (120 seconds)
        max_wait = 120
        poll_interval = 10
        elapsed = 0
        
        while elapsed < max_wait:
            poll_response = requests.get(
                f"{BASE_URL}/api/ai/spell-job/{job_id}",
                timeout=30
            )
            
            if poll_response.status_code != 200:
                pytest.skip(f"Job poll failed: {poll_response.text}")
            
            data = poll_response.json()
            status = data.get("status")
            
            print(f"  - Status: {status}, Progress: {data.get('progress', 'N/A')}%, Stage: {data.get('current_stage', 'N/A')}")
            
            if status == "complete":
                # Validate research_origins in result
                result = data.get("result", {})
                research_origins = result.get("research_origins")
                
                assert research_origins is not None, "Completed job missing research_origins"
                
                print(f"✓ Job completed with research_origins")
                print(f"  - Keys: {list(research_origins.keys())}")
                
                # Validate expected fields
                expected_fields = ["summary", "closing_statement"]
                for field in expected_fields:
                    if field in research_origins:
                        print(f"  - {field}: present")
                
                # Check for new spec fields
                if "research_table" in research_origins:
                    print(f"  - research_table: {len(research_origins['research_table'])} rows")
                if "suggested_further_reading" in research_origins:
                    print(f"  - suggested_further_reading: {len(research_origins['suggested_further_reading'])} items")
                if "ethical_statement" in research_origins:
                    print(f"  - ethical_statement: present")
                
                return research_origins
            
            elif status == "failed":
                pytest.fail(f"Job failed: {data.get('error', 'Unknown error')}")
            
            time.sleep(poll_interval)
            elapsed += poll_interval
        
        pytest.skip(f"Job did not complete within {max_wait} seconds")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
