import React from "react";
import CrowlandsIcon from "../CrowlandsIcon";

/**
 * SpellHeader - Vintage grimoire style header
 * Features illuminated drop cap style and elegant typography
 */
export default function SpellHeader({
  title,
  guideLine,
  summaryLine,
  iconRow = [],
  actions = null,
  spellNumber = null, // e.g., "LXXIII"
}) {
  // Get first letter for drop cap effect
  const firstLetter = title ? title.charAt(0).toUpperCase() : '';
  const restOfTitle = title ? title.slice(1) : '';

  return (
    <header className="mb-8 text-center">
      {/* Spell number in Roman numerals */}
      {spellNumber && (
        <div className="font-cinzel text-2xl sm:text-3xl text-amber-800/40 tracking-widest mb-2">
          {spellNumber}
        </div>
      )}

      {/* Title with illuminated drop cap effect */}
      <div className="flex items-start justify-center gap-1 mb-3">
        {firstLetter && (
          <span 
            className="font-cinzel text-5xl sm:text-6xl md:text-7xl text-amber-800 leading-none"
            style={{ 
              fontWeight: 700,
              textShadow: '2px 2px 0 rgba(139, 90, 43, 0.2)',
              marginTop: '-0.1em'
            }}
          >
            {firstLetter}
          </span>
        )}
        <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-amber-950 leading-tight pt-2">
          {restOfTitle}
        </h1>
      </div>

      {/* Guide attribution line */}
      {guideLine && (
        <div className="font-montserrat uppercase tracking-[0.2em] text-xs text-amber-800/70 mb-3">
          {guideLine}
        </div>
      )}

      {/* Decorative divider */}
      <div className="flex items-center justify-center gap-3 my-4">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-700/40" />
        <img 
          src="/icons/anchors/gold/anchor-bird.png" 
          alt="" 
          className="w-6 h-6 opacity-60"
        />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-700/40" />
      </div>

      {/* Summary/essence line - like a poetic tagline */}
      {summaryLine && (
        <blockquote className="font-crimson text-lg sm:text-xl italic text-stone-700 max-w-lg mx-auto mb-4 leading-relaxed">
          "{summaryLine}"
        </blockquote>
      )}

      {/* Icon row */}
      {iconRow?.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
          {iconRow.slice(0, 5).map((ic, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <CrowlandsIcon iconPath={ic.iconPath} alt={ic.alt} size={28} />
              {ic.label && (
                <span className="font-montserrat text-xs text-stone-500">{ic.label}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions if provided */}
      {actions && <div className="mt-4">{actions}</div>}
    </header>
  );
}
