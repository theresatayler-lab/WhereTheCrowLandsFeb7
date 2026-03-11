#!/usr/bin/env python3
"""
Focused test for Personalized Spell Generation system - REVIEW REQUEST
"""

import requests
import json
import sys
from datetime import datetime

class PersonalizedSpellTester:
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

    def register_user(self):
        """Register a new user for testing"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user_data = {
            "email": f"test_personalized_{timestamp}@example.com",
            "password": "TestPass123!",
            "name": f"Test Personalized User {timestamp}"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if success and isinstance(response, dict) and 'token' in response:
            self.token = response['token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_personalized_spell_kathleen_protection(self):
        """Test personalized spell generation with Kathleen persona for protection - REVIEW REQUEST TEST 1"""
        spell_data = {
            "spell_spec": {
                "persona_id": "kathleen",
                "user_query": "I need protection at work from a toxic coworker",
                "desired_feeling": "protected",
                "time": "10_min",
                "tone": "practical",
                "belief_boundary": "spiritual_grounded",
                "anchor_object": "candle",
                "setting": "desk",
                "user_name": "Sarah",
                "avoid": ""
            },
            "generate_images": False
        }
        
        success, response = self.run_test(
            "Personalized Spell - Kathleen Protection",
            "POST",
            "ai/generate-personalized-spell",
            200,
            data=spell_data,
            timeout=90
        )
        
        if success and isinstance(response, dict):
            # Verify response structure
            required_fields = ['spell', 'archetype', 'scenario']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"   ❌ Missing top-level fields: {missing_fields}")
                return False
            
            # Verify spell structure
            spell = response.get('spell', {})
            spell_required_fields = ['title', 'materials', 'the_working', 'spoken_words']
            missing_spell_fields = [field for field in spell_required_fields if field not in spell]
            
            if missing_spell_fields:
                print(f"   ❌ Missing spell fields: {missing_spell_fields}")
                return False
            
            # Verify archetype info
            archetype = response.get('archetype', {})
            if archetype.get('id') != 'kathleen':
                print(f"   ❌ Expected archetype id 'kathleen', got '{archetype.get('id')}'")
                return False
            
            # Verify scenario info
            scenario = response.get('scenario', {})
            if not scenario.get('id') or not scenario.get('name'):
                print(f"   ❌ Missing scenario info: {scenario}")
                return False
            
            # Check for user name integration
            full_spell_text = json.dumps(spell).lower()
            if 'sarah' not in full_spell_text:
                print(f"   ❌ User name 'Sarah' not found in spell content")
                return False
            
            # Check for anchor object integration (candle)
            if 'candle' not in full_spell_text:
                print(f"   ❌ Anchor object 'candle' not found in spell content")
                return False
            
            # Check for setting integration (desk)
            if 'desk' not in full_spell_text:
                print(f"   ❌ Setting 'desk' not found in spell content")
                return False
            
            print(f"   ✅ Personalized spell generated successfully")
            print(f"   ✅ Spell title: {spell.get('title')}")
            print(f"   ✅ Archetype: {archetype.get('name')}")
            print(f"   ✅ Scenario: {scenario.get('name')}")
            print(f"   ✅ User name 'Sarah' integrated: ✓")
            print(f"   ✅ Anchor object 'candle' integrated: ✓")
            print(f"   ✅ Setting 'desk' integrated: ✓")
            
            # Store scenario ID for rotation test
            self.first_scenario_id = scenario.get('id')
            
            return True
        
        return False

    def test_personalized_spell_kathleen_grief_rotation(self):
        """Test personalized spell generation with scenario rotation - REVIEW REQUEST TEST 2"""
        spell_data = {
            "spell_spec": {
                "persona_id": "kathleen",
                "user_query": "I need to release grief about my grandmother",
                "desired_feeling": "softened",
                "time": "30_min",
                "tone": "gentle",
                "belief_boundary": "ancestor_friendly",
                "anchor_object": "song",
                "setting": "bedroom",
                "user_name": "Sarah",
                "avoid": ""
            },
            "generate_images": False
        }
        
        success, response = self.run_test(
            "Personalized Spell - Kathleen Grief (Scenario Rotation)",
            "POST",
            "ai/generate-personalized-spell",
            200,
            data=spell_data,
            timeout=90
        )
        
        if success and isinstance(response, dict):
            # Verify response structure
            required_fields = ['spell', 'archetype', 'scenario']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"   ❌ Missing top-level fields: {missing_fields}")
                return False
            
            # Verify scenario rotation - should be different from first test
            scenario = response.get('scenario', {})
            current_scenario_id = scenario.get('id')
            
            if hasattr(self, 'first_scenario_id') and current_scenario_id == self.first_scenario_id:
                print(f"   ⚠️  Scenario ID same as previous test - rotation may not be working")
                print(f"   Previous: {self.first_scenario_id}, Current: {current_scenario_id}")
            else:
                print(f"   ✅ Scenario rotation working - different scenario selected")
                if hasattr(self, 'first_scenario_id'):
                    print(f"   Previous: {self.first_scenario_id}, Current: {current_scenario_id}")
            
            # Verify spell structure is different (different section focus)
            spell = response.get('spell', {})
            spell_text = json.dumps(spell).lower()
            
            # Check for voice/song elements (not candle)
            voice_elements = ['song', 'voice', 'sing', 'hum', 'melody', 'music']
            voice_found = [elem for elem in voice_elements if elem in spell_text]
            
            if voice_found:
                print(f"   ✅ Voice/song elements found: {', '.join(voice_found)}")
            else:
                print(f"   ⚠️  No voice/song elements detected")
            
            # Check for bedroom setting
            if 'bedroom' in spell_text:
                print(f"   ✅ Setting 'bedroom' integrated")
            else:
                print(f"   ⚠️  Setting 'bedroom' not found")
            
            print(f"   ✅ Grief spell generated successfully")
            print(f"   ✅ Spell title: {spell.get('title')}")
            print(f"   ✅ Scenario: {scenario.get('name')}")
            
            return True
        
        return False

    def test_personalized_spell_choose_for_me(self):
        """Test personalized spell generation with 'choose_for_me' persona - REVIEW REQUEST TEST 3"""
        spell_data = {
            "spell_spec": {
                "persona_id": "choose_for_me",
                "user_query": "I want to find guidance through bird signs",
                "desired_feeling": "clear",
                "time": "10_min",
                "tone": "gentle",
                "belief_boundary": "spiritual_grounded",
                "anchor_object": "bird",
                "setting": "outdoors",
                "user_name": "",
                "avoid": ""
            },
            "generate_images": False
        }
        
        success, response = self.run_test(
            "Personalized Spell - Choose For Me (Should Select Shigg)",
            "POST",
            "ai/generate-personalized-spell",
            200,
            data=spell_data,
            timeout=90
        )
        
        if success and isinstance(response, dict):
            # Verify response structure
            required_fields = ['spell', 'archetype', 'scenario']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"   ❌ Missing top-level fields: {missing_fields}")
                return False
            
            # Verify the system chose Shigg (because of bird anchor)
            archetype = response.get('archetype', {})
            expected_persona = 'shiggy'  # Should choose Shigg for bird anchor
            
            if archetype.get('id') != expected_persona:
                print(f"   ❌ Expected system to choose '{expected_persona}' for bird anchor, got '{archetype.get('id')}'")
                return False
            
            print(f"   ✅ System correctly chose Shigg for bird anchor")
            print(f"   ✅ Selected archetype: {archetype.get('name')}")
            
            # Verify spell has bird-related content
            spell = response.get('spell', {})
            spell_text = json.dumps(spell).lower()
            
            bird_elements = ['bird', 'wing', 'feather', 'flight', 'nest', 'song', 'oracle', 'parliament']
            bird_found = [elem for elem in bird_elements if elem in spell_text]
            
            if bird_found:
                print(f"   ✅ Bird-related content found: {', '.join(bird_found)}")
            else:
                print(f"   ❌ No bird-related content detected in spell")
                return False
            
            # Check for outdoor setting
            outdoor_elements = ['outdoor', 'outside', 'nature', 'sky', 'tree', 'garden']
            outdoor_found = [elem for elem in outdoor_elements if elem in spell_text]
            
            if outdoor_found:
                print(f"   ✅ Outdoor elements found: {', '.join(outdoor_found)}")
            else:
                print(f"   ⚠️  No outdoor elements detected")
            
            print(f"   ✅ Choose-for-me spell generated successfully")
            print(f"   ✅ Spell title: {spell.get('title')}")
            print(f"   ✅ Scenario: {response.get('scenario', {}).get('name')}")
            
            return True
        
        return False

    def run_all_tests(self):
        """Run all personalized spell tests"""
        print("🌟 PERSONALIZED SPELL GENERATION TESTING")
        print("=" * 60)
        print("Testing the new Personalized Spell Generation system")
        print("=" * 60)
        
        # Register user
        if not self.register_user():
            print("❌ Failed to register user, cannot continue")
            return False
        
        # Run the three main tests from review request
        print(f"\n📋 REVIEW REQUEST TESTS:")
        print(f"1. Kathleen protection spell with personalization")
        print(f"2. Kathleen grief spell with scenario rotation") 
        print(f"3. Choose-for-me persona selection")
        
        # Test 1: Kathleen protection spell
        self.test_personalized_spell_kathleen_protection()
        
        # Test 2: Kathleen grief spell with scenario rotation
        self.test_personalized_spell_kathleen_grief_rotation()
        
        # Test 3: Choose-for-me persona selection
        self.test_personalized_spell_choose_for_me()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 PERSONALIZED SPELL TEST SUMMARY")
        print("=" * 60)
        print(f"Total tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed / self.tests_run * 100):.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed tests:")
            for failure in self.failed_tests:
                print(f"   - {failure['test']}: {failure.get('error', failure.get('response', 'Unknown error'))}")
        else:
            print(f"\n🎉 All personalized spell tests passed!")
        
        return self.tests_passed == self.tests_run

def main():
    tester = PersonalizedSpellTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())