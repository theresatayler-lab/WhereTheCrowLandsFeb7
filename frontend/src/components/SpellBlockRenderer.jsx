// SpellBlockRenderer - Renders blocks-based spell as flowing grimoire page
// All sections visible, no accordion dropdowns - reads like a spell page

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Check, Circle, Play,
  BookOpen, Feather, Flame, Moon, Star, Bird, Music,
  Shield, Eye, FileText, Clock, AlertTriangle, Quote,
  Sparkles, Heart, ArrowRight, Edit3, Binoculars, Library
} from 'lucide-react';
import { cn } from '../lib/utils';

// Block type icons
const BLOCK_ICONS = {
  cold_open: Sparkles,
  materials: Feather,
  choice: ArrowRight,
  stepper: Play,
  lore_vignette: BookOpen,
  reflection: Edit3,
  closing: Moon,
  bird_oracle: Bird,
  ward: Shield,
  song_prompt: Music,
  evidence_card: Eye,
  journal_prompt: FileText,
  safety_note: AlertTriangle,
  poetry_reading: Quote,
  observation_task: Binoculars,
  further_reading: Library
};

// Block type labels
const BLOCK_LABELS = {
  cold_open: 'Opening',
  materials: 'What You\'ll Need',
  choice: 'Your Choice',
  stepper: 'The Working',
  lore_vignette: 'From the Archives',
  reflection: 'Reflection',
  closing: 'Closing',
  bird_oracle: 'Bird Oracle',
  ward: 'Protection Ward',
  song_prompt: 'Voice Work',
  evidence_card: 'Inspiration',
  journal_prompt: 'Journal',
  safety_note: 'Safety Note',
  poetry_reading: 'A Poem for You',
  observation_task: 'Your Task',
  further_reading: 'Further Reading'
};

// Decorative divider between spell sections
const SectionDivider = ({ archetypeStyle }) => (
  <div className="flex items-center justify-center gap-3 py-2">
    <div className={cn("h-px flex-1 max-w-[80px]", "bg-gradient-to-r from-transparent",
      archetypeStyle.accentColor?.replace('text-', 'to-') || "to-amber-600/40"
    )} />
    <Sparkles className={cn("w-3 h-3 opacity-30", archetypeStyle.accentColor || "text-amber-600")} />
    <div className={cn("h-px flex-1 max-w-[80px]", "bg-gradient-to-l from-transparent",
      archetypeStyle.accentColor?.replace('text-', 'to-') || "to-amber-600/40"
    )} />
  </div>
);

// Main Block Renderer Component - Flowing page layout, no accordions
export const SpellBlockRenderer = ({
  spell,
  archetypeStyle = {},
  onLogUpdate = () => {},
  initialLog = {}
}) => {
  const [stepperProgress, setStepperProgress] = useState({});
  const [selectedChoices, setSelectedChoices] = useState({});
  const [journalEntries, setJournalEntries] = useState(initialLog);

  const blocks = spell?.blocks || [];
  const personaLock = spell?.persona_lock || {};
  const canonAnchor = spell?.canon_anchor || {};

  const handleStepComplete = useCallback((blockId, stepIndex) => {
    setStepperProgress(prev => {
      const blockProgress = prev[blockId] || new Set();
      const next = new Set(blockProgress);
      if (next.has(stepIndex)) {
        next.delete(stepIndex);
      } else {
        next.add(stepIndex);
      }
      const updated = { ...prev, [blockId]: next };
      onLogUpdate({ stepperProgress: updated });
      return updated;
    });
  }, [onLogUpdate]);

  const handleChoiceSelect = useCallback((blockId, optionId) => {
    setSelectedChoices(prev => {
      const updated = { ...prev, [blockId]: optionId };
      onLogUpdate({ choices: updated });
      return updated;
    });
  }, [onLogUpdate]);

  const handleJournalEntry = useCallback((fieldId, value) => {
    setJournalEntries(prev => {
      const updated = { ...prev, [fieldId]: value };
      onLogUpdate({ journal: updated });
      return updated;
    });
  }, [onLogUpdate]);

  return (
    <div className="space-y-8" data-testid="spell-block-renderer">
      {/* Persona Lock Header */}
      {personaLock.props && (
        <div className={cn(
          "flex items-center justify-center gap-2 text-xs",
          archetypeStyle.textMuted || "text-muted-foreground"
        )}>
          <Sparkles className={cn("w-3 h-3", archetypeStyle.accentColor || "text-primary")} />
          <span className="italic">{personaLock.props.join(' · ')} · {personaLock.sensory_cue}</span>
        </div>
      )}

      {/* Canon Anchor Badge */}
      {canonAnchor.title && (
        <div className="flex justify-center">
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border",
            archetypeStyle.bgAccent || "bg-primary/10",
            archetypeStyle.borderColor || "border-primary/30"
          )}>
            <BookOpen className={cn("w-3 h-3", archetypeStyle.accentColor || "text-primary")} />
            <span>{canonAnchor.title}</span>
            {canonAnchor.year && <span className="text-muted-foreground">({canonAnchor.year})</span>}
          </div>
        </div>
      )}

      {/* Render Blocks - All visible, flowing page layout */}
      {blocks.map((block, index) => (
        <React.Fragment key={block.block_id || index}>
          {/* Decorative divider between sections (not before first block) */}
          {index > 0 && block.block_type !== 'safety_note' && (
            <SectionDivider archetypeStyle={archetypeStyle} />
          )}
          <BlockWrapper
            block={block}
            archetypeStyle={archetypeStyle}
            stepperProgress={stepperProgress[block.block_id]}
            selectedChoice={selectedChoices[block.block_id]}
            journalEntries={journalEntries}
            onStepComplete={(stepIndex) => handleStepComplete(block.block_id, stepIndex)}
            onChoiceSelect={(optionId) => handleChoiceSelect(block.block_id, optionId)}
            onJournalEntry={handleJournalEntry}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

// Block Wrapper - flowing section with decorative header, always visible
const BlockWrapper = ({
  block,
  archetypeStyle,
  stepperProgress,
  selectedChoice,
  journalEntries,
  onStepComplete,
  onChoiceSelect,
  onJournalEntry
}) => {
  const Icon = BLOCK_ICONS[block.block_type] || Sparkles;
  const label = BLOCK_LABELS[block.block_type] || block.block_type;

  // Cold open has no section header, just content
  if (block.block_type === 'cold_open') {
    return (
      <ColdOpenBlock
        content={block.content}
        archetypeStyle={archetypeStyle}
      />
    );
  }

  // Safety notes get a distinct warning appearance
  if (block.block_type === 'safety_note') {
    return (
      <div data-testid={`block-${block.block_type}`}>
        <BlockContent
          block={block}
          archetypeStyle={archetypeStyle}
          stepperProgress={stepperProgress}
          selectedChoice={selectedChoice}
          journalEntries={journalEntries}
          onStepComplete={onStepComplete}
          onChoiceSelect={onChoiceSelect}
          onJournalEntry={onJournalEntry}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-testid={`block-${block.block_type}`}
    >
      {/* Decorative Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <Icon className={cn("w-5 h-5", archetypeStyle.accentColor || "text-amber-700")} />
        <h3 className="font-cinzel text-lg tracking-wide text-stone-800">{label}</h3>
        <div className={cn(
          "h-px flex-1",
          "bg-gradient-to-r from-stone-300 to-transparent"
        )} />
        {/* Progress indicator for stepper */}
        {block.block_type === 'stepper' && stepperProgress && (
          <span className="text-xs text-stone-500 font-montserrat">
            {stepperProgress.size || 0}/{block.content?.steps?.length || 0} complete
          </span>
        )}
      </div>

      {/* Block Content - always visible */}
      <BlockContent
        block={block}
        archetypeStyle={archetypeStyle}
        stepperProgress={stepperProgress}
        selectedChoice={selectedChoice}
        journalEntries={journalEntries}
        onStepComplete={onStepComplete}
        onChoiceSelect={onChoiceSelect}
        onJournalEntry={onJournalEntry}
      />
    </motion.div>
  );
};

// Block Content Router
const BlockContent = ({
  block,
  archetypeStyle,
  stepperProgress,
  selectedChoice,
  journalEntries,
  onStepComplete,
  onChoiceSelect,
  onJournalEntry
}) => {
  switch (block.block_type) {
    case 'materials':
      return <MaterialsBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'choice':
      return <ChoiceBlock content={block.content} selectedChoice={selectedChoice} onSelect={onChoiceSelect} archetypeStyle={archetypeStyle} />;
    case 'stepper':
      return <StepperBlock content={block.content} progress={stepperProgress} onComplete={onStepComplete} archetypeStyle={archetypeStyle} />;
    case 'lore_vignette':
      return <LoreVignetteBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'reflection':
      return <ReflectionBlock content={block.content} entries={journalEntries} onEntry={onJournalEntry} archetypeStyle={archetypeStyle} />;
    case 'closing':
      return <ClosingBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'bird_oracle':
      return <BirdOracleBlock content={block.content} entries={journalEntries} onEntry={onJournalEntry} archetypeStyle={archetypeStyle} />;
    case 'ward':
      return <WardBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'song_prompt':
      return <SongPromptBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'evidence_card':
      return <EvidenceCardBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'journal_prompt':
      return <JournalPromptBlock content={block.content} entries={journalEntries} onEntry={onJournalEntry} archetypeStyle={archetypeStyle} />;
    case 'safety_note':
      return <SafetyNoteBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'poetry_reading':
      return <PoetryReadingBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'observation_task':
      return <ObservationTaskBlock content={block.content} archetypeStyle={archetypeStyle} />;
    case 'further_reading':
      return <FurtherReadingBlock content={block.content} archetypeStyle={archetypeStyle} />;
    default:
      return <div className="text-muted-foreground">Unknown block type: {block.block_type}</div>;
  }
};

// === INDIVIDUAL BLOCK COMPONENTS ===

// Cold Open - Guide's opening narrative - CONTRAST LOCKED
const ColdOpenBlock = ({ content, archetypeStyle }) => (
  <div className="mb-8" data-testid="cold-open-block">
    {/* Greeting as immersive blockquote */}
    {content.greeting && (
      <blockquote className="font-crimson-text text-lg text-stone-800 italic leading-relaxed border-l-3 pl-5 mb-4" style={{ borderLeftColor: archetypeStyle.accentColor || '#B5651D' }}>
        {content.greeting}
      </blockquote>
    )}
    {/* Scene setting */}
    {content.scene_setting && (
      <p className="font-crimson-text text-stone-600 leading-relaxed mb-3">
        {content.scene_setting}
      </p>
    )}
    {/* Hook */}
    {content.hook && (
      <p className="font-crimson-text text-stone-800 leading-relaxed">
        {content.hook}
      </p>
    )}
  </div>
);

// Materials Block - CONTRAST LOCKED
const MaterialsBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-3" data-testid="materials-block">
    {content.items?.map((item, i) => (
      <div key={i} className="flex gap-3 items-start py-2">
        <Feather className={cn("w-4 h-4 mt-1 flex-shrink-0", archetypeStyle.accentColor || "text-amber-700")} />
        <div>
          <span className="font-crimson-text text-stone-800 font-semibold">{item.name}</span>
          {item.purpose && (
            <span className="font-crimson-text text-stone-600"> — {item.purpose}</span>
          )}
          {item.substitution && (
            <span className="font-crimson-text text-stone-500 text-sm block mt-1">
              (Or substitute: {item.substitution})
            </span>
          )}
        </div>
      </div>
    ))}
    {content.gathering_note && (
      <p className="text-sm italic mt-4 text-stone-600 font-crimson-text">
        {content.gathering_note}
      </p>
    )}
  </div>
);

// Choice Block - Interactive decision point - CONTRAST LOCKED
const ChoiceBlock = ({ content, selectedChoice, onSelect, archetypeStyle }) => (
  <div className="space-y-4" data-testid="choice-block">
    <p className={cn("text-lg font-medium font-cinzel text-stone-800")}>
      {content.prompt}
    </p>
    
    <div className="grid gap-3">
      {content.options?.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={cn(
            "p-4 rounded-lg border-2 text-left transition-all bg-[#F3EFE8]",
            selectedChoice === option.id
              ? cn(archetypeStyle.borderColor || "border-amber-600", "bg-[#EDE8DF]")
              : "border-stone-300 hover:border-stone-400"
          )}
        >
          <div className="flex items-center gap-3">
            {selectedChoice === option.id ? (
              <Check className={cn("w-5 h-5", archetypeStyle.accentColor || "text-amber-700")} />
            ) : (
              <Circle className="w-5 h-5 text-stone-400" />
            )}
            <div>
              <div className="font-medium text-stone-800">{option.label}</div>
              <div className="text-sm text-stone-600">{option.description}</div>
              {option.affects && (
                <div className="text-xs mt-1 italic text-stone-500">{option.affects}</div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
    
    {content.consequence_hint && (
      <p className="text-sm italic text-stone-600">
        &ldquo;{content.consequence_hint}&rdquo;
      </p>
    )}
  </div>
);

// Stepper Block - Interactive step-by-step with checkboxes - CONTRAST LOCKED
const StepperBlock = ({ content, progress = new Set(), onComplete, archetypeStyle }) => (
  <div className="space-y-6" data-testid="stepper-block">
    {content.steps?.map((step, index) => (
      <div 
        key={index}
        className="mb-6"
      >
        {/* Step heading */}
        <h4 className="font-cinzel text-base mb-2" style={{ color: archetypeStyle.accentColor ? undefined : '#B5651D' }}>
          Step {step.step_number}{step.title ? `: ${step.title}` : ''}
        </h4>
        
        {/* Step content as flowing prose */}
        <div className="font-crimson-text text-stone-800 text-base leading-relaxed">
          <p>{step.action || step.instruction || step.text}</p>
          
          {/* Spoken words as blockquote */}
          {step.spoken_words && (
            <blockquote className="my-3 pl-4 border-l-2 border-amber-400 italic text-stone-700">
              "{step.spoken_words}"
            </blockquote>
          )}
          
          {/* Why explanation */}
          {step.why && (
            <p className="mt-2 text-stone-600 italic text-sm">{step.why}</p>
          )}
          
          {/* Duration hint */}
          {step.duration_hint && (
            <p className="mt-1 text-stone-500 text-xs font-montserrat flex items-center gap-1">
              <Clock className="w-3 h-3" /> {step.duration_hint}
            </p>
          )}
        </div>
      </div>
    ))}
    
    {/* Completion message */}
    {content.completion_message && (
      <div className="p-4 rounded-lg text-center border bg-[#EDE8DF] border-amber-400">
        <Check className="w-6 h-6 mx-auto mb-2 text-amber-600" />
        <p className="font-cinzel text-stone-800">{content.completion_message}</p>
      </div>
    )}
  </div>
);

// Lore Vignette Block - Historical/folkloric story - CONTRAST LOCKED
const LoreVignetteBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="lore-vignette-block">
    {content.title && (
      <h4 className="font-cinzel text-lg text-stone-800">{content.title}</h4>
    )}
    
    <div className="flex items-center gap-4 text-xs text-stone-500">
      {content.era && <span>{content.era}</span>}
      {content.tradition && <span>• {content.tradition}</span>}
    </div>
    
    <div className="prose prose-sm prose-invert max-w-none">
      <p className="text-stone-700 leading-relaxed">{content.narrative}</p>
    </div>
    
    {content.relevance_to_working && (
      <div className="p-3 rounded-lg text-sm border bg-[#F3EFE8] border-stone-300">
        <span className="font-medium text-stone-800">Connection:</span> <span className="text-stone-700">{content.relevance_to_working}</span>
      </div>
    )}
    
    {content.source_connection && (
      <div className="text-xs italic text-stone-500">
        Source: {content.source_connection}
      </div>
    )}
  </div>
);

// Reflection Block - CONTRAST LOCKED
const ReflectionBlock = ({ content, entries, onEntry, archetypeStyle }) => (
  <div className="space-y-4" data-testid="reflection-block">
    {content.guide_note && (
      <p className="italic text-stone-600">&ldquo;{content.guide_note}&rdquo;</p>
    )}
    
    {content.prompts?.map((prompt, i) => (
      <div key={i} className="p-3 rounded-lg border bg-[#F3EFE8] border-stone-300">
        <p className="text-sm text-stone-800">{prompt}</p>
      </div>
    ))}
    
    {content.log_fields?.map((field) => (
      <div key={field.field_id} className="space-y-2">
        <label className="text-sm font-medium text-stone-700">{field.label}</label>
        {field.type === 'scale' ? (
          <input
            type="range"
            min="1"
            max="10"
            value={entries[field.field_id] || 5}
            onChange={(e) => onEntry(field.field_id, e.target.value)}
            className="w-full"
          />
        ) : field.type === 'textarea' ? (
          <textarea
            value={entries[field.field_id] || ''}
            onChange={(e) => onEntry(field.field_id, e.target.value)}
            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-800"
            rows={3}
            placeholder={field.placeholder}
          />
        ) : (
          <input
            type="text"
            value={entries[field.field_id] || ''}
            onChange={(e) => onEntry(field.field_id, e.target.value)}
            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-800"
            placeholder={field.placeholder}
          />
        )}
      </div>
    ))}
  </div>
);

// Closing Block - CONTRAST LOCKED
const ClosingBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="closing-block">
    {content.license_to_depart && (
      <div className="p-4 rounded-lg border bg-[#F3EFE8] border-stone-300">
        <p className="italic text-stone-700">&ldquo;{content.license_to_depart}&rdquo;</p>
      </div>
    )}
    
    {content.grounding_action && (
      <div className="flex items-start gap-3">
        <Moon className="w-5 h-5 mt-0.5 text-amber-600" />
        <p className="text-stone-800">{content.grounding_action}</p>
      </div>
    )}
    
    {content.empowerment_line && (
      <div className="p-4 rounded-lg text-center font-cinzel border bg-[#EDE8DF] border-amber-500">
        <p className="text-lg text-amber-800">&ldquo;{content.empowerment_line}&rdquo;</p>
      </div>
    )}
    
    {content.next_steps_hint && (
      <p className="text-sm text-stone-600">
        <span className="font-medium">In the next 24 hours:</span> {content.next_steps_hint}
      </p>
    )}
  </div>
);

// Bird Oracle Block - CONTRAST LOCKED
const BirdOracleBlock = ({ content, entries, onEntry, archetypeStyle }) => (
  <div className="space-y-4" data-testid="bird-oracle-block">
    <div className="flex items-center gap-3">
      <Bird className="w-8 h-8 text-amber-600" />
      <div>
        <div className="font-cinzel text-lg text-stone-800">{content.bird || content.bird_name}</div>
        <div className="text-sm text-stone-500">Oracle Message</div>
      </div>
    </div>
    
    <div className={cn(
      "p-4 rounded-lg italic border",
      archetypeStyle.bgAccent || "bg-muted/30",
      archetypeStyle.borderColor ? archetypeStyle.borderColor.replace('border-', 'border-') + '/30' : "border-border/30"
    )}>
      &ldquo;{content.message || content.oracle_message}&rdquo;
    </div>
    
    {content.observation_prompt && (
      <div className="space-y-2">
        <p className="text-sm">{content.observation_prompt}</p>
        {content.log_field && (
          <textarea
            value={entries['bird_observation'] || ''}
            onChange={(e) => onEntry('bird_observation', e.target.value)}
            className="w-full p-2 rounded-lg text-sm border bg-white border-stone-300 text-stone-800"
            rows={2}
            placeholder="Record what you observe..."
          />
        )}
      </div>
    )}
  </div>
);

// Ward Block - CONTRAST LOCKED
// Backend sends: ward_name, creation_steps, activation_phrase, protects_against
const WardBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="ward-block">
    <div className="flex items-center gap-3">
      <Shield className="w-6 h-6 text-teal-600" />
      <div>
        <div className="font-cinzel text-lg text-stone-800">{content.ward_name}</div>
        <div className="text-sm text-stone-500">{content.protects_against || content.purpose}</div>
      </div>
    </div>

    {content.creation_steps && Array.isArray(content.creation_steps) && content.creation_steps.length > 0 && (
      <ol className="space-y-2 list-decimal list-inside text-stone-700">
        {content.creation_steps.map((step, i) => (
          <li key={i} className="text-sm">{step}</li>
        ))}
      </ol>
    )}

    {content.activation_phrase && (
      <div className="p-4 bg-[#F3EFE8] border border-teal-300 rounded-lg text-center">
        <p className="text-sm text-stone-500 mb-1">Activation Phrase:</p>
        <p className="font-cinzel italic text-stone-800">&ldquo;{content.activation_phrase}&rdquo;</p>
      </div>
    )}

    {content.talisman_option && (
      <p className="text-sm text-stone-600">
        <span className="font-medium">Optional talisman:</span> {content.talisman_option}
      </p>
    )}
  </div>
);

// Song Prompt Block - CONTRAST LOCKED
// Backend sends: instruction, pitch, phrase, duration, why_this_sound
const SongPromptBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="song-prompt-block">
    <div className="flex items-start gap-3">
      <Music className="w-6 h-6 text-teal-600" />
      <div>
        <p className="font-medium text-stone-800">{content.instruction}</p>
        {(content.pitch || content.suggested_melody) && (
          <p className="text-sm text-stone-500 mt-1">
            {content.pitch ? `Pitch: ${content.pitch}` : `Suggested melody: ${content.suggested_melody}`}
          </p>
        )}
      </div>
    </div>

    {(content.phrase || content.words_optional) && (
      <div className="p-3 bg-[#F3EFE8] border border-teal-300 rounded-lg italic text-sm text-stone-700">
        &ldquo;{content.phrase || content.words_optional}&rdquo;
      </div>
    )}

    {content.duration && (
      <p className="text-sm text-stone-600 flex items-center gap-1">
        <Clock className="w-3 h-3" /> {content.duration}
      </p>
    )}

    {(content.why_this_sound || content.purpose) && (
      <p className="text-sm text-stone-600">{content.why_this_sound || content.purpose}</p>
    )}
  </div>
);

// Inspiration Block (Theresa specialty) - formerly Evidence Card - CONTRAST LOCKED
const EvidenceCardBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="inspiration-block">
    <div className="grid gap-4">
      {content.known?.length > 0 && (
        <div className="p-3 bg-[#F3EFE8] border border-indigo-400 rounded-lg">
          <div className="text-xs font-cinzel tracking-wider text-indigo-700 mb-2">What the Records Show</div>
          <ul className="space-y-1 text-sm">
            {content.known.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-stone-700">
                <Check className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {content.likely?.length > 0 && (
        <div className="p-3 bg-[#F3EFE8] border border-stone-400 rounded-lg">
          <div className="text-xs font-cinzel tracking-wider text-stone-600 mb-2">What the Patterns Suggest</div>
          <ul className="space-y-1 text-sm">
            {content.likely.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-stone-700">
                <Star className="w-4 h-4 text-stone-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {content.lore?.length > 0 && (
        <div className="p-3 bg-[#F3EFE8] border border-violet-400 rounded-lg">
          <div className="text-xs font-cinzel tracking-wider text-violet-700 mb-2">What the Stories Tell</div>
          <ul className="space-y-1 text-sm">
            {content.lore.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-stone-700">
                <BookOpen className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    
    {content.pattern_note && (
      <p className="text-sm italic text-muted-foreground">&ldquo;{content.pattern_note}&rdquo;</p>
    )}
  </div>
);

// Journal Prompt Block - CONTRAST LOCKED
// Backend sends: prompts, guide_note, log_fields (with field_id, label, type)
const JournalPromptBlock = ({ content, entries, onEntry, archetypeStyle }) => {
  // Support both backend field names (log_fields/field_id) and legacy (fields/id)
  const fields = content.log_fields || content.fields || [];

  return (
    <div className="space-y-4" data-testid="journal-prompt-block">
      {content.guide_note && (
        <p className="italic text-stone-600">&ldquo;{content.guide_note}&rdquo;</p>
      )}

      {content.prompts?.map((prompt, i) => (
        <div key={i} className="p-3 bg-[#F3EFE8] border border-stone-300 rounded-lg">
          <p className="text-sm text-stone-700">{prompt}</p>
        </div>
      ))}

      {fields.map((field) => {
        const fieldKey = field.field_id || field.id;
        return (
          <div key={fieldKey} className="space-y-2">
            <label className="text-sm font-medium text-stone-700">{field.label}</label>
            {field.type === 'scale' ? (
              <input
                type="range"
                min="1"
                max="10"
                value={entries[fieldKey] || 5}
                onChange={(e) => onEntry(fieldKey, e.target.value)}
                className="w-full"
              />
            ) : (
              <textarea
                value={entries[fieldKey] || ''}
                onChange={(e) => onEntry(fieldKey, e.target.value)}
                className="w-full p-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-800"
                rows={3}
                placeholder={field.placeholder}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Safety Note Block - CONTRAST LOCKED (Critical readability)
// Backend sends: warning, when_to_stop, consent_check, alternatives
const SafetyNoteBlock = ({ content, archetypeStyle }) => (
  <div className="p-4 bg-[#F3EFE8] border-2 border-amber-500 rounded-lg" data-testid="safety-note-block">
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
      <div className="space-y-2">
        <p className="text-sm text-stone-800 font-medium">{content.warning || content.note}</p>
        {content.when_to_stop && (
          <p className="text-sm text-stone-700">
            <span className="font-medium">When to stop:</span> {content.when_to_stop}
          </p>
        )}
        {content.consent_check && (
          <p className="text-sm text-stone-600 italic">{content.consent_check}</p>
        )}
        {content.alternatives && (
          typeof content.alternatives === 'string' ? (
            <p className="text-sm text-stone-600">{content.alternatives}</p>
          ) : content.alternatives.length > 0 && (
            <ul className="space-y-1 text-sm text-stone-600">
              {content.alternatives.map((alt, i) => (
                <li key={i}>&bull; {alt}</li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  </div>
);

// Poetry Reading Block - Shigg's poem + commentary - CONTRAST LOCKED
const PoetryReadingBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="poetry-reading-block">
    {content.poem_title && (
      <div className="flex items-center gap-2">
        <Quote className={cn("w-5 h-5", archetypeStyle.accentColor || "text-amber-700")} />
        <h4 className="font-cinzel text-lg text-stone-800">{content.poem_title}</h4>
      </div>
    )}

    {content.poem_author && (
      <p className="text-sm text-stone-500 italic">by {content.poem_author}</p>
    )}

    {content.poem_text && (
      <div className={cn(
        "p-5 rounded-lg border-l-4 bg-[#F3EFE8]",
        archetypeStyle.borderColor || "border-amber-600"
      )}>
        <p className="whitespace-pre-line font-crimson text-stone-800 leading-relaxed italic">
          {content.poem_text}
        </p>
      </div>
    )}

    {content.guide_commentary && (
      <div className="p-4 rounded-lg border bg-[#EDE8DF] border-stone-300">
        <p className="text-sm text-stone-700">{content.guide_commentary}</p>
      </div>
    )}

    {content.reading_instruction && (
      <p className="text-sm text-stone-600">
        <span className="font-medium">How to read it:</span> {content.reading_instruction}
      </p>
    )}
  </div>
);

// Observation Task Block - Shigg's outdoor quest - CONTRAST LOCKED
const ObservationTaskBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="observation-task-block">
    <div className="flex items-start gap-3">
      <Binoculars className={cn("w-6 h-6 mt-0.5", archetypeStyle.accentColor || "text-amber-700")} />
      <div>
        <p className="font-medium text-stone-800">{content.task_description}</p>
        {content.location_suggestion && (
          <p className="text-sm text-stone-600 mt-1">
            <span className="font-medium">Where:</span> {content.location_suggestion}
          </p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      {content.duration && (
        <div className="p-3 rounded-lg border bg-[#F3EFE8] border-stone-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-500" />
            <span className="text-sm text-stone-700">{content.duration}</span>
          </div>
        </div>
      )}

      {content.what_to_notice && (
        <div className="p-3 rounded-lg border bg-[#F3EFE8] border-stone-300">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-stone-500" />
            <span className="text-sm text-stone-700">{content.what_to_notice}</span>
          </div>
        </div>
      )}
    </div>

    {content.recording_prompt && (
      <div className="p-3 rounded-lg border bg-[#EDE8DF] border-stone-300">
        <p className="text-sm text-stone-700">
          <span className="font-medium">Record:</span> {content.recording_prompt}
        </p>
      </div>
    )}
  </div>
);

// Further Reading Block - Guide's book recommendations - CONTRAST LOCKED
const FurtherReadingBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="further-reading-block">
    {content.recommendations?.map((rec, i) => (
      <div key={i} className={cn(
        "p-4 rounded-lg border bg-[#F3EFE8]",
        archetypeStyle.borderColor ? archetypeStyle.borderColor.replace('border-', 'border-') + '/30' : "border-amber-600/30"
      )}>
        <div className="flex items-start gap-3">
          <Library className={cn("w-5 h-5 mt-0.5 flex-shrink-0", archetypeStyle.accentColor || "text-amber-700")} />
          <div>
            <div className="font-medium text-stone-800">{rec.title}</div>
            {rec.author && (
              <div className="text-sm text-stone-600">by {rec.author}</div>
            )}
            {rec.guide_note && (
              <p className="text-sm italic mt-2 text-stone-700">&ldquo;{rec.guide_note}&rdquo;</p>
            )}
            {rec.specific_passage && (
              <p className="text-xs mt-1 text-stone-500">
                <span className="font-medium">Start with:</span> {rec.specific_passage}
              </p>
            )}
          </div>
        </div>
      </div>
    ))}

    {content.reading_ritual && (
      <div className="p-3 rounded-lg border bg-[#EDE8DF] border-stone-300">
        <p className="text-sm text-stone-700">
          <span className="font-medium">How to approach it:</span> {content.reading_ritual}
        </p>
      </div>
    )}
  </div>
);

export default SpellBlockRenderer;
