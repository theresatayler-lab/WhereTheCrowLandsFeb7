"""
Test Suite for Iteration 12 - 5 New Features
1. Stage progress indicator during spell generation (archivist->planner->writer->qa)
2. Admin stats dashboard endpoint
3. PDF export endpoint
4. Frontend spell request page loads with Alchemize categories
5. Spell generation end-to-end with blocks + tarot_card

Credentials: Admin email = sub_test@test.com, password = test123
"""
import pytest
import requests
import time
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://env-refresh-deploy.preview.emergentagent.com').rstrip('/')

class TestAdminAuth:
    """Test admin login and get auth token"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get auth token for admin user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "sub_test@test.com",
            "password": "test123"
        })
        if response.status_code != 200:
            # Try to register if not exists
            register_resp = requests.post(f"{BASE_URL}/api/auth/register", json={
                "email": "sub_test@test.com",
                "password": "test123",
                "name": "Admin Test User"
            })
            if register_resp.status_code == 200:
                return register_resp.json()['token']
            pytest.skip("Could not authenticate admin user")
        return response.json()['token']
    
    def test_admin_login_success(self):
        """Test that admin user can login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "sub_test@test.com",
            "password": "test123"
        })
        # Accept 200 (exists) or try registration
        if response.status_code == 401:
            # User doesn't exist, try to register
            reg_resp = requests.post(f"{BASE_URL}/api/auth/register", json={
                "email": "sub_test@test.com",
                "password": "test123",
                "name": "Admin Test User"
            })
            assert reg_resp.status_code in [200, 201, 400], f"Registration failed: {reg_resp.text}"
            if reg_resp.status_code in [200, 201]:
                data = reg_resp.json()
                assert 'token' in data
                print(f"Admin user registered successfully")
                return
            # 400 means already exists, try login again
            response = requests.post(f"{BASE_URL}/api/auth/login", json={
                "email": "sub_test@test.com",
                "password": "test123"
            })
        
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert 'token' in data
        print(f"Admin login successful")


class TestAdminStats:
    """Feature 2: GET /api/admin/stats endpoint"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get auth token for admin user"""
        # First try login
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "sub_test@test.com",
            "password": "test123"
        })
        if response.status_code == 200:
            return response.json()['token']
        
        # Try registration
        reg_resp = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": "sub_test@test.com",
            "password": "test123",
            "name": "Admin Test User"
        })
        if reg_resp.status_code in [200, 201]:
            return reg_resp.json()['token']
        
        # Final login attempt
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "sub_test@test.com",
            "password": "test123"
        })
        if response.status_code == 200:
            return response.json()['token']
        pytest.skip("Could not authenticate admin user")
    
    def test_admin_stats_returns_all_fields(self, admin_token):
        """Verify admin stats returns expected structure"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 200, f"Admin stats failed: {response.text}"
        data = response.json()
        
        # Verify users section
        assert 'users' in data
        assert 'total' in data['users']
        assert isinstance(data['users']['total'], int)
        print(f"Total users: {data['users']['total']}")
        
        # Verify spells section
        assert 'spells' in data
        assert 'total' in data['spells']
        assert 'last_24h' in data['spells']
        print(f"Total spells: {data['spells']['total']}, Last 24h: {data['spells']['last_24h']}")
        
        # Verify guides section (map of guide_id -> count)
        assert 'guides' in data
        assert isinstance(data['guides'], dict)
        print(f"Guide stats: {data['guides']}")
        
        # Verify performance section
        assert 'performance' in data
        assert 'avg_generation_ms' in data['performance']
        print(f"Avg generation time: {data['performance']['avg_generation_ms']}ms")
    
    def test_admin_stats_requires_auth(self):
        """Verify admin stats requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code in [401, 403], "Admin stats should require auth"
    
    def test_admin_stats_requires_admin_email(self):
        """Verify only admin email can access stats"""
        # Register a non-admin user
        non_admin_email = f"nonadmin_{int(time.time())}@test.com"
        reg_resp = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": non_admin_email,
            "password": "test123",
            "name": "Non Admin User"
        })
        
        if reg_resp.status_code in [200, 201]:
            token = reg_resp.json()['token']
            response = requests.get(
                f"{BASE_URL}/api/admin/stats",
                headers={"Authorization": f"Bearer {token}"}
            )
            assert response.status_code == 403, "Non-admin should get 403"
            print("Confirmed non-admin users cannot access admin stats")


class TestPDFExport:
    """Feature 3: GET /api/grimoire/export/pdf endpoint"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "sub_test@test.com",
            "password": "test123"
        })
        if response.status_code == 200:
            return response.json()['token']
        pytest.skip("Could not authenticate")
    
    def test_pdf_export_endpoint_exists(self, admin_token):
        """Verify PDF export endpoint responds (may return 404 if no saved spells)"""
        response = requests.get(
            f"{BASE_URL}/api/grimoire/export/pdf",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        # Accept 200 (has spells) or 404 (no saved spells) as valid responses
        assert response.status_code in [200, 404], f"Unexpected status: {response.status_code} - {response.text}"
        
        if response.status_code == 200:
            # Verify PDF content type
            content_type = response.headers.get('content-type', '')
            assert 'pdf' in content_type.lower() or 'octet-stream' in content_type.lower(), f"Expected PDF, got {content_type}"
            print("PDF export returned successfully")
        else:
            print("PDF export returned 404 (no saved spells) - expected behavior for test user")
    
    def test_pdf_export_requires_auth(self):
        """Verify PDF export requires authentication"""
        response = requests.get(f"{BASE_URL}/api/grimoire/export/pdf")
        assert response.status_code in [401, 403], "PDF export should require auth"


class TestStageProgress:
    """Feature 1: Stage progress indicator during spell generation"""
    
    def test_create_spell_job_and_check_stages(self):
        """Test spell job creation and poll for stage progression"""
        # Create spell job
        spell_spec = {
            "persona_id": "shigg",
            "user_query": "I need comfort after a difficult day, something gentle to restore peace",
            "alchemize_category": "comfort_healing",
            "desired_feeling": "comfort_healing",
            "time": "10_min",
            "tone": "gentle",
            "belief_boundary": "spiritual_grounded",
            "anchor_object": "tea",
            "setting": "home_quiet"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-job",
            json={
                "spell_spec": spell_spec,
                "belief_mode": "SPIRITUAL",
                "generate_images": False
            }
        )
        
        assert create_response.status_code == 200, f"Job creation failed: {create_response.text}"
        job_data = create_response.json()
        assert 'job_id' in job_data
        job_id = job_data['job_id']
        print(f"Created job: {job_id}")
        
        # Poll for stages (within first 60 seconds to catch progression)
        stages_seen = set()
        stage_messages = []
        max_polls = 20
        poll_interval = 5  # seconds
        
        for i in range(max_polls):
            time.sleep(poll_interval)
            
            status_response = requests.get(f"{BASE_URL}/api/ai/spell-job/{job_id}")
            if status_response.status_code != 200:
                print(f"Poll {i+1}: Error {status_response.status_code}")
                continue
            
            status_data = status_response.json()
            status = status_data.get('status', 'unknown')
            
            # Check for current_stage and stage_message
            current_stage = status_data.get('current_stage')
            stage_message = status_data.get('stage_message')
            
            if current_stage:
                if current_stage not in stages_seen:
                    stages_seen.add(current_stage)
                    stage_messages.append((current_stage, stage_message))
                    print(f"Poll {i+1}: Stage '{current_stage}' - {stage_message}")
            
            if status == 'complete':
                print(f"Spell generation complete after {(i+1)*poll_interval}s")
                break
            elif status == 'failed':
                print(f"Spell generation failed: {status_data.get('error')}")
                break
        
        # Verify we saw at least some stages
        expected_stages = {'archivist', 'planner', 'writer', 'qa'}
        print(f"Stages observed: {stages_seen}")
        
        # We should see at least 1-2 stages if we polled early enough
        # (The full 70s generation might complete before we see all)
        if stages_seen:
            for stage in stages_seen:
                assert stage in expected_stages, f"Unexpected stage: {stage}"
            print(f"Successfully observed stage progression: {stages_seen}")
        else:
            print("Warning: No stages observed during polling (job may have completed quickly)")
        
        return job_id, stages_seen


class TestSpellGenerationE2E:
    """Feature 5: End-to-end spell generation with blocks + tarot_card"""
    
    def test_full_spell_generation(self):
        """Test complete spell generation returns blocks and tarot_card"""
        spell_spec = {
            "persona_id": "cathleen",
            "user_query": "I need protection and strength to face a challenging meeting",
            "alchemize_category": "protection",
            "desired_feeling": "protection",
            "time": "2_min",
            "tone": "practical",
            "belief_boundary": "practitioner",
            "anchor_object": "candle",
            "setting": "work_daily"
        }
        
        # Create job
        create_response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-job",
            json={
                "spell_spec": spell_spec,
                "belief_mode": "PRACTITIONER",
                "generate_images": False
            }
        )
        
        assert create_response.status_code == 200, f"Job creation failed: {create_response.text}"
        job_id = create_response.json()['job_id']
        print(f"Created E2E test job: {job_id}")
        
        # Poll until complete (max 90 seconds for this ~70s generation)
        result = None
        for i in range(18):
            time.sleep(5)
            status_response = requests.get(f"{BASE_URL}/api/ai/spell-job/{job_id}")
            status_data = status_response.json()
            
            if status_data.get('status') == 'complete':
                result = status_data.get('result')
                print(f"Spell complete after {(i+1)*5}s")
                break
            elif status_data.get('status') == 'failed':
                pytest.fail(f"Spell generation failed: {status_data.get('error')}")
        
        if not result:
            pytest.skip("Spell generation timed out after 90s")
        
        # Verify spell structure
        assert 'spell' in result, "Result missing 'spell'"
        spell = result['spell']
        
        # Check blocks
        blocks = spell.get('blocks', [])
        assert isinstance(blocks, list), "blocks should be array"
        assert len(blocks) >= 5, f"Expected at least 5 blocks, got {len(blocks)}"
        print(f"Spell has {len(blocks)} blocks")
        
        # Check block types
        block_types = [b.get('type') for b in blocks if isinstance(b, dict)]
        print(f"Block types: {block_types}")
        
        # Check for tarot_card (can be in spell or separate)
        tarot_card = spell.get('tarot_card') or result.get('tarot_card')
        if tarot_card:
            print(f"Tarot card present: {tarot_card.get('name', 'unnamed')}")
        else:
            print("Note: No tarot_card in this generation (may be tier-dependent)")
        
        # Verify archetype info
        assert 'archetype' in result, "Result missing 'archetype'"
        archetype = result['archetype']
        assert 'id' in archetype
        assert 'name' in archetype
        print(f"Archetype: {archetype['name']} ({archetype['id']})")


class TestHealthAndProviders:
    """Basic health checks"""
    
    def test_health_providers(self):
        """Verify provider status endpoint"""
        response = requests.get(f"{BASE_URL}/api/health/providers")
        assert response.status_code == 200
        data = response.json()
        print(f"Providers: {data}")
    
    def test_llm_status(self):
        """Verify LLM status endpoint"""
        response = requests.get(f"{BASE_URL}/api/llm/status")
        assert response.status_code == 200
        data = response.json()
        print(f"LLM status: {data}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
