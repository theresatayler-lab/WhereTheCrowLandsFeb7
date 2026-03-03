import React from "react";
import CrowlandsIcon from "../CrowlandsIcon";

export default function TarotSummaryCard({
  tarotImageUrl,
  symbolIconPath,
  title,
  essence,
  keyAction,
  timing,
  guideBadge,
  sealIconPath,
}) {
  return (
    <section className="my-8">
      <div className="mx-auto w-full max-w-sm sm:max-w-md">
        {/* Outer glow */}
        <div className="box-glow-gold rounded-[24px] p-0.5" style={{ background: 'rgba(200, 164, 77, 0.06)' }}>
          {/* Card with triple border effect */}
          <div
            className="grimoire-page-border !rounded-[22px] !p-4 sm:!p-5"
            style={{ background: "var(--vellum)" }}
          >
            <div className="relative w-full">
              {/* Subtle radial glow behind content */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-xl"
                style={{
                  opacity: 0.06,
                  backgroundImage:
                    "radial-gradient(circle at 50% 30%, rgba(200,164,77,0.25), transparent 60%)",
                }}
              />

              <div className="relative flex flex-col">
                {/* Top decorative divider */}
                <div className="grimoire-divider !py-2 mb-4">
                  <div className="grimoire-divider-symbol !w-2 !h-2" />
                </div>

                {/* Content */}
                <div className="px-4 py-2 text-center">
                  {tarotImageUrl ? (
                    <img
                      src={tarotImageUrl}
                      alt={title || "Tarot card"}
                      className="mx-auto mb-5 max-h-72 w-auto rounded-xl shadow-lg"
                      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : symbolIconPath ? (
                    <div className="mb-5 drop-glow-gold-soft">
                      <CrowlandsIcon iconPath={symbolIconPath} alt="Symbol" size={86} />
                    </div>
                  ) : null}

                  {title ? (
                    <h2 className="grimoire-title text-xl sm:text-2xl">
                      {title}
                    </h2>
                  ) : null}

                  {essence ? (
                    <p className="grimoire-subtitle mt-3 text-sm sm:text-base max-w-xs mx-auto">
                      {essence}
                    </p>
                  ) : null}
                </div>

                {/* Footer chips */}
                <div className="px-4 pt-4 pb-2">
                  <div className="grimoire-divider !py-2 mb-3">
                    <div className="grimoire-divider-symbol !w-2 !h-2" />
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {keyAction ? (
                      <span className="font-cinzel text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-amber-700/25 text-[#2a1f14]/70">
                        {keyAction}
                      </span>
                    ) : null}

                    {timing ? (
                      <span className="font-cinzel text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-amber-700/25 text-[#2a1f14]/70">
                        {timing}
                      </span>
                    ) : null}

                    {guideBadge ? (
                      <span className="font-cinzel text-[9px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-amber-700/25 text-[#2a1f14]/70">
                        {guideBadge}
                      </span>
                    ) : null}

                    {sealIconPath ? (
                      <span className="ml-1 opacity-60">
                        <CrowlandsIcon iconPath={sealIconPath} alt="Seal" size={16} />
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
