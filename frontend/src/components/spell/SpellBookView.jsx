import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SpellBookView - Two-page spell book layout
 * Page 1: Tarot Card (cover)
 * Page 2: Spell Content with ornate border
 * 
 * Flippable on click, designed for future PDF export as facing pages
 */
export default function SpellBookView({ 
  children, // Spell content
  tarotImageUrl,
  title,
  guideName,
  spellNumber = "I", // Roman numeral
}) {
  const [showSpell, setShowSpell] = useState(false);

  return (
    <div className="spell-book-container mx-auto max-w-2xl">
      {/* Book wrapper with perspective for flip effect */}
      <div 
        className="relative w-full cursor-pointer"
        style={{ perspective: '2000px' }}
        onClick={() => setShowSpell(!showSpell)}
      >
        <AnimatePresence mode="wait">
          {!showSpell ? (
            /* === TAROT CARD VIEW (Front) === */
            <motion.div
              key="tarot"
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -180, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <TarotCardPage 
                tarotImageUrl={tarotImageUrl}
                title={title}
                guideName={guideName}
              />
              
              {/* Flip hint */}
              <p className="text-center text-amber-700/60 text-sm mt-4 font-crimson italic">
                Tap to reveal the spell →
              </p>
            </motion.div>
          ) : (
            /* === SPELL CONTENT VIEW (Back) === */
            <motion.div
              key="spell"
              initial={{ rotateY: -180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 180, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <SpellContentPage 
                title={title}
                spellNumber={spellNumber}
              >
                {children}
              </SpellContentPage>
              
              {/* Flip hint */}
              <p className="text-center text-amber-700/60 text-sm mt-4 font-crimson italic">
                ← Tap to see the tarot card
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
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
