import React from "react";
import CrowlandsIcon from "../CrowlandsIcon";

/**
 * SpellHeader — Grimoire title page
 * Rose-and-crows divider, TC Phantasmagoria title,
 * guide attribution in Italiana, essence quote, optional tarot frontispiece.
 */
export default function SpellHeader({
  title,
  guideLine,
  summaryLine,
  tarotImageUrl,
  iconRow = [],
  actions = null,
}) {
  return (
    <header className="grimoire-header-block">
      {/* Rose-and-crows divider */}
      <div className="flex justify-center mb-4">
        <img
          src="/images/ornaments/divider-rose-crows.png"
          alt=""
          className="h-8 sm:h-10 w-auto opacity-80"
        />
      </div>

      {/* Spell title — TC Phantasmagoria */}
      <h1 className="grimoire-manuscript-title">{title}</h1>

      {/* Guide attribution — Italiana small caps */}
      {guideLine ? (
        <p className="grimoire-guide-line">{guideLine}</p>
      ) : null}

      {/* Essence quote — Crimson Text italic */}
      {summaryLine ? (
        <p className="grimoire-essence-line">
          &ldquo;{summaryLine}&rdquo;
        </p>
      ) : null}

      {/* Tarot frontispiece — inline book illustration */}
      {tarotImageUrl ? (
        <div className="grimoire-frontispiece">
          <div className="grimoire-frontispiece-frame">
            <img
              src={tarotImageUrl}
              alt={title || "Spell illustration"}
              className="grimoire-frontispiece-img"
            />
          </div>
        </div>
      ) : null}

      {/* Icon row */}
      {iconRow?.length ? (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
          {iconRow.slice(0, 5).map((ic, idx) => (
            <span
              key={idx}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <CrowlandsIcon iconPath={ic.iconPath} alt={ic.alt} size={18} />
            </span>
          ))}
        </div>
      ) : null}

      {actions ? <div className="pt-2">{actions}</div> : null}

      {/* Thin gold rule to end header */}
      <div className="grimoire-header-rule" />
    </header>
  );
}
