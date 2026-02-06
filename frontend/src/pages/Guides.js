import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { ARCHETYPES, getArchetypeById } from '../data/archetypes';
import { setCurrentArchetype, getCurrentArchetype } from '../components/OnboardingModal';
import { ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { BrandIcon } from '../components/BrandIcon';
import { DarkSection, LightSection, GrandDivider, MysticalDivider, ElaborateCorner, PageHeader, PageDivider, BestiaryGlyph, ATMOSPHERIC_IMAGES } from '../components/OrnateElements';

// Glyph mapping per guide
const GUIDE_GLYPHS = {
  theresa: { main: 'feather', secondary: 'crescent' },
  corrie: { main: 'owl', secondary: 'crescent' },
  cathleen: { main: 'triquetra', secondary: 'serpent' },
  emily: { main: 'candle', secondary: 'key' }
};

export const Guides = () => {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [expandedBio, setExpandedBio] = useState(null);
  const currentArchetypeId = getCurrentArchetype();
  const navigate = useNavigate();

  const handleSelectAsGuide = (archetypeId) => {
    setCurrentArchetype(archetypeId);
    const guideName = getArchetypeById(archetypeId).shortName;
    toast.success(`${guideName} is now your guide! Redirecting to spell crafting...`);
    
    // Navigate to spell-request page after a short delay
    setTimeout(() => {
      navigate('/spell-request');
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      {/* Dark Hero Section */}
      <DarkSection className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" variant="warm">
        <ElaborateCorner className="absolute top-3 left-3 w-16 h-16 sm:w-20 sm:h-20" variant="gold" />
        <ElaborateCorner className="absolute top-3 right-3 w-16 h-16 sm:w-20 sm:h-20 rotate-90" variant="gold" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PageHeader 
              icon={Users}
              title="Meet the Guides"
              subtitle="Four generations of women who practiced in secret, each with her own wisdom, ritual style, and way of seeing the world."
            />
            <p className="font-crimson text-base sm:text-lg text-gold/90 italic text-center max-w-2xl mx-auto px-2">
              &ldquo;The women who walked before you left their spells in stories, their magic in memories.&rdquo;
            </p>
          </motion.div>
          
          <GrandDivider variant="crow" />

          {/* Current Guide Banner */}
          {currentArchetypeId && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gold/10 border border-gold/40 rounded-sm text-center"
            >
              <p className="font-montserrat text-sm text-gold">
                <Check className="w-4 h-4 inline mr-2" />
                Your current guide: <strong className="text-gold-light">{getArchetypeById(currentArchetypeId)?.shortName}</strong>
              </p>
            </motion.div>
          )}
        </div>
      </DarkSection>

      {/* Light Section - Guides Grid */}
      <LightSection 
        className="py-12 sm:py-16 px-4 sm:px-6"
        atmosphericImage={ATMOSPHERIC_IMAGES.peonies}
        atmosphericOpacity={0.10}
        atmosphericPosition="center bottom"
        atmosphericTint="sepia"
      >
        <div className="max-w-6xl mx-auto">
          <GrandDivider variant="eye" light />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {ARCHETYPES.map((archetype, index) => (
              <GuideCard
                key={archetype.id}
                archetype={archetype}
                index={index}
                isCurrentGuide={currentArchetypeId === archetype.id}
                isExpanded={selectedGuide === archetype.id}
                isBioExpanded={expandedBio === archetype.id}
                onToggle={() => setSelectedGuide(selectedGuide === archetype.id ? null : archetype.id)}
                onToggleBio={() => setExpandedBio(expandedBio === archetype.id ? null : archetype.id)}
                onSelectAsGuide={() => handleSelectAsGuide(archetype.id)}
              />
            ))}
          </div>

          <MysticalDivider light />

          {/* Philosophy Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <div className="relative">
              <div className="absolute inset-0 border-2 border-gold/40 rounded-lg" />
              <div className="absolute inset-1.5 border border-crimson/20 rounded-md" />
              <div className="absolute inset-0 bg-white/80 rounded-lg" />
              
              <div className="relative z-10 p-6">
                <div className="flex items-start gap-4">
                  <BrandIcon name="book" size={36} opacity={0.9} />
                  <div>
                    <h3 className="font-cinzel text-xl text-crimson mb-3" style={{ textShadow: '0 0 20px rgba(185, 78, 106, 0.4)' }}>The Lineage</h3>
                    <p className="font-montserrat text-sm text-navy-dark/80 leading-relaxed mb-3">
                      These four women span over a century of practice—from Victorian Spitalfields to contemporary 
                      London. Each carried the magic forward in her own way: through craft, through secrets, through 
                      poetry, and through truth-telling.
                    </p>
                    <p className="font-crimson text-base text-gold-dark italic">
                      You don&apos;t need to choose just one. Their wisdom overlaps, contradicts, and complements. 
                      Like any family, they argue. Like any lineage, they build on what came before.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </LightSection>
    </div>
  );
};

const GuideCard = ({ archetype, index, isCurrentGuide, isExpanded, isBioExpanded, onToggle, onToggleBio, onSelectAsGuide }) => {
  const navigate = useNavigate();
  
  // Truncate bio for preview
  const bioPreview = archetype.bio.split('\n\n')[0]; // First paragraph only
  const hasMoreBio = archetype.bio.length > bioPreview.length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative bg-white/90 border-2 rounded-sm overflow-hidden transition-all duration-300 ${
        isCurrentGuide ? 'border-crimson shadow-lg' : 'border-gold/40 hover:border-crimson/50'
      }`}
    >
      {/* Corner accents with bestiary glyphs */}
      <span className="absolute top-2 left-2 z-10 opacity-70">
        <BestiaryGlyph animal={GUIDE_GLYPHS[archetype.id]?.main || 'feather'} size="sm" color="#b82330" />
      </span>
      <span className="absolute top-2 right-2 z-10 opacity-70">
        <BestiaryGlyph animal={GUIDE_GLYPHS[archetype.id]?.secondary || 'crescent'} size="sm" color="#d4a84b" />
      </span>
      
      {/* Image or Placeholder */}
      <div 
        className="w-full h-56 flex items-center justify-center border-b border-gold/30 overflow-hidden relative"
        style={{ backgroundColor: '#e8e4dc' }}
      >
        {archetype.image ? (
          <>
            <img 
              src={archetype.image} 
              alt={archetype.shortName}
              className="w-full h-full object-cover"
              style={{ 
                objectPosition: '50% 25%'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <span className="text-3xl drop-shadow-lg">{archetype.birdEmoji}</span>
              {isCurrentGuide && (
                <span className="text-xs font-montserrat text-primary-foreground bg-primary px-2 py-1 rounded-sm shadow-lg">
                  Your Guide
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="relative flex flex-col items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-28 h-28 text-primary/25">
              <ellipse cx="50" cy="35" rx="18" ry="22" fill="currentColor" />
              <path d="M32 55 Q50 85 68 55 Q50 70 32 55" fill="currentColor" />
              <circle cx="50" cy="30" r="12" fill="currentColor" opacity="0.6" />
            </svg>
            <span className="text-3xl mt-2">{archetype.birdEmoji}</span>
            {isCurrentGuide && (
              <span className="absolute top-3 right-3 text-xs font-montserrat text-cream bg-crimson px-2 py-1 rounded-sm">
                Your Guide
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {/* Portrait Image */}
            <div 
              className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold/40"
              style={{ backgroundColor: '#e8e4dc' }}
            >
              {archetype.image ? (
                <img 
                  src={archetype.image} 
                  alt={archetype.shortName}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '50% 20%' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  {archetype.birdEmoji}
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-phantasmagoria text-2xl text-crimson" style={{ textShadow: '0 0 20px rgba(185, 78, 106, 0.45)' }}>{archetype.shortName}</h2>
                {isCurrentGuide && (
                  <span className="text-xs font-montserrat text-cream bg-crimson px-2 py-0.5 rounded-sm">
                    Your Guide
                  </span>
                )}
              </div>
              <p className="font-cinzel text-sm text-gold-dark">{archetype.title}</p>
              <p className="font-montserrat text-xs text-navy-dark/60 mt-1">{archetype.era}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl">{archetype.birdEmoji}</span>
            <p className="font-montserrat text-xs text-gold-dark">{archetype.birdSymbol}</p>
          </div>
        </div>

        {/* Bio - Collapsible */}
        <div className="mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={isBioExpanded ? 'expanded' : 'collapsed'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-montserrat text-sm text-navy-dark/80 leading-relaxed whitespace-pre-line">
                {isBioExpanded ? archetype.bio : bioPreview}
              </p>
            </motion.div>
          </AnimatePresence>
          
          {hasMoreBio && (
            <button
              onClick={onToggleBio}
              className="mt-2 flex items-center gap-1 text-crimson hover:text-crimson-bright transition-colors font-montserrat text-xs"
            >
              {isBioExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Show less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Read full story</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Empowerment Message */}
        <div className="p-4 bg-crimson/5 border-l-2 border-crimson rounded-r-sm mb-4">
          <p className="font-crimson text-sm text-crimson/90 italic">
            {archetype.empowermentMessage}
          </p>
        </div>

        {/* Expandable Details */}
        <button
          onClick={onToggle}
          className="w-full text-left font-montserrat text-xs text-crimson uppercase tracking-wider flex items-center gap-2 mb-4 hover:text-crimson-bright transition-colors"
        >
          <span>{isExpanded ? 'Hide Specialties & Details' : 'Show Specialties & Details'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 border-t border-border pt-4 overflow-hidden"
            >
              {/* Ritual Style */}
              <CollapsibleSection title="Ritual Style" defaultOpen={true}>
                <p className="font-montserrat text-xs text-navy-dark/70">{archetype.ritualStyle}</p>
              </CollapsibleSection>

              {/* Specialties */}
              <CollapsibleSection title="Specialties" defaultOpen={true}>
                <div className="flex flex-wrap gap-2">
                  {archetype.specialties.map((specialty, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gold/20 border border-gold/30 text-xs font-montserrat text-navy-dark/70 rounded-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Best For */}
              <CollapsibleSection title="Best For">
                <ul className="space-y-1">
                  {archetype.bestFor.map((item, i) => (
                    <li key={i} className="font-montserrat text-xs text-navy-dark/70 flex items-start gap-2">
                      <Sparkles className="w-3 h-3 text-gold-dark flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              {/* Tenets */}
              <CollapsibleSection title="Core Tenets">
                <ul className="space-y-1">
                  {archetype.tenets.slice(0, 5).map((tenet, i) => (
                    <li key={i} className="font-crimson text-xs text-navy-dark/70 italic">
                      &ldquo;{tenet}&rdquo;
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              {/* Historical Sources */}
              <CollapsibleSection title="Historical Sources">
                <ul className="space-y-1">
                  {archetype.historicalSources.map((source, i) => (
                    <li key={i} className="font-montserrat text-xs text-navy-dark/70">
                      • {source}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        {!isCurrentGuide && (
          <button
            onClick={onSelectAsGuide}
            className="w-full mt-4 px-4 py-2 relative overflow-hidden rounded-sm font-montserrat tracking-widest uppercase text-xs flex items-center justify-center gap-2"
          >
            <span className="absolute inset-0 border border-gold/50 rounded-sm" />
            <span className="absolute inset-0.5 bg-gradient-to-r from-crimson-deep via-crimson to-crimson-deep rounded-sm" />
            <span className="relative text-cream flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Choose as My Guide</span>
            </span>
          </button>
        )}
        
        {/* Special Cathleen Feature - Ward Finder */}
        {archetype.id === 'kathleen' && (
          <button
            onClick={() => navigate('/ward-finder')}
            className="w-full mt-3 px-4 py-2 bg-gold/10 text-navy-dark border border-gold/40 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-gold/20 transition-all flex items-center justify-center gap-2"
          >
            <Hand className="w-4 h-4" />
            <span>Find Your Ward</span>
          </button>
        )}
        
        {/* Special Shigg Feature - What Would Corrie Do */}
        {archetype.id === 'shiggy' && (
          <button
            onClick={() => navigate('/corrie-tarot')}
            className="w-full mt-3 px-4 py-2 bg-primary/20 text-primary border border-primary/40 rounded-sm font-montserrat tracking-widest uppercase text-xs hover:bg-primary/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-base">📺</span>
            <span>What Would Corrie Do?</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Collapsible section component for nested content
const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gold/20 pb-3 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <h4 className="font-cinzel text-sm text-crimson">{title}</h4>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-crimson/60" />
        ) : (
          <ChevronDown className="w-4 h-4 text-crimson/60" />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
