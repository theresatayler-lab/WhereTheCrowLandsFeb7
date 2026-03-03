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
      {/* Decorative top element */}
      <div className="grimoire-divider mb-6">
        <div className="grimoire-divider-symbol" />
      </div>

      <div className="flex flex-col gap-3">
        {/* Main title - grimoire style */}
        <h1 className="grimoire-title text-2xl sm:text-3xl md:text-4xl leading-tight">
          {title}
        </h1>

        {/* Guide attribution */}
        {guideLine ? (
          <div className="font-cinzel uppercase tracking-[0.2em] text-[10px] sm:text-xs text-amber-800/60">
            {guideLine}
          </div>
        ) : null}

        {/* Subtitle/essence - italic serif */}
        {summaryLine ? (
          <p className="grimoire-subtitle text-base sm:text-lg mt-1 max-w-2xl mx-auto">
            {summaryLine}
          </p>
        ) : null}

        {/* Icon row - centered with subtle styling */}
        {iconRow?.length ? (
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3 pb-1">
            {iconRow.slice(0, 5).map((ic, idx) => (
              <span key={idx} className="opacity-70 hover:opacity-100 transition-opacity">
                <CrowlandsIcon iconPath={ic.iconPath} alt={ic.alt} size={20} />
              </span>
            ))}
          </div>
        ) : null}

        {actions ? <div className="pt-2">{actions}</div> : null}
      </div>

      {/* Bottom divider */}
      <div className="grimoire-divider mt-6">
        <div className="grimoire-divider-symbol" />
      </div>
    </header>
  );
}
