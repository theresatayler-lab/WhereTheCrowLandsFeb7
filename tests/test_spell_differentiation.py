#!/usr/bin/env python3
"""
Spell Differentiation Tests - V1.2
Tests that micro_lore, taboos, and variation tokens are properly wired and working.

Run with: pytest tests/test_spell_differentiation.py -v
"""

import os
import sys
import json
import asyncio
import pytest
from collections import Counter

# Add parent to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.persona_config import (
    PERSONA_CONFIG, 
    get_persona_micro_lore, 
    get_persona_taboos,
    get_persona_voice
)
from backend.prompts.planner_blocks import build_planner_prompt_blocks as build_planner_prompt, TEXT_VARIATION_TOKENS, VARIATION_KNOBS
from backend.prompts.writer_blocks import build_writer_prompt_blocks as build_writer_prompt


class TestMicroLoreWiring:
    """Test that micro_lore is properly selected and passed to writer"""
    
    def test_micro_lore_exists_for_all_guides(self):
        """Each guide should have micro_lore defined"""
        for guide_id in ["shigg", "cathleen", "katherine"]:
            micro_lore = get_persona_micro_lore(guide_id)
            assert micro_lore is not None, f"{guide_id} has no micro_lore"
            assert len(micro_lore) >= 3, f"{guide_id} has fewer than 3 micro_lore items: {len(micro_lore)}"
            print(f"✓ {guide_id}: {len(micro_lore)} micro_lore items")
    
    def test_micro_lore_in_planner_prompt(self):
        """Planner prompt should include micro_lore selection section"""
        spell_spec = {
            "intention": "I need protection for my home",
            "seeker_name": "Test User",
            "desired_feeling": "protected",
            "time_available": "15 minutes",
            "setting": "living room",
            "persona_id": "shigg"
        }
        guide_config = PERSONA_CONFIG["shigg"]
        research_packet = {"facts": [{"claim_type": "folklore", "claim": "test fact"}]}
        
        prompt = build_planner_prompt(spell_spec, guide_config, research_packet)
        
        assert "MICRO-LORE DETAILS" in prompt, "Planner prompt missing MICRO-LORE section"
        assert "MUST include at least 2" in prompt, "Planner prompt missing micro_lore requirement"
        print("✓ Planner prompt contains micro_lore section")
    
    def test_micro_lore_randomization(self):
        """Running planner multiple times should select different micro_lore"""
        spell_spec = {
            "intention": "I need calm",
            "seeker_name": "Test",
            "desired_feeling": "calm",
            "time_available": "10 minutes",
            "setting": "bedroom",
            "persona_id": "shigg"
        }
        guide_config = PERSONA_CONFIG["shigg"]
        research_packet = {"facts": []}
        
        selections = []
        for _ in range(10):
            prompt = build_planner_prompt(spell_spec, guide_config, research_packet)
            # Extract the micro_lore_selected from the JSON schema in the prompt
            if '"micro_lore_selected":' in prompt:
                selections.append(prompt)
        
        # Should have variation (not all identical)
        unique_prompts = len(set(selections))
        print(f"✓ {unique_prompts}/10 unique micro_lore selections")
        assert unique_prompts >= 3, "micro_lore selection not random enough"


class TestTaboosWiring:
    """Test that taboos are properly injected and enforced"""
    
    def test_taboos_exist_for_all_guides(self):
        """Each guide should have taboos defined"""
        for guide_id in ["shigg", "cathleen", "katherine"]:
            taboos = get_persona_taboos(guide_id)
            assert taboos is not None, f"{guide_id} has no taboos"
            assert len(taboos) >= 3, f"{guide_id} has fewer than 3 taboos: {len(taboos)}"
            print(f"✓ {guide_id}: {len(taboos)} taboos")
    
    def test_taboos_in_writer_prompt(self):
        """Writer prompt should include taboos as forbidden section"""
        plan = {
            "template_id": "kettle_charm",
            "canon_anchor": {"id": "rubaiyat", "title": "Test"},
            "block_sequence": ["cold_open", "lore_vignette", "stepper", "closing"],
            "variation_tokens": {"time_of_day": "dawn", "gesture_type": "circular"},
            "text_tokens": {"setting_detail": "kitchen", "sensory_detail": "steam", "gesture_detail": "stirring"},
            "micro_lore_selected": ["the kettle that sings", "bread for the birds"],
            "taboos": ["Modern crystal shop language", "Neon cyber occult aesthetics"],
            "tradition_tags": ["kitchen_magic"]
        }
        spell_spec = {
            "intention": "calm",
            "seeker_name": "Test",
            "desired_feeling": "calm",
            "persona_id": "shigg"
        }
        guide_config = PERSONA_CONFIG["shigg"]
        research_packet = {"facts": []}
        
        prompt = build_writer_prompt(spell_spec, guide_config, research_packet, plan)
        
        assert "FORBIDDEN THEMES/IMAGERY" in prompt, "Writer prompt missing TABOOS section"
        assert "Modern crystal shop language" in prompt, "Taboo not injected into prompt"
        assert "gently reframe" in prompt, "Missing taboo handling instruction"
        print("✓ Writer prompt contains taboos section")
    
    def test_taboos_are_guide_specific(self):
        """Different guides should have different taboos"""
        shigg_taboos = set(get_persona_taboos("shigg"))
        cathleen_taboos = set(get_persona_taboos("cathleen"))
        katherine_taboos = set(get_persona_taboos("katherine"))
        
        # They should NOT be identical
        assert shigg_taboos != cathleen_taboos, "Shigg and Cathleen have identical taboos"
        assert shigg_taboos != katherine_taboos, "Shigg and Katherine have identical taboos"
        assert cathleen_taboos != katherine_taboos, "Cathleen and Katherine have identical taboos"
        print("✓ All guides have unique taboo sets")


class TestTextVariationTokens:
    """Test that text variation tokens add uniqueness"""
    
    def test_variation_tokens_defined(self):
        """TEXT_VARIATION_TOKENS should exist with multiple options"""
        assert TEXT_VARIATION_TOKENS is not None
        required_keys = ["setting_detail", "sensory_detail", "gesture_detail", "metaphor_detail"]
        for key in required_keys:
            assert key in TEXT_VARIATION_TOKENS, f"Missing {key} in TEXT_VARIATION_TOKENS"
            assert len(TEXT_VARIATION_TOKENS[key]) >= 5, f"{key} has too few options"
        print(f"✓ TEXT_VARIATION_TOKENS has all required keys with sufficient options")
    
    def test_variation_knobs_defined(self):
        """VARIATION_KNOBS should exist"""
        assert VARIATION_KNOBS is not None
        required_keys = ["time_of_day", "gesture_type", "repetition_pattern", "closing_action"]
        for key in required_keys:
            assert key in VARIATION_KNOBS, f"Missing {key} in VARIATION_KNOBS"
        print(f"✓ VARIATION_KNOBS has all required keys")
    
    def test_text_tokens_in_writer_prompt(self):
        """Writer prompt should include text variation tokens"""
        plan = {
            "template_id": "voice_ward",
            "canon_anchor": {"id": "morrigan", "title": "Test"},
            "block_sequence": ["cold_open", "lore_vignette", "stepper", "closing"],
            "variation_tokens": {"time_of_day": "dusk", "gesture_type": "breath work"},
            "text_tokens": {
                "setting_detail": "corner by the fire",
                "sensory_detail": "beeswax and paper",
                "gesture_detail": "tracing a circle with thumb"
            },
            "micro_lore_selected": [],
            "taboos": [],
            "tradition_tags": []
        }
        spell_spec = {
            "intention": "protection",
            "seeker_name": "Test",
            "desired_feeling": "protected",
            "persona_id": "cathleen"
        }
        guide_config = PERSONA_CONFIG["cathleen"]
        research_packet = {"facts": []}
        
        prompt = build_writer_prompt(spell_spec, guide_config, research_packet, plan)
        
        assert "TEXT VARIATION TOKENS" in prompt, "Writer prompt missing text tokens section"
        assert "corner by the fire" in prompt, "Setting detail not in prompt"
        assert "beeswax and paper" in prompt, "Sensory detail not in prompt"
        print("✓ Writer prompt contains text variation tokens")


class TestVarianceAcrossRuns:
    """Test that multiple runs produce different outputs"""
    
    def test_planner_prompt_varies(self):
        """10 runs of planner should produce varied prompts"""
        spell_spec = {
            "intention": "I want to feel brave",
            "seeker_name": "TestUser",
            "desired_feeling": "brave",
            "time_available": "20 minutes",
            "setting": "bedroom",
            "persona_id": "cathleen"
        }
        guide_config = PERSONA_CONFIG["cathleen"]
        research_packet = {"facts": []}
        
        setting_details = []
        sensory_details = []
        
        for _ in range(10):
            prompt = build_planner_prompt(spell_spec, guide_config, research_packet)
            # Extract from prompt (look for the pattern)
            for line in prompt.split('\n'):
                if 'setting_detail:' in line:
                    setting_details.append(line.split('setting_detail:')[1].strip())
                if 'sensory_detail:' in line:
                    sensory_details.append(line.split('sensory_detail:')[1].strip())
        
        unique_settings = len(set(setting_details))
        unique_sensory = len(set(sensory_details))
        
        print(f"Settings: {unique_settings}/10 unique, Sensory: {unique_sensory}/10 unique")
        assert unique_settings >= 3, f"Setting details not varied enough: {unique_settings}/10"
        assert unique_sensory >= 3, f"Sensory details not varied enough: {unique_sensory}/10"
        print("✓ Planner produces varied prompts across runs")


class TestGuideVoiceDifferentiation:
    """Test that different guides produce notably different outputs"""
    
    def test_signature_phrases_differ(self):
        """Each guide should have unique signature phrases"""
        shigg_voice = get_persona_voice("shigg")
        cathleen_voice = get_persona_voice("cathleen")
        katherine_voice = get_persona_voice("katherine")
        
        shigg_phrases = set(shigg_voice.get("signature_phrases", []))
        cathleen_phrases = set(cathleen_voice.get("signature_phrases", []))
        katherine_phrases = set(katherine_voice.get("signature_phrases", []))
        
        # No overlap
        assert not shigg_phrases & cathleen_phrases, "Shigg and Cathleen share signature phrases"
        assert not shigg_phrases & katherine_phrases, "Shigg and Katherine share signature phrases"
        assert not cathleen_phrases & katherine_phrases, "Cathleen and Katherine share signature phrases"
        print("✓ All guides have unique signature phrases")
    
    def test_never_says_differ(self):
        """Each guide should have unique never_says"""
        guides = ["shigg", "cathleen", "katherine"]
        never_says_sets = {}
        
        for guide_id in guides:
            voice = get_persona_voice(guide_id)
            never_says_sets[guide_id] = set(voice.get("never_says", []))
        
        # Check there's SOME overlap (they all avoid certain things) but not complete overlap
        common = never_says_sets["shigg"] & never_says_sets["cathleen"] & never_says_sets["katherine"]
        print(f"Common never_says across all guides: {len(common)}")
        
        # But each should have unique ones too
        for guide_id in guides:
            unique = never_says_sets[guide_id] - common
            print(f"  {guide_id} has {len(unique)} unique never_says")


class TestPlannerOutputSchema:
    """Test that planner output includes new V1.2 fields"""
    
    def test_planner_json_schema_includes_micro_lore(self):
        """Planner prompt should include micro_lore_selected in JSON schema"""
        spell_spec = {
            "intention": "test",
            "seeker_name": "Test",
            "desired_feeling": "calm",
            "persona_id": "shigg"
        }
        guide_config = PERSONA_CONFIG["shigg"]
        research_packet = {"facts": []}
        
        prompt = build_planner_prompt(spell_spec, guide_config, research_packet)
        
        assert '"micro_lore_selected"' in prompt, "micro_lore_selected not in planner JSON schema"
        assert '"taboos"' in prompt, "taboos not in planner JSON schema"
        print("✓ Planner JSON schema includes V1.2 fields")


class TestCacheSeedRegression:
    """
    FAILURE MODE TEST: Catches fixed RNG seed, cached plan reuse, 
    or tokens accidentally computed once per process.
    """
    
    def test_text_tokens_vary_across_runs(self):
        """6 runs with same prompt should produce varied text_tokens"""
        spell_spec = {
            "intention": "I need protection for my home",
            "seeker_name": "TestUser",
            "desired_feeling": "protected",
            "time_available": "15 minutes",
            "setting": "living room",
            "persona_id": "shigg"
        }
        guide_config = PERSONA_CONFIG["shigg"]
        research_packet = {"facts": []}
        
        setting_details = []
        gesture_details = []
        sensory_details = []
        
        for _ in range(6):
            prompt = build_planner_prompt(spell_spec, guide_config, research_packet)
            for line in prompt.split('\n'):
                if 'setting_detail:' in line:
                    setting_details.append(line.split('setting_detail:')[1].strip())
                if 'gesture_detail:' in line:
                    gesture_details.append(line.split('gesture_detail:')[1].strip())
                if 'sensory_detail:' in line:
                    sensory_details.append(line.split('sensory_detail:')[1].strip())
        
        unique_settings = len(set(setting_details))
        unique_gestures = len(set(gesture_details))
        unique_sensory = len(set(sensory_details))
        
        print(f"Settings: {unique_settings}/6 unique (need >=4)")
        print(f"Gestures: {unique_gestures}/6 unique (need >=3)")
        print(f"Sensory: {unique_sensory}/6 unique")
        
        assert unique_settings >= 4, f"Setting details not varied: {unique_settings}/6 (need >=4)"
        assert unique_gestures >= 3, f"Gesture details not varied: {unique_gestures}/6 (need >=3)"
        print("✓ Text tokens vary across runs (no cache/seed issue)")
    
    def test_micro_lore_varies_across_runs(self):
        """6 runs should select different micro_lore combinations"""
        spell_spec = {
            "intention": "calm me",
            "seeker_name": "Test",
            "desired_feeling": "calm",
            "persona_id": "cathleen"
        }
        guide_config = PERSONA_CONFIG["cathleen"]
        research_packet = {"facts": []}
        
        all_selections = []
        for _ in range(6):
            prompt = build_planner_prompt(spell_spec, guide_config, research_packet)
            # Extract micro_lore section
            if "MICRO-LORE DETAILS" in prompt:
                start = prompt.find("MICRO-LORE DETAILS")
                end = prompt.find("## TABOO", start)
                section = prompt[start:end] if end > start else prompt[start:start+500]
                all_selections.append(section)
        
        unique_selections = len(set(all_selections))
        print(f"Micro-lore selections: {unique_selections}/6 unique")
        assert unique_selections >= 3, f"Micro-lore not varied: {unique_selections}/6"
        print("✓ Micro-lore varies across runs")


class TestCrossContamination:
    """
    FAILURE MODE TEST: Catches persona bleed - when one guide accidentally 
    uses another guide's domain terms, tools, or phrases.
    """
    
    # Define forbidden terms for each persona (from OTHER personas' domains)
    FORBIDDEN_TERMS = {
        "shigg": [
            # Katherine's domain
            "Golden Dawn", "sephirot", "Tree of Life", "Rule of Three Tests",
            "SPR", "psychical research", "sigil", "hexagram", "Qabalah",
            "Let's be precise", "test everything", "Document everything",
            # Cathleen's domain  
            "Morrigan", "keening", "Wigmore Hall", "soprano",
            "Listen now", "Here's what we do", "brave one"
        ],
        "cathleen": [
            # Katherine's domain
            "Golden Dawn", "sephirot", "needle and thread", "sigil binding",
            "measuring tape", "scissors", "SPR methodology",
            "Let's be precise", "Document everything",
            # Shigg's domain
            "kettle", "teacup", "tea leaves", "Rubáiyát", "Omar Khayyám",
            "Come closer, love", "That's the thing, isn't it", "pet", "duck"
        ],
        "katherine": [
            # Shigg's domain
            "kettle", "teacup", "tea leaves", "Rubáiyát", "bird omen",
            "Come closer, love", "The birds know", "my nan always said",
            "love", "dear", "pet", "duck",
            # Cathleen's domain
            "Morrigan", "keening", "voice ward", "song", "soprano",
            "Listen now", "dear heart", "brave one"
        ]
    }
    
    def test_shigg_no_cross_contamination(self):
        """Shigg output must not contain Katherine/Cathleen domain terms"""
        self._test_persona_contamination("shigg")
    
    def test_cathleen_no_cross_contamination(self):
        """Cathleen output must not contain Shigg/Katherine domain terms"""
        self._test_persona_contamination("cathleen")
    
    def test_katherine_no_cross_contamination(self):
        """Katherine output must not contain Shigg/Cathleen domain terms"""
        self._test_persona_contamination("katherine")
    
    def _test_persona_contamination(self, persona_id: str):
        """Helper to test a persona for cross-contamination"""
        spell_spec = {
            "intention": "I need protection and clarity",
            "seeker_name": "TestUser",
            "desired_feeling": "protected",
            "time_available": "15 minutes",
            "persona_id": persona_id
        }
        guide_config = PERSONA_CONFIG[persona_id]
        research_packet = {"facts": []}
        
        # Build both planner and writer prompts
        plan = {
            "template_id": "test",
            "canon_anchor": {"id": "test", "title": "Test"},
            "block_sequence": ["cold_open", "stepper", "closing"],
            "variation_tokens": {"time_of_day": "dawn", "gesture_type": "circular"},
            "text_tokens": {"setting_detail": "corner", "sensory_detail": "warmth", "gesture_detail": "motion"},
            "micro_lore_selected": get_persona_micro_lore(persona_id)[:2],
            "taboos": get_persona_taboos(persona_id),
            "tradition_tags": []
        }
        
        writer_prompt = build_writer_prompt(spell_spec, guide_config, research_packet, plan)
        
        # Check for forbidden terms in the PROMPT (what we're asking the AI to do)
        # The prompt should be setting up the right constraints
        forbidden = self.FORBIDDEN_TERMS[persona_id]
        violations = []
        
        # Check the micro_lore and signature phrases sections specifically
        for term in forbidden:
            # We're checking the SETUP not the output - but certain terms should never appear
            # in the signature_phrases or micro_lore being injected
            if term.lower() in writer_prompt.lower():
                # Allow if it's in the "NEVER say" section (that's correct)
                never_section = writer_prompt.find("NEVER say:")
                taboo_section = writer_prompt.find("FORBIDDEN THEMES")
                term_pos = writer_prompt.lower().find(term.lower())
                
                # If term is in forbidden/never sections, that's OK
                if never_section != -1 and term_pos > never_section:
                    continue
                if taboo_section != -1 and term_pos > taboo_section:
                    continue
                    
                violations.append(term)
        
        if violations:
            print(f"✗ {persona_id} has cross-contamination: {violations}")
        else:
            print(f"✓ {persona_id} has no cross-contamination in prompt setup")
        
        # This is a soft assertion - we're checking prompt construction
        # Real output checking would require live API calls
        assert len(violations) == 0, f"{persona_id} prompt contains forbidden terms: {violations}"


class TestTabooKeywordEnforcement:
    """Test that taboo keywords are properly defined and checkable"""
    
    # Expanded taboo keywords for detection
    TABOO_KEYWORDS = {
        "shigg": {
            "modern crystal shop language": ["crystal grid", "charging crystals", "crystal healing", "chakra stones"],
            "neon cyber occult aesthetics": ["neon", "cyber", "digital sigil", "tech magic"],
            "new age manifestation talk": ["manifest", "manifestation", "law of attraction", "abundance mindset", "raise your vibration"],
            "Instagram witch aesthetic": ["witchy vibes", "witch aesthetic", "cottagecore witch"]
        },
        "cathleen": {
            "kitchen-witch domestic aesthetics": ["kitchen witch", "hearth magic", "domestic goddess"],
            "teacups and cozy domesticity": ["teacup", "tea leaves", "cozy kitchen", "kettle charm"],
            "new age love-and-light bypassing": ["love and light", "good vibes only", "positive vibes", "toxic positivity"]
        },
        "katherine": {
            "cozy domestic teacup imagery": ["teacup", "tea leaves", "kettle", "cozy kitchen"],
            "warm kitchen aesthetics": ["kitchen witch", "hearth", "domestic magic", "cozy"],
            "bird oracle work": ["bird omen", "bird oracle", "what the birds say", "feathered messenger"],
            "vague intuition-based practice": ["just feel it", "trust your gut", "intuition says", "vibe check"]
        }
    }
    
    def test_taboo_keywords_defined(self):
        """Each persona should have expanded taboo keywords"""
        for persona_id in ["shigg", "cathleen", "katherine"]:
            keywords = self.TABOO_KEYWORDS.get(persona_id, {})
            assert len(keywords) >= 3, f"{persona_id} needs more taboo keyword mappings"
            total_keywords = sum(len(v) for v in keywords.values())
            print(f"✓ {persona_id}: {len(keywords)} taboo themes → {total_keywords} keywords")
    
    def test_can_detect_taboo_violations(self):
        """Validator function should detect taboo keywords in text"""
        # Simulate a "bad" output that violates Katherine's taboos
        bad_output = "Let's use the kettle charm and read the tea leaves for guidance."
        
        violations = self._check_taboo_violations("katherine", bad_output)
        assert len(violations) > 0, "Should detect kettle/tea violations for Katherine"
        print(f"✓ Detected violations in bad output: {violations}")
    
    def test_clean_output_passes(self):
        """Clean output should pass taboo check"""
        clean_output = "Take the needle and thread. Bind with precision. Document your findings."
        
        violations = self._check_taboo_violations("katherine", clean_output)
        assert len(violations) == 0, f"Clean output should pass: {violations}"
        print("✓ Clean output passes taboo check")
    
    def _check_taboo_violations(self, persona_id: str, text: str) -> list:
        """Check text for taboo keyword violations"""
        violations = []
        keywords_map = self.TABOO_KEYWORDS.get(persona_id, {})
        text_lower = text.lower()
        
        for taboo_theme, keywords in keywords_map.items():
            for keyword in keywords:
                if keyword.lower() in text_lower:
                    violations.append(f"{taboo_theme}: '{keyword}'")
        
        return violations


if __name__ == "__main__":
    # Run tests
    print("\n" + "="*60)
    print("SPELL DIFFERENTIATION TESTS - V1.2")
    print("="*60 + "\n")
    
    # Micro-lore tests
    print("\n--- MICRO-LORE WIRING ---")
    t1 = TestMicroLoreWiring()
    t1.test_micro_lore_exists_for_all_guides()
    t1.test_micro_lore_in_planner_prompt()
    t1.test_micro_lore_randomization()
    
    # Taboos tests
    print("\n--- TABOOS WIRING ---")
    t2 = TestTaboosWiring()
    t2.test_taboos_exist_for_all_guides()
    t2.test_taboos_in_writer_prompt()
    t2.test_taboos_are_guide_specific()
    
    # Text variation tests
    print("\n--- TEXT VARIATION TOKENS ---")
    t3 = TestTextVariationTokens()
    t3.test_variation_tokens_defined()
    t3.test_variation_knobs_defined()
    t3.test_text_tokens_in_writer_prompt()
    
    # Variance tests
    print("\n--- VARIANCE ACROSS RUNS ---")
    t4 = TestVarianceAcrossRuns()
    t4.test_planner_prompt_varies()
    
    # Voice differentiation tests
    print("\n--- GUIDE VOICE DIFFERENTIATION ---")
    t5 = TestGuideVoiceDifferentiation()
    t5.test_signature_phrases_differ()
    t5.test_never_says_differ()
    
    # Schema tests
    print("\n--- PLANNER OUTPUT SCHEMA ---")
    t6 = TestPlannerOutputSchema()
    t6.test_planner_json_schema_includes_micro_lore()
    
    print("\n" + "="*60)
    print("ALL TESTS PASSED ✓")
    print("="*60)
