import requests
import json
import sys
from datetime import datetime

class SubscriptionSystemTester:
    def __init__(self, base_url="https://crowlands.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user_id = None

    def register_user(self):
        """Register a new user for testing"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user_data = {
            "email": f"sub_test_{timestamp}@example.com",
            "password": "SubTest123!",
            "name": f"Subscription Test User {timestamp}"
        }
        
        url = f"{self.base_url}/api/auth/register"
        headers = {'Content-Type': 'application/json'}
        
        try:
            response = requests.post(url, json=test_user_data, headers=headers, timeout=30)
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('token')
                self.user_id = data.get('user', {}).get('id')
                self.user_email = test_user_data['email']
                print(f"✅ User registered: {self.user_email}")
                return True
            else:
                print(f"❌ Registration failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Registration error: {str(e)}")
            return False

    def test_spell_limit_enforcement(self):
        """Test that free users are limited to 3 spells"""
        print("\n🔢 Testing Spell Limit Enforcement for Free Users")
        
        if not self.token:
            print("❌ No token available")
            return False
        
        spell_data = {
            "intention": "Test spell for limit checking",
            "archetype": "kathleen",
            "generate_image": False
        }
        
        url = f"{self.base_url}/api/ai/generate-spell"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.token}'
        }
        
        spells_generated = 0
        
        # Try to generate 4 spells (should fail on the 4th)
        for i in range(4):
            try:
                print(f"   Generating spell {i+1}...")
                response = requests.post(url, json=spell_data, headers=headers, timeout=60)
                
                if response.status_code == 200:
                    spells_generated += 1
                    print(f"   ✅ Spell {i+1} generated successfully")
                elif response.status_code == 403:
                    error_data = response.json()
                    detail = error_data.get('detail', {})
                    if isinstance(detail, dict) and detail.get('error') == 'spell_limit_reached':
                        print(f"   🚫 Spell {i+1} blocked - limit reached")
                        print(f"   Message: {detail.get('message')}")
                        break
                    else:
                        print(f"   ❌ Unexpected 403 error: {response.text}")
                        return False
                else:
                    print(f"   ❌ Unexpected error: {response.status_code}")
                    return False
                    
            except Exception as e:
                print(f"   ❌ Error generating spell {i+1}: {str(e)}")
                return False
        
        if spells_generated == 3:
            print(f"✅ Spell limit enforcement working correctly (3 spells generated, 4th blocked)")
            return True
        else:
            print(f"❌ Spell limit enforcement failed (generated {spells_generated} spells)")
            return False

    def test_save_to_grimoire_restriction(self):
        """Test that free users cannot save to grimoire"""
        print("\n📖 Testing Save to Grimoire Restriction for Free Users")
        
        if not self.token:
            print("❌ No token available")
            return False
        
        spell_data = {
            "spell_data": {
                "title": "Test Protection Spell",
                "subtitle": "A test spell",
                "materials": [{"name": "White Candle", "icon": "candle", "note": "For purification"}],
                "steps": [{"number": 1, "title": "Light Candle", "instruction": "Light the candle"}],
                "spoken_words": {"invocation": "Test invocation", "main_incantation": "Test incantation", "closing": "Test closing"},
                "historical_context": {"tradition": "Test", "sources": []}
            },
            "archetype_id": "kathleen",
            "archetype_name": "Kathleen Winifred Malzard",
            "archetype_title": "The Keeper of Secrets"
        }
        
        url = f"{self.base_url}/api/grimoire/save"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.token}'
        }
        
        try:
            response = requests.post(url, json=spell_data, headers=headers, timeout=30)
            
            if response.status_code == 403:
                error_data = response.json()
                detail = error_data.get('detail', {})
                if isinstance(detail, dict) and detail.get('error') == 'feature_locked':
                    print("✅ Save to grimoire correctly blocked for free users")
                    print(f"   Message: {detail.get('message')}")
                    return True
                else:
                    print(f"❌ Unexpected 403 error: {response.text}")
                    return False
            else:
                print(f"❌ Expected 403 but got {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error testing grimoire save: {str(e)}")
            return False

    def check_subscription_status(self):
        """Check subscription status"""
        if not self.token:
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
                print(f"📊 Subscription Status:")
                print(f"   Tier: {data.get('subscription_tier')}")
                print(f"   Spells Remaining: {data.get('spells_remaining')}")
                print(f"   Can Save Spells: {data.get('can_save_spells')}")
                print(f"   Can Download PDF: {data.get('can_download_pdf')}")
                return data
            else:
                print(f"❌ Subscription check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Subscription check error: {str(e)}")
            return False

def main():
    print("🧙‍♀️ Subscription System Backend Testing")
    print("=" * 50)
    
    tester = SubscriptionSystemTester()
    
    # Register user
    if not tester.register_user():
        print("❌ Failed to register user")
        return 1
    
    # Check initial subscription status
    tester.check_subscription_status()
    
    # Test spell limit enforcement
    limit_test_passed = tester.test_spell_limit_enforcement()
    
    # Check subscription status after spell generation
    print("\n📊 Subscription status after spell generation:")
    tester.check_subscription_status()
    
    # Test save to grimoire restriction
    grimoire_test_passed = tester.test_save_to_grimoire_restriction()
    
    print("\n" + "=" * 50)
    print("📊 Subscription System Test Results:")
    print(f"   Spell limit enforcement: {'✅ PASS' if limit_test_passed else '❌ FAIL'}")
    print(f"   Grimoire save restriction: {'✅ PASS' if grimoire_test_passed else '❌ FAIL'}")
    
    if limit_test_passed and grimoire_test_passed:
        print("\n🎉 Subscription System Backend Tests PASSED")
        return 0
    else:
        print("\n❌ Subscription System Backend Tests FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(main())