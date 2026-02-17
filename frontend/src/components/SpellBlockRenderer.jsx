// SpellBlockRenderer - Renders blocks as flowing narrative grimoire page
// Vintage book aesthetic with ornate dividers and proper typography

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '../lib/utils';

// Ornate section divider - uses the generated decorative image
const OrnateSectionDivider = () => (
  <div className="flex items-center justify-center py-6 my-2">
    <img 
      src="/images/ornaments/divider-ornate-horizontal.png" 
      alt="" 
      className="h-4 w-auto opacity-60"
      style={{ maxWidth: '200px' }}
    />
  </div>
);

// Simple elegant divider for minor breaks
const SubtleDivider = () => (
  <div className="flex items-center justify-center py-4 opacity-40">
    <div className="h-px w-8 bg-amber-700" />
    <div className="mx-2 w-1.5 h-1.5 rotate-45 border border-amber-700" />
    <div className="h-px w-8 bg-amber-700" />
  </div>
);

// Section header with small decorative icon
const SectionLabel = ({ icon, label }) => (
  <div className="flex items-center gap-2 mb-3">
    {icon && (
      <img src={icon} alt="" className="w-5 h-5 opacity-70" />
    )}
    <span className="font-cinzel text-xs uppercase tracking-[0.2em] text-amber-800/70">
      {label}
    </span>
    <div className="flex-1 h-px bg-amber-700/20 ml-2" />
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
        <div className="text-center mb-6 pb-4 border-b border-amber-700/20">
          <p className="font-crimson text-stone-600 italic text-sm">
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

// Single narrative block - no headers, just prose
const NarrativeBlock = ({ block, archetypeStyle }) => {
  const bt = block.block_type;
  const c = block.content || {};

  if (bt === 'cold_open') return <ColdOpen c={c} style={archetypeStyle} />;
  if (bt === 'materials') return <Materials c={c} style={archetypeStyle} />;
  if (bt === 'stepper') return <Stepper c={c} style={archetypeStyle} />;
  if (bt === 'lore_vignette') return <LoreVignette c={c} style={archetypeStyle} />;
  if (bt === 'choice') return <Choice c={c} style={archetypeStyle} />;
  if (bt === 'closing') return <Closing c={c} style={archetypeStyle} />;
  if (bt === 'reflection') return <Reflection c={c} />;
  if (bt === 'journal_prompt') return <Reflection c={c} />;
  if (bt === 'bird_oracle') return <BirdOracle c={c} style={archetypeStyle} />;
  if (bt === 'ward') return <Ward c={c} style={archetypeStyle} />;
  if (bt === 'song_prompt') return <SongPrompt c={c} style={archetypeStyle} />;
  if (bt === 'evidence_card') return <EvidenceCard c={c} />;
  if (bt === 'safety_note') return <SafetyNote c={c} />;
  if (bt === 'poetry_reading') return <PoetryReading c={c} style={archetypeStyle} />;
  if (bt === 'observation_task') return <ObservationTask c={c} />;
  if (bt === 'further_reading') return <FurtherReading c={c} style={archetypeStyle} />;

  return null;
};

// === NARRATIVE BLOCK COMPONENTS ===

// Cold Open - the guide's opening, presented as immersive quote with decorative styling
const ColdOpen = ({ c, style }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-6 py-4"
    data-testid="cold-open-block"
  >
    {c.greeting && (
      <blockquote className="relative px-6 py-4 mb-4">
        {/* Decorative quote mark */}
        <span className="absolute -top-2 -left-1 text-5xl text-amber-700/20 font-serif">"</span>
        <p className="font-crimson text-xl text-stone-800 italic leading-relaxed">
          {c.greeting}
        </p>
        <span className="absolute -bottom-4 right-4 text-5xl text-amber-700/20 font-serif rotate-180">"</span>
      </blockquote>
    )}
    {c.scene_setting && (
      <p className="font-crimson text-stone-600 leading-relaxed mb-3 text-center italic">
        {c.scene_setting}
      </p>
    )}
    {c.hook && (
      <p className="font-crimson text-stone-800 leading-relaxed text-lg">
        {c.hook}
      </p>
    )}
  </motion.div>
);

// Materials - elegant ingredient list with visual icons
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
    <div className="py-4" data-testid="materials-block">
      <SectionLabel icon="/icons/anchors/gold/anchor-herb.png" label="Gather These Materials" />
      
      <div className="grid gap-3 mt-4">
        {c.items?.map((item, i) => {
          const iconPath = getIconForMaterial(item.name);
          return (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-900/5 border border-amber-700/10">
              {iconPath ? (
                <img src={iconPath} alt="" className="w-8 h-8 opacity-70 flex-shrink-0 mt-0.5" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-700/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-800 text-xs font-cinzel">{i + 1}</span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-cinzel text-amber-900 font-medium">{item.name}</p>
                {item.purpose && (
                  <p className="font-crimson text-stone-600 text-sm mt-0.5">{item.purpose}</p>
                )}
                {item.substitution && (
                  <p className="font-crimson text-stone-500 text-xs italic mt-1">
                    Alternative: {item.substitution}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {c.gathering_note && (
        <p className="font-crimson text-stone-500 text-sm italic mt-4 text-center">
          {c.gathering_note}
        </p>
      )}
    </div>
  );
};

// Stepper - flowing narrative steps with elegant numbering
const Stepper = ({ c, style }) => (
  <div className="py-4" data-testid="stepper-block">
    <SectionLabel icon="/icons/ui/gold/icon-grimoire.png" label="The Working" />
    
    <div className="space-y-6 mt-4">
      {c.steps?.map((step, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-12"
        >
          {/* Step number in decorative circle */}
          <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-amber-700/40 flex items-center justify-center bg-amber-50/50">
            <span className="font-cinzel text-sm text-amber-800">{index + 1}</span>
          </div>
          
          {/* Connecting line to next step */}
          {index < (c.steps?.length || 0) - 1 && (
            <div className="absolute left-[15px] top-10 bottom-0 w-px bg-amber-700/20" style={{ height: 'calc(100% + 1rem)' }} />
          )}
          
          {/* Step content */}
          <div>
            {step.title && (
              <h4 className="font-cinzel text-sm text-amber-900 tracking-wide mb-2">
                {step.title}
              </h4>
            )}

            <p className="font-crimson text-stone-800 text-base leading-relaxed">
              {step.action || step.instruction || step.text}
            </p>

            {/* Spoken words as elegant blockquote */}
            {step.spoken_words && (
              <blockquote className="my-3 py-2 px-4 bg-amber-900/5 border-l-2 border-amber-600/60 rounded-r-lg">
                <p className="font-crimson italic text-amber-900">
                  "{step.spoken_words}"
                </p>
              </blockquote>
            )}

            {/* Why - explanation */}
            {step.why && (
              <p className="font-crimson text-stone-600 text-sm italic mt-2 pl-2 border-l border-stone-300">
                {step.why}
              </p>
            )}

            {step.duration_hint && (
              <p className="text-stone-400 text-xs mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {step.duration_hint}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>

    {c.completion_message && (
      <div className="mt-8 text-center">
        <SubtleDivider />
        <p className="font-crimson text-stone-600 italic mt-4">{c.completion_message}</p>
      </div>
    )}
  </div>
);

// Lore Vignette - embedded historical narrative with elegant framing
const LoreVignette = ({ c, style }) => (
  <div className="py-4 my-2" data-testid="lore-vignette-block">
    <div className="relative px-6 py-4 bg-stone-100/50 rounded-lg border border-stone-200/50">
      {/* Decorative corner accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-amber-700/30" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-amber-700/30" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-amber-700/30" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-amber-700/30" />
      
      {(c.era || c.tradition || c.title) && (
        <p className="font-cinzel text-xs text-amber-800/70 uppercase tracking-[0.15em] mb-2 text-center">
          {c.era && `${c.era} · `}{c.tradition || c.title}
        </p>
      )}
      <p className="font-crimson text-stone-700 leading-relaxed italic text-center">
        {c.narrative}
      </p>
      {c.relevance_to_working && (
        <p className="font-crimson text-stone-600 mt-3 text-sm text-center">{c.relevance_to_working}</p>
      )}
      {c.source_connection && (
        <p className="text-xs text-stone-400 mt-2 italic text-center">— {c.source_connection}</p>
      )}
    </div>
  </div>
);

// Choice - subtle inline options
const Choice = ({ c, style }) => {
  const [selected, setSelected] = useState(null);
  return (
    <div data-testid="choice-block">
      <p className="font-crimson-text text-stone-800 text-base leading-relaxed mb-3">{c.prompt}</p>
      <div className="space-y-2">
        {c.options?.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={cn(
              "w-full text-left p-3 rounded transition-all font-crimson-text text-sm",
              selected === opt.id
                ? "bg-amber-100/60 border border-amber-600/40 text-stone-800"
                : "bg-stone-100/40 border border-stone-200 text-stone-700 hover:bg-stone-100/60"
            )}
          >
            <span className="font-semibold">{opt.label}</span>
            {opt.description && <span className="text-stone-500"> — {opt.description}</span>}
          </button>
        ))}
      </div>
      {c.consequence_hint && (
        <p className="font-crimson-text text-sm italic text-stone-500 mt-2">"{c.consequence_hint}"</p>
      )}
    </div>
  );
};

// Closing - the guide's farewell, elegant
const Closing = ({ c, style }) => (
  <div className="py-6" data-testid="closing-block">
    <SectionLabel icon="/icons/anchors/gold/anchor-feather.png" label="Closing the Circle" />
    
    <div className="mt-4 text-center">
      {c.license_to_depart && (
        <blockquote className="font-crimson text-stone-700 italic leading-relaxed text-lg mb-4">
          "{c.license_to_depart}"
        </blockquote>
      )}
      {c.grounding_action && (
        <p className="font-crimson text-stone-800 mt-3">{c.grounding_action}</p>
      )}
      {c.empowerment_line && (
        <div className="my-6 py-4 px-6 bg-amber-900/5 rounded-lg border border-amber-700/20">
          <p className="font-cinzel text-lg text-amber-900">
            "{c.empowerment_line}"
          </p>
        </div>
      )}
      {c.next_steps_hint && (
        <p className="font-crimson text-sm text-stone-500 mt-4 italic">
          In the next 24 hours: {c.next_steps_hint}
        </p>
      )}
    </div>
  </div>
);

// Reflection / Journal - elegant prompt presentation
const Reflection = ({ c }) => (
  <div className="py-4" data-testid="reflection-block">
    <SectionLabel icon="/icons/anchors/gold/anchor-notebook.png" label="Reflect" />
    
    {c.guide_note && (
      <p className="font-crimson text-stone-700 italic leading-relaxed mt-3">"{c.guide_note}"</p>
    )}
    {c.prompts?.length > 0 && (
      <div className="mt-4 space-y-3">
        {c.prompts.map((prompt, i) => (
          <p key={i} className="font-crimson text-stone-600 leading-relaxed pl-4 border-l border-amber-700/30">
            {prompt}
          </p>
        ))}
      </div>
    )}
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
      <p className="font-cinzel text-sm text-amber-800/70 tracking-[0.15em] uppercase mb-2">
        {c.bird || c.bird_name || 'The Bird Oracle'}
      </p>
      <blockquote className="font-crimson text-stone-700 italic text-lg leading-relaxed">
        "{c.message || c.oracle_message}"
      </blockquote>
      {c.observation_prompt && (
        <p className="font-crimson text-stone-500 text-sm mt-3">{c.observation_prompt}</p>
      )}
    </div>
  </div>
);

// Ward - protection instruction as narrative
const Ward = ({ c, style }) => (
  <div data-testid="ward-block">
    {c.ward_name && (
      <p className="font-cinzel text-sm text-stone-500 tracking-wide mb-2">{c.ward_name}</p>
    )}
    {c.protects_against && (
      <p className="font-crimson-text text-stone-600 text-sm italic mb-2">{c.protects_against}</p>
    )}
    {c.creation_steps && Array.isArray(c.creation_steps) && c.creation_steps.map((step, i) => (
      <p key={i} className="font-crimson-text text-stone-800 leading-relaxed mb-2">{step}</p>
    ))}
    {c.activation_phrase && (
      <blockquote className="font-crimson-text text-amber-800 italic text-center my-3 py-2 border-y border-amber-400/30">
        "{c.activation_phrase}"
      </blockquote>
    )}
    {c.talisman_option && (
      <p className="font-crimson-text text-stone-500 text-sm mt-2">{c.talisman_option}</p>
    )}
  </div>
);

// Song Prompt - voice instruction as flowing text
const SongPrompt = ({ c, style }) => (
  <div data-testid="song-prompt-block">
    <p className="font-crimson-text text-stone-800 leading-relaxed">{c.instruction}</p>
    {(c.phrase || c.words_optional) && (
      <blockquote className="font-crimson-text italic text-stone-700 my-2 pl-4 border-l-2 border-amber-400/40">
        "{c.phrase || c.words_optional}"
      </blockquote>
    )}
    {c.duration && (
      <p className="text-stone-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {c.duration}</p>
    )}
    {(c.why_this_sound || c.purpose) && (
      <p className="font-crimson-text text-stone-600 text-sm italic mt-1">{c.why_this_sound || c.purpose}</p>
    )}
  </div>
);

// Evidence Card - Theresa's research findings as prose
const EvidenceCard = ({ c }) => (
  <div data-testid="evidence-card-block">
    {c.known?.length > 0 && (
      <div className="mb-3">
        <p className="font-cinzel text-xs text-stone-400 uppercase tracking-widest mb-1">What the records show</p>
        {c.known.map((item, i) => (
          <p key={i} className="font-crimson-text text-stone-700 leading-relaxed">{item}</p>
        ))}
      </div>
    )}
    {c.likely?.length > 0 && (
      <div className="mb-3">
        <p className="font-cinzel text-xs text-stone-400 uppercase tracking-widest mb-1">What the patterns suggest</p>
        {c.likely.map((item, i) => (
          <p key={i} className="font-crimson-text text-stone-600 leading-relaxed">{item}</p>
        ))}
      </div>
    )}
    {c.lore?.length > 0 && (
      <div>
        <p className="font-cinzel text-xs text-stone-400 uppercase tracking-widest mb-1">What the stories tell</p>
        {c.lore.map((item, i) => (
          <p key={i} className="font-crimson-text text-stone-600 italic leading-relaxed">{item}</p>
        ))}
      </div>
    )}
    {c.pattern_note && (
      <p className="font-crimson-text text-sm italic text-stone-500 mt-2">"{c.pattern_note}"</p>
    )}
  </div>
);

// Safety Note - minimal but clear
const SafetyNote = ({ c }) => (
  <div className="py-2 px-4 border-l-2 border-amber-500/60 bg-amber-50/30 rounded-r" data-testid="safety-note-block">
    <p className="font-crimson-text text-sm text-stone-700">{c.warning || c.note}</p>
    {c.when_to_stop && (
      <p className="font-crimson-text text-xs text-stone-600 mt-1">When to pause: {c.when_to_stop}</p>
    )}
    {c.consent_check && (
      <p className="font-crimson-text text-xs text-stone-500 italic mt-1">{c.consent_check}</p>
    )}
  </div>
);

// Poetry Reading - poem as flowing text
const PoetryReading = ({ c, style }) => (
  <div data-testid="poetry-reading-block">
    {c.poem_title && (
      <p className="font-cinzel text-sm text-stone-500 tracking-wide mb-1">{c.poem_title}</p>
    )}
    {c.poem_author && (
      <p className="text-xs text-stone-400 italic mb-2">by {c.poem_author}</p>
    )}
    {c.poem_text && (
      <blockquote className="font-crimson-text text-stone-800 italic leading-relaxed whitespace-pre-line pl-4 border-l-2 border-amber-500/30">
        {c.poem_text}
      </blockquote>
    )}
    {c.guide_commentary && (
      <p className="font-crimson-text text-stone-600 text-sm mt-3">{c.guide_commentary}</p>
    )}
    {c.reading_instruction && (
      <p className="font-crimson-text text-stone-500 text-sm mt-1 italic">{c.reading_instruction}</p>
    )}
  </div>
);

// Observation Task - simple instruction
const ObservationTask = ({ c }) => (
  <div data-testid="observation-task-block">
    <p className="font-crimson-text text-stone-800 leading-relaxed">{c.task_description}</p>
    {c.location_suggestion && (
      <p className="font-crimson-text text-stone-600 text-sm mt-1">Where: {c.location_suggestion}</p>
    )}
    {c.what_to_notice && (
      <p className="font-crimson-text text-stone-600 text-sm mt-1">Notice: {c.what_to_notice}</p>
    )}
    {c.recording_prompt && (
      <p className="font-crimson-text text-stone-500 text-sm italic mt-1">{c.recording_prompt}</p>
    )}
  </div>
);

// Further Reading - simple list of recommendations
const FurtherReading = ({ c, style }) => (
  <div data-testid="further-reading-block">
    <p className="font-cinzel text-xs text-stone-400 uppercase tracking-widest mb-2">For further reading</p>
    {c.recommendations?.map((rec, i) => (
      <div key={i} className="mb-2">
        <p className="font-crimson-text text-stone-800">
          <span className="font-semibold">{rec.title}</span>
          {rec.author && <span className="text-stone-600"> by {rec.author}</span>}
        </p>
        {rec.guide_note && (
          <p className="font-crimson-text text-stone-600 text-sm italic">{rec.guide_note}</p>
        )}
        {rec.learn_more_url && (
          <a href={rec.learn_more_url} target="_blank" rel="noopener noreferrer"
            className="text-amber-700 hover:text-amber-600 text-sm underline">
            Learn more
          </a>
        )}
      </div>
    ))}
    {c.reading_ritual && (
      <p className="font-crimson-text text-stone-500 text-sm italic mt-2">{c.reading_ritual}</p>
    )}
  </div>
);

export default SpellBlockRenderer;
