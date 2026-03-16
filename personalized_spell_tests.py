import requests
import sys
import json
from datetime import datetime

class PersonalizedSpellTester:
    def __init__(self, base_url="https://timeline-enrichment.preview.emergentagent.com"):
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

    def test_auth_register(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user_data = {
            "email": f"test_user_{timestamp}@example.com",
            "password": "TestPass123!",
            "name": f"Test User {timestamp}"
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

    def test_personalized_spell_shigg_kitchen_magic(self):
        """Test personalized spell generation with Shigg persona for kitchen magic - REVIEW REQUEST TEST 1"""
        spell_data = {
            "spell_spec": {
                "persona_id": "shigg",
                "user_query": "I need help finding calm before a difficult conversation",
                "desired_feeling": "calm",
                "time": "10_min",
                "tone": "gentle",
                "belief_boundary": "spiritual_grounded",
                "anchor_object": "tea",
                "setting": "kitchen",
                "user_name": "Sarah",
                "avoid": ""
            },
            "generate_images": False
        }
        
        success, response = self.run_test(
            "Personalized Spell - Shigg Kitchen Magic",
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
            spell_required_fields = ['title', 'subtitle', 'format_id', 'scenario_id', 'variation_tokens', 'tarot_card', 'the_working', 'spoken_words', 'inspired_by']
            missing_spell_fields = [field for field in spell_required_fields if field not in spell]
            
            if missing_spell_fields:
                print(f"   ❌ Missing spell fields: {missing_spell_fields}")
                return False
            
            # Verify archetype response
            archetype = response.get('archetype', {})
            if archetype.get('id') != 'shigg':
                print(f"   ❌ Expected archetype id 'shigg', got '{archetype.get('id')}'")
                return False
            
            if archetype.get('name') != 'Shigg':
                print(f"   ❌ Expected archetype name 'Shigg', got '{archetype.get('name')}'")
                return False
            
            # Verify variation tokens
            variation_tokens = spell.get('variation_tokens', {})
            expected_tokens = ['time_of_day', 'gesture_type', 'repetition_pattern', 'material_placement', 'closing_action', 'energy_direction']
            missing_tokens = [token for token in expected_tokens if token not in variation_tokens]
            
            if missing_tokens:
                print(f"   ❌ Missing variation tokens: {missing_tokens}")
                return False
            
            # Verify tarot card structure
            tarot_card = spell.get('tarot_card', {})
            tarot_required_fields = ['title', 'symbol', 'essence']
            missing_tarot_fields = [field for field in tarot_required_fields if field not in tarot_card]
            
            if missing_tarot_fields:
                print(f"   ❌ Missing tarot card fields: {missing_tarot_fields}")
                return False
            
            # Verify citations (CRITICAL)
            inspired_by = spell.get('inspired_by', [])
            if not inspired_by:
                print(f"   ❌ No citations found in inspired_by")
                return False
            
            # Check allowed sources for Shigg
            allowed_sources = ['rubaiyat', 'hughes_crow', 'domestic_traditions', 'east_end', 'roux_ornithography', 'grieve_herbal']
            invalid_sources = []
            
            for citation in inspired_by:
                source_id = citation.get('source_id', '')
                if source_id not in allowed_sources:
                    invalid_sources.append(source_id)
            
            if invalid_sources:
                print(f"   ❌ Invalid sources for Shigg: {invalid_sources}")
                print(f"   Allowed sources: {allowed_sources}")
                return False
            
            # Verify asset plan
            asset_plan = response.get('asset_plan', {})
            if not asset_plan:
                print(f"   ❌ Missing asset_plan")
                return False
            
            micro_icons = asset_plan.get('micro_icons', [])
            if not micro_icons:
                print(f"   ❌ Missing micro_icons in asset_plan")
                return False
            
            # Check micro icon structure
            for icon in micro_icons:
                if 'id' not in icon or 'emoji' not in icon:
                    print(f"   ❌ Invalid micro icon structure: {icon}")
                    return False
            
            # Verify scenario matching
            scenario = response.get('scenario', {})
            scenario_id = scenario.get('id', '')
            expected_scenarios = ['kettle_charm', 'tea_ring_unknotting']
            
            if scenario_id not in expected_scenarios:
                print(f"   ⚠️  Unexpected scenario for tea/kitchen: {scenario_id}")
                print(f"   Expected one of: {expected_scenarios}")
            
            print(f"   ✅ Shigg personalized spell generated successfully")
            print(f"   ✅ Spell title: {spell.get('title')}")
            print(f"   ✅ Archetype: {archetype.get('name')}")
            print(f"   ✅ Scenario: {scenario.get('name')}")
            print(f"   ✅ Citations count: {len(inspired_by)}")
            print(f"   ✅ Micro icons count: {len(micro_icons)}")
            print(f"   ✅ All variation tokens present")
            
            return True
        
        return False

    def test_personalized_spell_cathleen_protection(self):
        """Test personalized spell generation with Cathleen persona for protection - REVIEW REQUEST TEST 2"""
        spell_data = {
            "spell_spec": {
                "persona_id": "cathleen",
                "user_query": "I need to protect my home from negative energy",
                "desired_feeling": "protected",
                "time": "10_min",
                "tone": "practical",
                "belief_boundary": "spiritual_grounded",
                "anchor_object": "candle",
                "setting": "bedroom",
                "user_name": "Elena",
                "avoid": ""
            },
            "generate_images": False
        }
        
        success, response = self.run_test(
            "Personalized Spell - Cathleen Protection",
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
            spell_required_fields = ['title', 'subtitle', 'format_id', 'scenario_id', 'variation_tokens', 'tarot_card', 'the_working', 'spoken_words', 'inspired_by']
            missing_spell_fields = [field for field in spell_required_fields if field not in spell]
            
            if missing_spell_fields:
                print(f"   ❌ Missing spell fields: {missing_spell_fields}")
                return False
            
            # Verify archetype response
            archetype = response.get('archetype', {})
            if archetype.get('id') != 'cathleen':
                print(f"   ❌ Expected archetype id 'cathleen', got '{archetype.get('id')}'")
                return False
            
            if archetype.get('name') != 'Cathleen':
                print(f"   ❌ Expected archetype name 'Cathleen', got '{archetype.get('name')}'")
                return False
            
            # Verify citations (CRITICAL) - Cathleen allowed sources
            inspired_by = spell.get('inspired_by', [])
            if not inspired_by:
                print(f"   ❌ No citations found in inspired_by")
                return False
            
            allowed_sources = ['morrigan_book', 'celtic_twilight', 'irish_folk', 'home_spiritualism', 'dion_fortune', 'essex_witches']
            invalid_sources = []
            
            for citation in inspired_by:
                source_id = citation.get('source_id', '')
                if source_id not in allowed_sources:
                    invalid_sources.append(source_id)
            
            if invalid_sources:
                print(f"   ❌ Invalid sources for Cathleen: {invalid_sources}")
                print(f"   Allowed sources: {allowed_sources}")
                return False
            
            # Verify scenario matching for voice/protection
            scenario = response.get('scenario', {})
            scenario_id = scenario.get('id', '')
            expected_scenarios = ['voice_ward', 'home_circle_blessing']
            
            if scenario_id not in expected_scenarios:
                print(f"   ⚠️  Unexpected scenario for voice/protection: {scenario_id}")
                print(f"   Expected one of: {expected_scenarios}")
            
            print(f"   ✅ Cathleen personalized spell generated successfully")
            print(f"   ✅ Spell title: {spell.get('title')}")
            print(f"   ✅ Archetype: {archetype.get('name')}")
            print(f"   ✅ Scenario: {scenario.get('name')}")
            print(f"   ✅ Citations count: {len(inspired_by)}")
            print(f"   ✅ All citations from allowed sources")
            
            return True
        
        return False

    def test_personalized_spell_katherine_shadow_work(self):
        """Test personalized spell generation with Katherine persona for shadow work - REVIEW REQUEST TEST 3"""
        spell_data = {
            "spell_spec": {
                "persona_id": "katherine",
                "user_query": "I want to understand a recurring pattern in my life",
                "desired_feeling": "clear",
                "time": "30_min",
                "tone": "intense",
                "belief_boundary": "spiritual_grounded",
                "anchor_object": "mirror",
                "setting": "desk",
                "user_name": "David",
                "avoid": ""
            },
            "generate_images": False
        }
        
        success, response = self.run_test(
            "Personalized Spell - Katherine Shadow Work",
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
            spell_required_fields = ['title', 'subtitle', 'format_id', 'scenario_id', 'variation_tokens', 'tarot_card', 'the_working', 'spoken_words', 'inspired_by']
            missing_spell_fields = [field for field in spell_required_fields if field not in spell]
            
            if missing_spell_fields:
                print(f"   ❌ Missing spell fields: {missing_spell_fields}")
                return False
            
            # Verify archetype response
            archetype = response.get('archetype', {})
            if archetype.get('id') != 'katherine':
                print(f"   ❌ Expected archetype id 'katherine', got '{archetype.get('id')}'")
                return False
            
            if archetype.get('name') != 'Katherine':
                print(f"   ❌ Expected archetype name 'Katherine', got '{archetype.get('name')}'")
                return False
            
            # Verify citations (CRITICAL) - Katherine allowed sources
            inspired_by = spell.get('inspired_by', [])
            if not inspired_by:
                print(f"   ❌ No citations found in inspired_by")
                return False
            
            allowed_sources = ['jung_red_book', 'dion_fortune', 'spr_methods', 'victorian_seance', 'davies_cunning', 'spitalfields_craft']
            invalid_sources = []
            
            for citation in inspired_by:
                source_id = citation.get('source_id', '')
                if source_id not in allowed_sources:
                    invalid_sources.append(source_id)
            
            if invalid_sources:
                print(f"   ❌ Invalid sources for Katherine: {invalid_sources}")
                print(f"   Allowed sources: {allowed_sources}")
                return False
            
            # Verify scenario matching for mirror/discernment
            scenario = response.get('scenario', {})
            scenario_id = scenario.get('id', '')
            expected_scenarios = ['discernment_protocol', 'mirror_inquiry_safe']
            
            if scenario_id not in expected_scenarios:
                print(f"   ⚠️  Unexpected scenario for mirror/discernment: {scenario_id}")
                print(f"   Expected one of: {expected_scenarios}")
            
            print(f"   ✅ Katherine personalized spell generated successfully")
            print(f"   ✅ Spell title: {spell.get('title')}")
            print(f"   ✅ Archetype: {archetype.get('name')}")
            print(f"   ✅ Scenario: {scenario.get('name')}")
            print(f"   ✅ Citations count: {len(inspired_by)}")
            print(f"   ✅ All citations from allowed sources")
            
            return True
        
        return False

    def run_all_tests(self):
        """Run all personalized spell tests"""
        print("🧪 Starting Personalized Spell Generation Tests...")
        print("=" * 60)
        
        # Register user first
        if not self.test_auth_register():
            print("❌ Failed to register user - cannot continue with tests")
            return
        
        # Run the three main tests
        tests = [
            self.test_personalized_spell_shigg_kitchen_magic,
            self.test_personalized_spell_cathleen_protection,
            self.test_personalized_spell_katherine_shadow_work
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                print(f"❌ Test {test.__name__} failed with error: {str(e)}")
                self.failed_tests.append({
                    'test': test.__name__,
                    'error': str(e)
                })
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"  - {failure['test']}: {failure.get('error', failure.get('response', 'Unknown error'))}")
        else:
            print("\n✅ ALL TESTS PASSED!")

if __name__ == "__main__":
    tester = PersonalizedSpellTester()
    tester.run_all_tests()