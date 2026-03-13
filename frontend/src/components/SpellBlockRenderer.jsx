// SpellBlockRenderer - Renders blocks as flowing narrative grimoire page
// Elegant vintage book aesthetic inspired by astrology guides

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '../lib/utils';

// Ornate section divider - elegant diamond pattern like astrology guides
const OrnateSectionDivider = () => (
  <div className="grimoire-divider my-6">
    <div className="grimoire-divider-symbol" />
  </div>
);

// Simple elegant divider for minor breaks
const SubtleDivider = () => (
  <div className="flex items-center justify-center py-3 opacity-50">
    <div className="h-px w-12 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
  </div>
);

// Section header with elegant uppercase styling
const SectionLabel = ({ icon, label }) => (
  <div className="grimoire-section-header flex items-center gap-2">
    {icon && (
      <img src={icon} alt="" className="w-4 h-4 opacity-60" />
    )}
    <span>{label}</span>
    <div className="flex-1" />
  </div>
);

// Main Block Renderer Component
export const SpellBlockRenderer = ({
  spell,
  archetypeStyle = {},
  onLogUpdate = () => {},
  initialLog = {}
}) => {
  const blocks = spell?.blocks || [];
  const personaLock = spell?.persona_lock || {};
  const canonAnchor = spell?.canon_anchor || {};

  return (
    <div className="spell-content space-y-1" data-testid="spell-block-renderer">
      {/* Persona Lock Header - elegant presentation */}
      {personaLock.props && (
        <div className="text-center mb-6 pb-4 border-b border-gold/20">
          <p className="font-crimson text-navy-dark/70 italic text-sm">
            {personaLock.props.join(' · ')}{personaLock.sensory_cue ? ` · ${personaLock.sensory_cue}` : ''}
          </p>
        </div>
      )}

      {/* Render all blocks as flowing narrative */}
      {blocks.map((block, index) => (
        <React.Fragment key={block.block_id || index}>
          {index > 0 && block.block_type !== 'safety_note' && shouldShowDivider(blocks[index-1], block) && (
            <OrnateSectionDivider />
          )}
          <NarrativeBlock block={block} archetypeStyle={archetypeStyle} />
        </React.Fragment>
      ))}
    </div>
  );
};

// Determine if we should show a major divider between blocks
const shouldShowDivider = (prevBlock, currentBlock) => {
  const majorTypes = ['materials', 'stepper', 'closing', 'lore_vignette'];
  return majorTypes.includes(currentBlock.block_type) || majorTypes.includes(prevBlock?.block_type);
};

// Single narrative block - wrapped in spell-block-frame for intricacy
const NarrativeBlock = ({ block, archetypeStyle }) => {
  const bt = block.block_type;
  const c = block.content || {};

  // Get the block content based on type
  let blockContent = null;
  
  if (bt === 'cold_open') blockContent = <ColdOpen c={c} style={archetypeStyle} />;
  else if (bt === 'materials') blockContent = <Materials c={c} style={archetypeStyle} />;
  else if (bt === 'stepper') blockContent = <Stepper c={c} style={archetypeStyle} />;
  else if (bt === 'lore_vignette') blockContent = <LoreVignette c={c} style={archetypeStyle} />;
  else if (bt === 'choice') blockContent = <Choice c={c} style={archetypeStyle} />;
  else if (bt === 'closing') blockContent = <Closing c={c} style={archetypeStyle} />;
  else if (bt === 'reflection') blockContent = <Reflection c={c} />;
  else if (bt === 'journal_prompt') blockContent = <Reflection c={c} />;
  else if (bt === 'bird_oracle') blockContent = <BirdOracle c={c} style={archetypeStyle} />;
  else if (bt === 'ward') blockContent = <Ward c={c} style={archetypeStyle} />;
  else if (bt === 'song_prompt') blockContent = <SongPrompt c={c} style={archetypeStyle} />;
  else if (bt === 'evidence_card') blockContent = <EvidenceCard c={c} />;
  else if (bt === 'safety_note') blockContent = <SafetyNote c={c} />;
  else if (bt === 'poetry_reading') blockContent = <PoetryReading c={c} style={archetypeStyle} />;
  else if (bt === 'observation_task') blockContent = <ObservationTask c={c} />;
  else if (bt === 'further_reading') blockContent = <FurtherReading c={c} style={archetypeStyle} />;

  if (!blockContent) return null;

  // Wrap major blocks in spell-block-frame for visual intricacy
  const majorBlockTypes = ['materials', 'stepper', 'closing', 'ward', 'evidence_card', 'further_reading'];
  const shouldFrame = majorBlockTypes.includes(bt);

  if (shouldFrame) {
    return (
      <section className="spell-block-frame p-4 sm:p-5 my-4">
        {blockContent}
      </section>
    );
  }

  return blockContent;
};

// === NARRATIVE BLOCK COMPONENTS ===

// Cold Open - the guide's opening, elegant grimoire-style quote
const ColdOpen = ({ c, style }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8 py-4"
    data-testid="cold-open-block"
  >
    {c.greeting && (
      <div className="grimoire-quote">
        <p className="grimoire-body">
          {c.greeting}
        </p>
      </div>
    )}
    {c.scene_setting && (
      <p className="grimoire-body text-center opacity-80 mt-4">
        {c.scene_setting}
      </p>
    )}
    {c.hook && (
      <p className="grimoire-body text-center mt-4 text-lg">
        {c.hook}
      </p>
    )}
  </motion.div>
);

// Materials - elegant ingredient list
const Materials = ({ c, style }) => {
  // Map material names to available anchor icons
  const getIconForMaterial = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('candle')) return '/icons/anchors/gold/anchor-candle.png';
    if (lower.includes('herb') || lower.includes('rosemary') || lower.includes('sage') || lower.includes('lavender')) return '/icons/anchors/gold/anchor-herb.png';
    if (lower.includes('thread') || lower.includes('string') || lower.includes('cord')) return '/icons/anchors/gold/anchor-thread.png';
    if (lower.includes('salt')) return '/icons/anchors/gold/anchor-salt.png';
    if (lower.includes('feather')) return '/icons/anchors/gold/anchor-feather.png';
    if (lower.includes('mirror')) return '/icons/anchors/gold/anchor-mirror.png';
    if (lower.includes('letter') || lower.includes('paper') || lower.includes('note')) return '/icons/anchors/gold/anchor-letter.png';
    if (lower.includes('photo') || lower.includes('picture') || lower.includes('image')) return '/icons/anchors/gold/anchor-photograph.png';
    if (lower.includes('heirloom') || lower.includes('jewelry') || lower.includes('ring') || lower.includes('necklace')) return '/icons/anchors/gold/anchor-heirloom.png';
    if (lower.includes('crystal') || lower.includes('stone') || lower.includes('gem')) return '/icons/ui/gold/icon-crystal-ball.png';
    if (lower.includes('tea') || lower.includes('cup') || lower.includes('mug')) return '/icons/anchors/gold/anchor-tea.png';
    if (lower.includes('bell')) return '/icons/anchors/gold/anchor-bell.png';
    if (lower.includes('bird') || lower.includes('crow') || lower.includes('raven')) return '/icons/anchors/gold/anchor-bird.png';
    if (lower.includes('bread') || lower.includes('food') || lower.includes('offering')) return '/icons/anchors/gold/anchor-bread.png';
    if (lower.includes('compass') || lower.includes('direction')) return '/icons/anchors/gold/anchor-compass.png';
    if (lower.includes('map')) return '/icons/anchors/gold/anchor-map.png';
    if (lower.includes('notebook') || lower.includes('journal') || lower.includes('diary')) return '/icons/anchors/gold/anchor-notebook.png';
    if (lower.includes('scissors') || lower.includes('cut')) return '/icons/anchors/gold/anchor-scissors.png';
    return null;
  };

  return (
    <div className="py-6" data-testid="materials-block">
      <SectionLabel icon="/icons/anchors/gold/anchor-herb.png" label="What's Getting Gathered" />
      
      <ul className="grimoire-list mt-4">
        {c.items?.map((item, i) => (
          <li key={i} className="!pl-0 !p-2">
            <div className="flex items-start gap-3">
              {getIconForMaterial(item.name) ? (
                <img src={getIconForMaterial(item.name)} alt="" className="w-5 h-5 opacity-60 flex-shrink-0 mt-0.5" />
              ) : (
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                  <div className="w-2 h-2 rotate-45 border border-gold/50" />
                </div>
              )}
              <div>
                <span className="font-cinzel text-sm text-[#2a1f14]">{item.name}</span>
                {item.purpose && (
                  <span className="text-sm opacity-70"> — {item.purpose}</span>
                )}
                {item.substitution && (
                  <p className="text-xs italic opacity-60 mt-0.5">
                    Alternative: {item.substitution}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      {c.gathering_note && (
        <p className="grimoire-body text-sm text-center opacity-70 mt-4 italic">
          {c.gathering_note}
        </p>
      )}
    </div>
  );
};

// Stepper - elegant numbered action steps
const Stepper = ({ c, style }) => (
  <div className="py-6" data-testid="stepper-block">
    <SectionLabel icon="/icons/ui/gold/icon-grimoire.png" label="During This Working" />
    
    <ol className="grimoire-numbered-list mt-4">
      {c.steps?.map((step, index) => (
        <motion.li 
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div>
            {step.title && (
              <span className="font-cinzel text-sm text-crimson/80 mr-2">
                {step.title}:
              </span>
            )}
            <span className="grimoire-body">
              {step.action || step.instruction || step.text}
            </span>

            {/* Spoken words as elegant quote */}
            {step.spoken_words && (
              <blockquote className="grimoire-quote my-3 text-sm">
                {step.spoken_words}
              </blockquote>
            )}

            {/* Why - explanation */}
            {step.why && (
              <p className="text-sm opacity-70 mt-2 italic pl-4 border-l border-gold/20">
                {step.why}
              </p>
            )}

            {step.duration_hint && (
              <p className="text-xs opacity-50 mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {step.duration_hint}
              </p>
            )}
          </div>
        </motion.li>
      ))}
    </ol>

    {c.completion_message && (
      <div className="grimoire-quote mt-8 text-center">
        {c.completion_message}
      </div>
    )}
  </div>
);

// Lore Vignette - embedded historical narrative with elegant framing
const LoreVignette = ({ c, style }) => (
  <div className="py-6 my-2" data-testid="lore-vignette-block">
    <div className="relative px-8 py-6 rounded-2xl" style={{ background: 'rgba(200, 164, 77, 0.04)' }}>
      {/* Decorative corner accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-gold/25" />
      <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-gold/25" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-gold/25" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-gold/25" />
      
      {(c.era || c.tradition || c.title) && (
        <p className="font-cinzel text-[10px] text-gold-dark/60 uppercase tracking-[0.2em] mb-4 text-center">
          {c.era && `${c.era} · `}{c.tradition || c.title}
        </p>
      )}
      <p className="grimoire-body text-center leading-loose">
        {c.narrative}
      </p>
      {c.relevance_to_working && (
        <p className="grimoire-body text-sm opacity-80 mt-4 text-center">{c.relevance_to_working}</p>
      )}
      {c.source_connection && (
        <p className="text-xs text-gold-dark/50 mt-4 text-center tracking-wide">— {c.source_connection}</p>
      )}
    </div>
  </div>
);

// Choice - subtle inline options
const Choice = ({ c, style }) => {
  const [selected, setSelected] = useState(null);
  return (
    <div data-testid="choice-block">
      <p className="font-crimson-text text-navy-dark text-base leading-relaxed mb-3">{c.prompt}</p>
      <div className="space-y-2">
        {c.options?.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={cn(
              "w-full text-left p-3 rounded transition-all font-crimson-text text-sm",
              selected === opt.id
                ? "bg-gold/10 border border-gold/40 text-navy-dark"
                : "bg-gold/5 border border-gold/20 text-navy-dark/80 hover:bg-gold/10"
            )}
          >
            <span className="font-semibold">{opt.label}</span>
            {opt.description && <span className="text-navy-dark/60"> — {opt.description}</span>}
          </button>
        ))}
      </div>
      {c.consequence_hint && (
        <p className="font-crimson-text text-sm italic text-navy-dark/60 mt-2">"{c.consequence_hint}"</p>
      )}
    </div>
  );
};

// Closing - the guide's farewell, elegant affirmation styling
const Closing = ({ c, style }) => (
  <div className="py-6" data-testid="closing-block">
    <SectionLabel icon="/icons/anchors/gold/anchor-feather.png" label="Closing the Circle" />
    
    <div className="mt-6 text-center space-y-6">
      {c.license_to_depart && (
        <p className="grimoire-body text-center leading-relaxed">
          {c.license_to_depart}
        </p>
      )}
      {c.grounding_action && (
        <p className="grimoire-body text-center opacity-90">{c.grounding_action}</p>
      )}
      {c.empowerment_line && (
        <div className="grimoire-quote mx-auto max-w-lg">
          <p className="font-cinzel text-lg tracking-wide text-[#2a1f14]">
            {c.empowerment_line}
          </p>
        </div>
      )}
      {c.next_steps_hint && (
        <div className="grimoire-practice-box max-w-md mx-auto">
          <p className="grimoire-practice-label">In the Next 24 Hours</p>
          <p className="grimoire-body text-sm">
            {c.next_steps_hint}
          </p>
        </div>
      )}
    </div>
  </div>
);

// Reflection / Journal - elegant prompt list like shadow work prompts
const Reflection = ({ c }) => (
  <div className="py-6" data-testid="reflection-block">
    <SectionLabel icon="/icons/anchors/gold/anchor-notebook.png" label="Shadow Work Prompts" />
    
    {c.guide_note && (
      <p className="grimoire-body text-center opacity-80 mb-6">"{c.guide_note}"</p>
    )}
    {c.prompts?.length > 0 && (
      <ul className="grimoire-list">
        {c.prompts.map((prompt, i) => (
          <li key={i}>{prompt}</li>
        ))}
      </ul>
    )}
    
    {/* Notes section for journaling */}
    <div className="grimoire-notes mt-6">
      <p className="grimoire-notes-label">Notes</p>
    </div>
  </div>
);

// Bird Oracle - mystical message with decorative framing
const BirdOracle = ({ c, style }) => (
  <div className="py-4" data-testid="bird-oracle-block">
    <div className="relative text-center py-6 px-4">
      <img 
        src="/icons/anchors/gold/anchor-bird.png" 
        alt="" 
        className="w-12 h-12 mx-auto mb-3 opacity-60"
      />
      <p className="font-cinzel text-sm text-gold-dark/70 tracking-[0.15em] uppercase mb-2">
        {c.bird || c.bird_name || 'The Bird Oracle'}
      </p>
      <blockquote className="font-crimson text-navy-dark/80 italic text-lg leading-relaxed">
        "{c.message || c.oracle_message}"
      </blockquote>
      {c.observation_prompt && (
        <p className="font-crimson text-navy-dark/60 text-sm mt-3">{c.observation_prompt}</p>
      )}
    </div>
  </div>
);

// Ward - protection instruction as narrative
const Ward = ({ c, style }) => (
  <div data-testid="ward-block">
    {c.ward_name && (
      <p className="font-cinzel text-sm text-navy-dark/60 tracking-wide mb-2">{c.ward_name}</p>
    )}
    {c.protects_against && (
      <p className="font-crimson-text text-navy-dark/70 text-sm italic mb-2">{c.protects_against}</p>
    )}
    {c.creation_steps && Array.isArray(c.creation_steps) && c.creation_steps.map((step, i) => (
      <p key={i} className="font-crimson-text text-navy-dark leading-relaxed mb-2">{step}</p>
    ))}
    {c.activation_phrase && (
      <blockquote className="font-crimson-text text-navy-dark italic text-center my-3 py-2 border-y border-gold/30">
        "{c.activation_phrase}"
      </blockquote>
    )}
    {c.talisman_option && (
      <p className="font-crimson-text text-navy-dark/60 text-sm mt-2">{c.talisman_option}</p>
    )}
  </div>
);

// Song Prompt - voice instruction as flowing text
const SongPrompt = ({ c, style }) => (
  <div data-testid="song-prompt-block">
    <p className="font-crimson-text text-navy-dark leading-relaxed">{c.instruction}</p>
    {(c.phrase || c.words_optional) && (
      <blockquote className="font-crimson-text italic text-navy-dark/80 my-2 pl-4 border-l-2 border-gold/40">
        "{c.phrase || c.words_optional}"
      </blockquote>
    )}
    {c.duration && (
      <p className="text-navy-dark/50 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {c.duration}</p>
    )}
    {(c.why_this_sound || c.purpose) && (
      <p className="font-crimson-text text-navy-dark/70 text-sm italic mt-1">{c.why_this_sound || c.purpose}</p>
    )}
  </div>
);

// Evidence Card - Theresa's research findings as prose
const EvidenceCard = ({ c }) => (
  <div data-testid="evidence-card-block">
    {c.known?.length > 0 && (
      <div className="mb-3">
        <p className="font-cinzel text-xs text-navy-dark/50 uppercase tracking-widest mb-1">What the records show</p>
        {c.known.map((item, i) => (
          <p key={i} className="font-crimson-text text-navy-dark/80 leading-relaxed">{item}</p>
        ))}
      </div>
    )}
    {c.likely?.length > 0 && (
      <div className="mb-3">
        <p className="font-cinzel text-xs text-navy-dark/50 uppercase tracking-widest mb-1">What the patterns suggest</p>
        {c.likely.map((item, i) => (
          <p key={i} className="font-crimson-text text-navy-dark/70 leading-relaxed">{item}</p>
        ))}
      </div>
    )}
    {c.lore?.length > 0 && (
      <div>
        <p className="font-cinzel text-xs text-navy-dark/50 uppercase tracking-widest mb-1">What the stories tell</p>
        {c.lore.map((item, i) => (
          <p key={i} className="font-crimson-text text-navy-dark/70 italic leading-relaxed">{item}</p>
        ))}
      </div>
    )}
    {c.pattern_note && (
      <p className="font-crimson-text text-sm italic text-navy-dark/60 mt-2">"{c.pattern_note}"</p>
    )}
  </div>
);

// Safety Note - minimal but clear
const SafetyNote = ({ c }) => (
  <div className="py-2 px-4 border-l-2 border-gold/60 bg-gold/5 rounded-r" data-testid="safety-note-block">
    <p className="font-crimson-text text-sm text-navy-dark/80">{c.warning || c.note}</p>
    {c.when_to_stop && (
      <p className="font-crimson-text text-xs text-navy-dark/70 mt-1">When to pause: {c.when_to_stop}</p>
    )}
    {c.consent_check && (
      <p className="font-crimson-text text-xs text-navy-dark/60 italic mt-1">{c.consent_check}</p>
    )}
  </div>
);

// Poetry Reading - poem as flowing text
const PoetryReading = ({ c, style }) => (
  <div data-testid="poetry-reading-block">
    {c.poem_title && (
      <p className="font-cinzel text-sm text-navy-dark/60 tracking-wide mb-1">{c.poem_title}</p>
    )}
    {c.poem_author && (
      <p className="text-xs text-navy-dark/50 italic mb-2">by {c.poem_author}</p>
    )}
    {c.poem_text && (
      <blockquote className="font-crimson-text text-navy-dark italic leading-relaxed whitespace-pre-line pl-4 border-l-2 border-gold/30">
        {c.poem_text}
      </blockquote>
    )}
    {c.guide_commentary && (
      <p className="font-crimson-text text-navy-dark/70 text-sm mt-3">{c.guide_commentary}</p>
    )}
    {c.reading_instruction && (
      <p className="font-crimson-text text-navy-dark/60 text-sm mt-1 italic">{c.reading_instruction}</p>
    )}
  </div>
);

// Observation Task - simple instruction
const ObservationTask = ({ c }) => (
  <div data-testid="observation-task-block">
    <p className="font-crimson-text text-navy-dark leading-relaxed">{c.task_description}</p>
    {c.location_suggestion && (
      <p className="font-crimson-text text-navy-dark/70 text-sm mt-1">Where: {c.location_suggestion}</p>
    )}
    {c.what_to_notice && (
      <p className="font-crimson-text text-navy-dark/70 text-sm mt-1">Notice: {c.what_to_notice}</p>
    )}
    {c.recording_prompt && (
      <p className="font-crimson-text text-navy-dark/60 text-sm italic mt-1">{c.recording_prompt}</p>
    )}
  </div>
);

// Further Reading - simple list of recommendations
const FurtherReading = ({ c, style }) => (
  <div data-testid="further-reading-block">
    <p className="font-cinzel text-xs text-navy-dark/50 uppercase tracking-widest mb-2">For further reading</p>
    {c.recommendations?.map((rec, i) => (
      <div key={i} className="mb-2">
        <p className="font-crimson-text text-navy-dark">
          <span className="font-semibold">{rec.title}</span>
          {rec.author && <span className="text-navy-dark/70"> by {rec.author}</span>}
        </p>
        {rec.guide_note && (
          <p className="font-crimson-text text-navy-dark/70 text-sm italic">{rec.guide_note}</p>
        )}
        {rec.learn_more_url && (
          <a href={rec.learn_more_url} target="_blank" rel="noopener noreferrer"
            className="text-crimson hover:text-crimson-bright text-sm underline">
            Learn more
          </a>
        )}
      </div>
    ))}
    {c.reading_ritual && (
      <p className="font-crimson-text text-navy-dark/60 text-sm italic mt-2">{c.reading_ritual}</p>
    )}
  </div>
);

export default SpellBlockRenderer;
