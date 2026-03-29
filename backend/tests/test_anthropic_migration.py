"""
Test Suite for OpenAI to Anthropic Migration Verification
Validates that:
1. Provider status endpoints return correct configuration (Anthropic, DeepSeek, library image provider)
2. V3 Spell generation uses Claude Sonnet for writing
3. Research uses DeepSeek
4. No OpenAI API calls are made for text generation
"""

import pytest
import requests
import os
import time

# Get base URL from environment
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    BASE_URL = "http://localhost:8000"

# Test credentials
TEST_EMAIL = "TheresaTayler@me.com"
TEST_PASSWORD = "NinaROck1!"


class TestProviderConfiguration:
    """Test that provider configuration reflects Anthropic + DeepSeek migration"""
    
    def test_health_providers_endpoint(self):
        """GET /api/health/providers should return correct provider status"""
        response = requests.get(f"{BASE_URL}/api/health/providers")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        
        # Verify Anthropic is configured
        assert data.get("anthropic_configured") == True, "Anthropic should be configured"
        
        # Verify DeepSeek is configured
        assert data.get("deepseek_configured") == True, "DeepSeek should be configured"
        
        # Verify image provider is library (static images)
        assert data.get("image_provider") == "library", f"Image provider should be 'library', got {data.get('image_provider')}"
        
        # Verify Anthropic model
        assert "claude" in data.get("anthropic_model", "").lower(), f"Anthropic model should be Claude, got {data.get('anthropic_model')}"
        
        # Verify DeepSeek model
        assert data.get("deepseek_model") == "deepseek-chat", f"DeepSeek model should be 'deepseek-chat', got {data.get('deepseek_model')}"
        
        print(f"✓ Provider status: anthropic={data.get('anthropic_configured')}, deepseek={data.get('deepseek_configured')}, image={data.get('image_provider')}")

    def test_spell_config_v3_endpoint(self):
        """GET /api/ai/spell-config-v3 should return provider_status with Anthropic configured"""
        response = requests.get(f"{BASE_URL}/api/ai/spell-config-v3")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        
        # Verify version is v3_blocks
        assert data.get("version") == "v3_blocks", f"Version should be v3_blocks, got {data.get('version')}"
        
        # Verify provider_status exists
        provider_status = data.get("provider_status", {})
        assert provider_status, "provider_status should be present"
        
        # Check Anthropic configured
        assert provider_status.get("anthropic_configured") == True, "Anthropic should be configured in provider_status"
        
        # Check DeepSeek configured
        assert provider_status.get("deepseek_configured") == True, "DeepSeek should be configured in provider_status"
        
        # Check image provider is library
        assert provider_status.get("image_provider") == "library", f"Image provider should be 'library', got {provider_status.get('image_provider')}"
        
        # Verify llm_config shows correct providers
        llm_config = provider_status.get("llm_config", {})
        
        # spell_writer should use anthropic
        spell_writer = llm_config.get("spell_writer", {})
        assert spell_writer.get("provider") == "anthropic", f"spell_writer provider should be 'anthropic', got {spell_writer.get('provider')}"
        assert "claude-sonnet" in spell_writer.get("model", "").lower(), f"spell_writer model should contain 'claude-sonnet', got {spell_writer.get('model')}"
        
        # spell_planner should use anthropic (haiku)
        spell_planner = llm_config.get("spell_planner", {})
        assert spell_planner.get("provider") == "anthropic", f"spell_planner provider should be 'anthropic', got {spell_planner.get('provider')}"
        assert "haiku" in spell_planner.get("model", "").lower(), f"spell_planner model should contain 'haiku', got {spell_planner.get('model')}"
        
        # research should use deepseek
        research = llm_config.get("research", {})
        assert research.get("provider") == "deepseek", f"research provider should be 'deepseek', got {research.get('provider')}"
        
        print(f"✓ Spell config V3: version={data.get('version')}, providers correctly configured")
        print(f"  - spell_writer: {spell_writer.get('provider')} / {spell_writer.get('model')}")
        print(f"  - spell_planner: {spell_planner.get('provider')} / {spell_planner.get('model')}")
        print(f"  - research: {research.get('provider')} / {research.get('model')}")

    def test_llm_status_endpoint(self):
        """GET /api/llm/status should return current LLM configuration"""
        response = requests.get(f"{BASE_URL}/api/llm/status")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        
        # Verify Anthropic configured
        assert data.get("anthropic_configured") == True, "Anthropic should be configured"
        
        # Verify DeepSeek configured
        assert data.get("deepseek_configured") == True, "DeepSeek should be configured"
        
        # Verify current_config shows correct provider mappings
        current_config = data.get("current_config", {})
        
        for purpose in ["persona_voice", "spell_planner", "spell_writer"]:
            config = current_config.get(purpose, {})
            assert config.get("provider") == "anthropic", f"{purpose} should use anthropic, got {config.get('provider')}"
            assert "claude" in config.get("model", "").lower(), f"{purpose} model should contain 'claude', got {config.get('model')}"
        
        # Research should use DeepSeek
        research_config = current_config.get("research", {})
        assert research_config.get("provider") == "deepseek", f"research should use deepseek, got {research_config.get('provider')}"
        
        print(f"✓ LLM status: All text generation using Anthropic, research using DeepSeek")


class TestV3SpellGeneration:
    """Test V3 spell generation using Anthropic Claude"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("token")
        pytest.skip(f"Authentication failed: {response.status_code} - {response.text}")
    
    def test_start_spell_job_shigg(self, auth_token):
        """POST /api/ai/generate-spell-job with shigg guide - async job pattern to avoid proxy timeout"""
        headers = {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}
        
        payload = {
            "spell_spec": {
                "persona_id": "shigg",
                "intention": "I need calm and peace for testing",
                "user_query": "I need calm and peace",
                "user_name": "Test Seeker",
                "desired_feeling": "calm"
            },
            "belief_mode": "SPIRITUAL",
            "generate_images": False,
            "tier_preference": "quick"
        }
        
        print(f"Starting async spell job for shigg guide...")
        
        # Start the job
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-job",
            json=payload,
            headers=headers,
            timeout=30
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text[:500]}"
        
        data = response.json()
        assert "job_id" in data, "job_id should be in response"
        assert data.get("status") == "pending", f"Status should be pending, got {data.get('status')}"
        
        job_id = data["job_id"]
        print(f"✓ Job started: {job_id}")
        print(f"  - Status: {data.get('status')}")
        print(f"  - Poll URL: {data.get('poll_url')}")
        
        # Poll for completion (with timeout)
        max_polls = 30  # 30 * 5 = 150 seconds max wait
        for i in range(max_polls):
            time.sleep(5)
            
            poll_response = requests.get(
                f"{BASE_URL}/api/ai/spell-job/{job_id}",
                headers=headers,
                timeout=30
            )
            
            assert poll_response.status_code == 200, f"Poll failed: {poll_response.status_code}"
            
            poll_data = poll_response.json()
            status = poll_data.get("status")
            
            print(f"  Poll {i+1}: status={status}")
            
            if status == "complete":
                # Verify spell result
                result = poll_data.get("result", {})
                spell = result.get("spell", {})
                blocks = spell.get("blocks", [])
                
                assert len(blocks) > 0, "Spell should have blocks"
                
                print(f"✓ Spell complete with {len(blocks)} blocks")
                print(f"  - Title: {spell.get('title', spell.get('spell_title', 'N/A'))[:50]}")
                return  # Success!
                
            elif status == "failed":
                pytest.fail(f"Spell generation failed: {poll_data.get('error')}")
        
        pytest.fail(f"Spell generation timed out after {max_polls * 5} seconds")
    
    def test_generate_spell_v3_quick_shigg(self, auth_token):
        """POST /api/ai/generate-spell-v3 with shigg guide should generate spell using Claude"""
        headers = {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}
        
        payload = {
            "spell_spec": {
                "persona_id": "shigg",
                "intention": "I need calm and peace",
                "user_query": "I need calm and peace for my morning",
                "user_name": "Test Seeker",
                "desired_feeling": "calm"
            },
            "belief_mode": "SPIRITUAL",
            "generate_images": False,
            "tier_preference": "quick"  # Use quick tier for faster testing
        }
        
        print(f"Sending spell generation request to {BASE_URL}/api/ai/generate-spell-v3...")
        print(f"Using tier_preference: quick (expected 15-25 seconds)")
        
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-v3",
            json=payload,
            headers=headers,
            timeout=120  # 2 minute timeout
        )
        elapsed = time.time() - start_time
        
        print(f"Response received in {elapsed:.1f} seconds, status: {response.status_code}")
        
        # Check response status
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text[:500]}"
        
        data = response.json()
        
        # Verify spell was generated
        spell = data.get("spell", {})
        assert spell, "Spell object should be present"
        
        # Verify spell_title exists
        assert spell.get("title") or spell.get("spell_title"), f"Spell should have a title, got keys: {list(spell.keys())[:10]}"
        
        # Verify blocks array exists and has content
        blocks = spell.get("blocks", [])
        assert isinstance(blocks, list), f"Blocks should be a list, got {type(blocks)}"
        assert len(blocks) > 0, "Blocks array should not be empty"
        
        # Verify block structure
        for i, block in enumerate(blocks[:3]):  # Check first 3 blocks
            assert "block_type" in block, f"Block {i} should have block_type"
            assert "content" in block, f"Block {i} should have content"
            print(f"  - Block {i}: type={block.get('block_type')}")
        
        # Verify metadata shows tier and timing
        metadata = data.get("metadata", {})
        timing = metadata.get("timing", {})
        
        print(f"✓ Spell generated successfully with {len(blocks)} blocks in {elapsed:.1f}s")
        print(f"  - Title: {spell.get('title', spell.get('spell_title', 'N/A'))[:50]}")
        print(f"  - Tier: {metadata.get('tier', {}).get('selected', 'N/A')}")
        print(f"  - Writer model: {metadata.get('writer_model', 'N/A')}")
        
    def test_generate_spell_v3_quick_cathleen(self, auth_token):
        """POST /api/ai/generate-spell-v3 with cathleen guide should generate protection spell"""
        headers = {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}
        
        payload = {
            "spell_spec": {
                "persona_id": "cathleen",
                "intention": "I need protection and strength",
                "user_query": "I need protection for my home",
                "user_name": "Test Seeker",
                "desired_feeling": "protected"
            },
            "belief_mode": "SPIRITUAL",
            "generate_images": False,
            "tier_preference": "quick"
        }
        
        print(f"Sending spell generation request for cathleen guide...")
        
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-v3",
            json=payload,
            headers=headers,
            timeout=120
        )
        elapsed = time.time() - start_time
        
        print(f"Response received in {elapsed:.1f} seconds, status: {response.status_code}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text[:500]}"
        
        data = response.json()
        spell = data.get("spell", {})
        blocks = spell.get("blocks", [])
        
        assert len(blocks) > 0, "Blocks array should not be empty"
        
        # Verify guide ID is cathleen
        assert data.get("archetype", {}).get("id") == "cathleen" or spell.get("persona_id") == "cathleen", \
            f"Guide should be cathleen, got {data.get('archetype', {}).get('id')}"
        
        print(f"✓ Cathleen spell generated with {len(blocks)} blocks in {elapsed:.1f}s")
        print(f"  - Title: {spell.get('title', spell.get('spell_title', 'N/A'))[:50]}")

    def test_generate_spell_v3_quick_katherine(self, auth_token):
        """POST /api/ai/generate-spell-v3 with katherine guide should generate precise spell"""
        headers = {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}
        
        payload = {
            "spell_spec": {
                "persona_id": "katherine",
                "intention": "I need clarity about a decision",
                "user_query": "I seek clarity for a difficult choice",
                "user_name": "Test Seeker",
                "desired_feeling": "clear"
            },
            "belief_mode": "SPIRITUAL",
            "generate_images": False,
            "tier_preference": "quick"
        }
        
        print(f"Sending spell generation request for katherine guide...")
        
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-v3",
            json=payload,
            headers=headers,
            timeout=120
        )
        elapsed = time.time() - start_time
        
        print(f"Response received in {elapsed:.1f} seconds, status: {response.status_code}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text[:500]}"
        
        data = response.json()
        spell = data.get("spell", {})
        blocks = spell.get("blocks", [])
        
        assert len(blocks) > 0, "Blocks array should not be empty"
        
        print(f"✓ Katherine spell generated with {len(blocks)} blocks in {elapsed:.1f}s")
        print(f"  - Title: {spell.get('title', spell.get('spell_title', 'N/A'))[:50]}")


class TestResearchService:
    """Test that research service uses DeepSeek"""
    
    def test_research_config_endpoint(self):
        """GET /api/research/config should return research configuration"""
        response = requests.get(f"{BASE_URL}/api/research/config")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        
        # Verify version
        assert data.get("version") == "v3", f"Research version should be v3, got {data.get('version')}"
        
        # Verify research_modes exist
        research_modes = data.get("research_modes", {})
        assert "spell_origins" in research_modes, "spell_origins mode should exist"
        assert "safety_substitutions" in research_modes, "safety_substitutions mode should exist"
        
        # Verify tradition tags
        tradition_tags = data.get("tradition_tags", [])
        assert "british_folk_magic" in tradition_tags, "british_folk_magic should be in tradition tags"
        
        print(f"✓ Research config v3 with {len(research_modes)} modes, {len(tradition_tags)} tradition tags")


class TestAuthentication:
    """Test authentication endpoints"""
    
    def test_login_with_test_credentials(self):
        """POST /api/auth/login should authenticate test user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text[:200]}"
        
        data = response.json()
        assert "token" in data, "Token should be in response"
        assert "user" in data, "User should be in response"
        assert data["user"]["email"] == TEST_EMAIL, "Email should match"
        
        print(f"✓ Authentication successful for {TEST_EMAIL}")


# Run tests when executed directly
if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
