import React from "react";

/**
 * Crowlands Spell Page Frame
 * Uses positioned decorative elements inspired by vintage grimoire designs
 * - Header banner with crow and roses
 * - Corner flourishes
 * - Side borders that repeat
 * - Footer decoration with skull and roses
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

      <main className="relative z-10 mx-auto w-full max-w-4xl px-2 py-4 sm:px-4 sm:py-6">
        {/* The spell page container */}
        <div 
          className="relative"
          style={{
            backgroundColor: '#F5F0E6',
            backgroundImage: "url('/images/textures/parchment-texture.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* === HEADER BANNER === */}
          <div className="relative z-20">
            <img 
              src="/images/spell-decor/header-banner.png"
              alt=""
              className="w-full h-auto"
              style={{ maxHeight: '120px', objectFit: 'contain', objectPosition: 'center top' }}
            />
          </div>

          {/* === CORNER FLOURISHES (top) === */}
          <img 
            src="/images/spell-decor/corner-flourish.png"
            alt=""
            className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 z-10 pointer-events-none"
            style={{ transform: 'rotate(0deg)' }}
          />
          <img 
            src="/images/spell-decor/corner-flourish.png"
            alt=""
            className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 z-10 pointer-events-none"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* === SIDE BORDERS === */}
          <div 
            className="absolute left-0 top-24 bottom-24 w-8 sm:w-12 z-10 pointer-events-none hidden md:block"
            style={{
              backgroundImage: "url('/images/spell-decor/side-border.png')",
              backgroundSize: '100% auto',
              backgroundRepeat: 'repeat-y',
              backgroundPosition: 'center',
              opacity: 0.8
            }}
          />
          <div 
            className="absolute right-0 top-24 bottom-24 w-8 sm:w-12 z-10 pointer-events-none hidden md:block"
            style={{
              backgroundImage: "url('/images/spell-decor/side-border.png')",
              backgroundSize: '100% auto',
              backgroundRepeat: 'repeat-y',
              backgroundPosition: 'center',
              transform: 'scaleX(-1)',
              opacity: 0.8
            }}
          />

          {/* === MAIN CONTENT AREA === */}
          <div 
            className="relative z-5 px-4 py-6 sm:px-8 md:px-16 lg:px-20"
            data-surface="light"
          >
            {children}
          </div>

          {/* === CORNER FLOURISHES (bottom) === */}
          <img 
            src="/images/spell-decor/corner-flourish.png"
            alt=""
            className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 z-10 pointer-events-none"
            style={{ transform: 'scaleY(-1)' }}
          />
          <img 
            src="/images/spell-decor/corner-flourish.png"
            alt=""
            className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 z-10 pointer-events-none"
            style={{ transform: 'scale(-1, -1)' }}
          />

          {/* === FOOTER DECORATION === */}
          <div className="relative z-20 mt-4">
            <img 
              src="/images/spell-decor/footer-decoration.png"
              alt=""
              className="w-full h-auto mx-auto"
              style={{ maxHeight: '80px', objectFit: 'contain', objectPosition: 'center bottom' }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
