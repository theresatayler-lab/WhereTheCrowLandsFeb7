#!/usr/bin/env python3
"""
Visual System V1.1 Testing Script
Tests the specific backend implementation for the review request
"""

import sys
import os

# Add backend to path
sys.path.append('/app/backend')

def test_crowlands_art_bible_structure():
    """Test CROWLANDS_ART_BIBLE loads with 8 style tokens and 5 motif families - REVIEW REQUEST TEST"""
    try:
        from persona_config import CROWLANDS_ART_BIBLE, get_art_bible_prompt_suffix, PERSONA_CONFIG
        
        print(f"✅ persona_config.py imported successfully")
        
        # Test CROWLANDS_ART_BIBLE structure
        required_keys = ['style_tokens', 'palette', 'motif_families', 'composition_rules', 'hard_negatives', 'dall_e_global_suffix']
        missing_keys = [key for key in required_keys if key not in CROWLANDS_ART_BIBLE]
        
        if missing_keys:
            print(f"❌ Missing keys in CROWLANDS_ART_BIBLE: {missing_keys}")
            return False
        
        # Test 8 style tokens
        style_tokens = CROWLANDS_ART_BIBLE['style_tokens']
        if len(style_tokens) != 8:
            print(f"❌ Expected 8 style tokens, got {len(style_tokens)}")
            return False
        
        print(f"✅ Found 8 style tokens:")
        for token in style_tokens:
            print(f"   - {token}")
        
        # Test 5 motif families
        motif_families = CROWLANDS_ART_BIBLE['motif_families']
        expected_families = ['british_folklore', 'planetary', 'alchemical', 'occult_tools', 'gothic_botanicals']
        
        if len(motif_families) != 5:
            print(f"❌ Expected 5 motif families, got {len(motif_families)}")
            return False
        
        missing_families = [family for family in expected_families if family not in motif_families]
        if missing_families:
            print(f"❌ Missing motif families: {missing_families}")
            return False
        
        print(f"✅ Found all 5 motif families:")
        for family, items in motif_families.items():
            print(f"   - {family}: {len(items)} items")
        
        # Test hard negatives include "NO 3D render"
        hard_negatives = CROWLANDS_ART_BIBLE['hard_negatives']
        if not any("3D render" in negative for negative in hard_negatives):
            print(f"❌ Hard negatives missing 'NO 3D render'")
            return False
        
        print(f"✅ Hard negatives include 'NO 3D render'")
        print(f"✅ Hard negatives: {hard_negatives}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing CROWLANDS_ART_BIBLE: {str(e)}")
        return False

def test_asset_role_locks_system():
    """Test ASSET_ROLE_LOCKS system with correct types - REVIEW REQUEST TEST"""
    try:
        from persona_config import ASSET_ROLE_LOCKS
        
        print(f"✅ ASSET_ROLE_LOCKS imported successfully")
        
        # Test expected asset types and their rules
        expected_locks = {
            'header': 'SCENE/STILL-LIFE',
            'tarot': 'EMBLEM/SIGIL PLATE', 
            'sigil': 'MINIMAL LINEWORK',
            'divider': 'HORIZONTAL STRIP'
        }
        
        for asset_type, expected_type in expected_locks.items():
            if asset_type not in ASSET_ROLE_LOCKS:
                print(f"❌ Missing asset type: {asset_type}")
                return False
            
            actual_type = ASSET_ROLE_LOCKS[asset_type]['type']
            if actual_type != expected_type:
                print(f"❌ {asset_type} expected '{expected_type}', got '{actual_type}'")
                return False
            
            print(f"✅ {asset_type}: {actual_type}")
        
        # Test that each has required fields
        for asset_type, lock_data in ASSET_ROLE_LOCKS.items():
            required_fields = ['type', 'aspect', 'rule', 'prompt_suffix']
            missing_fields = [field for field in required_fields if field not in lock_data]
            
            if missing_fields:
                print(f"❌ {asset_type} missing fields: {missing_fields}")
                return False
        
        print(f"✅ All asset role locks have required fields")
        return True
        
    except Exception as e:
        print(f"❌ Error testing ASSET_ROLE_LOCKS: {str(e)}")
        return False

def test_persona_visual_dna_scarf_tapestry():
    """Test all 3 persona visual_dna blocks have 'ornate silk scarf tapestry illustration' - REVIEW REQUEST TEST"""
    try:
        from persona_config import PERSONA_CONFIG
        
        print(f"✅ PERSONA_CONFIG imported successfully")
        
        # Test all 3 personas
        personas_to_test = ['shigg', 'cathleen', 'katherine']
        expected_phrase = "ornate silk scarf tapestry illustration"
        
        for persona_id in personas_to_test:
            if persona_id not in PERSONA_CONFIG:
                print(f"❌ Missing persona: {persona_id}")
                return False
            
            persona = PERSONA_CONFIG[persona_id]
            visual_dna = persona.get('visual_dna', {})
            constants = visual_dna.get('constants', {})
            art_style = constants.get('art_style', '')
            
            if expected_phrase not in art_style:
                print(f"❌ {persona_id} missing '{expected_phrase}' in art_style")
                print(f"   Current art_style: {art_style}")
                return False
            
            print(f"✅ {persona_id}: Contains '{expected_phrase}'")
            
            # Test specific persona characteristics
            if persona_id == 'shigg':
                if "warmer sepia/cream tones" not in art_style:
                    print(f"❌ Shigg missing 'warmer sepia/cream tones'")
                    return False
                print(f"✅ Shigg: Has warmer sepia/cream tones")
            
            elif persona_id == 'cathleen':
                if "deeper crimson" not in art_style and "candlelit" not in art_style:
                    print(f"❌ Cathleen missing 'deeper crimson' or 'candlelit'")
                    return False
                print(f"✅ Cathleen: Has deeper crimson tones and candlelit elements")
            
            elif persona_id == 'katherine':
                has_cooler_steel = "cooler steel" in art_style and "silver" in art_style
                has_atelier_desk = "atelier desk" in art_style
                
                if not has_cooler_steel or not has_atelier_desk:
                    print(f"❌ Katherine missing required elements")
                    print(f"   Has cooler steel/silver: {has_cooler_steel}")
                    print(f"   Has atelier desk: {has_atelier_desk}")
                    print(f"   Current art_style: {art_style}")
                    return False
                print(f"✅ Katherine: Has cooler steel/silver tones and atelier desk scene")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing persona visual DNA: {str(e)}")
        return False

def test_build_image_prompt_function():
    """Test build_image_prompt() function generates proper prompts with asset role locks - REVIEW REQUEST TEST"""
    try:
        from persona_config import build_image_prompt, get_art_bible_prompt_suffix, ASSET_ROLE_LOCKS
        
        print(f"✅ build_image_prompt function imported successfully")
        
        # Test basic function call
        test_persona_prompt = "mystical scene with candles"
        
        # Test each asset type
        asset_types = ['header', 'tarot', 'sigil', 'divider']
        
        for asset_type in asset_types:
            try:
                prompt = build_image_prompt(test_persona_prompt, asset_type)
                
                if not prompt:
                    print(f"❌ {asset_type}: Empty prompt returned")
                    return False
                
                # Check that it contains the persona prompt
                if test_persona_prompt not in prompt:
                    print(f"❌ {asset_type}: Missing persona prompt")
                    return False
                
                # Check that it contains the role lock suffix
                role_lock = ASSET_ROLE_LOCKS[asset_type]
                if role_lock['prompt_suffix'] not in prompt:
                    print(f"❌ {asset_type}: Missing role lock suffix")
                    return False
                
                # Check that it contains the global art bible suffix
                art_bible_suffix = get_art_bible_prompt_suffix()
                if art_bible_suffix not in prompt:
                    print(f"❌ {asset_type}: Missing art bible suffix")
                    return False
                
                print(f"✅ {asset_type}: Prompt generated correctly")
                print(f"   Length: {len(prompt)} characters")
                
            except Exception as e:
                print(f"❌ {asset_type}: Error generating prompt - {str(e)}")
                return False
        
        # Test that different asset types produce different prompts
        header_prompt = build_image_prompt(test_persona_prompt, "header")
        tarot_prompt = build_image_prompt(test_persona_prompt, "tarot")
        
        if header_prompt == tarot_prompt:
            print(f"❌ Header and tarot prompts are identical (should be different)")
            return False
        
        print(f"✅ Different asset types produce different prompts")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing build_image_prompt function: {str(e)}")
        return False

def main():
    print("🎨 Testing Visual System V1.1 Implementation")
    print("=" * 60)
    
    tests = [
        ("CROWLANDS_ART_BIBLE Structure", test_crowlands_art_bible_structure),
        ("ASSET_ROLE_LOCKS System", test_asset_role_locks_system),
        ("Persona Visual DNA Scarf/Tapestry", test_persona_visual_dna_scarf_tapestry),
        ("build_image_prompt() Function", test_build_image_prompt_function)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing {test_name}...")
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name} PASSED")
            else:
                print(f"❌ {test_name} FAILED")
        except Exception as e:
            print(f"❌ {test_name} ERROR: {str(e)}")
    
    print(f"\n📊 Visual System V1.1 Test Results: {passed}/{total} passed")
    print(f"🎯 Success Rate: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print("🎉 All Visual System V1.1 tests PASSED!")
        return 0
    else:
        print("⚠️  Some Visual System V1.1 tests FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(main())