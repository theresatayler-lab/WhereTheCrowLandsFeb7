// SpellComicsRotation — crossfade gallery for the spell generation loading screen.
// Phase 1: Guide intro video (full-screen, plays once).
// Phase 2: Guide-specific comic panels, then shared pool; stills ~8s, videos play once.

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Guide intro videos (play first, before comics) ──────────────────────────
const GUIDE_INTRO_VIDEOS = {
  cathleen:  '/images/guides/videos/cathleen-video.mp4',
  shigg:     '/images/guides/videos/shigg-video.mp4',
  katherine: '/images/guides/videos/katherine-video.mp4',
  theresa:   '/images/guides/videos/theresa-video.mp4',
};

// ── Comic asset catalog (from MANIFEST.md) ───────────────────────────────────

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

function buildComicPlaylist(guideId) {
  const guidePool = GUIDE_ASSETS[guideId] || [];
  return [...shuffle(guidePool), ...shuffle(SHARED_ASSETS)];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SpellComicsRotation({ guideId, className = '' }) {
  // Phase 1: guide intro video, Phase 2: comic rotation
  const introSrc = GUIDE_INTRO_VIDEOS[guideId] || null;
  const [phase, setPhase] = useState(introSrc ? 'intro' : 'comics');

  const [comicPlaylist] = useState(() => buildComicPlaylist(guideId));
  const [comicIndex, setComicIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const introVideoRef = useRef(null);
  const comicVideoRef = useRef(null);
  const timerRef = useRef(null);

  // ── Phase 1: Intro video ──────────────────────────────────────────────────

  const handleIntroEnded = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setPhase('comics');
      setFading(false);
    }, CROSSFADE_MS);
  }, []);

  useEffect(() => {
    if (phase === 'intro' && introVideoRef.current) {
      introVideoRef.current.play().catch(() => {});
    }
  }, [phase]);

  // ── Phase 2: Comic rotation ───────────────────────────────────────────────

  const current = comicPlaylist[comicIndex % comicPlaylist.length];
  const comicSrc = current ? BASE_PATH + current.file : null;

  const advanceComic = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setComicIndex(i => (i + 1) % comicPlaylist.length);
      setFading(false);
    }, CROSSFADE_MS);
  }, [comicPlaylist.length]);

  // Stills: advance after STILL_DURATION_MS
  useEffect(() => {
    if (phase !== 'comics' || !current) return;
    if (current.type === 'still') {
      timerRef.current = setTimeout(advanceComic, STILL_DURATION_MS);
    }
    return () => clearTimeout(timerRef.current);
  }, [phase, comicIndex, current, advanceComic]);

  // Videos: advance when playback ends
  const handleComicVideoEnded = useCallback(() => {
    advanceComic();
  }, [advanceComic]);

  useEffect(() => {
    const vid = comicVideoRef.current;
    if (phase === 'comics' && vid && current?.type === 'video') {
      vid.addEventListener('ended', handleComicVideoEnded);
      vid.play().catch(() => {});
      return () => vid.removeEventListener('ended', handleComicVideoEnded);
    }
  }, [phase, comicIndex, current, handleComicVideoEnded]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ transition: `opacity ${CROSSFADE_MS}ms ease-in-out`, opacity: fading ? 0 : 0.4 }}
    >
      {phase === 'intro' && introSrc ? (
        <video
          key="intro"
          ref={introVideoRef}
          src={introSrc}
          muted
          playsInline
          onEnded={handleIntroEnded}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(0.8) contrast(1.1)' }}
        />
      ) : current?.type === 'still' ? (
        <img
          key={comicSrc}
          src={comicSrc}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(0.8) contrast(1.1)' }}
        />
      ) : (
        <video
          key={comicSrc}
          ref={comicVideoRef}
          src={comicSrc}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(0.8) contrast(1.1)' }}
        />
      )}
    </div>
  );
}
