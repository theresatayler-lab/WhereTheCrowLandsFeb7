import React from "react";

/**
 * SpellPageFrame — Grimoire manuscript page
 * Triple-border aged parchment with Art Nouveau corner flourishes.
 * Sullivan-inspired: let the page breathe, ornament only at edges.
 */
export default function SpellPageFrame({ children, backgroundImageUrl }) {
  return (
    <div className="spell-page-wrap bg-navy-dark" data-surface="dark">
      {backgroundImageUrl ? (
        <div
          className="spell-atmosphere"
          aria-hidden="true"
          style={
            backgroundImageUrl.startsWith("linear-gradient") || backgroundImageUrl.startsWith("radial-gradient")
              ? { backgroundImage: backgroundImageUrl }
              : { backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
          }
        />
      ) : null}

      <main className="relative z-10 mx-auto w-full max-w-3xl px-2 py-6 sm:px-4 sm:py-10">
        <div className="grimoire-manuscript-page">
          {/* Art Nouveau corner flourishes */}
          <img
            src="/images/spell-decor/corner-flourish.png"
            alt=""
            className="grimoire-corner grimoire-corner--tl"
            aria-hidden="true"
          />
          <img
            src="/images/spell-decor/corner-flourish.png"
            alt=""
            className="grimoire-corner grimoire-corner--tr"
            aria-hidden="true"
          />
          <img
            src="/images/spell-decor/corner-flourish.png"
            alt=""
            className="grimoire-corner grimoire-corner--bl"
            aria-hidden="true"
          />
          <img
            src="/images/spell-decor/corner-flourish.png"
            alt=""
            className="grimoire-corner grimoire-corner--br"
            aria-hidden="true"
          />

          {/* Manuscript content */}
          <div
            className="px-6 sm:px-10 md:px-14 py-8 sm:py-12"
            data-surface="light"
          >
            {children}
          </div>

          {/* Footer ornament */}
          <div className="flex justify-center pb-6">
            <img
              src="/images/spell-decor/footer-decoration.png"
              alt=""
              className="h-8 sm:h-10 w-auto opacity-70"
              aria-hidden="true"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
