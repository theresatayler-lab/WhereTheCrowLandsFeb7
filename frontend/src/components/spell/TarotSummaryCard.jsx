import React from "react";

/**
 * TarotSummaryCard - Displays the Crowlands tarot card with spell summary
 * Uses the beautiful crow/chalice/roses tarot card design
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
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Tarot Card Image */}
        <div className="w-48 sm:w-56 flex-shrink-0">
          <div className="relative">
            {/* If we have a generated tarot image, show it */}
            {tarotImageUrl ? (
              <img 
                src={tarotImageUrl} 
                alt={title || "Spell Tarot Card"}
                className="w-full h-auto rounded-lg shadow-xl"
                style={{ 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(200,164,77,0.3)'
                }}
              />
            ) : (
              /* Fallback: Use the beautiful Crowlands tarot card template */
              <div className="relative">
                <img 
                  src="/images/frames/crowlands-tarot-card.png" 
                  alt=""
                  className="w-full h-auto rounded-lg shadow-xl"
                  style={{ 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(200,164,77,0.3)'
                  }}
                />
                {/* Overlay title on the card if no image */}
                {title && (
                  <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                    <p className="font-cinzel text-sm text-amber-900 bg-amber-50/90 rounded px-2 py-1 inline-block">
                      {title}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Spell Summary Info */}
        <div className="flex-1 text-center md:text-left">
          {/* Guide badge */}
          {guideBadge && (
            <div className="font-montserrat uppercase tracking-[0.15em] text-xs text-amber-700/70 mb-2">
              Crafted by {guideBadge}
            </div>
          )}

          {/* Title */}
          {title && (
            <h3 className="font-cinzel text-xl sm:text-2xl text-amber-950 mb-3">
              {title}
            </h3>
          )}

          {/* Essence/Tagline */}
          {essence && (
            <blockquote className="font-crimson text-stone-700 italic text-base leading-relaxed mb-4">
              "{essence}"
            </blockquote>
          )}

          {/* Key Action & Timing */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {keyAction && (
              <div className="text-sm">
                <span className="font-montserrat uppercase tracking-wider text-xs text-amber-800/60 block mb-1">
                  Key Action
                </span>
                <span className="font-crimson text-stone-800">{keyAction}</span>
              </div>
            )}
            {timing && (
              <div className="text-sm">
                <span className="font-montserrat uppercase tracking-wider text-xs text-amber-800/60 block mb-1">
                  Best Timing
                </span>
                <span className="font-crimson text-stone-800">{timing}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
