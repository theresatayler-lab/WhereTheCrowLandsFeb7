#!/usr/bin/env python3
"""
Quick test to verify spell generation is working without image generation
"""

import requests
import json

def quick_spell_test():
    base_url = "https://spell-debug-fix.preview.emergentagent.com"
    
    print("🧙‍♀️ Quick Spell Generation Test")
    print("=" * 40)
    
    # Test basic spell generation
    spell_data = {
        "intention": "I need protection for my home",
        "archetype": "kathleen",
        "generate_image": False
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/ai/generate-spell",
            json=spell_data,
            headers={'Content-Type': 'application/json'},
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            spell = data.get('spell', {})
            archetype = data.get('archetype', {})
            
            print(f"✅ Status: {response.status_code}")
            print(f"✅ Archetype: {archetype.get('name')}")
            print(f"✅ Spell Title: {spell.get('title')}")
            print(f"✅ Materials Count: {len(spell.get('materials', []))}")
            print(f"✅ Steps Count: {len(spell.get('steps', []))}")
            
            # Show first material as example
            materials = spell.get('materials', [])
            if materials:
                first_material = materials[0]
                print(f"✅ First Material: {first_material.get('name')} ({first_material.get('icon')})")
            
            # Show first step as example
            steps = spell.get('steps', [])
            if steps:
                first_step = steps[0]
                print(f"✅ First Step: {first_step.get('title')}")
            
            return True
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    quick_spell_test()