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
    <header className="mb-8 text-center">
      {/* Decorative header with ornamental divider */}
      <div className="flex flex-col items-center gap-4">
        {/* Guide attribution line */}
        {guideLine ? (
          <div className="font-montserrat uppercase tracking-[0.2em] text-xs text-amber-800/60">
            {guideLine}
          </div>
        ) : null}

        {/* Main title */}
        <h1 className="font-cinzel text-3xl sm:text-4xl leading-tight text-amber-950">
          {title}
        </h1>

        {/* Summary/essence line */}
        {summaryLine ? (
          <p className="font-crimson text-base sm:text-lg italic text-stone-600 max-w-xl">
            "{summaryLine}"
          </p>
        ) : null}

        {/* Icon row */}
        {iconRow?.length ? (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {iconRow.slice(0, 5).map((ic, idx) => (
              <span key={idx} className="drop-glow-gold-soft">
                <CrowlandsIcon iconPath={ic.iconPath} alt={ic.alt} size={24} />
              </span>
            ))}
          </div>
        ) : null}

        {/* Actions if provided */}
        {actions ? <div className="pt-2">{actions}</div> : null}

        {/* Ornate divider */}
        <div className="flex items-center justify-center pt-4 w-full">
          <img 
            src="/images/ornaments/divider-ornate-horizontal.png" 
            alt="" 
            className="h-5 w-auto opacity-50"
            style={{ maxWidth: '180px' }}
          />
        </div>
      </div>
    </header>
  );
}
