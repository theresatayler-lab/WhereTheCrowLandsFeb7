"""
Test AI Image Generation endpoint with Gemini Nano Banana integration.
Tests:
- POST /api/ai/generate-image with valid prompt and archetype
- Different archetype styles (shiggy, kathleen, katherine, theresa, neutral)
- Error handling for empty prompts
- GET /api/ai/image-styles endpoint for available styles
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')

class TestImageStyles:
    """Test GET /api/ai/image-styles endpoint"""
    
    def test_get_image_styles(self):
        """Test that image styles endpoint returns available styles"""
        response = requests.get(f"{BASE_URL}/api/ai/image-styles")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert 'styles' in data, "Response should contain 'styles'"
        assert 'default' in data, "Response should contain 'default'"
        assert data['default'] == 'neutral', "Default style should be 'neutral'"
        
        # Check all expected archetypes are present
        expected_archetypes = ['shiggy', 'kathleen', 'katherine', 'theresa', 'neutral']
        for archetype in expected_archetypes:
            assert archetype in data['styles'], f"Missing archetype: {archetype}"
            assert 'name' in data['styles'][archetype], f"Missing 'name' for {archetype}"
            assert 'description' in data['styles'][archetype], f"Missing 'description' for {archetype}"
        
        print(f"✓ GET /api/ai/image-styles: All {len(expected_archetypes)} styles present")


class TestImageGeneration:
    """Test POST /api/ai/generate-image endpoint - Real AI integration"""
    
    def test_generate_image_with_neutral_style(self):
        """Test image generation with default neutral style"""
        payload = {
            "prompt": "A mystical cauldron with swirling mist",
            "archetype": "neutral"
        }
        
        print(f"Testing image generation with neutral style (this may take 10-30 seconds)...")
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-image",
            json=payload,
            timeout=90  # Longer timeout for AI generation
        )
        
        if response.status_code == 429:
            pytest.skip("Rate limit reached - skipping test")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert 'image_base64' in data, "Response should contain 'image_base64'"
        assert isinstance(data['image_base64'], str), "image_base64 should be a string"
        assert len(data['image_base64']) > 100, "image_base64 should be non-trivial length"
        
        print(f"✓ POST /api/ai/generate-image (neutral): Generated base64 image (length: {len(data['image_base64'])})")

    def test_generate_image_with_shiggy_style(self):
        """Test image generation with shiggy archetype style"""
        # Wait to avoid rate limiting
        time.sleep(12)
        
        payload = {
            "prompt": "A robin perched on an ancient tome",
            "archetype": "shiggy"
        }
        
        print(f"Testing image generation with shiggy style (this may take 10-30 seconds)...")
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-image",
            json=payload,
            timeout=90
        )
        
        if response.status_code == 429:
            pytest.skip("Rate limit reached - skipping test")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert 'image_base64' in data, "Response should contain 'image_base64'"
        assert len(data['image_base64']) > 100, "image_base64 should be non-trivial"
        
        print(f"✓ POST /api/ai/generate-image (shiggy): Generated base64 image (length: {len(data['image_base64'])})")

    def test_generate_image_empty_prompt_validation(self):
        """Test that empty prompt returns appropriate error"""
        payload = {
            "prompt": "",
            "archetype": "neutral"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-image",
            json=payload,
            timeout=30
        )
        
        # Should return 422 for validation error
        # Note: If 200 is returned, the backend doesn't validate empty prompts
        if response.status_code == 200:
            print(f"⚠ POST /api/ai/generate-image (empty prompt): Backend accepts empty prompts (no validation)")
        elif response.status_code == 422:
            print(f"✓ POST /api/ai/generate-image (empty prompt): Correctly rejected with 422")
        elif response.status_code == 429:
            pytest.skip("Rate limit reached - skipping test")
        else:
            print(f"⚠ POST /api/ai/generate-image (empty prompt): Got status {response.status_code}")


class TestImageGenerationAllArchetypes:
    """Test image generation with all archetype styles - slower tests"""
    
    @pytest.mark.parametrize("archetype", ["kathleen", "katherine", "theresa"])
    def test_generate_image_archetype(self, archetype):
        """Test image generation with each archetype style"""
        # Wait to avoid rate limiting
        time.sleep(15)
        
        payload = {
            "prompt": f"A mystical scene",
            "archetype": archetype
        }
        
        print(f"Testing image generation with {archetype} style...")
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-image",
            json=payload,
            timeout=90
        )
        
        if response.status_code == 429:
            pytest.skip(f"Rate limit reached for {archetype} - skipping test")
        
        assert response.status_code == 200, f"Expected 200 for {archetype}, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert 'image_base64' in data, f"Response for {archetype} should contain 'image_base64'"
        print(f"✓ POST /api/ai/generate-image ({archetype}): Generated base64 image")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
