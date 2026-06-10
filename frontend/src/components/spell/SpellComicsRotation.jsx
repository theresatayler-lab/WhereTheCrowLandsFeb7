// SpellComicsRotation — crossfade gallery for the spell generation loading screen.
// Assets served from /spell_comics/ (public folder, lazy-loaded).
// Guide pool first, then shared; stills ~8s crossfade, videos play once then advance.

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Asset catalog (from MANIFEST.md) ──────────────────────────────────────────

const GUIDE_ASSETS = {
  cathleen: [
    { file: 'sc37.webp', type: 'still' },
    { file: 'sc31.webp', type: 'still' },
    { file: 'sc32.webp', type: 'still' },
    { file: 'sc49.webp', type: 'still' },
    { file: 'sc50.webp', type: 'still' },
    { file: 'sc55.mp4', type: 'video' },
    { file: 'sc51.mp4', type: 'video' },
    { file: 'sc52.mp4', type: 'video' },
    { file: 'sc53.mp4', type: 'video' },
    { file: 'sc43.mp4', type: 'video' },
  ],
  shigg: [
    { file: 'sc34.webp', type: 'still' },
    { file: 'sc35.webp', type: 'still' },
    { file: 'sc36.webp', type: 'still' },
    { file: 'sc40.webp', type: 'still' },
    { file: 'sc26.webp', type: 'still' },
  ],
  katherine: [
    { file: 'sc33.webp', type: 'still' },
    { file: 'sc17.webp', type: 'still' },
    { file: 'sc41.mp4', type: 'video' },
    { file: 'sc56.mp4', type: 'video' },
  ],
  theresa: [
    { file: 'sc07.webp', type: 'still' },
    { file: 'sc11.webp', type: 'still' },
    { file: 'sc14.webp', type: 'still' },
    { file: 'sc19.webp', type: 'still' },
    { file: 'sc16.webp', type: 'still' },
    { file: 'sc12.mp4', type: 'video' },
  ],
  brenda: [
    { file: 'sc21.webp', type: 'still' },
    { file: 'sc24.webp', type: 'still' },
    { file: 'sc27.webp', type: 'still' },
    { file: 'sc28.webp', type: 'still' },
    { file: 'sc02.mp4', type: 'video' },
    { file: 'sc30.mp4', type: 'video' },
  ],
};

const SHARED_ASSETS = [
  { file: 'sc29.webp', type: 'still' },
  { file: 'sc47.webp', type: 'still' },
  { file: 'sc48.webp', type: 'still' },
  { file: 'sc15.webp', type: 'still' },
  { file: 'sc18.webp', type: 'still' },
  { file: 'sc20.webp', type: 'still' },
  { file: 'sc22.webp', type: 'still' },
  { file: 'sc25.webp', type: 'still' },
  { file: 'sc23.webp', type: 'still' },
  { file: 'sc54.mp4', type: 'video' },
  { file: 'sc57.mp4', type: 'video' },
  { file: 'sc58.mp4', type: 'video' },
  { file: 'sc45.mp4', type: 'video' },
  { file: 'sc46.mp4', type: 'video' },
  { file: 'sc04.mp4', type: 'video' },
  { file: 'sc38.mp4', type: 'video' },
];

const STILL_DURATION_MS = 8000;
const CROSSFADE_MS = 1200;
const BASE_PATH = '/spell_comics/';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPlaylist(guideId) {
  const guidePool = GUIDE_ASSETS[guideId] || [];
  return [...shuffle(guidePool), ...shuffle(SHARED_ASSETS)];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SpellComicsRotation({ guideId, className = '' }) {
  const [playlist] = useState(() => buildPlaylist(guideId));
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  const current = playlist[index % playlist.length];
  const src = BASE_PATH + current.file;

  const advance = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setIndex(i => (i + 1) % playlist.length);
      setFading(false);
    }, CROSSFADE_MS);
  }, [playlist.length]);

  // Stills: advance after STILL_DURATION_MS
  useEffect(() => {
    if (current.type === 'still') {
      timerRef.current = setTimeout(advance, STILL_DURATION_MS);
    }
    return () => clearTimeout(timerRef.current);
  }, [index, current.type, advance]);

  // Videos: advance when playback ends
  const handleVideoEnded = useCallback(() => {
    advance();
  }, [advance]);

  // Attach ended listener when video element mounts
  useEffect(() => {
    const vid = videoRef.current;
    if (vid && current.type === 'video') {
      vid.addEventListener('ended', handleVideoEnded);
      vid.play().catch(() => {});
      return () => vid.removeEventListener('ended', handleVideoEnded);
    }
  }, [index, current.type, handleVideoEnded]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ transition: `opacity ${CROSSFADE_MS}ms ease-in-out`, opacity: fading ? 0 : 0.4 }}
    >
      {current.type === 'still' ? (
        <img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(0.8) contrast(1.1)' }}
        />
      ) : (
        <video
          key={src}
          ref={videoRef}
          src={src}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(0.8) contrast(1.1)' }}
        />
      )}
    </div>
  );
}
