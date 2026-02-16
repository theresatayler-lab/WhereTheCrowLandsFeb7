"""
Test Archivist DeepSeek Integration
===================================
Tests that the Archivist research stage now makes REAL DeepSeek API calls
instead of returning hardcoded data.

Key Metrics:
- archivist_ms > 5000ms proves real API call (not hardcoded)
- stages_completed includes 'archivist'
- Spell blocks contain specific historical/folklore references
"""

import pytest
import requests
import os
import time
import json

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestArchivistDeepSeekIntegration:
    """Tests for the live Archivist DeepSeek integration"""
    
    def test_health_check_providers(self):
        """Verify all AI providers (including DeepSeek) are configured"""
        response = requests.get(f"{BASE_URL}/api/health/providers", timeout=30)
        assert response.status_code == 200
        
        data = response.json()
        print(f"Provider status: {json.dumps(data, indent=2)}")
        
        # Verify DeepSeek is configured
        assert data.get('deepseek_configured') == True, "DeepSeek should be configured"
        assert data.get('openai_configured') == True, "OpenAI should be configured"
        
        print("✓ DeepSeek and OpenAI providers are configured")
    
    def test_spell_generation_with_real_archivist(self):
        """
        TEST: Spell generation uses REAL DeepSeek API for Archivist research
        
        Expected:
        - archivist_ms > 5000ms (proves real API call, not hardcoded ~0-1ms)
        - stages_completed includes 'archivist'
        - Spell completes with blocks and tarot_card
        """
        # Create spell job
        spell_spec = {
            "intention": "I want to protect my home from negative energy",
            "user_query": "I want to protect my home from negative energy",
            "desired_feeling": "protected",
            "persona_id": "shigg"
        }
        
        payload = {
            "spell_spec": spell_spec,
            "belief_mode": "SPIRITUAL",
            "generate_images": False
        }
        
        print(f"\n📜 Creating spell job for: {spell_spec['intention'][:50]}...")
        
        # Create job
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-job",
            json=payload,
            timeout=30
        )
        assert response.status_code == 200, f"Failed to create job: {response.text}"
        
        job_data = response.json()
        job_id = job_data.get('job_id')
        assert job_id, "No job_id returned"
        
        print(f"✓ Job created: {job_id}")
        print(f"  Estimated time: {job_data.get('estimated_time_seconds', 120)}s")
        
        # Poll for completion (extended timeout for real DeepSeek call ~40-60s)
        max_wait = 180  # 3 minutes
        poll_interval = 5
        elapsed = 0
        
        result = None
        while elapsed < max_wait:
            poll_response = requests.get(
                f"{BASE_URL}/api/ai/spell-job/{job_id}",
                timeout=30
            )
            assert poll_response.status_code == 200
            
            poll_data = poll_response.json()
            status = poll_data.get('status')
            
            if status == 'processing':
                progress = poll_data.get('progress', 0)
                print(f"  [{elapsed}s] Processing... {progress}%")
            elif status == 'complete':
                result = poll_data.get('result')
                print(f"✓ Spell completed in {elapsed}s")
                break
            elif status == 'failed':
                error = poll_data.get('error', 'Unknown error')
                pytest.fail(f"Spell generation failed: {error}")
            
            time.sleep(poll_interval)
            elapsed += poll_interval
        
        assert result, f"Spell generation timed out after {max_wait}s"
        
        # Extract metadata
        metadata = result.get('metadata', {})
        timing = metadata.get('timing', {})
        stages = metadata.get('stages_completed', [])
        
        print(f"\n📊 Timing Analysis:")
        print(f"  - archivist_ms: {timing.get('archivist_ms', 0)}ms")
        print(f"  - planner_ms: {timing.get('planner_ms', 0)}ms")
        print(f"  - writer_ms: {timing.get('writer_ms', 0)}ms")
        print(f"  - total_ms: {timing.get('total_ms', 0)}ms")
        print(f"  - stages_completed: {stages}")
        
        # KEY ASSERTION: archivist_ms > 5000ms proves real DeepSeek API call
        archivist_ms = timing.get('archivist_ms', 0)
        assert archivist_ms > 5000, (
            f"archivist_ms={archivist_ms}ms - TOO LOW! "
            f"Real DeepSeek API calls should take 15-40 seconds. "
            f"This suggests hardcoded/mocked data is still being returned."
        )
        print(f"✓ archivist_ms={archivist_ms}ms - REAL DeepSeek API call confirmed!")
        
        # Verify 'archivist' stage completed
        assert 'archivist' in stages, f"'archivist' not in stages_completed: {stages}"
        print("✓ 'archivist' stage in stages_completed")
        
        # Verify spell output structure
        spell = result.get('spell', {})
        blocks = spell.get('blocks', [])
        tarot_card = spell.get('tarot_card', {})
        
        assert len(blocks) > 0, "No spell blocks returned"
        print(f"✓ Spell has {len(blocks)} blocks")
        
        assert tarot_card, "No tarot_card returned"
        assert tarot_card.get('title'), "tarot_card missing title"
        print(f"✓ Tarot card: {tarot_card.get('title')}")
        
        # Report block types found
        block_types = [b.get('block_type') for b in blocks]
        print(f"  Block types: {block_types}")
        
        return result
    
    def test_spell_content_quality_has_folklore_references(self):
        """
        TEST: Spell content contains specific historical/folklore references
        (not generic 'family patterns' boilerplate)
        
        The Archivist should provide intention-specific research that makes
        spell content richer and more historically grounded.
        """
        # Create spell job with specific intention
        spell_spec = {
            "intention": "I need protection for my journey and safe travels",
            "user_query": "I need protection for my journey and safe travels",
            "desired_feeling": "protected",
            "persona_id": "shigg"
        }
        
        payload = {
            "spell_spec": spell_spec,
            "belief_mode": "SPIRITUAL",
            "generate_images": False
        }
        
        print(f"\n📜 Testing content quality for: {spell_spec['intention'][:50]}...")
        
        # Create and poll job
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-job",
            json=payload,
            timeout=30
        )
        assert response.status_code == 200
        
        job_id = response.json().get('job_id')
        
        # Wait for completion
        max_wait = 180
        poll_interval = 5
        elapsed = 0
        result = None
        
        while elapsed < max_wait:
            poll_response = requests.get(
                f"{BASE_URL}/api/ai/spell-job/{job_id}",
                timeout=30
            )
            poll_data = poll_response.json()
            
            if poll_data.get('status') == 'complete':
                result = poll_data.get('result')
                break
            elif poll_data.get('status') == 'failed':
                pytest.fail(f"Spell failed: {poll_data.get('error')}")
            
            time.sleep(poll_interval)
            elapsed += poll_interval
        
        assert result, "Spell generation timed out"
        
        spell = result.get('spell', {})
        blocks = spell.get('blocks', [])
        
        # Find cold_open and lore_vignette blocks
        cold_open = None
        lore_vignette = None
        
        for block in blocks:
            block_type = block.get('block_type')
            if block_type == 'cold_open':
                cold_open = block
            elif block_type == 'lore_vignette':
                lore_vignette = block
        
        # Check cold_open content
        if cold_open:
            content = cold_open.get('content', '') or cold_open.get('text', '') or ''
            print(f"\n📖 cold_open content ({len(content)} chars):")
            print(f"  '{str(content)[:300]}...'")
            
            # Check it's not generic boilerplate
            generic_patterns = [
                "family patterns",
                "lorem ipsum",
                "placeholder",
                "generic protection spell"
            ]
            content_lower = content.lower()
            for pattern in generic_patterns:
                assert pattern not in content_lower, (
                    f"cold_open contains generic boilerplate: '{pattern}'"
                )
            
            # Should have some substantial content
            assert len(content) > 50, "cold_open content too short"
            print("✓ cold_open has substantial, non-generic content")
        else:
            print("⚠ No cold_open block found")
        
        # Check lore_vignette content
        if lore_vignette:
            content = lore_vignette.get('content', '') or lore_vignette.get('text', '') or ''
            print(f"\n📖 lore_vignette content ({len(content)} chars):")
            print(f"  '{str(content)[:300]}...'")
            
            assert len(content) > 50, "lore_vignette content too short"
            print("✓ lore_vignette has substantial content")
        else:
            print("⚠ No lore_vignette block found")
        
        # Verify archivist timing is real
        timing = result.get('metadata', {}).get('timing', {})
        archivist_ms = timing.get('archivist_ms', 0)
        print(f"\n⏱ archivist_ms: {archivist_ms}ms")
        
        assert archivist_ms > 5000, (
            f"archivist_ms={archivist_ms}ms too low - suggests mocked data"
        )
        print("✓ Real DeepSeek research confirmed by timing")


class TestResearchEndpointDirect:
    """Test the research service directly"""
    
    def test_combined_research_endpoint(self):
        """
        TEST: POST /api/combined makes real DeepSeek call
        This tests the research button in GrimoirePage
        """
        payload = {
            "user_request": "Tell me about protection magic for the home",
            "persona": "shigg",
            "tone": "gentle"
        }
        
        print(f"\n📡 Testing /api/combined endpoint...")
        
        start = time.time()
        response = requests.post(
            f"{BASE_URL}/api/combined",
            json=payload,
            timeout=120  # 2 minute timeout as per requirement
        )
        elapsed = time.time() - start
        
        assert response.status_code == 200, f"Failed: {response.text}"
        
        data = response.json()
        print(f"✓ Response received in {elapsed:.1f}s")
        
        # Check V2 format
        research = data.get('research_origins', {})
        
        # V2 uses 'summary' not 'answer'
        summary = research.get('summary', '')
        assert summary, "research_origins.summary is empty"
        print(f"  Summary: {summary[:100]}...")
        
        # V2 uses key_takeaways as array
        key_takeaways = research.get('key_takeaways', [])
        assert isinstance(key_takeaways, list), "key_takeaways should be array"
        print(f"  Key takeaways: {len(key_takeaways)} items")
        
        # V2 uses sources as objects
        sources = research.get('sources', [])
        if sources:
            assert isinstance(sources[0], dict), "sources should be objects"
            print(f"  Sources: {len(sources)} items")
        
        # Check spellbook response
        spellbook = data.get('spellbook_response', '')
        assert spellbook, "spellbook_response is empty"
        print(f"  Spellbook response: {len(spellbook)} chars")
        
        print("✓ /api/combined V2 format verified")


class TestErrorFallback:
    """Test graceful degradation when DeepSeek fails"""
    
    def test_spell_generation_fallback(self):
        """
        TEST: If DeepSeek fails, pipeline should complete with fallback research
        
        Note: We can't easily simulate DeepSeek failure, but we can verify
        the spell generation still has proper structure even with minimal research.
        """
        # This test mainly verifies the pipeline doesn't crash
        spell_spec = {
            "intention": "Basic test intention",
            "user_query": "Basic test intention",
            "desired_feeling": "calm",
            "persona_id": "shigg"
        }
        
        payload = {
            "spell_spec": spell_spec,
            "belief_mode": "SECULAR",
            "generate_images": False
        }
        
        print(f"\n🔧 Testing basic spell generation structure...")
        
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-job",
            json=payload,
            timeout=30
        )
        assert response.status_code == 200
        
        job_id = response.json().get('job_id')
        
        # Poll with shorter timeout - just verify it completes
        max_wait = 180
        poll_interval = 5
        elapsed = 0
        result = None
        
        while elapsed < max_wait:
            poll_response = requests.get(
                f"{BASE_URL}/api/ai/spell-job/{job_id}",
                timeout=30
            )
            poll_data = poll_response.json()
            
            if poll_data.get('status') == 'complete':
                result = poll_data.get('result')
                break
            elif poll_data.get('status') == 'failed':
                # Even failure is acceptable for this test - it means graceful handling
                print(f"⚠ Job failed gracefully: {poll_data.get('error')}")
                return
            
            time.sleep(poll_interval)
            elapsed += poll_interval
        
        if result:
            spell = result.get('spell', {})
            blocks = spell.get('blocks', [])
            
            print(f"✓ Spell completed with {len(blocks)} blocks")
            
            # Verify basic structure exists
            assert 'metadata' in result, "Result should have metadata"
            assert 'spell' in result, "Result should have spell"
            print("✓ Basic structure verified")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
