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
    <header className="mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-cinzel text-3xl sm:text-4xl leading-tight text-[#0b0b0b]">
            {title}
          </h1>

          {guideLine ? (
            <div className="font-montserrat uppercase tracking-wide text-xs sm:text-sm text-[#1a1a1a]/70">
              {guideLine}
            </div>
          ) : null}

          {summaryLine ? (
            <p className="font-crimson text-base sm:text-lg italic text-[#141414]/85">
              {summaryLine}
            </p>
          ) : null}
        </div>

        {iconRow?.length ? (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {iconRow.slice(0, 5).map((ic, idx) => (
              <span key={idx} className="drop-glow-gold-soft">
                <CrowlandsIcon iconPath={ic.iconPath} alt={ic.alt} size={22} />
              </span>
            ))}
          </div>
        ) : null}

        {actions ? <div className="pt-1">{actions}</div> : null}

        <div className="spell-divider-line mt-2" />
      </div>
    </header>
  );
}
