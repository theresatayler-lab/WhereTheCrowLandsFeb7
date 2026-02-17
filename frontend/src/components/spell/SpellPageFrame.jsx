import React from "react";

/**
 * SpellPageFrame - Simple wrapper for spell content
 * The decorative elements come from SpellBookView
 */
export default function SpellPageFrame({ children, backgroundImageUrl }) {
  return (
    <div className="spell-page-wrap bg-navy-dark min-h-screen" data-surface="dark">
      {/* Optional atmosphere layer */}
      {backgroundImageUrl && (
        <div
          className="spell-atmosphere"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      <main className="relative z-10 mx-auto w-full max-w-3xl px-3 py-6 sm:px-4 sm:py-8">
        {children}
      </main>
    </div>
  );
}
