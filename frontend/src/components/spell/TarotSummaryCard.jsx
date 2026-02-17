import React from "react";

/**
 * TarotSummaryCard - Displays spell summary with tarot card
 * Mobile-friendly layout
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
    <section className="my-6">
      <div className="flex flex-col items-center gap-4">
        {/* Tarot Card Image */}
        {tarotImageUrl ? (
          <div className="w-40 sm:w-48 flex-shrink-0">
            <img 
              src={tarotImageUrl} 
              alt={title || "Spell Tarot Card"}
              className="w-full h-auto rounded-lg shadow-xl"
              style={{ 
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(200,164,77,0.3)'
              }}
            />
          </div>
        ) : (
          /* Fallback: Simple card design without stretched image */
          <div 
            className="w-40 sm:w-48 rounded-lg p-4 text-center"
            style={{ 
              aspectRatio: '2.5/4',
              backgroundColor: '#1a365d',
              border: '2px solid rgba(200,164,77,0.5)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            <div className="h-full flex flex-col items-center justify-center">
              <img 
                src="/icons/anchors/gold/anchor-bird.png" 
                alt="" 
                className="w-12 h-12 mb-3 opacity-80"
              />
              {title && (
                <p className="font-cinzel text-sm text-amber-200 leading-tight">
                  {title}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Spell Summary Info */}
        <div className="text-center w-full">
          {/* Guide badge */}
          {guideBadge && (
            <div className="font-montserrat uppercase tracking-[0.15em] text-xs text-amber-700/70 mb-2">
              Crafted by {guideBadge}
            </div>
          )}

          {/* Title */}
          {title && (
            <h3 className="font-cinzel text-xl sm:text-2xl text-amber-950 mb-2">
              {title}
            </h3>
          )}

          {/* Essence/Tagline */}
          {essence && (
            <blockquote className="font-crimson text-stone-700 italic text-base leading-relaxed mb-3">
              "{essence}"
            </blockquote>
          )}

          {/* Key Action & Timing */}
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            {keyAction && (
              <span className="px-3 py-1 rounded-full border border-amber-700/30 font-crimson text-stone-700">
                {keyAction}
              </span>
            )}
            {timing && (
              <span className="px-3 py-1 rounded-full border border-amber-700/30 font-crimson text-stone-700">
                {timing}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
