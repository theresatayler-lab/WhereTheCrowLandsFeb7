// SpellBlockRenderer - Renders blocks-based spell experience
// Handles all block types with interactive stepper and logging

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, Check, Circle, Play, Pause,
  BookOpen, Feather, Flame, Moon, Star, Bird, Music,
  Shield, Eye, FileText, Clock, AlertTriangle, Quote,
  Sparkles, Heart, ArrowRight, Edit3
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
  safety_note: AlertTriangle
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
  safety_note: 'Safety Note'
};

// Main Block Renderer Component
export const SpellBlockRenderer = ({ 
  spell, 
  archetypeStyle = {},
  onLogUpdate = () => {},
  initialLog = {}
}) => {
  const [expandedBlocks, setExpandedBlocks] = useState(new Set(['cold_open_1']));
  const [stepperProgress, setStepperProgress] = useState({});
  const [selectedChoices, setSelectedChoices] = useState({});
  const [journalEntries, setJournalEntries] = useState(initialLog);

  const blocks = spell?.blocks || [];
  const personaLock = spell?.persona_lock || {};
  const canonAnchor = spell?.canon_anchor || {};

  const toggleBlock = useCallback((blockId) => {
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
  }, []);

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
    <div className="space-y-4" data-testid="spell-block-renderer">
      {/* Persona Lock Header */}
      {personaLock.props && (
        <div className={cn(
          "flex items-center gap-2 text-xs mb-2",
          archetypeStyle.textMuted || "text-muted-foreground"
        )}>
          <Sparkles className={cn("w-3 h-3", archetypeStyle.accentColor || "text-primary")} />
          <span>{personaLock.props.join(' • ')} • {personaLock.sensory_cue}</span>
        </div>
      )}

      {/* Canon Anchor Badge */}
      {canonAnchor.title && (
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4 border",
          archetypeStyle.bgAccent || "bg-primary/10",
          archetypeStyle.borderColor || "border-primary/30"
        )}>
          <BookOpen className={cn("w-3 h-3", archetypeStyle.accentColor || "text-primary")} />
          <span>{canonAnchor.title}</span>
          {canonAnchor.year && <span className="text-muted-foreground">({canonAnchor.year})</span>}
        </div>
      )}

      {/* Render Blocks */}
      {blocks.map((block, index) => (
        <BlockWrapper
          key={block.block_id || index}
          block={block}
          isExpanded={expandedBlocks.has(block.block_id)}
          onToggle={() => toggleBlock(block.block_id)}
          archetypeStyle={archetypeStyle}
          stepperProgress={stepperProgress[block.block_id]}
          selectedChoice={selectedChoices[block.block_id]}
          journalEntries={journalEntries}
          onStepComplete={(stepIndex) => handleStepComplete(block.block_id, stepIndex)}
          onChoiceSelect={(optionId) => handleChoiceSelect(block.block_id, optionId)}
          onJournalEntry={handleJournalEntry}
        />
      ))}
    </div>
  );
};

// Block Wrapper - handles expand/collapse and common styling
const BlockWrapper = ({
  block,
  isExpanded,
  onToggle,
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
  
  // Cold open is always expanded and has no header
  if (block.block_type === 'cold_open') {
    return (
      <ColdOpenBlock 
        content={block.content} 
        archetypeStyle={archetypeStyle}
      />
    );
  }

  return (
    <div 
      className={cn(
        "border rounded-lg overflow-hidden transition-all shadow-sm",
        archetypeStyle.borderColor || "border-border",
        "bg-[#F3EFE8]" // CONTRAST LOCKED: Solid vellum background
      )}
      data-testid={`block-${block.block_type}`}
    >
      {/* Block Header */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 text-left transition-colors",
          "hover:bg-stone-200/50",
          "bg-[#EDE8DF]" // Slightly darker vellum for header distinction
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("w-5 h-5", archetypeStyle.accentColor || "text-amber-700")} />
          <span className={cn("font-medium font-cinzel text-stone-800")}>{label}</span>
          
          {/* Progress indicator for stepper */}
          {block.block_type === 'stepper' && stepperProgress && (
            <span className="text-xs text-stone-600">
              ({stepperProgress.size || 0}/{block.content?.steps?.length || 0})
            </span>
          )}
          
          {/* Choice indicator */}
          {block.block_type === 'choice' && selectedChoice && (
            <Check className={cn("w-4 h-4", archetypeStyle.accentColor || "text-green-600")} />
          )}
        </div>
        
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-stone-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-stone-500" />
        )}
      </button>

      {/* Block Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 pt-0">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
    default:
      return <div className="text-muted-foreground">Unknown block type: {block.block_type}</div>;
  }
};

// === INDIVIDUAL BLOCK COMPONENTS ===

// Cold Open - Guide's opening narrative - CONTRAST LOCKED
const ColdOpenBlock = ({ content, archetypeStyle }) => (
  <div className={cn(
    "p-6 rounded-lg border bg-[#F3EFE8] shadow-sm",
    archetypeStyle.borderColor || "border-amber-600/30"
  )} data-testid="cold-open-block">
    {content.greeting && (
      <p className="text-lg font-cinzel mb-4 italic text-amber-800">
        &ldquo;{content.greeting}&rdquo;
      </p>
    )}
    {content.scene_setting && (
      <p className="mb-3 text-stone-600">{content.scene_setting}</p>
    )}
    {content.hook && (
      <p className="text-stone-800">{content.hook}</p>
    )}
  </div>
);

// Materials Block - CONTRAST LOCKED
const MaterialsBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-3" data-testid="materials-block">
    {content.items?.map((item, i) => (
      <div key={i} className={cn(
        "flex items-start gap-3 p-3 rounded-lg border bg-[#F3EFE8]",
        archetypeStyle.borderColor ? archetypeStyle.borderColor.replace('border-', 'border-') + '/30' : "border-amber-600/30"
      )}>
        <Feather className={cn("w-4 h-4 mt-1 flex-shrink-0", archetypeStyle.accentColor || "text-amber-700")} />
        <div className="flex-1">
          <div className="font-medium text-stone-800">{item.name}</div>
          <div className="text-sm text-stone-600">{item.purpose}</div>
          {item.substitution && (
            <div className="text-xs mt-1 text-stone-500">
              <span className="font-medium">Alternative:</span> {item.substitution}
            </div>
          )}
        </div>
        {item.optional && (
          <span className="text-xs px-2 py-0.5 bg-stone-200 text-stone-600 rounded">optional</span>
        )}
      </div>
    ))}
    {content.gathering_note && (
      <p className="text-sm italic mt-4 text-stone-600">
        &ldquo;{content.gathering_note}&rdquo;
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
  <div className="space-y-4" data-testid="stepper-block">
    {content.steps?.map((step, index) => {
      const isComplete = progress.has(index);
      
      return (
        <div 
          key={index}
          className={cn(
            "p-4 rounded-lg border transition-all bg-[#F3EFE8]",
            isComplete 
              ? cn(archetypeStyle.borderColor || "border-amber-600", "bg-[#EDE8DF]")
              : "border-stone-300"
          )}
        >
          <div className="flex items-start gap-3">
            <button
              onClick={() => onComplete(index)}
              className={cn(
                "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                isComplete 
                  ? "bg-amber-600 border-amber-600 text-white"
                  : "border-stone-400 hover:border-stone-500 bg-white"
              )}
              data-testid={`step-checkbox-${index}`}
            >
              {isComplete && <Check className="w-4 h-4" />}
            </button>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded font-cinzel bg-stone-200 text-stone-700"
                )}>
                  Step {step.step_number}
                </span>
                {step.duration_hint && (
                  <span className="text-xs flex items-center gap-1 text-stone-500">
                    <Clock className="w-3 h-3" /> {step.duration_hint}
                  </span>
                )}
              </div>
              
              <p className={cn("mb-2 text-stone-800", isComplete && "line-through opacity-60")}>
                {step.action}
              </p>
              
              {step.spoken_words && (
                <div className="p-3 rounded-lg mb-2 italic text-sm border bg-white border-amber-200">
                  <Quote className="w-4 h-4 inline mr-2 opacity-50 text-amber-600" />
                  <span className="text-stone-700">&ldquo;{step.spoken_words}&rdquo;</span>
                </div>
              )}
              
              {step.why && (
                <div className="text-sm text-stone-600">
                  <span className="font-medium">Why:</span> {step.why}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    })}
    
    {content.completion_message && progress.size === content.steps?.length && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg text-center border bg-[#EDE8DF] border-amber-500"
      >
        <Check className="w-6 h-6 mx-auto mb-2 text-amber-600" />
        <p className="font-cinzel text-stone-800">{content.completion_message}</p>
      </motion.div>
    )}
  </div>
);

// Lore Vignette Block - Historical/folkloric story - CONTRAST LOCKED
const LoreVignetteBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="lore-vignette-block">
    {content.title && (
      <h4 className="font-cinzel text-lg text-stone-800">{content.title}</h4>
    )}
    
    <div className="flex items-center gap-4 text-xs text-stone-500">>
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
const WardBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="ward-block">
    <div className="flex items-center gap-3">
      <Shield className="w-6 h-6 text-teal-600" />
      <div>
        <div className="font-cinzel text-lg text-stone-800">{content.ward_name}</div>
        <div className="text-sm text-stone-500">{content.purpose}</div>
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
const SongPromptBlock = ({ content, archetypeStyle }) => (
  <div className="space-y-4" data-testid="song-prompt-block">
    <div className="flex items-start gap-3">
      <Music className="w-6 h-6 text-amber-600" />
      <div>
        <p className="font-medium text-stone-800">{content.instruction}</p>
        {content.suggested_melody && (
          <p className="text-sm text-stone-500 mt-1">
            Suggested melody: {content.suggested_melody}
          </p>
        )}
      </div>
    </div>
    
    {content.words_optional && (
      <div className="p-3 bg-[#F3EFE8] border border-amber-300 rounded-lg italic text-sm text-stone-700">
        Optional words: &ldquo;{content.words_optional}&rdquo;
      </div>
    )}
    
    {content.purpose && (
      <p className="text-sm text-stone-600">{content.purpose}</p>
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
const JournalPromptBlock = ({ content, entries, onEntry, archetypeStyle }) => (
  <div className="space-y-4" data-testid="journal-prompt-block">
    {content.prompts?.map((prompt, i) => (
      <div key={i} className="p-3 bg-[#F3EFE8] border border-stone-300 rounded-lg">
        <p className="text-sm text-stone-700">{prompt}</p>
      </div>
    ))}
    
    {content.fields?.map((field) => (
      <div key={field.id} className="space-y-2">
        <label className="text-sm font-medium text-stone-700">{field.label}</label>
        <textarea
          value={entries[field.id] || ''}
          onChange={(e) => onEntry(field.id, e.target.value)}
          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-800"
          rows={3}
          placeholder={field.placeholder}
        />
      </div>
    ))}
  </div>
);

// Safety Note Block - CONTRAST LOCKED (Critical readability)
const SafetyNoteBlock = ({ content, archetypeStyle }) => (
  <div className="p-4 bg-[#F3EFE8] border-2 border-amber-500 rounded-lg" data-testid="safety-note-block">
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
      <div>
        <p className="text-sm text-stone-800 font-medium">{content.note}</p>
        {content.alternatives?.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm text-stone-600">
            {content.alternatives.map((alt, i) => (
              <li key={i}>• {alt}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);

export default SpellBlockRenderer;
