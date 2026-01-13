"""
Test Suite for V2 Spell Generation Pipeline
Tests the 4-stage pipeline: Archivist → Planner → Writer → QA

Features tested:
- V2 spell generation endpoint POST /api/ai/generate-spell-v2
- All 4 guides (shigg, cathleen, katherine, theresa)
- Belief modes (SECULAR, SPIRITUAL, PRACTITIONER)
- QA validation
- Hard limits enforcement
- Persona-lock validation
- Sources citation
- Materials and steps count validation
- GET /api/ai/spell-config-v2 configuration endpoint
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test timeout for long-running spell generation (90 seconds per call)
SPELL_GENERATION_TIMEOUT = 120


class TestSpellConfigV2:
    """Test the V2 configuration endpoint"""
    
    def test_get_spell_config_v2(self):
        """Test GET /api/ai/spell-config-v2 returns configuration correctly"""
        response = requests.get(f"{BASE_URL}/api/ai/spell-config-v2", timeout=30)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        
        # Check belief_modes
        assert "belief_modes" in data, "Missing belief_modes in response"
        assert set(data["belief_modes"]) == {"SECULAR", "SPIRITUAL", "PRACTITIONER"}, \
            f"Expected 3 belief modes, got {data['belief_modes']}"
        
        # Check belief_mode_descriptions
        assert "belief_mode_descriptions" in data, "Missing belief_mode_descriptions"
        for mode in ["SECULAR", "SPIRITUAL", "PRACTITIONER"]:
            assert mode in data["belief_mode_descriptions"], f"Missing description for {mode}"
        
        # Check guides
        assert "guides" in data, "Missing guides in response"
        expected_guides = {"shigg", "cathleen", "katherine", "theresa"}
        assert set(data["guides"]) == expected_guides, f"Expected guides {expected_guides}, got {data['guides']}"
        
        # Check guide_structures
        assert "guide_structures" in data, "Missing guide_structures"
        for guide in expected_guides:
            assert guide in data["guide_structures"], f"Missing structure for {guide}"
        
        # Check tradition_tags
        assert "tradition_tags" in data, "Missing tradition_tags"
        assert len(data["tradition_tags"]) > 0, "tradition_tags should not be empty"
        
        # Check categories_count
        assert "categories_count" in data, "Missing categories_count"
        assert data["categories_count"] > 0, "categories_count should be > 0"
        
        print(f"✓ Config V2 endpoint working: {len(data['guides'])} guides, {len(data['belief_modes'])} belief modes")


class TestSpellGenerationV2:
    """Test V2 spell generation with different guides and belief modes"""
    
    def _create_spell_request(self, persona_id: str, belief_mode: str, user_query: str = None):
        """Helper to create spell request payload"""
        return {
            "spell_spec": {
                "user_query": user_query or f"I need a spell for finding inner peace and calm",
                "desired_feeling": "calm",
                "time": "10_min",
                "anchor_object": "candle",
                "setting": "home_quiet",
                "user_name": "TestSeeker",
                "persona_id": persona_id
            },
            "belief_mode": belief_mode,
            "generate_images": False
        }
    
    def _validate_spell_structure(self, spell: dict, guide_id: str, belief_mode: str):
        """Validate spell output structure and content"""
        errors = []
        
        # Required top-level fields
        required_fields = ["title", "intent", "materials", "steps", "closing", "sources", "ethics_statement"]
        for field in required_fields:
            if not spell.get(field):
                errors.append(f"MISSING_FIELD: {field}")
        
        # Validate materials count (2-7)
        materials = spell.get("materials", [])
        if not (2 <= len(materials) <= 7):
            errors.append(f"MATERIALS_COUNT_INVALID: {len(materials)} (expected 2-7)")
        
        # Validate steps count (3-7)
        steps = spell.get("steps", [])
        if not (3 <= len(steps) <= 7):
            errors.append(f"STEPS_COUNT_INVALID: {len(steps)} (expected 3-7)")
        
        # Validate every step has 'why' field
        for i, step in enumerate(steps):
            if not step.get("why"):
                errors.append(f"STEP_{i+1}_MISSING_WHY")
            elif len(step.get("why", "")) < 20:
                errors.append(f"STEP_{i+1}_WHY_TOO_SHORT: {len(step.get('why', ''))} chars")
        
        # Validate sources count (2-5)
        sources = spell.get("sources", [])
        if not (2 <= len(sources) <= 5):
            errors.append(f"SOURCES_COUNT_INVALID: {len(sources)} (expected 2-5)")
        
        # Validate persona_lock
        persona_lock = spell.get("persona_lock", {})
        if not persona_lock.get("props") or len(persona_lock.get("props", [])) < 2:
            errors.append("PERSONA_LOCK_INSUFFICIENT_PROPS")
        if not persona_lock.get("sensory_cue"):
            errors.append("PERSONA_LOCK_MISSING_SENSORY_CUE")
        if not persona_lock.get("signature_move"):
            errors.append("PERSONA_LOCK_MISSING_SIGNATURE_MOVE")
        
        # Validate closing structure
        closing = spell.get("closing", {})
        closing_fields = ["license_to_depart", "unseal_action", "physical_action"]
        for field in closing_fields:
            if not closing.get(field):
                errors.append(f"CLOSING_MISSING_{field.upper()}")
        
        return errors
    
    def _check_hard_limits(self, spell: dict):
        """Check for hard limit violations"""
        violations = []
        
        # Extract all text
        def extract_text(obj):
            if isinstance(obj, str):
                return obj + " "
            elif isinstance(obj, list):
                return " ".join(extract_text(item) for item in obj)
            elif isinstance(obj, dict):
                return " ".join(extract_text(v) for v in obj.values())
            return ""
        
        text = extract_text(spell).lower()
        
        # Forbidden phrases
        forbidden = [
            "this will definitely", "guaranteed to", "you must do exactly",
            "without this step it won't work", "the spirits demand", "you have no choice",
            "align your vibration", "raise your frequency", "manifest your destiny",
            "the universe will provide"
        ]
        
        for phrase in forbidden:
            if phrase.lower() in text:
                violations.append(f"FORBIDDEN_PHRASE: '{phrase}'")
        
        # Coercion indicators
        coercion = ["make them", "force them", "without their knowledge", 
                    "control their", "bind them to", "against their will"]
        for indicator in coercion:
            if indicator.lower() in text:
                violations.append(f"COERCION_DETECTED: '{indicator}'")
        
        return violations
    
    def test_shigg_secular_spell(self):
        """Test Shigg guide with SECULAR belief mode"""
        print("\n=== Testing Shigg + SECULAR ===")
        
        request_data = self._create_spell_request("shigg", "SECULAR", 
            "I need a calming ritual for anxiety relief")
        
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-v2",
            json=request_data,
            timeout=SPELL_GENERATION_TIMEOUT
        )
        elapsed = time.time() - start_time
        print(f"Response time: {elapsed:.1f}s")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        
        # Validate response structure
        assert "spell" in data, "Missing 'spell' in response"
        assert "archetype" in data, "Missing 'archetype' in response"
        assert "metadata" in data, "Missing 'metadata' in response"
        assert "belief_mode" in data, "Missing 'belief_mode' in response"
        assert "validation" in data, "Missing 'validation' in response"
        
        spell = data["spell"]
        metadata = data["metadata"]
        validation = data["validation"]
        
        # Check belief mode
        assert data["belief_mode"] == "SECULAR", f"Expected SECULAR, got {data['belief_mode']}"
        
        # Check guide ID
        assert spell.get("guide_id") == "shigg" or data["archetype"]["id"] == "shigg", \
            "Guide should be shigg"
        
        # Check metadata stages
        assert "archivist" in metadata.get("stages_completed", []), "Archivist stage not completed"
        assert "planner" in metadata.get("stages_completed", []), "Planner stage not completed"
        assert "writer" in metadata.get("stages_completed", []), "Writer stage not completed"
        assert "qa" in metadata.get("stages_completed", []), "QA stage not completed"
        
        # Validate spell structure
        structure_errors = self._validate_spell_structure(spell, "shigg", "SECULAR")
        assert len(structure_errors) == 0, f"Structure errors: {structure_errors}"
        
        # Check hard limits
        hard_limit_violations = self._check_hard_limits(spell)
        assert len(hard_limit_violations) == 0, f"Hard limit violations: {hard_limit_violations}"
        
        # Check QA passed
        assert validation.get("qa_passed", False) or validation.get("hard_limits_passed", False), \
            "QA validation should pass"
        
        print(f"✓ Shigg SECULAR spell generated successfully")
        print(f"  Title: {spell.get('title', 'N/A')}")
        print(f"  Steps: {len(spell.get('steps', []))}, Materials: {len(spell.get('materials', []))}")
        print(f"  Sources: {len(spell.get('sources', []))}")
    
    def test_cathleen_spiritual_spell(self):
        """Test Cathleen guide with SPIRITUAL belief mode"""
        print("\n=== Testing Cathleen + SPIRITUAL ===")
        
        request_data = self._create_spell_request("cathleen", "SPIRITUAL",
            "I need protection and strength for a difficult conversation")
        
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-v2",
            json=request_data,
            timeout=SPELL_GENERATION_TIMEOUT
        )
        elapsed = time.time() - start_time
        print(f"Response time: {elapsed:.1f}s")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        spell = data["spell"]
        
        # Check belief mode
        assert data["belief_mode"] == "SPIRITUAL", f"Expected SPIRITUAL, got {data['belief_mode']}"
        
        # Validate spell structure
        structure_errors = self._validate_spell_structure(spell, "cathleen", "SPIRITUAL")
        assert len(structure_errors) == 0, f"Structure errors: {structure_errors}"
        
        # Check hard limits
        hard_limit_violations = self._check_hard_limits(spell)
        assert len(hard_limit_violations) == 0, f"Hard limit violations: {hard_limit_violations}"
        
        print(f"✓ Cathleen SPIRITUAL spell generated successfully")
        print(f"  Title: {spell.get('title', 'N/A')}")
        print(f"  Steps: {len(spell.get('steps', []))}, Materials: {len(spell.get('materials', []))}")
    
    def test_katherine_practitioner_spell(self):
        """Test Katherine guide with PRACTITIONER belief mode"""
        print("\n=== Testing Katherine + PRACTITIONER ===")
        
        request_data = self._create_spell_request("katherine", "PRACTITIONER",
            "I need a precise ritual for clarity and discernment")
        
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-v2",
            json=request_data,
            timeout=SPELL_GENERATION_TIMEOUT
        )
        elapsed = time.time() - start_time
        print(f"Response time: {elapsed:.1f}s")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        spell = data["spell"]
        
        # Check belief mode
        assert data["belief_mode"] == "PRACTITIONER", f"Expected PRACTITIONER, got {data['belief_mode']}"
        
        # Validate spell structure
        structure_errors = self._validate_spell_structure(spell, "katherine", "PRACTITIONER")
        assert len(structure_errors) == 0, f"Structure errors: {structure_errors}"
        
        # Check hard limits
        hard_limit_violations = self._check_hard_limits(spell)
        assert len(hard_limit_violations) == 0, f"Hard limit violations: {hard_limit_violations}"
        
        print(f"✓ Katherine PRACTITIONER spell generated successfully")
        print(f"  Title: {spell.get('title', 'N/A')}")
        print(f"  Steps: {len(spell.get('steps', []))}, Materials: {len(spell.get('materials', []))}")
    
    def test_theresa_secular_spell(self):
        """Test Theresa guide with SECULAR belief mode"""
        print("\n=== Testing Theresa + SECULAR ===")
        
        request_data = self._create_spell_request("theresa", "SECULAR",
            "I need to break a negative pattern in my life")
        
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-v2",
            json=request_data,
            timeout=SPELL_GENERATION_TIMEOUT
        )
        elapsed = time.time() - start_time
        print(f"Response time: {elapsed:.1f}s")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        spell = data["spell"]
        
        # Check belief mode
        assert data["belief_mode"] == "SECULAR", f"Expected SECULAR, got {data['belief_mode']}"
        
        # Validate spell structure
        structure_errors = self._validate_spell_structure(spell, "theresa", "SECULAR")
        assert len(structure_errors) == 0, f"Structure errors: {structure_errors}"
        
        # Check hard limits
        hard_limit_violations = self._check_hard_limits(spell)
        assert len(hard_limit_violations) == 0, f"Hard limit violations: {hard_limit_violations}"
        
        print(f"✓ Theresa SECULAR spell generated successfully")
        print(f"  Title: {spell.get('title', 'N/A')}")
        print(f"  Steps: {len(spell.get('steps', []))}, Materials: {len(spell.get('materials', []))}")


class TestBeliefModeValidation:
    """Test belief mode validation and framing"""
    
    def test_invalid_belief_mode_defaults_to_spiritual(self):
        """Test that invalid belief mode defaults to SPIRITUAL"""
        request_data = {
            "spell_spec": {
                "user_query": "A simple calming ritual",
                "desired_feeling": "calm",
                "time": "5_min",
                "anchor_object": "candle",
                "setting": "home_quiet",
                "user_name": "TestSeeker",
                "persona_id": "shigg"
            },
            "belief_mode": "INVALID_MODE",
            "generate_images": False
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-v2",
            json=request_data,
            timeout=SPELL_GENERATION_TIMEOUT
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        # Should default to SPIRITUAL
        assert data["belief_mode"] == "SPIRITUAL", \
            f"Invalid mode should default to SPIRITUAL, got {data['belief_mode']}"
        
        print("✓ Invalid belief mode correctly defaults to SPIRITUAL")


class TestMetadataAndTiming:
    """Test metadata and timing information"""
    
    def test_metadata_contains_timing(self):
        """Test that metadata contains timing information"""
        request_data = {
            "spell_spec": {
                "user_query": "Quick grounding ritual",
                "desired_feeling": "grounded",
                "time": "2_min",
                "anchor_object": "stone",
                "setting": "anywhere",
                "user_name": "TestSeeker",
                "persona_id": "shigg"
            },
            "belief_mode": "SPIRITUAL",
            "generate_images": False
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ai/generate-spell-v2",
            json=request_data,
            timeout=SPELL_GENERATION_TIMEOUT
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        metadata = data.get("metadata", {})
        
        # Check timing info
        timing = metadata.get("timing", {})
        assert "total_ms" in timing, "Missing total_ms in timing"
        assert timing["total_ms"] > 0, "total_ms should be > 0"
        
        # Check stages completed
        stages = metadata.get("stages_completed", [])
        expected_stages = ["archivist", "planner", "writer", "qa"]
        for stage in expected_stages:
            assert stage in stages, f"Missing stage: {stage}"
        
        # Check QA report
        assert "qa_report" in metadata, "Missing qa_report in metadata"
        
        print(f"✓ Metadata contains timing: {timing.get('total_ms', 0)}ms total")
        print(f"  Stages completed: {stages}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
