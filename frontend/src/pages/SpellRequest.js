import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GrimoirePage } from '../components/GrimoirePage';
import { aiAPI, subscriptionAPI } from '../utils/api';
import { ARCHETYPES, getArchetypeById } from '../data/archetypes';
import { getCurrentArchetype, setCurrentArchetype } from '../components/OnboardingModal';
import { SpellLimitBanner } from '../components/UpgradePrompt';
import { DarkSection, LightSection, GrandDivider, MysticalDivider, ElaborateCorner, PageHeader, OrnateCard, LightOrnateCard } from '../components/OrnateElements';
import { 
  Sparkles, ChevronRight, ChevronLeft, Check, Loader2, 
  User, Clock, Heart, Flame, Shield, Eye, Zap, Cloud,
  Coffee, Scissors, Sun, Moon, Bird, Home, Bath, Briefcase, TreeDeciduous
} from 'lucide-react';
import { toast } from 'sonner';

// ===== WIZARD CONFIGURATION =====

const PERSONAS = [
  { id: 'shiggy', name: 'Shigg', emoji: '🐦', title: 'Birds of Parliament', description: 'Gentle domestic magic, bird omens, tea rituals, poetry' },
  { id: 'kathleen', name: 'Cathleen', emoji: '🪶', title: 'Singer of Strength', description: 'Voice magic, protection, Celtic mysticism, the Morrigan' },
  { id: 'catherine', name: 'Katherine', emoji: '🪡', title: 'Weaver of Hidden Knowledge', description: 'Shadow work, mirrors, Victorian spiritualism, protocols' },
  { id: 'choose_for_me', name: 'Choose for me', emoji: '✨', title: 'Let the spell decide', description: 'Based on your needs, the right guide will emerge' }
];

const FEELINGS = [
  { id: 'calm', label: 'Calm', icon: Cloud, color: 'text-blue-400' },
  { id: 'brave', label: 'Brave', icon: Shield, color: 'text-amber-400' },
  { id: 'clear', label: 'Clear', icon: Eye, color: 'text-purple-400' },
  { id: 'protected', label: 'Protected', icon: Shield, color: 'text-green-400' },
  { id: 'softened', label: 'Softened', icon: Heart, color: 'text-pink-400' },
  { id: 'energized', label: 'Energized', icon: Zap, color: 'text-yellow-400' }
];

const TIMES = [
  { id: '2_min', label: '2 minutes', description: 'Quick & immediate' },
  { id: '10_min', label: '10 minutes', description: 'Focused ritual' },
  { id: '30_min', label: '30 minutes', description: 'Full ceremony' }
];

const TONES = [
  { id: 'gentle', label: 'Gentle', description: 'Soft, nurturing, invitational' },
  { id: 'practical', label: 'Practical', description: 'Clear, direct, grounded' },
  { id: 'intense', label: 'Intense', description: 'Powerful, unflinching, deep' }
];

const BELIEF_BOUNDARIES = [
  { id: 'secular_reflective', label: 'Secular & Reflective', description: 'Psychology-focused, no supernatural framing' },
  { id: 'spiritual_grounded', label: 'Spiritual & Grounded', description: 'Energy work, universe, nature-based' },
  { id: 'deity_friendly', label: 'Deity Friendly', description: 'Open to invoking specific divine figures' },
  { id: 'ancestor_friendly', label: 'Ancestor Friendly', description: 'Connecting with lineage and those who came before' }
];

const ANCHORS = [
  { id: 'tea', label: 'Tea', emoji: '☕', forPersonas: ['shiggy'] },
  { id: 'thread', label: 'Thread', emoji: '🧵', forPersonas: ['catherine', 'kathleen'] },
  { id: 'candle', label: 'Candle', emoji: '🕯️', forPersonas: ['shiggy', 'kathleen', 'catherine'] },
  { id: 'salt', label: 'Salt', emoji: '🧂', forPersonas: ['shiggy', 'kathleen', 'catherine'] },
  { id: 'bird', label: 'Bird', emoji: '🐦', forPersonas: ['shiggy'] },
  { id: 'mirror', label: 'Mirror', emoji: '🪞', forPersonas: ['catherine', 'kathleen'] },
  { id: 'song', label: 'Song/Voice', emoji: '🎵', forPersonas: ['kathleen'] }
];

const SETTINGS = [
  { id: 'kitchen', label: 'Kitchen', icon: Coffee },
  { id: 'bedroom', label: 'Bedroom', icon: Moon },
  { id: 'outdoors', label: 'Outdoors', icon: TreeDeciduous },
  { id: 'bath', label: 'Bath', icon: Bath },
  { id: 'desk', label: 'Desk/Office', icon: Briefcase }
];

// ===== WIZARD STEP COMPONENTS =====

const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <div key={i} className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-sm transition-all ${
          i < currentStep 
            ? 'bg-gold text-navy-dark' 
            : i === currentStep 
              ? 'bg-crimson text-cream border-2 border-gold' 
              : 'bg-navy-mid/50 text-cream/50'
        }`}>
          {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
        </div>
        {i < totalSteps - 1 && (
          <div className={`w-8 h-0.5 mx-1 ${i < currentStep ? 'bg-gold' : 'bg-navy-mid/50'}`} />
        )}
      </div>
    ))}
  </div>
);

const OptionCard = ({ selected, onClick, children, className = '' }) => (
  <motion.button
    onClick={onClick}
    className={`relative p-4 rounded-sm text-left transition-all ${
      selected 
        ? 'bg-gradient-to-br from-crimson/20 to-crimson/10 border-2 border-crimson shadow-lg' 
        : 'bg-navy-mid/30 border border-gold/20 hover:border-gold/40'
    } ${className}`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {selected && (
      <div className="absolute top-2 right-2">
        <Check className="w-4 h-4 text-crimson" />
      </div>
    )}
    {children}
  </motion.button>
);

// Step 1: Persona & Query
const Step1 = ({ spellSpec, updateSpec }) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-cinzel text-lg text-gold-light mb-4">Who will guide your spell?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PERSONAS.map((p) => (
          <OptionCard
            key={p.id}
            selected={spellSpec.persona_id === p.id}
            onClick={() => updateSpec({ persona_id: p.id })}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{p.emoji}</span>
              <div>
                <p className="font-cinzel text-cream">{p.name}</p>
                <p className="font-montserrat text-xs text-cream/60">{p.title}</p>
              </div>
            </div>
            <p className="font-montserrat text-xs text-cream/50 mt-2">{p.description}</p>
          </OptionCard>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-cinzel text-lg text-gold-light mb-2">What do you need?</h3>
      <p className="font-montserrat text-xs text-cream/60 mb-3">Tell me in your own words what you're facing or seeking.</p>
      <textarea
        value={spellSpec.user_query || ''}
        onChange={(e) => updateSpec({ user_query: e.target.value })}
        placeholder="I need courage to speak up at work... / I'm grieving and need comfort... / I want to protect my home... / I need clarity about a decision..."
        className="w-full h-28 bg-navy-dark/50 border border-gold/30 focus:border-gold/60 rounded-sm px-4 py-3 text-cream font-montserrat text-sm placeholder:text-cream/30 resize-none"
      />
    </div>

    <div>
      <h3 className="font-cinzel text-lg text-gold-light mb-3">How do you want to feel after?</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {FEELINGS.map((f) => {
          const Icon = f.icon;
          return (
            <OptionCard
              key={f.id}
              selected={spellSpec.desired_feeling === f.id}
              onClick={() => updateSpec({ desired_feeling: f.id })}
              className="py-3"
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className={`w-4 h-4 ${f.color}`} />
                <span className="font-montserrat text-sm text-cream">{f.label}</span>
              </div>
            </OptionCard>
          );
        })}
      </div>
    </div>
  </div>
);

// Step 2: Time, Tone, Belief
const Step2 = ({ spellSpec, updateSpec }) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-cinzel text-lg text-gold-light mb-3">How much time do you have?</h3>
      <div className="grid grid-cols-3 gap-3">
        {TIMES.map((t) => (
          <OptionCard
            key={t.id}
            selected={spellSpec.time === t.id}
            onClick={() => updateSpec({ time: t.id })}
          >
            <div className="text-center">
              <Clock className={`w-5 h-5 mx-auto mb-1 ${spellSpec.time === t.id ? 'text-crimson' : 'text-cream/60'}`} />
              <p className="font-montserrat text-sm text-cream">{t.label}</p>
              <p className="font-montserrat text-xs text-cream/50">{t.description}</p>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-cinzel text-lg text-gold-light mb-3">What tone feels right?</h3>
      <div className="grid grid-cols-3 gap-3">
        {TONES.map((t) => (
          <OptionCard
            key={t.id}
            selected={spellSpec.tone === t.id}
            onClick={() => updateSpec({ tone: t.id })}
          >
            <div className="text-center">
              <p className="font-montserrat text-sm text-cream mb-1">{t.label}</p>
              <p className="font-montserrat text-xs text-cream/50">{t.description}</p>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-cinzel text-lg text-gold-light mb-3">Your belief comfort zone</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BELIEF_BOUNDARIES.map((b) => (
          <OptionCard
            key={b.id}
            selected={spellSpec.belief_boundary === b.id}
            onClick={() => updateSpec({ belief_boundary: b.id })}
          >
            <p className="font-montserrat text-sm text-cream">{b.label}</p>
            <p className="font-montserrat text-xs text-cream/50 mt-1">{b.description}</p>
          </OptionCard>
        ))}
      </div>
    </div>
  </div>
);

// Step 3: Anchor, Setting, Name, Avoid
const Step3 = ({ spellSpec, updateSpec }) => {
  const relevantAnchors = ANCHORS.filter(a => 
    !a.forPersonas || 
    a.forPersonas.includes(spellSpec.persona_id) || 
    spellSpec.persona_id === 'choose_for_me'
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-cinzel text-lg text-gold-light mb-3">Choose an anchor object</h3>
        <p className="font-montserrat text-xs text-cream/60 mb-3">This will be central to your ritual.</p>
        <div className="flex flex-wrap gap-2">
          {relevantAnchors.map((a) => (
            <OptionCard
              key={a.id}
              selected={spellSpec.anchor_object === a.id}
              onClick={() => updateSpec({ anchor_object: a.id })}
              className="px-4 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{a.emoji}</span>
                <span className="font-montserrat text-sm text-cream">{a.label}</span>
              </div>
            </OptionCard>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-cinzel text-lg text-gold-light mb-3">Where will you perform this?</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {SETTINGS.map((s) => {
            const Icon = s.icon;
            return (
              <OptionCard
                key={s.id}
                selected={spellSpec.setting === s.id}
                onClick={() => updateSpec({ setting: s.id })}
                className="py-3"
              >
                <div className="text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${spellSpec.setting === s.id ? 'text-crimson' : 'text-cream/60'}`} />
                  <p className="font-montserrat text-xs text-cream">{s.label}</p>
                </div>
              </OptionCard>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-cinzel text-lg text-gold-light mb-2">Your name (optional)</h3>
          <p className="font-montserrat text-xs text-cream/60 mb-2">For a more personal spell.</p>
          <input
            type="text"
            value={spellSpec.user_name || ''}
            onChange={(e) => updateSpec({ user_name: e.target.value })}
            placeholder="Name or nickname..."
            className="w-full bg-navy-dark/50 border border-gold/30 focus:border-gold/60 rounded-sm px-4 py-2 text-cream font-montserrat text-sm placeholder:text-cream/30"
          />
        </div>

        <div>
          <h3 className="font-cinzel text-lg text-gold-light mb-2">Anything to avoid? (optional)</h3>
          <p className="font-montserrat text-xs text-cream/60 mb-2">Topics or elements to exclude.</p>
          <input
            type="text"
            value={spellSpec.avoid || ''}
            onChange={(e) => updateSpec({ avoid: e.target.value })}
            placeholder="e.g., fire, spirit contact, blood..."
            className="w-full bg-navy-dark/50 border border-gold/30 focus:border-gold/60 rounded-sm px-4 py-2 text-cream font-montserrat text-sm placeholder:text-cream/30"
          />
        </div>
      </div>
    </div>
  );
};

// ===== MAIN COMPONENT =====

export const SpellRequest = () => {
  const [step, setStep] = useState(0);
  const [spellSpec, setSpellSpec] = useState({
    persona_id: getCurrentArchetype() || 'choose_for_me',
    user_query: '',
    desired_feeling: 'calm',
    time: '10_min',
    tone: 'practical',
    belief_boundary: 'spiritual_grounded',
    anchor_object: 'candle',
    setting: 'bedroom',
    user_name: '',
    avoid: ''
  });
  const [loading, setLoading] = useState(false);
  const [spellResult, setSpellResult] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const status = await subscriptionAPI.getStatus();
          setSubscriptionStatus(status);
        } catch (error) {
          console.error('Failed to load subscription status:', error);
        }
      }
    };
    loadSubscriptionStatus();
  }, []);

  const updateSpec = (updates) => {
    setSpellSpec(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    if (step === 0) {
      return spellSpec.persona_id && spellSpec.user_query?.trim().length > 10 && spellSpec.desired_feeling;
    }
    if (step === 1) {
      return spellSpec.time && spellSpec.tone && spellSpec.belief_boundary;
    }
    if (step === 2) {
      return spellSpec.anchor_object && spellSpec.setting;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!canProceed()) {
      toast.error('Please complete all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Use the new personalized spell endpoint
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ai/generate-personalized-spell`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify({
          spell_spec: spellSpec,
          generate_images: true
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403 && errorData.detail?.error === 'spell_limit_reached') {
          toast.error(errorData.detail.message);
          return;
        }
        throw new Error('Failed to generate spell');
      }
      
      const data = await response.json();
      setSpellResult(data);
      
      // Update persona if it was chosen for them
      if (spellSpec.persona_id === 'choose_for_me' && data.archetype?.id) {
        setCurrentArchetype(data.archetype.id);
      }
      
      toast.success('Your spell has been crafted!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Update subscription status if limits changed
      if (data.limit_info) {
        const token = localStorage.getItem('token');
        if (token) {
          const status = await subscriptionAPI.getStatus();
          setSubscriptionStatus(status);
        }
      }
    } catch (error) {
      console.error('Spell generation error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSpell = () => {
    setSpellResult(null);
    setStep(0);
    setSpellSpec(prev => ({
      ...prev,
      user_query: '',
      user_name: '',
      avoid: ''
    }));
  };

  // If spell result exists, show the result page
  if (spellResult) {
    return (
      <div className="min-h-screen">
        <DarkSection className="py-8 px-4" variant="warm">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleNewSpell}
              className="mb-6 px-4 py-2 bg-navy-mid/50 text-gold border border-gold/30 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-gold/10 transition-all"
            >
              ← Create Another Spell
            </button>
            <GrimoirePage 
              spell={spellResult.spell}
              archetype={spellResult.archetype}
              imageBase64={spellResult.image_base64}
              assetPlan={spellResult.asset_plan}
              inspirations={spellResult.spell?.inspired_by}
              onNewSpell={handleNewSpell}
            />
          </div>
        </DarkSection>
      </div>
    );
  }

  const STEPS = [
    { title: 'Your Intention', component: Step1 },
    { title: 'Style & Approach', component: Step2 },
    { title: 'Details & Personalization', component: Step3 }
  ];

  const CurrentStepComponent = STEPS[step].component;

  return (
    <div className="min-h-screen">
      {/* Dark Hero Section */}
      <DarkSection className="py-10 sm:py-14 px-4 sm:px-6" variant="warm">
        <ElaborateCorner className="absolute top-3 left-3 w-16 h-16 sm:w-20 sm:h-20" variant="gold" />
        <ElaborateCorner className="absolute top-3 right-3 w-16 h-16 sm:w-20 sm:h-20 rotate-90" variant="gold" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PageHeader 
              icon={Sparkles}
              title="Craft Your Spell"
              subtitle="Answer a few questions and receive a personalized ritual crafted just for you"
            />
          </motion.div>
          
          {/* Subscription Banner */}
          {subscriptionStatus && subscriptionStatus.subscription_tier === 'free' && (
            <SpellLimitBanner 
              remaining={subscriptionStatus.spells_remaining} 
              total={subscriptionStatus.spell_limit}
            />
          )}
          
          <GrandDivider variant="sparkle" />
        </div>
      </DarkSection>

      {/* Wizard Section */}
      <LightSection className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <StepIndicator currentStep={step} totalSteps={STEPS.length} />
          
          <LightOrnateCard hover={false}>
            <div className="mb-4">
              <h2 className="font-cinzel text-xl text-crimson">
                Step {step + 1}: {STEPS[step].title}
              </h2>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CurrentStepComponent spellSpec={spellSpec} updateSpec={updateSpec} />
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-crimson/20">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
                className="px-4 py-2 bg-parchment border border-crimson/30 text-crimson rounded-sm font-montserrat text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-crimson/5 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="px-6 py-2 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep text-cream rounded-sm font-montserrat text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:from-crimson hover:via-crimson-bright hover:to-crimson transition-all flex items-center gap-2 border border-gold/30"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={loading || !canProceed()}
                  className="px-6 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-navy-dark rounded-sm font-montserrat text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-gold hover:via-gold-light hover:to-gold transition-all flex items-center gap-2 border border-crimson/30"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Crafting your spell...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate My Spell
                    </>
                  )}
                </button>
              )}
            </div>
          </LightOrnateCard>
          
          <MysticalDivider light />
          
          {/* SpellSpec Preview (for debugging - can be removed) */}
          <details className="mt-4">
            <summary className="font-montserrat text-xs text-navy-dark/40 cursor-pointer">View SpellSpec</summary>
            <pre className="mt-2 p-3 bg-navy-dark/5 rounded text-xs overflow-auto">
              {JSON.stringify(spellSpec, null, 2)}
            </pre>
          </details>
        </div>
      </LightSection>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-dark/90 backdrop-blur-md z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { repeat: Infinity, duration: 3, ease: 'linear' },
                  scale: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
                }}
                className="w-20 h-20 mx-auto mb-6"
              >
                <Sparkles className="w-full h-full text-gold" />
              </motion.div>
              <h2 className="font-italiana text-2xl text-gold-light mb-2">Weaving your spell...</h2>
              <p className="font-montserrat text-sm text-cream/60">
                {spellSpec.persona_id !== 'choose_for_me' 
                  ? `${PERSONAS.find(p => p.id === spellSpec.persona_id)?.name} is crafting something special`
                  : 'Finding the right guide for you'
                }
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <DarkSection className="py-8 px-4" variant="warm">
        <ElaborateCorner className="absolute bottom-3 left-3 w-16 h-16 -rotate-90" variant="gold" />
        <ElaborateCorner className="absolute bottom-3 right-3 w-16 h-16 rotate-180" variant="gold" />
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <p className="font-crimson text-sm text-cream/60 italic">
            Each spell is unique, crafted for this moment, for you.
          </p>
          <div className="flex items-center justify-center gap-4 text-gold/50 mt-3">
            <span>☽</span>
            <span className="text-crimson/60">❦</span>
            <span>✨</span>
            <span className="text-crimson/60">❦</span>
            <span>☾</span>
          </div>
        </div>
      </DarkSection>
    </div>
  );
};
