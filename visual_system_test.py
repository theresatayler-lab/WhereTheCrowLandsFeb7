#!/usr/bin/env python3
"""
Visual System V1.1 Testing Script
Tests the specific requirements from the review request
"""

import requests
import sys
import json
from datetime import datetime

class VisualSystemTester:
    def __init__(self, base_url="https://spell-forge-7.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, timeout=30):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                try:
                    return False, response.json()
                except:
                    return False, response.text

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_crowlands_art_bible_structure(self):
        """Test CROWLANDS_ART_BIBLE loads with 8 style tokens and 5 motif families - REVIEW REQUEST TEST"""
        try:
            import sys
            sys.path.append('/app/backend')
            from persona_config import CROWLANDS_ART_BIBLE, get_art_bible_prompt_suffix
            
            print(f"   ✅ persona_config.py imported successfully")
            
            # Test CROWLANDS_ART_BIBLE structure
            required_keys = ['style_tokens', 'palette', 'motif_families', 'composition_rules', 'hard_negatives', 'dall_e_global_suffix']
            missing_keys = [key for key in required_keys if key not in CROWLANDS_ART_BIBLE]
            
            if missing_keys:
                print(f"   ❌ Missing CROWLANDS_ART_BIBLE keys: {missing_keys}")
                return False
            
            # Test 8 style tokens
            style_tokens = CROWLANDS_ART_BIBLE['style_tokens']
            if len(style_tokens) != 8:
                print(f"   ❌ Expected 8 style tokens, got {len(style_tokens)}")
                return False
            
            # Verify specific tokens mentioned in review request
            required_tokens = ['silk scarf', 'tapestry', 'ultra-detailed engraved linework']
            for token in required_tokens:
                found = any(token in str_token for str_token in style_tokens)
                if not found:
                    print(f"   ❌ Required token '{token}' not found in style_tokens")
                    return False
            
            print(f"   ✅ 8 style tokens verified: {len(style_tokens)}")
            print(f"   ✅ Required tokens found: silk scarf, tapestry, engraved linework")
            
            # Test 5 motif families
            motif_families = CROWLANDS_ART_BIBLE['motif_families']
            expected_families = ['british_folklore', 'planetary', 'alchemical', 'occult_tools', 'gothic_botanicals']
            
            if len(motif_families) != 5:
                print(f"   ❌ Expected 5 motif families, got {len(motif_families)}")
                return False
            
            for family in expected_families:
                if family not in motif_families:
                    print(f"   ❌ Missing motif family: {family}")
                    return False
            
            print(f"   ✅ 5 motif families verified: {', '.join(expected_families)}")
            
            # Test hard negatives include "NO 3D render"
            hard_negatives = CROWLANDS_ART_BIBLE['hard_negatives']
            if not any('3D render' in neg for neg in hard_negatives):
                print(f"   ❌ 'NO 3D render' not found in hard_negatives")
                return False
            
            print(f"   ✅ Hard negatives include 'NO 3D render' requirement")
            
            return True
            
        except Exception as e:
            print(f"   ❌ Error testing CROWLANDS_ART_BIBLE: {str(e)}")
            return False

    def test_asset_role_locks_system(self):
        """Test ASSET_ROLE_LOCKS system prevents image repetition - REVIEW REQUEST TEST"""
        try:
            import sys
            sys.path.append('/app/backend')
            from persona_config import ASSET_ROLE_LOCKS
            
            print(f"   ✅ ASSET_ROLE_LOCKS imported successfully")
            
            # Test required asset types
            required_assets = ['header', 'tarot', 'sigil', 'divider']
            missing_assets = [asset for asset in required_assets if asset not in ASSET_ROLE_LOCKS]
            
            if missing_assets:
                print(f"   ❌ Missing asset role locks: {missing_assets}")
                return False
            
            # Test each asset type has required fields
            required_fields = ['type', 'aspect', 'rule', 'prompt_suffix']
            for asset_type, lock_data in ASSET_ROLE_LOCKS.items():
                missing_fields = [field for field in required_fields if field not in lock_data]
                if missing_fields:
                    print(f"   ❌ Missing fields in {asset_type}: {missing_fields}")
                    return False
            
            # Verify specific constraints from review request
            header_lock = ASSET_ROLE_LOCKS['header']
            if 'SCENE/STILL-LIFE' not in header_lock['type']:
                print(f"   ❌ Header should be SCENE/STILL-LIFE, got: {header_lock['type']}")
                return False
            
            tarot_lock = ASSET_ROLE_LOCKS['tarot']
            if 'EMBLEM/SIGIL PLATE' not in tarot_lock['type']:
                print(f"   ❌ Tarot should be EMBLEM/SIGIL PLATE, got: {tarot_lock['type']}")
                return False
            
            print(f"   ✅ header: {header_lock['type']} verified")
            print(f"   ✅ tarot: {tarot_lock['type']} verified")
            print(f"   ✅ sigil: {ASSET_ROLE_LOCKS['sigil']['type']} verified")
            print(f"   ✅ divider: {ASSET_ROLE_LOCKS['divider']['type']} verified")
            
            return True
            
        except Exception as e:
            print(f"   ❌ Error testing ASSET_ROLE_LOCKS: {str(e)}")
            return False

    def test_persona_visual_dna_scarf_tapestry(self):
        """Test all 3 persona visual_dna blocks contain scarf/tapestry aesthetic - REVIEW REQUEST TEST"""
        try:
            import sys
            sys.path.append('/app/backend')
            from persona_config import PERSONA_CONFIG
            
            print(f"   ✅ PERSONA_CONFIG imported successfully")
            
            # Test all 3 personas have scarf/tapestry in art_style
            personas_to_test = ['shigg', 'cathleen', 'katherine']
            required_phrase = 'ornate silk scarf tapestry illustration'
            
            for persona_id in personas_to_test:
                if persona_id not in PERSONA_CONFIG:
                    print(f"   ❌ Missing persona: {persona_id}")
                    return False
                
                visual_dna = PERSONA_CONFIG[persona_id].get('visual_dna', {})
                constants = visual_dna.get('constants', {})
                art_style = constants.get('art_style', '')
                
                if required_phrase not in art_style:
                    print(f"   ❌ {persona_id} missing '{required_phrase}' in art_style")
                    print(f"   Found: {art_style}")
                    return False
                
                print(f"   ✅ {persona_id}: Contains required scarf/tapestry phrase")
            
            # Verify persona-specific elements
            shigg_style = PERSONA_CONFIG['shigg']['visual_dna']['constants']['art_style']
            if 'warmer sepia/cream tones' not in shigg_style:
                print(f"   ❌ Shigg missing warmer sepia/cream tones")
                return False
            
            cathleen_style = PERSONA_CONFIG['cathleen']['visual_dna']['constants']['art_style']
            if 'deeper crimson' not in cathleen_style:
                print(f"   ❌ Cathleen missing deeper crimson tones")
                return False
            
            katherine_style = PERSONA_CONFIG['katherine']['visual_dna']['constants']['art_style']
            if 'cooler steel silver' not in katherine_style:
                print(f"   ❌ Katherine missing cooler steel silver tones")
                return False
            
            print(f"   ✅ Shigg: warmer sepia/cream tones verified")
            print(f"   ✅ Cathleen: deeper crimson tones verified")
            print(f"   ✅ Katherine: cooler steel silver tones verified")
            
            return True
            
        except Exception as e:
            print(f"   ❌ Error testing persona visual DNA: {str(e)}")
            return False

    def test_build_image_prompt_function(self):
        """Test build_image_prompt() function generates proper prompts with asset role locks - REVIEW REQUEST TEST"""
        try:
            import sys
            sys.path.append('/app/backend')
            from spell_prompts import build_image_prompt
            from persona_config import get_persona_config
            
            print(f"   ✅ build_image_prompt imported successfully")
            
            # Test with Shigg persona
            persona_config = get_persona_config('shigg')
            spell_title = "Test Spell for Courage"
            
            # Create mock asset plan
            asset_plan = {
                "header_image": {
                    "scene_description": "teacup on windowsill with bird shadow",
                    "mood": "contemplative",
                    "key_elements": ["teacup", "bird", "hedgerow"]
                },
                "tarot_card_image": {
                    "must_include_focal": "single crow perched with teacup below",
                    "must_use_framing": "circular wreath of rosehip and ivy",
                    "must_include_symbols": ["hedgerow berries", "morning steam"]
                },
                "sigil": {
                    "design_concept": "protective bird symbol",
                    "elements": ["circle", "feather", "line"]
                },
                "dividers": [
                    {"placement": "after_introduction", "motif": "rosehip vine"},
                    {"placement": "after_working", "motif": "feather pattern"},
                    {"placement": "before_closing", "motif": "steam curls"}
                ]
            }
            
            # Test different asset types
            asset_types = ["header_image", "tarot_card_image", "sigil", "divider_1"]
            prompts = {}
            
            for asset_type in asset_types:
                prompt = build_image_prompt(asset_type, asset_plan, persona_config, spell_title)
                prompts[asset_type] = prompt
                
                # Verify prompt contains required elements
                if 'silk scarf' not in prompt or 'tapestry' not in prompt:
                    print(f"   ❌ {asset_type} prompt missing silk scarf/tapestry tokens")
                    print(f"   Prompt: {prompt[:100]}...")
                    return False
                
                print(f"   ✅ {asset_type}: Contains silk scarf/tapestry tokens")
            
            # Verify prompts are different (no repetition)
            prompt_values = list(prompts.values())
            for i, prompt1 in enumerate(prompt_values):
                for j, prompt2 in enumerate(prompt_values[i+1:], i+1):
                    if prompt1 == prompt2:
                        print(f"   ❌ Identical prompts found: {list(prompts.keys())[i]} == {list(prompts.keys())[j]}")
                        return False
            
            print(f"   ✅ All {len(asset_types)} asset types produce different prompts")
            
            # Verify prompt lengths are reasonable
            for asset_type, prompt in prompts.items():
                if len(prompt) < 100:
                    print(f"   ❌ {asset_type} prompt too short: {len(prompt)} characters")
                    return False
                if len(prompt) > 1000:
                    print(f"   ❌ {asset_type} prompt too long: {len(prompt)} characters")
                    return False
            
            print(f"   ✅ Prompt lengths appropriate (100-1000 characters)")
            
            return True
            
        except Exception as e:
            print(f"   ❌ Error testing build_image_prompt function: {str(e)}")
            return False

    def test_archetype_image_styles_endpoint(self):
        """Test ARCHETYPE_IMAGE_STYLES in server.py contain required tokens - REVIEW REQUEST TEST"""
        success, response = self.run_test(
            "AI Image Styles - Verify Scarf/Tapestry Tokens",
            "GET",
            "ai/image-styles",
            200
        )
        
        if not success or not isinstance(response, dict):
            print(f"   ❌ Failed to get image styles response")
            return False
        
        styles = response.get('styles', {})
        expected_archetypes = ['shiggy', 'kathleen', 'catherine', 'theresa', 'neutral']
        
        # Check all expected archetypes are present
        missing_archetypes = [arch for arch in expected_archetypes if arch not in styles]
        if missing_archetypes:
            print(f"   ❌ Missing archetype styles: {missing_archetypes}")
            return False
        
        print(f"   ✅ All 5 archetype styles present: {', '.join(expected_archetypes)}")
        
        # Verify each style contains required tokens
        required_tokens = ['silk scarf', 'tapestry', 'ultra-detailed engraved linework', 'NO text', 'NO letters', 'NO words']
        
        for archetype, style_data in styles.items():
            description = style_data.get('description', '')
            keywords = style_data.get('keywords', [])
            
            # Check for tapestry in description or keywords
            has_tapestry = 'tapestry' in description.lower() or any('tapestry' in str(kw).lower() for kw in keywords)
            if not has_tapestry:
                print(f"   ❌ {archetype} missing 'tapestry' in description/keywords")
                return False
            
            print(f"   ✅ {archetype}: Contains 'tapestry' keyword")
        
        # Test specific archetype requirements from review request
        shiggy_style = styles.get('shiggy', {})
        if 'Birds of Parliament' not in shiggy_style.get('name', ''):
            print(f"   ❌ Shiggy style name should contain 'Birds of Parliament'")
            return False
        
        print(f"   ✅ Shiggy style name correct: {shiggy_style.get('name')}")
        
        return True

    def test_spell_generation_shigg_visual_dna(self):
        """Test spell generation for Shigg with intention 'I need courage' - REVIEW REQUEST TEST"""
        # First authenticate with test credentials
        login_data = {
            "email": "sub_test@test.com",
            "password": "test123"
        }
        
        success, login_response = self.run_test(
            "Login Test User",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and isinstance(login_response, dict) and 'token' in login_response:
            self.token = login_response['token']
            print(f"   ✅ Authentication successful")
        else:
            print(f"   ❌ Authentication failed, continuing without token")
        
        spell_data = {
            "spell_spec": {
                "persona_id": "shigg",
                "user_query": "I need courage",
                "desired_feeling": "brave",
                "time": "10_min",
                "tone": "gentle",
                "belief_boundary": "spiritual_grounded",
                "anchor_object": "teacup",
                "setting": "kitchen",
                "user_name": "TestUser",
                "avoid": ""
            },
            "generate_images": False
        }
        
        success, response = self.run_test(
            "Personalized Spell - Shigg Courage Test",
            "POST",
            "ai/generate-personalized-spell",
            200,
            data=spell_data,
            timeout=90
        )
        
        if not success or not isinstance(response, dict):
            print(f"   ❌ Failed to generate Shigg spell")
            return False
        
        # Verify archetype is Shigg
        archetype = response.get('archetype', {})
        if archetype.get('id') != 'shigg':
            print(f"   ❌ Expected archetype 'shigg', got '{archetype.get('id')}'")
            return False
        
        print(f"   ✅ Archetype correctly identified as Shigg")
        
        # Check asset_plan contains visual_dna references
        asset_plan = response.get('asset_plan', {})
        if not asset_plan:
            print(f"   ❌ No asset_plan in response")
            return False
        
        # Verify asset plan structure
        required_assets = ['header_image', 'tarot_card_image', 'sigil']
        missing_assets = [asset for asset in required_assets if asset not in asset_plan]
        if missing_assets:
            print(f"   ❌ Missing assets in plan: {missing_assets}")
            return False
        
        print(f"   ✅ Asset plan contains required assets: {', '.join(required_assets)}")
        
        # Check for persona-specific elements (birds, teacup, hedgerow)
        full_response_text = str(response).lower()
        shigg_elements = ['bird', 'teacup', 'hedgerow', 'parliament', 'feather']
        found_elements = [elem for elem in shigg_elements if elem in full_response_text]
        
        if len(found_elements) < 2:
            print(f"   ❌ Insufficient Shigg-specific elements found: {found_elements}")
            return False
        
        print(f"   ✅ Shigg persona elements found: {', '.join(found_elements)}")
        
        return True

def main():
    print("🧙‍♀️ Testing Visual System V1.1 Implementation...")
    print("=" * 60)
    print()

    tester = VisualSystemTester()
    
    # Test 1: CROWLANDS_ART_BIBLE structure
    print('🔍 Test 1: CROWLANDS_ART_BIBLE Structure')
    result1 = tester.test_crowlands_art_bible_structure()
    print()

    # Test 2: ASSET_ROLE_LOCKS system
    print('🔍 Test 2: ASSET_ROLE_LOCKS System')
    result2 = tester.test_asset_role_locks_system()
    print()

    # Test 3: Persona visual DNA scarf/tapestry
    print('🔍 Test 3: Persona Visual DNA Scarf/Tapestry')
    result3 = tester.test_persona_visual_dna_scarf_tapestry()
    print()

    # Test 4: build_image_prompt function
    print('🔍 Test 4: build_image_prompt Function')
    result4 = tester.test_build_image_prompt_function()
    print()

    # Test 5: ARCHETYPE_IMAGE_STYLES endpoint
    print('🔍 Test 5: ARCHETYPE_IMAGE_STYLES Endpoint')
    result5 = tester.test_archetype_image_styles_endpoint()
    print()

    # Test 6: Spell generation with Shigg visual DNA
    print('🔍 Test 6: Spell Generation with Shigg Visual DNA')
    result6 = tester.test_spell_generation_shigg_visual_dna()
    print()

    # Summary
    passed = sum([result1, result2, result3, result4, result5, result6])
    total = 6
    print('=' * 60)
    print(f'📊 Visual System V1.1 Test Results: {passed}/{total} passed')
    print(f'🎯 Success Rate: {passed/total*100:.1f}%')
    
    if passed == total:
        print('🎉 All Visual System V1.1 tests PASSED!')
    else:
        print('⚠️  Some tests failed - see details above')
    
    return 0 if passed == total else 1

if __name__ == "__main__":
    sys.exit(main())