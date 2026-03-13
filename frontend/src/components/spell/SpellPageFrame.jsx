import React from "react";

/**
 * SpellPageFrame - Elegant grimoire page wrapper
 * Inspired by vintage astrology guides with ornate borders and generous whitespace
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

      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Outer glow container */}
        <div className="box-glow-gold rounded-[28px] p-1" style={{ background: 'rgba(200, 164, 77, 0.08)' }}>
          {/* Triple border grimoire frame */}
          <section
            className="grimoire-page-border relative"
            data-surface="light"
          >
            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/20 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-gold/20 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-gold/20 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold/20 rounded-br-lg" />
            
            {/* Content with generous padding */}
            <div className="px-2 sm:px-6 py-4">
              {children}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
