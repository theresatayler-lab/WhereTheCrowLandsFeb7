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
    <header className="mb-6 text-center">
      {/* Guide attribution line */}
      {guideLine && (
        <div className="font-montserrat uppercase tracking-[0.2em] text-xs text-amber-800/70 mb-2">
          {guideLine}
        </div>
      )}

      {/* Main title */}
      <h1 className="font-cinzel text-2xl sm:text-3xl leading-tight text-amber-950 mb-3">
        {title}
      </h1>

      {/* Summary/essence line */}
      {summaryLine && (
        <p className="font-crimson text-base italic text-stone-600 max-w-lg mx-auto mb-4">
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

      {/* Simple elegant divider */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <div className="h-px w-12 bg-amber-700/30" />
        <img 
          src="/icons/anchors/gold/anchor-bird.png" 
          alt="" 
          className="w-5 h-5 opacity-50"
        />
        <div className="h-px w-12 bg-amber-700/30" />
      </div>
    </header>
  );
}
