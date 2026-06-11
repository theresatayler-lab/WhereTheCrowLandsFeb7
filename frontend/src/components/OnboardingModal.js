import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { ARCHETYPES } from '../data/archetypes';

const ONBOARDING_KEY = 'crowlands_onboarding_complete';
const ARCHETYPE_KEY = 'crowlands_selected_archetype';

export const OnboardingModal = ({ onComplete, onSelectArchetype }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0); // 0: welcome, 1: select archetype
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasCompletedOnboarding) {
      // Use a microtask to avoid synchronous state update during effect
      queueMicrotask(() => setIsOpen(true));
    } else {
      // Load saved archetype
      const savedArchetype = localStorage.getItem(ARCHETYPE_KEY);
      if (savedArchetype && onSelectArchetype) {
        onSelectArchetype(savedArchetype);
      }
    }
  }, [onSelectArchetype]);

  const handleComplete = (archetypeId, goToSpellPage = false) => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    if (archetypeId) {
      localStorage.setItem(ARCHETYPE_KEY, archetypeId);
    }
    setIsOpen(false);
    if (onComplete) onComplete();
    if (onSelectArchetype) onSelectArchetype(archetypeId);
    
    // Navigate to spell request page if a guide was selected
    if (goToSpellPage) {
      navigate('/spell-request');
    }
  };

  const handleSkip = () => {
    handleComplete(null, false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-black/80 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && handleSkip()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-parchment border-2 border-primary/30 rounded-sm shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-primary transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 0 ? (
            <WelcomeStep onContinue={() => setStep(1)} onSkip={handleSkip} />
          ) : (
            <ArchetypeSelectionStep
              selectedArchetype={selectedArchetype}
              onSelect={setSelectedArchetype}
              onComplete={() => handleComplete(selectedArchetype, true)}
              onSkip={handleSkip}
              onBack={() => setStep(0)}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const WelcomeStep = ({ onContinue, onSkip }) => (
  <div className="p-8 md:p-12 text-center">
    {/* Decorative header */}
    <div className="flex justify-center mb-6">
      <div className="relative">
        <img src="/icons/anchors/gold/anchor-feather.png" alt="" className="w-16 h-16" />
        <img src="/icons/ui/gold/icon-sparkles.png" alt="" className="w-6 h-6 absolute -top-1 -right-1" />
      </div>
    </div>

    <h1 className="font-italiana text-3xl md:text-4xl text-primary mb-4">
      Welcome to Where the Crowlands
    </h1>

    <div className="max-w-2xl mx-auto space-y-4 mb-8">
      <p className="font-crimson text-lg text-foreground leading-relaxed">
        A place where the wisdom of your foremothers, the songs of birds, and the science of ritual meet.
      </p>
      <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
        Here, magic is not a mystery to be sold, but a practice to be reclaimed. Choose a guide from 
        the women who walked before you, or simply ask the wind for what you need.
      </p>
      <p className="font-crimson text-base text-accent italic">
        Every question is a spell, every answer a step towards your own power.
      </p>
    </div>

    {/* Features */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <FeatureCard
        iconSrc="/icons/anchors/gold/anchor-candle.png"
        title="Ancestral Wisdom"
        description="Learn from generations of women who practiced in secret"
      />
      <FeatureCard
        iconSrc="/icons/anchors/gold/anchor-notebook.png"
        title="Practical Rituals"
        description="Get tested formulas you can adapt to your own needs"
      />
      <FeatureCard
        iconSrc="/icons/ui/gold/icon-sparkles.png"
        title="Your Power"
        description="No gatekeepers. No intermediaries. Just you and the work."
      />
    </div>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={onContinue}
        className="px-8 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <span>Choose a Guide</span>
        <ArrowRight className="w-4 h-4" />
      </button>
      <button
        onClick={onSkip}
        className="px-8 py-3 bg-transparent text-muted-foreground border border-border rounded-sm font-montserrat tracking-widest uppercase text-sm hover:border-primary/30 hover:text-primary transition-colors"
      >
        Continue Without a Guide
      </button>
    </div>
  </div>
);

const FeatureCard = ({ iconSrc, title, description }) => (
  <div className="p-4 bg-card/50 border border-border rounded-sm">
    <img src={iconSrc} alt="" className="w-8 h-8 mx-auto mb-2" />
    <h3 className="font-cinzel text-sm text-secondary mb-1">{title}</h3>
    <p className="font-montserrat text-xs text-muted-foreground">{description}</p>
  </div>
);

const ArchetypeSelectionStep = ({ selectedArchetype, onSelect, onComplete, onSkip, onBack }) => (
  <div className="p-6 md:p-8">
    <div className="text-center mb-6">
      <h2 className="font-italiana text-2xl md:text-3xl text-primary mb-2">
        Choose Your Guide
      </h2>
      <p className="font-montserrat text-sm text-muted-foreground max-w-xl mx-auto">
        Each woman brings her own wisdom, ritual style, and era of practice. 
        Select one to personalize your experience, or continue without a guide.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {ARCHETYPES.map((archetype) => (
        <ArchetypeCard
          key={archetype.id}
          archetype={archetype}
          isSelected={selectedArchetype === archetype.id}
          onSelect={() => onSelect(archetype.id)}
        />
      ))}
    </div>

    <div className="flex flex-col sm:flex-row gap-3 justify-center border-t border-border pt-6">
      <button
        onClick={onBack}
        className="px-6 py-2 bg-transparent text-muted-foreground border border-border rounded-sm font-montserrat tracking-widest uppercase text-xs hover:border-primary/30 transition-colors"
      >
        Back
      </button>
      <button
        onClick={onComplete}
        disabled={!selectedArchetype}
        className="px-8 py-3 bg-primary text-primary-foreground rounded-sm font-montserrat tracking-widest uppercase text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span>{selectedArchetype ? 'Begin with Guide' : 'Select a Guide'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
      <button
        onClick={onSkip}
        className="px-6 py-2 bg-transparent text-muted-foreground border border-border rounded-sm font-montserrat tracking-widest uppercase text-xs hover:border-primary/30 transition-colors"
      >
        Skip for Now
      </button>
    </div>
  </div>
);

const ArchetypeCard = ({ archetype, isSelected, onSelect }) => {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`text-left bg-card/50 border-2 rounded-sm overflow-hidden transition-colors duration-300 ${
        isSelected
          ? 'border-primary shadow-lg shadow-primary/20'
          : 'border-border hover:border-primary/30'
      }`}
    >
      {/* Image or Placeholder */}
      <div 
        className="w-full h-40 flex items-center justify-center rounded-t-sm border-b border-border overflow-hidden relative"
        style={{ backgroundColor: '#F3EFE8' }}
      >
        {archetype.image ? (
          <>
            <img 
              src={archetype.image} 
              alt={archetype.shortName}
              className="w-full h-full object-cover object-center"
              style={{ 
                objectPosition: '50% 20%',
                mixBlendMode: 'multiply'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-2 right-2 text-2xl drop-shadow-lg">{archetype.birdEmoji}</span>
          </>
        ) : (
          <div className="relative flex flex-col items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-primary/30">
              <ellipse cx="50" cy="35" rx="18" ry="22" fill="currentColor" />
              <path d="M32 55 Q50 85 68 55 Q50 70 32 55" fill="currentColor" />
              <circle cx="50" cy="30" r="12" fill="currentColor" opacity="0.6" />
            </svg>
            <span className="text-2xl mt-1">{archetype.birdEmoji}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-cinzel text-base text-secondary">{archetype.shortName}</h3>
            <p className="font-montserrat text-xs text-primary">{archetype.title}</p>
          </div>
          <span className="text-xs font-montserrat text-muted-foreground bg-muted/50 px-2 py-1 rounded-sm">
            {archetype.era}
          </span>
        </div>
        
        <p className="font-montserrat text-xs text-muted-foreground mb-3 line-clamp-2">
          {archetype.bio.substring(0, 120)}...
        </p>
        
        <div className="flex items-center gap-2 text-xs font-montserrat text-accent">
          <span>{archetype.birdEmoji}</span>
          <span>{archetype.birdSymbol}</span>
        </div>
        
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 pt-3 border-t border-primary/20"
          >
            <p className="font-crimson text-xs text-primary italic line-clamp-2">
              {archetype.empowermentMessage.substring(0, 100)}...
            </p>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};

// Utility to reset onboarding (for testing)
export const resetOnboarding = () => {
  localStorage.removeItem(ONBOARDING_KEY);
  localStorage.removeItem(ARCHETYPE_KEY);
  window.location.reload();
};

// Utility to get current archetype
export const getCurrentArchetype = () => {
  return localStorage.getItem(ARCHETYPE_KEY);
};

// Utility to set archetype
export const setCurrentArchetype = (archetypeId) => {
  if (archetypeId) {
    localStorage.setItem(ARCHETYPE_KEY, archetypeId);
  } else {
    localStorage.removeItem(ARCHETYPE_KEY);
  }
};
