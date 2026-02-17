import React from "react";

/**
 * Pure wrapper. Atmosphere is outside reading surface.
 * Reading surface is solid vellum and marked data-surface="light".
 * Decorative botanical borders frame the content like a vintage book page.
 */
export default function SpellPageFrame({ children, backgroundImageUrl }) {
  return (
    <div className="spell-page-wrap bg-navy-dark" data-surface="dark">
      {backgroundImageUrl ? (
        <div
          className="spell-atmosphere"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : null}

      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Main reading surface with decorative borders */}
        <section
          className="spell-reading-surface box-glow-gold rounded-3xl overflow-hidden"
          data-surface="light"
          style={{
            backgroundImage: "url('/images/textures/parchment-texture.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Decorative side borders */}
          <div className="relative flex">
            {/* Left botanical border */}
            <div 
              className="hidden md:block w-16 flex-shrink-0 opacity-30"
              style={{
                backgroundImage: "url('/images/ornaments/border-botanical-vertical.png')",
                backgroundSize: "contain",
                backgroundRepeat: "repeat-y",
                backgroundPosition: "center",
              }}
              aria-hidden="true"
            />
            
            {/* Main content area */}
            <div className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
              {children}
            </div>
            
            {/* Right botanical border (mirrored) */}
            <div 
              className="hidden md:block w-16 flex-shrink-0 opacity-30"
              style={{
                backgroundImage: "url('/images/ornaments/border-botanical-vertical.png')",
                backgroundSize: "contain",
                backgroundRepeat: "repeat-y",
                backgroundPosition: "center",
                transform: "scaleX(-1)",
              }}
              aria-hidden="true"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
