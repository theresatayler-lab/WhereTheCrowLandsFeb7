import React from "react";

/**
 * Crowlands Spell Page Frame
 * Art Nouveau navy border with roses, crows, and skulls
 * Transparent center reveals parchment content
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

      <main className="relative z-10 mx-auto w-full max-w-4xl px-2 py-6 sm:px-4 sm:py-8">
        {/* Outer frame container */}
        <div className="relative">
          {/* Decorative Crowlands frame overlay */}
          <img 
            src="/images/frames/spell-page-frame.png"
            alt=""
            className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20"
            style={{ minHeight: '600px' }}
          />
          
          {/* Inner content area - positioned to fit within the frame */}
          <div 
            className="relative z-10 mx-auto"
            style={{ 
              padding: '12% 10% 10% 10%', // Padding to fit inside ornate frame
              minHeight: '600px'
            }}
          >
            {/* Parchment background for content */}
            <div 
              className="rounded-lg p-6 sm:p-8"
              data-surface="light"
              style={{
                backgroundColor: '#F5F0E6',
                backgroundImage: "url('/images/textures/parchment-texture.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "inset 0 0 30px rgba(139, 90, 43, 0.15)",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
