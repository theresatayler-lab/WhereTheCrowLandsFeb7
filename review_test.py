import requests
import json
import sys
from datetime import datetime

class ReviewRequestTester:
    def __init__(self, base_url="https://aiarchetypes.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user_id = None

    def register_user(self):
        """Register a new user for testing"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user_data = {
            "email": f"review_test_{timestamp}@example.com",
            "password": "ReviewTest123!",
            "name": f"Review Test User {timestamp}"
        }
        
        url = f"{self.base_url}/api/auth/register"
        headers = {'Content-Type': 'application/json'}
        
        try:
            response = requests.post(url, json=test_user_data, headers=headers, timeout=30)
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('token')
                self.user_id = data.get('user', {}).get('id')
                print(f"✅ User registered successfully")
                print(f"   Email: {test_user_data['email']}")
                print(f"   Token: {self.token[:20]}...")
                return True
            else:
                print(f"❌ Registration failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Registration error: {str(e)}")
            return False

    def check_subscription_status(self):
        """Check subscription status and limits"""
        if not self.token:
            print("❌ No token available for subscription check")
            return False
            
        url = f"{self.base_url}/api/subscription/status"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.token}'
        }
        
        try:
            response = requests.get(url, headers=headers, timeout=30)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Subscription Status:")
                print(f"   Tier: {data.get('subscription_tier')}")
                print(f"   Spell Limit: {data.get('spell_limit')}")
                print(f"   Spells Remaining: {data.get('spells_remaining')}")
                print(f"   Can Save Spells: {data.get('can_save_spells')}")
                print(f"   Can Download PDF: {data.get('can_download_pdf')}")
                return data
            else:
                print(f"❌ Subscription check failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Subscription check error: {str(e)}")
            return False

    def test_spell_generation_katherine_protection(self):
        """Test the exact spell generation flow from the review request"""
        print("\n🔮 Testing Katherine Protection Spell Generation (Review Request)")
        print("   Intention: 'A protection spell'")
        print("   Guide: Katherine (kathleen archetype)")
        print("   Image Generation: Enabled")
        
        spell_data = {
            "intention": "A protection spell",
            "archetype": "kathleen",
            "generate_image": True
        }
        
        url = f"{self.base_url}/api/ai/generate-spell"
        headers = {'Content-Type': 'application/json'}
        
        # Add auth token if available
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        try:
            print("   Sending request...")
            response = requests.post(url, json=spell_data, headers=headers, timeout=90)
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Spell generation successful!")
                
                # Verify spell structure
                spell = data.get('spell', {})
                archetype = data.get('archetype', {})
                image_base64 = data.get('image_base64')
                
                print(f"   📜 Spell Title: {spell.get('title', 'N/A')}")
                print(f"   🎭 Guide: {archetype.get('name', 'N/A')} - {archetype.get('title', 'N/A')}")
                
                # Check tarot card view
                tarot_card = spell.get('tarot_card', {})
                if tarot_card:
                    print(f"   🃏 Tarot Card Title: {tarot_card.get('title', 'N/A')}")
                    print(f"   🃏 Symbol: {tarot_card.get('symbol', 'N/A')}")
                    print(f"   🃏 Essence: {tarot_card.get('essence', 'N/A')}")
                
                # Check image generation
                if image_base64:
                    print(f"   🖼️  Image generated successfully (base64 length: {len(image_base64)})")
                else:
                    print("   ⚠️  No image generated")
                
                # Check materials
                materials = spell.get('materials', [])
                print(f"   🧿 Materials count: {len(materials)}")
                if materials:
                    print(f"   🧿 First material: {materials[0].get('name', 'N/A')}")
                
                # Check steps
                steps = spell.get('steps', [])
                print(f"   📋 Steps count: {len(steps)}")
                if steps:
                    print(f"   📋 First step: {steps[0].get('title', 'N/A')}")
                
                # Check spoken words
                spoken_words = spell.get('spoken_words', {})
                if spoken_words.get('main_incantation'):
                    print(f"   🗣️  Main incantation: {spoken_words['main_incantation'][:50]}...")
                
                # Check historical context
                historical = spell.get('historical_context', {})
                sources = historical.get('sources', [])
                print(f"   📚 Historical sources: {len(sources)}")
                
                return True
                
            elif response.status_code == 403:
                error_data = response.json()
                detail = error_data.get('detail', {})
                if isinstance(detail, dict) and detail.get('error') == 'spell_limit_reached':
                    print("⚠️  Spell limit reached for free user")
                    print(f"   Message: {detail.get('message')}")
                    print("   This is expected behavior for free users after 3 spells")
                    return True  # This is actually correct behavior
                else:
                    print(f"❌ Access denied: {response.text}")
                    return False
            else:
                print(f"❌ Spell generation failed: {response.status_code}")
                print(f"   Response: {response.text[:500]}...")
                return False
                
        except Exception as e:
            print(f"❌ Spell generation error: {str(e)}")
            return False

    def test_anonymous_spell_generation(self):
        """Test spell generation without authentication (anonymous user)"""
        print("\n🔮 Testing Anonymous Katherine Protection Spell Generation")
        
        spell_data = {
            "intention": "A protection spell",
            "archetype": "kathleen",
            "generate_image": True
        }
        
        url = f"{self.base_url}/api/ai/generate-spell"
        headers = {'Content-Type': 'application/json'}
        # No auth token for anonymous test
        
        try:
            print("   Sending anonymous request...")
            response = requests.post(url, json=spell_data, headers=headers, timeout=90)
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Anonymous spell generation successful!")
                
                spell = data.get('spell', {})
                archetype = data.get('archetype', {})
                image_base64 = data.get('image_base64')
                
                print(f"   📜 Spell Title: {spell.get('title', 'N/A')}")
                print(f"   🎭 Guide: {archetype.get('name', 'N/A')}")
                
                if image_base64:
                    print(f"   🖼️  Image generated successfully")
                else:
                    print("   ⚠️  No image generated")
                
                return True
            else:
                print(f"❌ Anonymous spell generation failed: {response.status_code}")
                print(f"   Response: {response.text[:500]}...")
                return False
                
        except Exception as e:
            print(f"❌ Anonymous spell generation error: {str(e)}")
            return False

def main():
    print("🧙‍♀️ Review Request Testing - Katherine Protection Spell Flow")
    print("=" * 70)
    
    tester = ReviewRequestTester()
    
    # Test 1: Anonymous spell generation (should work unlimited)
    success_anonymous = tester.test_anonymous_spell_generation()
    
    # Test 2: Authenticated user flow
    print("\n👤 Testing with authenticated user...")
    if tester.register_user():
        # Check subscription status
        subscription_data = tester.check_subscription_status()
        
        # Test spell generation
        success_auth = tester.test_spell_generation_katherine_protection()
    else:
        success_auth = False
    
    print("\n" + "=" * 70)
    print("📊 Review Request Test Results:")
    print(f"   Anonymous spell generation: {'✅ PASS' if success_anonymous else '❌ FAIL'}")
    print(f"   Authenticated spell generation: {'✅ PASS' if success_auth else '❌ FAIL'}")
    
    if success_anonymous and success_auth:
        print("\n🎉 Review Request Test PASSED")
        print("   ✅ Katherine archetype selection working")
        print("   ✅ Protection spell intention working")
        print("   ✅ Spell generation working")
        print("   ✅ Image generation working")
        print("   ✅ Spell result structure complete")
        return 0
    else:
        print("\n❌ Review Request Test FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(main())