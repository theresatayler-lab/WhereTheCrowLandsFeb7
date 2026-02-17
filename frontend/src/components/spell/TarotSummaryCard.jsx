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
    <section className="my-6">
      <div className="mx-auto w-full max-w-sm sm:max-w-md">
        <div
          className="box-glow-gold rounded-3xl p-4 sm:p-5"
          style={{
            background: "var(--vellum)",
            backgroundImage: "url('/images/textures/parchment-texture.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid rgba(200,164,77,0.40)",
          }}
        >
          <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{ aspectRatio: "2.75 / 4.75" }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                opacity: 0.08,
                backgroundImage:
                  "radial-gradient(circle at 50% 30%, rgba(200,164,77,0.18), transparent 55%)",
              }}
            />

            <div className="absolute left-0 right-0 top-0 px-4 pt-4">
              <div className="spell-divider-line" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              {tarotImageUrl ? (
                <img
                  src={tarotImageUrl}
                  alt={title || "Tarot card"}
                  className="mb-4 max-h-[48%] w-auto rounded-xl drop-shadow-2xl"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              ) : symbolIconPath ? (
                <div className="mb-4 drop-glow-gold-soft">
                  <CrowlandsIcon iconPath={symbolIconPath} alt="Symbol" size={86} />
                </div>
              ) : null}

              {title ? (
                <h2 className="font-cinzel text-xl sm:text-2xl text-[#0b0b0b] leading-snug">
                  {title}
                </h2>
              ) : null}

              {essence ? (
                <p className="mt-2 font-crimson text-sm sm:text-base italic text-[#141414]/85">
                  {essence}
                </p>
              ) : null}
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
              <div className="spell-divider-line mb-3" />
              <div className="flex flex-wrap items-center justify-center gap-2">
                {keyAction ? (
                  <span
                    className="font-montserrat text-[11px] uppercase tracking-wide px-2 py-1 rounded-full"
                    style={{ border: "1px solid rgba(200,164,77,0.35)" }}
                  >
                    {keyAction}
                  </span>
                ) : null}

                {timing ? (
                  <span
                    className="font-montserrat text-[11px] uppercase tracking-wide px-2 py-1 rounded-full"
                    style={{ border: "1px solid rgba(200,164,77,0.35)" }}
                  >
                    {timing}
                  </span>
                ) : null}

                {guideBadge ? (
                  <span
                    className="font-montserrat text-[11px] uppercase tracking-wide px-2 py-1 rounded-full"
                    style={{ border: "1px solid rgba(200,164,77,0.35)" }}
                  >
                    {guideBadge}
                  </span>
                ) : null}

                {sealIconPath ? (
                  <span className="ml-1 drop-glow-gold-soft">
                    <CrowlandsIcon iconPath={sealIconPath} alt="Seal" size={18} />
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
