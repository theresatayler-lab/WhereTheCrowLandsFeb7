import React from "react";
import CrowlandsIcon from "../CrowlandsIcon";
import { BrandIcon } from "../BrandIcon";
import { getGuideOrnamentSet, CornerOrnaments, COLORS } from "../../assets/ornaments/index";

/**
 * SpellHeader — Grimoire title page
 * Rose-and-crows divider, TC Phantasmagoria title,
 * guide attribution in Cinzel Decorative, essence quote,
 * framed-plate header image, optional tarot frontispiece.
 */
export default function SpellHeader({
  title,
  guideLine,
  summaryLine,
  headerImageUrl = null,
  tarotImageUrl,
  category = null,
  quickVisuals = null,
  guideId = null,
  iconRow = [],
  actions = null,
}) {
  const ornaments = getGuideOrnamentSet(guideId);
  const PlateCorner = ornaments?.Corner || CornerOrnaments.classic;
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

      {/* Ornamental rule above title */}
      <div className="grimoire-title-rule">
        <span className="grimoire-title-rule-diamond" />
      </div>

      {/* Spell title — TC Phantasmagoria, guide-colored */}
      <h1 className="grimoire-manuscript-title">{title}</h1>

      {/* Guide attribution — Italiana small caps */}
      {guideLine ? (
        <p className="grimoire-guide-line">{guideLine}</p>
      ) : null}

      {/* Ornamental rule below title block */}
      <div className="grimoire-title-rule" />

      {/* Essence quote — Crimson Text italic */}
      {summaryLine ? (
        <p className="grimoire-essence-line">
          &ldquo;{summaryLine}&rdquo;
        </p>
      ) : null}

      {/* Framed vignette plate — chapter illustration (Brief §3.1) */}
      {headerImageUrl ? (
        <div className="grimoire-plate">
          <div className="grimoire-plate-frame">
            {/* Per-guide corner ornaments on the plate frame (Brief §3.1/§4) */}
            {["tl", "tr", "bl", "br"].map((pos) => (
              <div
                key={pos}
                className={`grimoire-plate-corner grimoire-plate-corner--${pos}`}
                aria-hidden="true"
              >
                <PlateCorner size={32} color={COLORS.gold} />
              </div>
            ))}
            <img
              src={headerImageUrl}
              alt={title || "Spell illustration"}
              className="grimoire-plate-img"
            />
          </div>
          {category ? (
            <p className="grimoire-plate-caption">
              {`A WORKING OF ${category.toUpperCase()}`}
            </p>
          ) : null}
        </div>
      ) : quickVisuals?.header_pattern ? (
        /* Quick tier: CSS medallion header with guide icon (Brief §3.5) */
        <div className="grimoire-quick-header">
          <div
            className="grimoire-quick-header-medallion"
            style={{ backgroundImage: quickVisuals.header_pattern }}
          >
            <div className="grimoire-quick-header-icon">
              <img
                src={`/icons/guides/guide-${quickVisuals.guide_id || 'shigg'}.png`}
                alt=""
                className="w-12 h-12 sm:w-16 sm:h-16"
                style={{ filter: 'sepia(1) saturate(0.6) brightness(1.2)' }}
              />
            </div>
          </div>
          {category ? (
            <p className="grimoire-plate-caption">
              {`A WORKING OF ${category.toUpperCase()}`}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Tarot frontispiece — AI-generated or Quick-tier CSS placeholder (Brief §3.3) */}
      {tarotImageUrl ? (
        <div className="grimoire-frontispiece">
          <div className="grimoire-frontispiece-frame">
            <img
              src={tarotImageUrl}
              alt={title || "Spell illustration"}
              className="grimoire-frontispiece-img"
            />
          </div>
          <p className="grimoire-frontispiece-label">Significator</p>
        </div>
      ) : quickVisuals?.tarot_placeholder_icon ? (
        <div className="grimoire-frontispiece">
          <div
            className="grimoire-frontispiece-frame flex items-center justify-center"
            style={{
              background: quickVisuals.tarot_placeholder_bg || 'linear-gradient(180deg, #102534 0%, #123A3F 100%)',
              aspectRatio: '2/3',
              maxWidth: '200px',
              margin: '0 auto',
              border: quickVisuals.accent_border || '1px solid rgba(200, 164, 77, 0.3)',
            }}
          >
            <BrandIcon
              name={quickVisuals.tarot_placeholder_icon}
              size={64}
              variant="gold"
              opacity={0.35}
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
