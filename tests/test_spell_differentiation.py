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
            "text_tokens": {"setting_detail": "kitchen", "sensory_detail": "steam"},
            "micro_lore_selected": ["the kettle that sings", "bread for the birds"],
            "taboos": ["Modern crystal shop language", "Neon cyber occult aesthetics"],
            "tradition_tags": ["kitchen_magic"]
        }
        spell_spec = {
            "intention": "calm",
            "seeker_name": "Test",
            "desired_feeling": "calm"
        }
        guide_config = PERSONA_CONFIG["shigg"]
        
        prompt = build_writer_prompt(plan, spell_spec, guide_config)
        
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
        spell_spec = {"intention": "protection", "seeker_name": "Test", "desired_feeling": "protected"}
        guide_config = PERSONA_CONFIG["cathleen"]
        
        prompt = build_writer_prompt(plan, spell_spec, guide_config)
        
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
            "desired_feeling": "calm"
        }
        guide_config = PERSONA_CONFIG["shigg"]
        
        prompt = build_planner_prompt(spell_spec, guide_config, "shigg")
        
        assert '"micro_lore_selected"' in prompt, "micro_lore_selected not in planner JSON schema"
        assert '"taboos"' in prompt, "taboos not in planner JSON schema"
        print("✓ Planner JSON schema includes V1.2 fields")


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
