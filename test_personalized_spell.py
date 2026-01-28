#!/usr/bin/env python3
"""
Test personalized spell generation with Visual System V1.1
"""

import requests
import json
import sys

def test_personalized_spell_generation():
    """Test the personalized spell generation endpoint with Visual System V1.1"""
    
    base_url = "https://arcane-guides.preview.emergentagent.com"
    
    # First, login with the test credentials
    login_data = {
        "email": "sub_test@test.com",
        "password": "test123"
    }
    
    print("🔐 Logging in with test credentials...")
    login_response = requests.post(f"{base_url}/api/auth/login", json=login_data)
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        return False
    
    login_result = login_response.json()
    token = login_result['token']
    print(f"✅ Login successful")
    
    # Test personalized spell generation
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    spell_data = {
        "spell_spec": {
            "persona_id": "kathleen",
            "user_query": "I need protection from negative energy at work",
            "desired_feeling": "protected",
            "time": "10_min",
            "tone": "practical",
            "belief_boundary": "spiritual_grounded",
            "anchor_object": "candle",
            "setting": "desk",
            "user_name": "Sarah",
            "avoid": ""
        },
        "generate_images": False  # Skip images for faster testing
    }
    
    print("🔮 Testing personalized spell generation...")
    spell_response = requests.post(
        f"{base_url}/api/ai/generate-personalized-spell",
        json=spell_data,
        headers=headers,
        timeout=90
    )
    
    if spell_response.status_code != 200:
        print(f"❌ Spell generation failed: {spell_response.status_code}")
        print(f"Response: {spell_response.text}")
        return False
    
    spell_result = spell_response.json()
    print(f"✅ Spell generation successful")
    
    # Verify response structure
    required_fields = ['spell', 'archetype', 'scenario']
    missing_fields = [field for field in required_fields if field not in spell_result]
    
    if missing_fields:
        print(f"❌ Missing fields in response: {missing_fields}")
        return False
    
    # Check archetype
    archetype = spell_result.get('archetype', {})
    expected_ids = ['kathleen', 'cathleen']  # Handle both legacy and new IDs
    if archetype.get('id') not in expected_ids:
        print(f"❌ Expected archetype 'kathleen/cathleen', got '{archetype.get('id')}'")
        return False
    
    print(f"✅ Archetype correct: {archetype.get('name')} ({archetype.get('id')})")
    
    # Check spell structure
    spell = spell_result.get('spell', {})
    spell_required_fields = ['title', 'materials', 'the_working', 'spoken_words']
    missing_spell_fields = [field for field in spell_required_fields if field not in spell]
    
    if missing_spell_fields:
        print(f"❌ Missing spell fields: {missing_spell_fields}")
        return False
    
    print(f"✅ Spell structure complete")
    print(f"✅ Spell title: {spell.get('title')}")
    
    # Check for personalization
    full_spell_text = json.dumps(spell).lower()
    
    # Check for user name integration
    if 'sarah' not in full_spell_text:
        print(f"❌ User name 'Sarah' not found in spell")
        return False
    
    print(f"✅ User name 'Sarah' integrated")
    
    # Check for anchor object integration
    if 'candle' not in full_spell_text:
        print(f"❌ Anchor object 'candle' not found in spell")
        return False
    
    print(f"✅ Anchor object 'candle' integrated")
    
    # Check for setting integration
    if 'desk' not in full_spell_text:
        print(f"❌ Setting 'desk' not found in spell")
        return False
    
    print(f"✅ Setting 'desk' integrated")
    
    # Check for Kathleen-specific elements
    kathleen_indicators = ['voice', 'protection', 'candle', 'strength', 'ward']
    kathleen_found = [indicator for indicator in kathleen_indicators if indicator in full_spell_text]
    
    if kathleen_found:
        print(f"✅ Kathleen elements found: {', '.join(kathleen_found)}")
    else:
        print(f"⚠️  No Kathleen-specific elements detected")
    
    # Check scenario
    scenario = spell_result.get('scenario', {})
    print(f"✅ Scenario: {scenario.get('name', 'Unknown')}")
    
    return True

def main():
    print("🧪 Testing Personalized Spell Generation with Visual System V1.1")
    print("=" * 70)
    
    try:
        if test_personalized_spell_generation():
            print("\n🎉 Personalized spell generation test PASSED!")
            return 0
        else:
            print("\n❌ Personalized spell generation test FAILED!")
            return 1
    except Exception as e:
        print(f"\n💥 Test error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())