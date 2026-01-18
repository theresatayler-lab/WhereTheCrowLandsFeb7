#!/usr/bin/env python3
"""
Focused test script for image generation features - REVIEW REQUEST
Tests the specific image generation features requested in the review.
"""

import requests
import json
import sys
from datetime import datetime

class ImageGenerationTester:
    def __init__(self, base_url="https://arcane-rituals.preview.emergentagent.com"):
        self.base_url = base_url
        self.pro_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, timeout=60):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.pro_token:
            test_headers['Authorization'] = f'Bearer {self.pro_token}'
        
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

    def login_pro_user(self):
        """Login as Pro user for testing Pro features"""
        pro_login_data = {
            "email": "sub_test@test.com",
            "password": "test123"
        }
        
        success, response = self.run_test(
            "Login Pro User",
            "POST",
            "auth/login",
            200,
            data=pro_login_data
        )
        
        if success and isinstance(response, dict) and 'token' in response:
            self.pro_token = response['token']
            user = response.get('user', {})
            print(f"   ✅ Pro user logged in: {user.get('email')}")
            print(f"   ✅ Subscription tier: {user.get('subscription_tier')}")
            return True
        else:
            print(f"   ❌ Failed to login Pro user")
            return False

    def test_ai_image_styles_endpoint(self):
        """Test 1: GET /api/ai/image-styles - should return all archetype styles with descriptions"""
        print("\n" + "="*60)
        print("TEST 1: AI Image Styles Endpoint")
        print("="*60)
        
        success, response = self.run_test(
            "AI Image Styles - Get All Archetype Styles",
            "GET",
            "ai/image-styles",
            200
        )
        
        if success and isinstance(response, dict):
            # Verify response structure
            if 'styles' not in response:
                print(f"   ❌ Missing 'styles' field in response")
                return False
            
            styles = response.get('styles', {})
            expected_archetypes = ['shiggy', 'kathleen', 'catherine', 'theresa', 'neutral']
            
            # Check all expected archetypes are present
            missing_archetypes = [arch for arch in expected_archetypes if arch not in styles]
            if missing_archetypes:
                print(f"   ❌ Missing archetype styles: {missing_archetypes}")
                return False
            
            # Verify each style has required fields
            for archetype, style_data in styles.items():
                required_fields = ['name', 'description', 'keywords']
                missing_fields = [field for field in required_fields if field not in style_data]
                if missing_fields:
                    print(f"   ❌ Missing fields in {archetype} style: {missing_fields}")
                    return False
            
            print(f"   ✅ Found {len(styles)} archetype image styles")
            print(f"   ✅ All expected archetypes present: {', '.join(expected_archetypes)}")
            
            # Display style details
            for archetype in expected_archetypes:
                style = styles[archetype]
                print(f"   ✅ {archetype}: {style['name']}")
                print(f"      Description: {style['description'][:100]}...")
                print(f"      Keywords: {', '.join(style['keywords'][:3])}...")
            
            print(f"   ✅ Default style: {response.get('default')}")
            
            return True
        
        return False

    def test_ai_image_generation_with_archetype(self):
        """Test 2: POST /api/ai/generate-image with archetype style"""
        print("\n" + "="*60)
        print("TEST 2: AI Image Generation with Archetype Style")
        print("="*60)
        
        image_data = {
            "prompt": "A crow perched on a candlestick",
            "archetype": "kathleen"
        }
        
        success, response = self.run_test(
            "AI Image Generation - Kathleen Archetype Style",
            "POST",
            "ai/generate-image",
            200,
            data=image_data,
            timeout=45  # Image generation can take time
        )
        
        if success and isinstance(response, dict):
            # Verify image was generated
            image_base64 = response.get('image_base64')
            if not image_base64:
                print(f"   ❌ No image_base64 returned")
                return False
            
            # Verify image size (should be substantial)
            if len(image_base64) < 10000:  # Reasonable minimum for base64 image
                print(f"   ❌ Image seems too small: {len(image_base64)} characters")
                return False
            
            print(f"   ✅ Image generated successfully")
            print(f"   ✅ Image base64 length: {len(image_base64)} characters")
            print(f"   ✅ Estimated image size: ~{len(image_base64) * 3 // 4 // 1024}KB")
            
            # Check if archetype style was applied (response should indicate this)
            archetype_used = response.get('archetype_style')
            if archetype_used:
                print(f"   ✅ Archetype style applied: {archetype_used}")
            
            return True
        
        return False

    def test_spell_generation_shigg_with_image(self):
        """Test 3: POST /api/ai/generate-spell with Shigg archetype and image"""
        print("\n" + "="*60)
        print("TEST 3: Spell Generation with Shigg Archetype and Image")
        print("="*60)
        
        if not self.pro_token:
            print("   ⚠️  Skipping - requires Pro user login")
            return False
        
        spell_data = {
            "intention": "I need courage to start a new chapter",
            "archetype": "shiggy",
            "generate_image": True
        }
        
        success, response = self.run_test(
            "Spell Generation - Shigg with Image",
            "POST",
            "ai/generate-spell",
            200,
            data=spell_data,
            timeout=90  # Spell + image generation takes time
        )
        
        if success and isinstance(response, dict):
            # Verify response structure
            required_fields = ['spell', 'archetype', 'session_id']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"   ❌ Missing top-level fields: {missing_fields}")
                return False
            
            # Verify archetype info
            archetype = response.get('archetype', {})
            if archetype.get('name') != 'Shigg':
                print(f"   ❌ Expected archetype name 'Shigg', got '{archetype.get('name')}'")
                return False
            
            # Verify spell structure
            spell = response.get('spell', {})
            spell_required_fields = ['title', 'materials', 'steps', 'spoken_words']
            missing_spell_fields = [field for field in spell_required_fields if field not in spell]
            
            if missing_spell_fields:
                print(f"   ❌ Missing spell fields: {missing_spell_fields}")
                return False
            
            # Verify image was generated
            image_base64 = response.get('image_base64')
            if not image_base64:
                print(f"   ❌ Image generation was requested but no image returned")
                return False
            
            # Check for bird oracle elements (Shigg's signature)
            full_spell_text = json.dumps(spell).lower()
            bird_oracle_indicators = ['bird', 'oracle', 'parliament', 'feather', 'wing', 'flight', 'nest', 'song', 'crow', 'robin', 'dove']
            bird_found = [indicator for indicator in bird_oracle_indicators if indicator in full_spell_text]
            
            print(f"   ✅ Spell generated successfully")
            print(f"   ✅ Spell title: {spell.get('title')}")
            print(f"   ✅ Image generated (base64 length: {len(image_base64)})")
            print(f"   ✅ Archetype: {archetype.get('name')} - {archetype.get('title')}")
            
            if bird_found:
                print(f"   ✅ Bird oracle elements found: {', '.join(bird_found)}")
            else:
                print(f"   ⚠️  No bird oracle elements detected - this should be Shigg's unique feature")
            
            return True
        
        return False

    def test_spell_generation_catherine_with_image(self):
        """Test 4: POST /api/ai/generate-spell with Catherine archetype and image"""
        print("\n" + "="*60)
        print("TEST 4: Spell Generation with Catherine Archetype and Image")
        print("="*60)
        
        if not self.pro_token:
            print("   ⚠️  Skipping - requires Pro user login")
            return False
        
        spell_data = {
            "intention": "I need to do shadow work and face my fears",
            "archetype": "catherine",
            "generate_image": True
        }
        
        success, response = self.run_test(
            "Spell Generation - Catherine with Image",
            "POST",
            "ai/generate-spell",
            200,
            data=spell_data,
            timeout=90  # Spell + image generation takes time
        )
        
        if success and isinstance(response, dict):
            # Verify response structure
            required_fields = ['spell', 'archetype', 'session_id']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"   ❌ Missing top-level fields: {missing_fields}")
                return False
            
            # Verify archetype info
            archetype = response.get('archetype', {})
            if archetype.get('name') != 'Katherine':
                print(f"   ❌ Expected archetype name 'Katherine', got '{archetype.get('name')}'")
                return False
            
            # Verify spell structure
            spell = response.get('spell', {})
            spell_required_fields = ['title', 'materials', 'steps', 'spoken_words']
            missing_spell_fields = [field for field in spell_required_fields if field not in spell]
            
            if missing_spell_fields:
                print(f"   ❌ Missing spell fields: {missing_spell_fields}")
                return False
            
            # Verify image was generated
            image_base64 = response.get('image_base64')
            if not image_base64:
                print(f"   ❌ Image generation was requested but no image returned")
                return False
            
            # Check for thread/textile references (Catherine's signature)
            full_spell_text = json.dumps(spell).lower()
            textile_indicators = ['thread', 'needle', 'fabric', 'weave', 'stitch', 'textile', 'sew', 'cloth', 'silk', 'cotton']
            textile_found = [indicator for indicator in textile_indicators if indicator in full_spell_text]
            
            # Check for shadow work elements
            shadow_indicators = ['shadow', 'dark', 'fear', 'hidden', 'face', 'confront', 'integrate']
            shadow_found = [indicator for indicator in shadow_indicators if indicator in full_spell_text]
            
            print(f"   ✅ Spell generated successfully")
            print(f"   ✅ Spell title: {spell.get('title')}")
            print(f"   ✅ Image generated (base64 length: {len(image_base64)})")
            print(f"   ✅ Archetype: {archetype.get('name')} - {archetype.get('title')}")
            
            if textile_found:
                print(f"   ✅ Thread/textile elements found: {', '.join(textile_found)}")
            else:
                print(f"   ⚠️  No thread/textile elements detected - this should be Catherine's signature")
            
            if shadow_found:
                print(f"   ✅ Shadow work elements found: {', '.join(shadow_found)}")
            
            return True
        
        return False

    def run_all_tests(self):
        """Run all image generation tests"""
        print("🎨 Starting Image Generation Feature Testing...")
        print("Testing the specific features requested in the review:")
        print("1. GET /api/ai/image-styles")
        print("2. POST /api/ai/generate-image with archetype")
        print("3. POST /api/ai/generate-spell with Shigg + image")
        print("4. POST /api/ai/generate-spell with Catherine + image")
        print("="*60)
        
        # Test 1: Image styles endpoint (no auth required)
        test1_result = self.test_ai_image_styles_endpoint()
        
        # Test 2: Image generation with archetype (no auth required)
        test2_result = self.test_ai_image_generation_with_archetype()
        
        # Login as Pro user for spell generation tests
        pro_login_success = self.login_pro_user()
        
        # Test 3: Spell generation with Shigg + image (requires Pro)
        test3_result = False
        if pro_login_success:
            test3_result = self.test_spell_generation_shigg_with_image()
        
        # Test 4: Spell generation with Catherine + image (requires Pro)
        test4_result = False
        if pro_login_success:
            test4_result = self.test_spell_generation_catherine_with_image()
        
        # Print results
        print("\n" + "="*60)
        print("📊 IMAGE GENERATION TEST RESULTS")
        print("="*60)
        print(f"📊 Total Tests: {self.tests_run}")
        print(f"✅ Passed: {self.tests_passed}")
        print(f"❌ Failed: {len(self.failed_tests)}")
        
        print(f"\n🎯 Individual Test Results:")
        print(f"   Test 1 - Image Styles Endpoint: {'✅ PASS' if test1_result else '❌ FAIL'}")
        print(f"   Test 2 - Image Generation with Archetype: {'✅ PASS' if test2_result else '❌ FAIL'}")
        print(f"   Test 3 - Shigg Spell + Image: {'✅ PASS' if test3_result else '❌ FAIL' if pro_login_success else '⚠️ SKIP (no Pro login)'}")
        print(f"   Test 4 - Catherine Spell + Image: {'✅ PASS' if test4_result else '❌ FAIL' if pro_login_success else '⚠️ SKIP (no Pro login)'}")
        
        if self.failed_tests:
            print("\n❌ Failed Tests Details:")
            for failure in self.failed_tests:
                print(f"   - {failure.get('test', 'Unknown')}")
                if 'error' in failure:
                    print(f"     Error: {failure['error']}")
                else:
                    print(f"     Expected: {failure.get('expected')}, Got: {failure.get('actual')}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"\n🎯 Success Rate: {success_rate:.1f}%")
        
        # Summary for main agent
        print(f"\n📋 SUMMARY FOR MAIN AGENT:")
        if test1_result and test2_result:
            print(f"✅ Core image generation features working perfectly")
        if test3_result and test4_result:
            print(f"✅ Spell generation with images working for both archetypes")
        elif not pro_login_success:
            print(f"⚠️  Spell generation tests require Pro user access")
        
        return success_rate > 75

def main():
    tester = ImageGenerationTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())