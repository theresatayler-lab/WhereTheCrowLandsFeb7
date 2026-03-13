"""
Tests for Emotional Need Clusters enhancements and Bibliomancy routing.
Run: cd /app/backend && python3 -m pytest tests/test_bibliomancy.py -v
"""
import pytest
import sys
sys.path.insert(0, '/app/backend')

from prompts.writer_blocks import (
    EMOTIONAL_NEED_CLUSTERS, CLUSTER_PRIORITY,
    get_emotional_need_cluster, get_reality_check_for_guide,
    BIBLIOMANCY_BOOK_TEMPLATE, BIBLIOMANCY_SHUFFLE_TEMPLATE,
    BIBLIOMANCY_AFFINITY_KEYWORDS
)
from prompts.planner_blocks import (
    get_working_type, get_working_type_with_bibliomancy,
    get_bibliomancy_affinity, WORKING_TYPES
)


class TestEmotionalNeedClusters:
    """Tests for the enhanced emotional need cluster system."""
    
    def test_prefix_matching_isolated(self):
        r = get_emotional_need_cluster('I feel so isolated')
        assert r is not None
        # 'isolat*' is a prefix trigger for heartbreak_loneliness
    
    def test_prefix_matching_harassed(self):
        r = get_emotional_need_cluster('I am being harassed')
        assert r is not None
        assert r['cluster_id'] == 'protection_fear'
    
    def test_prefix_matching_bullying(self):
        r = get_emotional_need_cluster('the bullying is getting worse')
        assert r['cluster_id'] == 'protection_fear'
    
    def test_prefix_matching_intimidated(self):
        r = get_emotional_need_cluster('I feel intimidated')
        assert r['cluster_id'] == 'protection_fear'
    
    def test_tiebreak_grief_over_heartbreak(self):
        r = get_emotional_need_cluster('I am grieving and heartbroken')
        assert r['cluster_id'] == 'grief_loss'
    
    def test_tiebreak_protection_over_heartbreak(self):
        r = get_emotional_need_cluster('I feel scared and abandoned')
        assert r['cluster_id'] == 'protection_fear'
    
    def test_new_trigger_miscarriage(self):
        r = get_emotional_need_cluster('since the miscarriage')
        assert r['cluster_id'] == 'grief_loss'
    
    def test_new_trigger_numb_hollow(self):
        r = get_emotional_need_cluster('I feel numb and hollow')
        assert r['cluster_id'] == 'burnout_exhaustion'
    
    def test_reality_check_format(self):
        r = get_emotional_need_cluster('I feel exhausted')
        check = get_reality_check_for_guide(r, 'shigg')
        assert 'EMOTIONAL REALITY CHECK' in check
        assert '========' in check
        assert 'FOR SHIGG:' in check
    
    def test_no_match_returns_none(self):
        r = get_emotional_need_cluster('I want to learn a new hobby')
        assert r is None
    
    def test_priority_order(self):
        assert CLUSTER_PRIORITY == [
            "grief_loss", "protection_fear", "heartbreak_loneliness",
            "burnout_exhaustion", "money_anxiety"
        ]


class TestBibliomancyRouting:
    """Tests for the bibliomancy technique selection and routing."""
    
    def test_shigg_has_bibliomancy_book(self):
        assert 'bibliomancy_book' in WORKING_TYPES['shigg']
    
    def test_theresa_has_bibliomancy_shuffle(self):
        assert 'bibliomancy_shuffle' in WORKING_TYPES['theresa']
    
    def test_cathleen_no_bibliomancy(self):
        aff = get_bibliomancy_affinity('cathleen', 'I need clarity')
        assert aff == 0.0
    
    def test_shigg_affinity_high(self):
        aff = get_bibliomancy_affinity('shigg', 'I need clarity and feel lost')
        assert aff >= 0.5
    
    def test_routing_to_bibliomancy(self):
        wt = get_working_type_with_bibliomancy('shigg', 'I feel lost and need perspective')
        assert wt.get('name') == 'Book Bibliomancy'
    
    def test_protection_still_wins(self):
        wt = get_working_type_with_bibliomancy('shigg', 'I need protection from a toxic person')
        assert 'Protection' in wt.get('name', '')
    
    def test_theresa_shuffle_routing(self):
        wt = get_working_type_with_bibliomancy('theresa', "I need clarity and can't decide")
        assert wt.get('name') == 'Shuffle Oracle'
    
    def test_templates_exist(self):
        assert BIBLIOMANCY_BOOK_TEMPLATE['block_type'] == 'bibliomancy_book'
        assert BIBLIOMANCY_SHUFFLE_TEMPLATE['block_type'] == 'bibliomancy_shuffle'
    
    def test_template_sections(self):
        assert 'historical_grounding' in BIBLIOMANCY_BOOK_TEMPLATE['sections']
        assert 'tradition_bridge' in BIBLIOMANCY_SHUFFLE_TEMPLATE['sections']
