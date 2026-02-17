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
 * TarotCardPage - The tarot card "cover" page
 */
function TarotCardPage({ tarotImageUrl, title, guideName }) {
  return (
    <div 
      className="relative rounded-lg overflow-hidden"
      style={{
        backgroundColor: '#F5F0E6',
        backgroundImage: "url('/images/textures/parchment-texture.png')",
        backgroundSize: "cover",
      }}
    >
      {/* Art Nouveau corner frames */}
      <img 
        src="/images/spell-decor/corner-flourish.png"
        alt=""
        className="absolute top-0 left-0 w-20 h-20 sm:w-28 sm:h-28 z-10 pointer-events-none opacity-80"
      />
      <img 
        src="/images/spell-decor/corner-flourish.png"
        alt=""
        className="absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28 z-10 pointer-events-none opacity-80"
        style={{ transform: 'scaleX(-1)' }}
      />
      <img 
        src="/images/spell-decor/corner-flourish.png"
        alt=""
        className="absolute bottom-0 left-0 w-20 h-20 sm:w-28 sm:h-28 z-10 pointer-events-none opacity-80"
        style={{ transform: 'scaleY(-1)' }}
      />
      <img 
        src="/images/spell-decor/corner-flourish.png"
        alt=""
        className="absolute bottom-0 right-0 w-20 h-20 sm:w-28 sm:h-28 z-10 pointer-events-none opacity-80"
        style={{ transform: 'scale(-1, -1)' }}
      />

      {/* Card content */}
      <div className="relative z-5 p-6 sm:p-10">
        {/* Tarot Card Image */}
        <div className="relative mx-auto max-w-sm">
          {tarotImageUrl ? (
            <img 
              src={tarotImageUrl}
              alt={title || "Spell Tarot Card"}
              className="w-full h-auto rounded-lg shadow-2xl"
              style={{
                border: '3px solid #1a1a1a',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(200,164,77,0.3)'
              }}
            />
          ) : (
            /* Fallback with generated Crowlands tarot */
            <img 
              src="/images/frames/crowlands-tarot-card.png"
              alt=""
              className="w-full h-auto rounded-lg shadow-2xl"
              style={{
                border: '3px solid #1a1a1a',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(200,164,77,0.3)'
              }}
            />
          )}
        </div>

        {/* Spell Title Section */}
        <div className="mt-8 text-center">
          <div className="flex items-center gap-2 justify-center mb-2">
            <div className="h-px w-12 bg-amber-800/40" />
            <span className="font-cinzel text-xs text-amber-800/60 tracking-[0.2em] uppercase">
              Spell Title
            </span>
            <div className="h-px w-12 bg-amber-800/40" />
          </div>
          
          <h2 className="font-cinzel text-2xl sm:text-3xl text-amber-950 mb-4">
            {title || "Untitled Spell"}
          </h2>

          {guideName && (
            <p className="font-crimson text-amber-800/70 italic">
              Crafted by {guideName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * SpellContentPage - The spell content with ornate border overlay
 */
function SpellContentPage({ children, title, spellNumber }) {
  return (
    <div 
      className="relative"
      style={{ 
        minHeight: '600px',
      }}
    >
      {/* Ornate border frame as overlay */}
      <img 
        src="/images/spell-decor/spell-content-border.png"
        alt=""
        className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
        style={{ opacity: 0.9 }}
      />
      
      {/* Parchment background */}
      <div 
        className="absolute inset-0 rounded"
        style={{
          backgroundColor: '#F5F0E6',
          backgroundImage: "url('/images/textures/parchment-texture.png')",
          backgroundSize: "cover",
        }}
      />
      
      {/* Content area - positioned inside the border */}
      <div 
        className="relative z-5 px-10 py-16 sm:px-14 sm:py-20"
        style={{ minHeight: '600px' }}
      >
        {/* Roman numeral at top */}
        {spellNumber && (
          <div className="text-center mb-6">
            <span className="font-cinzel text-3xl sm:text-4xl text-amber-800/50 tracking-widest">
              {spellNumber}
            </span>
          </div>
        )}

        {/* Title */}
        {title && (
          <h1 className="font-cinzel text-xl sm:text-2xl text-amber-950 text-center mb-6">
            {title}
          </h1>
        )}

        {/* Spell content */}
        <div className="spell-content-area font-crimson text-stone-800 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

// Export sub-components for flexible use
export { TarotCardPage, SpellContentPage };
