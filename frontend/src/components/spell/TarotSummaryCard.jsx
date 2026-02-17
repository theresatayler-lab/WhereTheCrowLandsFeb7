import React from "react";

/**
 * TarotSummaryCard - Displays spell tarot card with vintage book layout
 * Inspired by the spell template with illustration panel + text sections
 */
export default function TarotSummaryCard({
  tarotImageUrl,
  title,
  essence,
  keyAction,
  timing,
  guideBadge,
}) {
  return (
    <section className="my-8">
      {/* Two-column layout like vintage spell template */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        
        {/* Left: Tarot Card / Illustration Panel */}
        <div className="w-full sm:w-2/5 flex-shrink-0">
          <div 
            className="relative rounded border-2 border-amber-800/30 overflow-hidden"
            style={{ 
              backgroundColor: '#1a1a1a',
              aspectRatio: tarotImageUrl ? 'auto' : '3/4'
            }}
          >
            {tarotImageUrl ? (
              <img 
                src={tarotImageUrl} 
                alt={title || "Spell Tarot Card"}
                className="w-full h-auto"
              />
            ) : (
              /* Fallback illustration area */
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <img 
                  src="/images/frames/crowlands-tarot-card.png" 
                  alt="" 
                  className="w-full h-full object-contain opacity-90"
                />
              </div>
            )}
            
            {/* Frame corners */}
            <div className="absolute top-1 left-1 w-4 h-4 border-t border-l border-amber-600/50" />
            <div className="absolute top-1 right-1 w-4 h-4 border-t border-r border-amber-600/50" />
            <div className="absolute bottom-1 left-1 w-4 h-4 border-b border-l border-amber-600/50" />
            <div className="absolute bottom-1 right-1 w-4 h-4 border-b border-r border-amber-600/50" />
          </div>
          
          {/* Caption below image */}
          {guideBadge && (
            <p className="font-montserrat text-xs text-amber-800/60 text-center mt-2 uppercase tracking-wider">
              Crafted by {guideBadge}
            </p>
          )}
        </div>

        {/* Right: Spell Details */}
        <div className="flex-1">
          {/* Title Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-cinzel text-xs text-amber-700 tracking-[0.15em] uppercase">
                Spell Title
              </span>
              <div className="flex-1 h-px bg-amber-700/30" />
            </div>
            {title && (
              <h3 className="font-cinzel text-xl sm:text-2xl text-amber-950">
                {title}
              </h3>
            )}
          </div>

          {/* Essence/Description */}
          {essence && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-cinzel text-xs text-amber-700 tracking-[0.15em] uppercase">
                  Essence
                </span>
                <div className="flex-1 h-px bg-amber-700/30" />
              </div>
              <p className="font-crimson text-stone-700 italic leading-relaxed">
                "{essence}"
              </p>
            </div>
          )}

          {/* Key Action */}
          {keyAction && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-cinzel text-xs text-amber-700 tracking-[0.15em] uppercase">
                  Key Action
                </span>
                <div className="flex-1 h-px bg-amber-700/30" />
              </div>
              <p className="font-crimson text-stone-800">
                {keyAction}
              </p>
            </div>
          )}

          {/* Timing */}
          {timing && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-cinzel text-xs text-amber-700 tracking-[0.15em] uppercase">
                  Best Timing
                </span>
                <div className="flex-1 h-px bg-amber-700/30" />
              </div>
              <p className="font-crimson text-stone-800">
                {timing}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
