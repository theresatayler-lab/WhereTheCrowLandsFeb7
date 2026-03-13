import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SpellBookView - Three-stage spell presentation
 * 
 * Stage 1: Flippable tarot card (front = illustration, back = quick summary)
 * Stage 2: Full Ritual View - card front + summary side-by-side, spell below
 */
export default function SpellBookView({ 
  children, // Spell content (full ritual)
  tarotImageUrl,
  title,
  guideName,
  spellNumber = "I",
  spell, // Full spell object for extracting summary data
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFullRitual, setShowFullRitual] = useState(false);

  // Extract quick summary data from spell
  const essence = spell?.tarot_card?.essence || spell?.essence || "A working to transform your intention into reality.";
  const keyAction = spell?.tarot_card?.key_action || extractKeyAction(spell);
  const timing = spell?.tarot_card?.timing || spell?.timing || "When you feel ready";
  const materials = extractMaterials(spell);

  return (
    <div className="spell-book-container mx-auto max-w-4xl" data-testid="spell-book-view">
      <AnimatePresence mode="wait">
        {!showFullRitual ? (
          /* === STAGE 1: FLIPPABLE CARD VIEW === */
          <motion.div
            key="card-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Flippable Card Container */}
            <div 
              className="relative mx-auto cursor-pointer"
              style={{ perspective: '1500px', maxWidth: '380px' }}
              onClick={() => setIsFlipped(!isFlipped)}
              data-testid="flippable-card"
            >
              <motion.div
                className="relative w-full"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* FRONT - Tarot Card Image */}
                <div 
                  className="w-full"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <TarotCardFront 
                    tarotImageUrl={tarotImageUrl}
                    title={title}
                    guideName={guideName}
                  />
                </div>

                {/* BACK - Quick Spell Summary */}
                <div 
                  className="absolute inset-0 w-full"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <QuickSummaryCard
                    title={title}
                    essence={essence}
                    keyAction={keyAction}
                    timing={timing}
                    materials={materials}
                    guideName={guideName}
                  />
                </div>
              </motion.div>
            </div>

            {/* Flip instruction */}
            <p className="text-center text-gold/50 text-sm mt-6 font-crimson italic tracking-wide">
              {isFlipped ? "← Tap to see the card" : "Tap to reveal the spell summary →"}
            </p>

            {/* View Full Ritual Button */}
            <div className="text-center mt-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullRitual(true);
                }}
                className="font-cinzel text-sm px-8 py-3 bg-ember/90 hover:bg-ember text-cream rounded-sm transition-all duration-300 border border-gold/30 hover:border-gold/50 shadow-lg hover:shadow-xl tracking-wider uppercase"
                data-testid="view-full-ritual-btn"
              >
                View Full Ritual
              </button>
            </div>
          </motion.div>
        ) : (
          /* === STAGE 2: FULL RITUAL VIEW === */
          <motion.div
            key="full-ritual"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Back to Card View */}
            <button
              onClick={() => setShowFullRitual(false)}
              className="mb-6 text-gold/60 hover:text-gold text-sm font-crimson flex items-center gap-2 transition-colors"
              data-testid="back-to-card-btn"
            >
              <span>←</span> Back to tarot card
            </button>

            {/* Side-by-Side Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Left: Tarot Card Front */}
              <div className="flex justify-center md:justify-end">
                <div style={{ maxWidth: '320px', width: '100%' }}>
                  <TarotCardFront 
                    tarotImageUrl={tarotImageUrl}
                    title={title}
                    guideName={guideName}
                    compact
                  />
                </div>
              </div>
              
              {/* Right: Quick Summary */}
              <div className="flex justify-center md:justify-start">
                <div style={{ maxWidth: '320px', width: '100%' }}>
                  <QuickSummaryCard
                    title={title}
                    essence={essence}
                    keyAction={keyAction}
                    timing={timing}
                    materials={materials}
                    guideName={guideName}
                    compact
                  />
                </div>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center py-6">
              <div className="h-px w-16 bg-gold/30" />
              <img 
                src="/images/ornaments/divider-rose-crows.png" 
                alt="" 
                className="h-8 w-auto mx-4 opacity-60"
              />
              <div className="h-px w-16 bg-gold/30" />
            </div>

            {/* Full Spell Content */}
            <FullRitualContent title={title} spellNumber={spellNumber}>
              {children}
            </FullRitualContent>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper: Extract key action from spell blocks
function extractKeyAction(spell) {
  if (!spell?.blocks) return null;
  const stepper = spell.blocks.find(b => b.block_type === 'stepper');
  if (stepper?.content?.steps?.[0]) {
    return stepper.content.steps[0].title || stepper.content.steps[0].action?.slice(0, 80);
  }
  return null;
}

// Helper: Extract materials list
function extractMaterials(spell) {
  if (!spell?.blocks) return [];
  const materialsBlock = spell.blocks.find(b => b.block_type === 'materials');
  if (materialsBlock?.content?.items) {
    return materialsBlock.content.items.slice(0, 4).map(i => i.name);
  }
  return [];
}

/**
 * TarotCardFront - The tarot card illustration side
 */
function TarotCardFront({ tarotImageUrl, title, guideName, compact = false }) {
  return (
    <div 
      className="relative overflow-hidden rounded-lg"
      style={{
        backgroundColor: '#0a0a0a',
        border: '2px solid #C8A44D',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 0 60px rgba(200,164,77,0.05)'
      }}
      data-testid="tarot-card-front"
    >
      {/* Gold corner accents */}
      <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-gold/60" />
      <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-gold/60" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-gold/60" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-gold/60" />

      {/* Card content */}
      <div className={`relative z-5 ${compact ? 'p-4' : 'p-5 sm:p-6'}`}>
        {/* Tarot Image */}
        <div className="relative mx-auto">
          {tarotImageUrl ? (
            <img 
              src={tarotImageUrl}
              alt={title || "Spell Tarot Card"}
              className="w-full h-auto rounded"
              style={{
                border: '1px solid rgba(200,164,77,0.3)',
              }}
            />
          ) : (
            <div 
              className="w-full aspect-[2/3] rounded flex items-center justify-center"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              <img 
                src="/images/frames/crowlands-tarot-card.png"
                alt=""
                className="w-full h-full object-contain opacity-80"
              />
            </div>
          )}
        </div>

        {/* Title beneath card */}
        <div className={`text-center ${compact ? 'mt-3' : 'mt-5'}`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-8 bg-gold/40" />
            <span className="font-cinzel text-[10px] text-gold/50 tracking-[0.2em] uppercase">
              {guideName ? `by ${guideName}` : 'Spell'}
            </span>
            <div className="h-px w-8 bg-gold/40" />
          </div>
          
          <h3 className={`font-cinzel text-cream ${compact ? 'text-base' : 'text-lg sm:text-xl'}`}>
            {title || "Untitled Spell"}
          </h3>
        </div>
      </div>
    </div>
  );
}

/**
 * QuickSummaryCard - The back of the tarot card with spell summary
 */
function QuickSummaryCard({ title, essence, keyAction, timing, materials, guideName, compact = false }) {
  return (
    <div 
      className="relative overflow-hidden rounded-lg h-full"
      style={{
        backgroundColor: '#F5F0E6',
        backgroundImage: "url('/images/textures/parchment-texture.png')",
        backgroundSize: "cover",
        border: '2px solid #C8A44D',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}
      data-testid="quick-summary-card"
    >
      {/* Decorative corner flourishes */}
      <img 
        src="/images/spell-decor/corner-flourish.png"
        alt=""
        className={`absolute top-0 left-0 ${compact ? 'w-12 h-12' : 'w-16 h-16'} z-10 pointer-events-none opacity-60`}
      />
      <img 
        src="/images/spell-decor/corner-flourish.png"
        alt=""
        className={`absolute top-0 right-0 ${compact ? 'w-12 h-12' : 'w-16 h-16'} z-10 pointer-events-none opacity-60`}
        style={{ transform: 'scaleX(-1)' }}
      />
      <img 
        src="/images/spell-decor/corner-flourish.png"
        alt=""
        className={`absolute bottom-0 left-0 ${compact ? 'w-12 h-12' : 'w-16 h-16'} z-10 pointer-events-none opacity-60`}
        style={{ transform: 'scaleY(-1)' }}
      />
      <img 
        src="/images/spell-decor/corner-flourish.png"
        alt=""
        className={`absolute bottom-0 right-0 ${compact ? 'w-12 h-12' : 'w-16 h-16'} z-10 pointer-events-none opacity-60`}
        style={{ transform: 'scale(-1, -1)' }}
      />

      {/* Content */}
      <div className={`relative z-5 ${compact ? 'p-4 pt-6' : 'p-6 pt-8'} h-full flex flex-col`}>
        {/* Header label */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-6 bg-gold-dark/40" />
          <span className="font-cinzel text-[10px] text-gold-dark/60 tracking-[0.2em] uppercase">
            Spell Summary
          </span>
          <div className="h-px w-6 bg-gold-dark/40" />
        </div>

        {/* Title */}
        <h3 className={`font-cinzel text-navy-dark text-center ${compact ? 'text-base mb-3' : 'text-lg mb-4'}`}>
          {title || "Your Spell"}
        </h3>

        {/* Essence */}
        {essence && (
          <div className="mb-4">
            <p className={`font-crimson text-navy-dark/80 italic text-center leading-relaxed ${compact ? 'text-sm' : 'text-base'}`}>
              "{essence}"
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center justify-center py-2">
          <div className="h-px w-full bg-gold/20" />
        </div>

        {/* Quick info grid */}
        <div className="flex-1 space-y-3">
          {keyAction && (
            <div>
              <p className="font-cinzel text-[10px] text-gold-dark/70 tracking-wider uppercase mb-1">
                Begin With
              </p>
              <p className={`font-crimson text-navy-dark ${compact ? 'text-xs' : 'text-sm'}`}>
                {keyAction}
              </p>
            </div>
          )}

          {materials?.length > 0 && (
            <div>
              <p className="font-cinzel text-[10px] text-gold-dark/70 tracking-wider uppercase mb-1">
                You'll Need
              </p>
              <p className={`font-crimson text-navy-dark/80 ${compact ? 'text-xs' : 'text-sm'}`}>
                {materials.join(' · ')}
              </p>
            </div>
          )}

          {timing && (
            <div>
              <p className="font-cinzel text-[10px] text-gold-dark/70 tracking-wider uppercase mb-1">
                Best Time
              </p>
              <p className={`font-crimson text-navy-dark/80 ${compact ? 'text-xs' : 'text-sm'}`}>
                {timing}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {guideName && (
          <p className={`font-crimson text-gold-dark/50 text-center italic mt-4 ${compact ? 'text-xs' : 'text-sm'}`}>
            Crafted by {guideName}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * FullRitualContent - The scrollable spell content with elegant book-page styling
 */
function FullRitualContent({ children, title, spellNumber }) {
  return (
    <div 
      className="relative"
      style={{ 
        minHeight: '400px',
      }}
      data-testid="full-ritual-content"
    >
      {/* Parchment background */}
      <div 
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundColor: '#F5F0E6',
          backgroundImage: "url('/images/textures/parchment-texture.png')",
          backgroundSize: "cover",
          border: '1px solid rgba(200,164,77,0.3)',
        }}
      />
      
      {/* Subtle border glow */}
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 40px rgba(139,90,43,0.1), 0 4px 20px rgba(0,0,0,0.2)'
        }}
      />

      {/* Decorative corner accents */}
      <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-gold/30 rounded-tl" />
      <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-gold/30 rounded-tr" />
      <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-gold/30 rounded-bl" />
      <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-gold/30 rounded-br" />
      
      {/* Content area */}
      <div 
        className="relative z-5 px-6 py-10 sm:px-10 sm:py-12 md:px-14"
      >
        {/* Roman numeral chapter marker */}
        {spellNumber && (
          <div className="text-center mb-6">
            <span className="font-cinzel text-2xl sm:text-3xl text-gold-dark/40 tracking-widest">
              {spellNumber}
            </span>
          </div>
        )}

        {/* Decorative header */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/30" />
          <div className="px-4">
            <span className="font-cinzel text-xs text-gold-dark/60 tracking-[0.2em] uppercase">
              The Full Ritual
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/30" />
        </div>

        {/* Title */}
        {title && (
          <h1 className="font-cinzel text-xl sm:text-2xl text-navy-dark text-center mb-8">
            {title}
          </h1>
        )}

        {/* Spell content - flowing narrative */}
        <div className="spell-content-area font-crimson text-navy-dark leading-relaxed">
          {children}
        </div>

        {/* Footer decoration */}
        <div className="mt-12 flex items-center justify-center">
          <img 
            src="/images/ornaments/divider-rose-crows.png" 
            alt="" 
            className="h-6 w-auto opacity-50"
          />
        </div>
      </div>
    </div>
  );
}

// Export sub-components for flexible use
export { TarotCardFront, QuickSummaryCard, FullRitualContent };
