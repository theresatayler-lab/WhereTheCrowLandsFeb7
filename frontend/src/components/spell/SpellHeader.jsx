import React from "react";
import CrowlandsIcon from "../CrowlandsIcon";

export default function SpellHeader({
  title,
  guideLine,
  summaryLine,
  iconRow = [],
  actions = null,
}) {
  return (
    <header className="mb-8">
      {/* Banner ribbon with title */}
      <div className="relative flex flex-col items-center">
        {/* Banner image as background */}
        <div className="relative w-full max-w-md mx-auto mb-4">
          <img 
            src="/images/ornaments/banner-ribbon.png" 
            alt="" 
            className="w-full h-auto"
            style={{ minHeight: '60px' }}
          />
          {/* Title overlaid on banner */}
          <div className="absolute inset-0 flex items-center justify-center px-8">
            <h1 
              className="font-cinzel text-lg sm:text-xl md:text-2xl text-amber-950 text-center leading-tight"
              style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}
            >
              {title}
            </h1>
          </div>
        </div>

        {/* Guide attribution line */}
        {guideLine && (
          <div className="font-montserrat uppercase tracking-[0.2em] text-xs text-amber-800/70 mb-2">
            {guideLine}
          </div>
        )}

        {/* Summary/essence line */}
        {summaryLine && (
          <p className="font-crimson text-base italic text-stone-600 max-w-lg text-center mb-4">
            "{summaryLine}"
          </p>
        )}

        {/* Icon row */}
        {iconRow?.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            {iconRow.slice(0, 5).map((ic, idx) => (
              <span key={idx} className="drop-glow-gold-soft">
                <CrowlandsIcon iconPath={ic.iconPath} alt={ic.alt} size={24} />
              </span>
            ))}
          </div>
        )}

        {/* Actions if provided */}
        {actions && <div className="mb-4">{actions}</div>}

        {/* Ornate divider with rose and crows */}
        <img 
          src="/images/ornaments/divider-rose-crows.png" 
          alt="" 
          className="h-8 w-auto opacity-70 mt-2"
          style={{ maxWidth: '200px' }}
        />
      </div>
    </header>
  );
}
