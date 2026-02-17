import React from "react";

/**
 * Crowlands Spell Page Frame
 * Simple, reliable frame that works on all devices
 * Uses CSS borders and decorative corners instead of stretched images
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

      <main className="relative z-10 mx-auto w-full max-w-3xl px-3 py-6 sm:px-6 sm:py-8">
        {/* Decorative frame using CSS */}
        <div 
          className="relative rounded-lg overflow-hidden"
          style={{
            border: '3px solid #1a365d',
            boxShadow: '0 0 0 1px rgba(200,164,77,0.4), 0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(200,164,77,0.2)',
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-600/50 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-600/50 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-600/50 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-600/50 rounded-br-lg" />
          
          {/* Inner content with parchment background */}
          <div 
            className="relative p-4 sm:p-6 md:p-8"
            data-surface="light"
            style={{
              backgroundColor: '#F5F0E6',
              backgroundImage: "url('/images/textures/parchment-texture.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
