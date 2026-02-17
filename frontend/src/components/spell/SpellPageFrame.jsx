import React from "react";

/**
 * Pure wrapper. Atmosphere is outside reading surface.
 * Reading surface is solid vellum and marked data-surface="light".
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
        <section
          className="spell-reading-surface box-glow-gold rounded-3xl px-5 py-6 sm:px-8 sm:py-8"
          data-surface="light"
        >
          {children}
        </section>
      </main>
    </div>
  );
}
