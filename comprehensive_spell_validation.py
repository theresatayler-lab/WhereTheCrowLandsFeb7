import requests
import json
from datetime import datetime

class DetailedSpellValidationTester:
    def __init__(self, base_url="https://mystic-grimoire-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.validation_results = []

    def register_user(self):
        """Register a test user"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user_data = {
            "email": f"test_validation_{timestamp}@example.com",
            "password": "TestPass123!",
            "name": f"Test Validation User {timestamp}"
        }
        
        url = f"{self.base_url}/api/auth/register"
        response = requests.post(url, json=test_user_data)
        
        if response.status_code == 200:
            data = response.json()
            self.token = data.get('token')
            print(f"✅ User registered successfully")
            return True
        else:
            print(f"❌ Failed to register user: {response.text}")
            return False

    def validate_spell_structure(self, spell, test_name):
        """Validate spell structure according to review request criteria"""
        print(f"\n🔍 Validating {test_name} spell structure...")
        
        validation_results = {
            'test_name': test_name,
            'spell_structure': True,
            'citation_validation': True,
            'archetype_response': True,
            'asset_plan': True,
            'scenario_matching': True,
            'errors': []
        }
        
        # 1. Spell Structure Validation
        required_spell_fields = ['title', 'subtitle', 'format_id', 'scenario_id', 'variation_tokens', 'tarot_card', 'the_working', 'spoken_words', 'inspired_by']
        missing_fields = [field for field in required_spell_fields if field not in spell]
        
        if missing_fields:
            validation_results['spell_structure'] = False
            validation_results['errors'].append(f"Missing spell fields: {missing_fields}")
            print(f"   ❌ Missing spell fields: {missing_fields}")
        else:
            print(f"   ✅ All required spell fields present")
        
        # Validate variation_tokens structure
        variation_tokens = spell.get('variation_tokens', {})
        expected_tokens = ['time_of_day', 'gesture_type', 'repetition_pattern', 'material_placement', 'closing_action', 'energy_direction']
        missing_tokens = [token for token in expected_tokens if token not in variation_tokens]
        
        if missing_tokens:
            validation_results['spell_structure'] = False
            validation_results['errors'].append(f"Missing variation tokens: {missing_tokens}")
            print(f"   ❌ Missing variation tokens: {missing_tokens}")
        else:
            print(f"   ✅ All variation tokens present")
        
        # Validate tarot_card structure
        tarot_card = spell.get('tarot_card', {})
        tarot_required_fields = ['title', 'symbol', 'essence']
        missing_tarot_fields = [field for field in tarot_required_fields if field not in tarot_card]
        
        if missing_tarot_fields:
            validation_results['spell_structure'] = False
            validation_results['errors'].append(f"Missing tarot card fields: {missing_tarot_fields}")
            print(f"   ❌ Missing tarot card fields: {missing_tarot_fields}")
        else:
            print(f"   ✅ Tarot card structure valid")
        
        # Validate the_working structure
        the_working = spell.get('the_working', {})
        if not the_working or 'steps' not in the_working:
            validation_results['spell_structure'] = False
            validation_results['errors'].append("Missing or invalid 'the_working' structure")
            print(f"   ❌ Missing or invalid 'the_working' structure")
        else:
            print(f"   ✅ 'the_working' structure valid")
        
        # Validate spoken_words structure
        spoken_words = spell.get('spoken_words', {})
        if not spoken_words or 'main_incantation' not in spoken_words:
            validation_results['spell_structure'] = False
            validation_results['errors'].append("Missing or invalid 'spoken_words' structure")
            print(f"   ❌ Missing or invalid 'spoken_words' structure")
        else:
            print(f"   ✅ 'spoken_words' structure valid")
        
        return validation_results

    def validate_citations(self, spell, persona_id, validation_results):
        """Validate citations according to allowed sources"""
        print(f"\n🔍 Validating citations for {persona_id}...")
        
        inspired_by = spell.get('inspired_by', [])
        if not inspired_by:
            validation_results['citation_validation'] = False
            validation_results['errors'].append("No citations found in inspired_by")
            print(f"   ❌ No citations found")
            return validation_results
        
        # Define allowed sources for each persona
        allowed_sources = {
            'shigg': ['rubaiyat', 'hughes_crow', 'domestic_traditions', 'east_end', 'roux_ornithography', 'grieve_herbal'],
            'cathleen': ['morrigan_book', 'celtic_twilight', 'irish_folk', 'home_spiritualism', 'dion_fortune', 'essex_witches'],
            'katherine': ['jung_red_book', 'dion_fortune', 'spr_methods', 'victorian_seance', 'davies_cunning', 'spitalfields_craft']
        }
        
        persona_allowed = allowed_sources.get(persona_id, [])
        invalid_sources = []
        
        for citation in inspired_by:
            source_id = citation.get('source_id', '')
            if source_id not in persona_allowed:
                invalid_sources.append(source_id)
        
        if invalid_sources:
            validation_results['citation_validation'] = False
            validation_results['errors'].append(f"Invalid sources for {persona_id}: {invalid_sources}")
            print(f"   ❌ Invalid sources: {invalid_sources}")
            print(f"   Allowed sources: {persona_allowed}")
        else:
            print(f"   ✅ All citations from allowed sources ({len(inspired_by)} citations)")
            for citation in inspired_by:
                print(f"     - {citation.get('source_id')}: {citation.get('title', 'No title')}")
        
        return validation_results

    def validate_archetype_response(self, archetype, expected_persona_id, validation_results):
        """Validate archetype response"""
        print(f"\n🔍 Validating archetype response...")
        
        if archetype.get('id') != expected_persona_id:
            validation_results['archetype_response'] = False
            validation_results['errors'].append(f"Expected archetype id '{expected_persona_id}', got '{archetype.get('id')}'")
            print(f"   ❌ Wrong archetype id: expected '{expected_persona_id}', got '{archetype.get('id')}'")
        else:
            print(f"   ✅ Archetype id correct: {archetype.get('id')}")
        
        if not archetype.get('name') or not archetype.get('title'):
            validation_results['archetype_response'] = False
            validation_results['errors'].append("Missing archetype name or title")
            print(f"   ❌ Missing archetype name or title")
        else:
            print(f"   ✅ Archetype name and title populated: {archetype.get('name')} - {archetype.get('title')}")
        
        return validation_results

    def validate_asset_plan(self, asset_plan, validation_results):
        """Validate asset plan"""
        print(f"\n🔍 Validating asset plan...")
        
        if not asset_plan:
            validation_results['asset_plan'] = False
            validation_results['errors'].append("Missing asset_plan")
            print(f"   ❌ Missing asset_plan")
            return validation_results
        
        # Check micro_icons
        micro_icons = asset_plan.get('micro_icons', [])
        if not micro_icons:
            validation_results['asset_plan'] = False
            validation_results['errors'].append("Missing micro_icons in asset_plan")
            print(f"   ❌ Missing micro_icons")
        else:
            # Validate micro icon structure
            valid_icons = True
            for icon in micro_icons:
                if 'id' not in icon or 'emoji' not in icon:
                    valid_icons = False
                    break
            
            if not valid_icons:
                validation_results['asset_plan'] = False
                validation_results['errors'].append("Invalid micro icon structure")
                print(f"   ❌ Invalid micro icon structure")
            else:
                print(f"   ✅ Micro icons valid ({len(micro_icons)} icons)")
        
        return validation_results

    def validate_scenario_matching(self, scenario, expected_scenarios, validation_results):
        """Validate scenario matching"""
        print(f"\n🔍 Validating scenario matching...")
        
        scenario_id = scenario.get('id', '')
        scenario_name = scenario.get('name', '')
        
        if not scenario_id or not scenario_name:
            validation_results['scenario_matching'] = False
            validation_results['errors'].append("Missing scenario id or name")
            print(f"   ❌ Missing scenario id or name")
        else:
            print(f"   ✅ Scenario: {scenario_name} (id: {scenario_id})")
            
            if expected_scenarios and scenario_id not in expected_scenarios:
                print(f"   ⚠️  Unexpected scenario: {scenario_id}")
                print(f"   Expected one of: {expected_scenarios}")
            else:
                print(f"   ✅ Scenario matches expected patterns")
        
        return validation_results

    def run_comprehensive_test(self, test_name, spell_data, expected_persona_id, expected_scenarios=None):
        """Run comprehensive validation test"""
        print(f"\n{'='*60}")
        print(f"🧪 COMPREHENSIVE TEST: {test_name}")
        print(f"{'='*60}")
        
        url = f"{self.base_url}/api/ai/generate-personalized-spell"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.token}'
        }
        
        try:
            response = requests.post(url, json=spell_data, headers=headers, timeout=90)
            
            if response.status_code != 200:
                print(f"❌ API call failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False
            
            data = response.json()
            spell = data.get('spell', {})
            archetype = data.get('archetype', {})
            scenario = data.get('scenario', {})
            asset_plan = data.get('asset_plan', {})
            
            # Run all validations
            validation_results = self.validate_spell_structure(spell, test_name)
            validation_results = self.validate_citations(spell, expected_persona_id, validation_results)
            validation_results = self.validate_archetype_response(archetype, expected_persona_id, validation_results)
            validation_results = self.validate_asset_plan(asset_plan, validation_results)
            validation_results = self.validate_scenario_matching(scenario, expected_scenarios, validation_results)
            
            # Overall result
            all_passed = all([
                validation_results['spell_structure'],
                validation_results['citation_validation'],
                validation_results['archetype_response'],
                validation_results['asset_plan'],
                validation_results['scenario_matching']
            ])
            
            validation_results['overall_passed'] = all_passed
            self.validation_results.append(validation_results)
            
            if all_passed:
                print(f"\n✅ {test_name} - ALL VALIDATIONS PASSED")
            else:
                print(f"\n❌ {test_name} - SOME VALIDATIONS FAILED")
                for error in validation_results['errors']:
                    print(f"   - {error}")
            
            return all_passed
            
        except Exception as e:
            print(f"❌ Test failed with error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all comprehensive validation tests"""
        print("🧪 Starting Comprehensive Spell Validation Tests...")
        
        if not self.register_user():
            return
        
        # Test 1: Shigg Kitchen Magic
        shigg_test = {
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
        
        # Test 2: Cathleen Protection
        cathleen_test = {
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
        
        # Test 3: Katherine Shadow Work
        katherine_test = {
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
        
        # Run tests
        test_results = []
        
        test_results.append(self.run_comprehensive_test(
            "Shigg Kitchen Magic",
            shigg_test,
            "shigg",
            ['kettle_charm', 'tea_ring_unknotting']
        ))
        
        test_results.append(self.run_comprehensive_test(
            "Cathleen Protection",
            cathleen_test,
            "cathleen",
            ['voice_ward', 'home_circle_blessing']
        ))
        
        test_results.append(self.run_comprehensive_test(
            "Katherine Shadow Work",
            katherine_test,
            "katherine",
            ['discernment_protocol', 'mirror_inquiry_safe']
        ))
        
        # Print final summary
        print(f"\n{'='*60}")
        print(f"📊 FINAL VALIDATION SUMMARY")
        print(f"{'='*60}")
        
        total_tests = len(test_results)
        passed_tests = sum(test_results)
        
        print(f"Total tests: {total_tests}")
        print(f"Passed tests: {passed_tests}")
        print(f"Failed tests: {total_tests - passed_tests}")
        
        if passed_tests == total_tests:
            print(f"\n🎉 ALL COMPREHENSIVE VALIDATIONS PASSED!")
            print(f"✅ Spell Personalization System is working correctly")
            print(f"✅ All validation criteria from review request met")
        else:
            print(f"\n❌ SOME VALIDATIONS FAILED")
            for result in self.validation_results:
                if not result['overall_passed']:
                    print(f"   - {result['test_name']}: {len(result['errors'])} errors")

if __name__ == "__main__":
    tester = DetailedSpellValidationTester()
    tester.run_all_tests()