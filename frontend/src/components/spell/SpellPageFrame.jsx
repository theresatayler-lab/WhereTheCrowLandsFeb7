import React from "react";
import { getGuideOrnamentSet, CornerOrnaments, getGuideDivider, COLORS } from "../../assets/ornaments/index";

/**
 * SpellPageFrame — Grimoire manuscript page
 * Triple-border aged parchment with per-guide SVG corner flourishes.
 * Sullivan-inspired: let the page breathe, ornament only at edges.
 */
export default function SpellPageFrame({ children, backgroundImageUrl, guideId }) {
  // Quick-tier CSS gradients still serve as subtle page atmosphere;
  // AI-generated header images are now rendered as framed plates inside
  // SpellHeader, not as faint backgrounds.
  const isGradient = backgroundImageUrl &&
    (backgroundImageUrl.startsWith("linear-gradient") || backgroundImageUrl.startsWith("radial-gradient"));

  const ornaments = getGuideOrnamentSet(guideId);
  const Corner = ornaments?.Corner || CornerOrnaments.classic;
  // .grimoire-corner--tr/bl/br CSS classes mirror the corner via scaleX/scaleY
  const cornerPositions = ["tl", "tr", "bl", "br"];

  return (
    <div className="spell-page-wrap bg-navy-dark" data-surface="dark">
      {isGradient ? (
        <div
          className="spell-atmosphere"
          aria-hidden="true"
          style={{ backgroundImage: backgroundImageUrl }}
        />
      ) : null}

      <main className="relative z-10 mx-auto w-full max-w-3xl px-2 py-6 sm:px-4 sm:py-10">
        <div className="grimoire-manuscript-page">
          {/* Per-guide SVG corner flourishes (gold stroke, mirrored by CSS) */}
          {cornerPositions.map((pos) => (
            <div
              key={pos}
              className={`grimoire-corner grimoire-corner--${pos}`}
              aria-hidden="true"
            >
              <Corner size={64} color={COLORS.gold} />
            </div>
          ))}

          {/* Manuscript content */}
          <div
            className="px-6 sm:px-10 md:px-14 py-8 sm:py-12"
            data-surface="light"
          >
            {children}
          </div>

          {/* Footer ornament — guide-specific divider strip */}
          <div className="flex justify-center pb-6 opacity-80" aria-hidden="true">
            {getGuideDivider(guideId, 0, { width: 200 })}
          </div>
        </div>
      </main>
    </div>
  );
}
