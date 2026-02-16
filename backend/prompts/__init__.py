# Crowlands Production Prompt Pack
# Version 2.0 - Archivist → Planner → Writer → QA Pipeline
# Version 2.1 - Blocks-based spell experience

from .archivist import ARCHIVIST_SYSTEM_PROMPT, build_archivist_prompt, validate_archivist_output
from .planner import build_planner_prompt_v2, validate_planner_output
from .writer import build_writer_prompt_v2, WRITER_CONTRACTS, validate_writer_output
from .qa import build_qa_prompt, QA_RULES, run_qa_validation
from .canon import CANON_TAXONOMY, get_canon_context, get_tradition_tags
from .hard_limits import HARD_LIMITS, validate_hard_limits
from .belief_modes import BELIEF_MODES, get_belief_framing
from .pipeline import SpellGenerationPipeline, generate_spell_v2

# Blocks-based system (V2.1)
from .planner_blocks import (
    build_planner_prompt_blocks,
    validate_planner_blocks_output,
    get_block_template,
    get_canon_anchors,
    select_working_type,
    BLOCK_TEMPLATES,
    CANON_ANCHORS,
    WORKING_TYPES
)
from .writer_blocks import build_writer_prompt_blocks, validate_writer_blocks_output
from .qa_blocks import run_qa_blocks_validation
from .pipeline_blocks import BlocksSpellPipeline, generate_spell_blocks, transform_blocks_to_array

__all__ = [
    # Archivist (Stage 1)
    'ARCHIVIST_SYSTEM_PROMPT',
    'build_archivist_prompt',
    'validate_archivist_output',
    
    # Planner (Stage 2) - V2
    'build_planner_prompt_v2',
    'validate_planner_output',
    
    # Planner (Stage 2) - Blocks
    'build_planner_prompt_blocks',
    'validate_planner_blocks_output',
    'get_block_template',
    'get_canon_anchors',
    'BLOCK_TEMPLATES',
    'CANON_ANCHORS',
    'WORKING_TYPES',
    'select_working_type',
    
    # Writer (Stage 3) - V2
    'build_writer_prompt_v2',
    'WRITER_CONTRACTS',
    'validate_writer_output',
    
    # Writer (Stage 3) - Blocks
    'build_writer_prompt_blocks',
    'validate_writer_blocks_output',
    
    # QA (Stage 4) - V2
    'build_qa_prompt',
    'QA_RULES',
    'run_qa_validation',
    
    # QA (Stage 4) - Blocks
    'run_qa_blocks_validation',
    
    # Canon & Taxonomy
    'CANON_TAXONOMY',
    'get_canon_context',
    'get_tradition_tags',
    
    # Hard Limits
    'HARD_LIMITS',
    'validate_hard_limits',
    
    # Belief Modes
    'BELIEF_MODES',
    'get_belief_framing',
    
    # Pipeline - V2
    'SpellGenerationPipeline',
    'generate_spell_v2',
    
    # Pipeline - Blocks
    'BlocksSpellPipeline',
    'generate_spell_blocks',
    'transform_blocks_to_array'
]
