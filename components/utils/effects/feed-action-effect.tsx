"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  LucideHeart,
  LucideBookmark,
  LucideStar,
  LucideSparkles,
} from "lucide-react";

/* -------------------------------- Types --------------------------------- */
export type FeedEffectType = "like" | "save";

type ParticleKind = "heart" | "bookmark" | "star" | "sparkle";

interface Particle {
  id: number;
  kind: ParticleKind;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  rotStart: number;
  rotEnd: number;
  driftX: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string; // ring color
  duration: number;
}

let uid = 0;
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/* =============================== SOUNDS ================================== */
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx)
    audioCtx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

/** Synthetic reverb via a convolver with a short noise impulse */
function makeReverb(ctx: AudioContext, secs: number): ConvolverNode {
  const conv = ctx.createConvolver();
  const len = Math.floor(ctx.sampleRate * secs);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
  }
  conv.buffer = buf;
  return conv;
}

function addOsc(
  ctx: AudioContext,
  dest: AudioNode,
  type: OscillatorType,
  freqs: [number, number][], // [time, freq]
  amps: [number, number, number][], // [time, gain, endTime]
  stopAt: number,
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g);
  g.connect(dest);
  osc.type = type;
  freqs.forEach(([t, f]) => osc.frequency.setValueAtTime(f, t));
  // exponential ramp from first amp to near-zero
  g.gain.setValueAtTime(0, amps[0][0]);
  g.gain.linearRampToValueAtTime(amps[0][1], amps[0][0] + 0.018);
  g.gain.exponentialRampToValueAtTime(0.0001, amps[0][2]);
  osc.start(ctx.currentTime);
  osc.stop(stopAt);
}

function playLikeSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.75, now);
  master.connect(ctx.destination);

  const rev = makeReverb(ctx, 0.5);
  const revGain = ctx.createGain();
  revGain.gain.setValueAtTime(0.3, now);
  master.connect(rev);
  rev.connect(revGain);
  revGain.connect(ctx.destination);

  // Layer 1 — main upward pop (A4 → A5 → Ab5)
  addOsc(
    ctx,
    master,
    "sine",
    [
      [now, 440],
      [now + 0.06, 880],
      [now + 0.16, 830],
    ],
    [[now, 0.55, now + 0.38]],
    now + 0.4,
  );

  // Layer 2 — sparkle harmonic (E6)
  addOsc(
    ctx,
    master,
    "triangle",
    [[now, 1318]],
    [[now, 0.18, now + 0.22]],
    now + 0.22,
  );

  // Layer 3 — low body thump (A2 → low)
  addOsc(
    ctx,
    master,
    "sine",
    [
      [now, 110],
      [now + 0.06, 55],
    ],
    [[now, 0.45, now + 0.14]],
    now + 0.16,
  );

  // Layer 4 — shimmer (C#7 flash)
  addOsc(
    ctx,
    master,
    "sine",
    [[now, 2217]],
    [[now, 0.1, now + 0.1]],
    now + 0.12,
  );
}

function playSaveSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.65, now);
  master.connect(ctx.destination);

  const rev = makeReverb(ctx, 0.9);
  const revGain = ctx.createGain();
  revGain.gain.setValueAtTime(0.45, now);
  master.connect(rev);
  rev.connect(revGain);
  revGain.connect(ctx.destination);

  // C-major arpeggio  C5 → E5 → G5 → C6  (bell triangle wave)
  const arpNotes = [
    { freq: 523.25, t: 0 },
    { freq: 659.25, t: 0.09 },
    { freq: 783.99, t: 0.18 },
    { freq: 1046.5, t: 0.29 },
  ];

  arpNotes.forEach(({ freq, t }) => {
    addOsc(
      ctx,
      master,
      "triangle",
      [[now + t, freq]],
      [[now + t, 0.28, now + t + 0.75]],
      now + t + 0.78,
    );
  });

  // Soft sub-harmonic shimmer on C3
  addOsc(
    ctx,
    master,
    "sine",
    [[now, 130.81]],
    [[now, 0.12, now + 0.5]],
    now + 0.52,
  );
}

/* ========================= VISUAL COMPONENTS ============================= */

/** Expanding ripple ring that bursts from the tap origin */
function AnimatedRipple({ ripple }: { ripple: Ripple }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const anim = el.animate(
      [
        { opacity: 0.9, transform: "scale(0.1)", offset: 0 },
        { opacity: 0.6, transform: "scale(1)", offset: 0.25 },
        { opacity: 0, transform: "scale(2.6)", offset: 1 },
      ],
      { duration: ripple.duration, fill: "forwards", easing: "ease-out" },
    );
    return () => anim.cancel();
  }, [ripple]);

  return (
    <span
      ref={ref}
      style={{
        position: "fixed",
        left: ripple.x - 50,
        top: ripple.y - 50,
        width: 100,
        height: 100,
        borderRadius: "50%",
        border: `3px solid ${ripple.color}`,
        boxShadow: `0 0 18px 4px ${ripple.color}`,
        opacity: 0,
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
}

/** A single floating particle (heart / bookmark / star / sparkle) */
function AnimatedParticle({ p }: { p: Particle }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const anim = el.animate(
      [
        {
          opacity: 0,
          transform: `translate(0,0) scale(0.1) rotate(${p.rotStart}deg)`,
        },
        {
          opacity: 1,
          transform: `translate(${p.driftX * 0.08}px,-22px) scale(1.65) rotate(${p.rotStart * -0.22}deg)`,
          offset: 0.1,
        },
        {
          opacity: 1,
          transform: `translate(${p.driftX * 0.24}px,-52px) scale(1.15) rotate(${p.rotStart * 0.08}deg)`,
          offset: 0.23,
        },
        {
          opacity: 0.95,
          transform: `translate(${p.driftX * 0.55}px,-140px) scale(1.05) rotate(${p.rotEnd * 0.4}deg)`,
          offset: 0.48,
        },
        {
          opacity: 0.4,
          transform: `translate(${p.driftX * 0.82}px,-240px) scale(0.88) rotate(${p.rotEnd * 0.75}deg)`,
          offset: 0.76,
        },
        {
          opacity: 0,
          transform: `translate(${p.driftX}px,-330px) scale(0.6) rotate(${p.rotEnd}deg)`,
        },
      ],
      {
        duration: p.duration,
        delay: p.delay,
        fill: "forwards",
        easing: "ease-out",
      },
    );
    return () => anim.cancel();
  }, [p]);

  const isLike = p.kind === "heart";
  const isStar = p.kind === "star";
  const isSparkle = p.kind === "sparkle";

  const filter = isLike
    ? "drop-shadow(0 0 10px rgba(244,63,94,0.9)) drop-shadow(0 0 22px rgba(244,63,94,0.5))"
    : isStar || isSparkle
      ? "drop-shadow(0 0 8px rgba(250,204,21,0.95)) drop-shadow(0 0 18px rgba(234,179,8,0.55))"
      : "drop-shadow(0 0 10px rgba(234,179,8,0.95)) drop-shadow(0 0 22px rgba(234,179,8,0.55))";

  return (
    <span
      ref={ref}
      style={{
        position: "fixed",
        left: p.x - p.size / 2,
        top: p.y - p.size / 2,
        width: p.size,
        height: p.size,
        opacity: 0,
        pointerEvents: "none",
        display: "inline-flex",
        filter,
        zIndex: 9999,
      }}
    >
      {isLike && (
        <LucideHeart
          style={{ width: "100%", height: "100%" }}
          className="fill-rose-500 text-rose-300"
        />
      )}
      {p.kind === "bookmark" && (
        <LucideBookmark
          style={{ width: "100%", height: "100%" }}
          className="fill-yellow-400 text-yellow-200"
        />
      )}
      {isStar && (
        <LucideStar
          style={{ width: "100%", height: "100%" }}
          className="fill-yellow-300 text-yellow-200"
        />
      )}
      {isSparkle && (
        <LucideSparkles
          style={{ width: "100%", height: "100%" }}
          className="fill-yellow-300 text-yellow-100"
        />
      )}
    </span>
  );
}

/* ================================ HOOK =================================== */
export function useFeedActionEffect() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const trigger = useCallback(
    (type: FeedEffectType, e?: React.MouseEvent | React.TouchEvent) => {
      /* Origin */
      let ox: number, oy: number;
      if (e) {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        ox = r.left + r.width / 2;
        oy = r.top + r.height / 2;
      } else {
        ox = typeof window !== "undefined" ? window.innerWidth / 2 : 300;
        oy = typeof window !== "undefined" ? window.innerHeight * 0.62 : 420;
      }

      /* Sound */
      if (type === "like") playLikeSound();
      else playSaveSound();

      /* Ripple ring */
      const rippleId = ++uid;
      const rippleDuration = 700;
      setRipples((prev) => [
        ...prev,
        {
          id: rippleId,
          x: ox,
          y: oy,
          color:
            type === "like" ? "rgba(244,63,94,0.7)" : "rgba(234,179,8,0.7)",
          duration: rippleDuration,
        },
      ]);
      setTimeout(
        () => setRipples((prev) => prev.filter((r) => r.id !== rippleId)),
        rippleDuration + 100,
      );

      /* Particles */
      const isLike = type === "like";

      // hearts or bookmarks + accent particles
      const mainKinds: ParticleKind[] = isLike
        ? ["heart", "heart", "heart", "heart", "heart", "heart", "heart"]
        : ["bookmark", "bookmark", "bookmark", "bookmark", "bookmark"];

      const accentKinds: ParticleKind[] = isLike
        ? ["star", "star", "sparkle"] // small stars around hearts
        : ["star", "star", "sparkle", "sparkle"]; // gold stars around bookmarks

      const allKinds = [...mainKinds, ...accentKinds];

      const newParticles: Particle[] = allKinds.map((kind, i) => {
        const isAccent = i >= mainKinds.length;
        return {
          id: ++uid,
          kind,
          x: ox + rand(-90, 90),
          y: oy + rand(-40, 40),
          size: isAccent ? rand(22, 38) : isLike ? rand(58, 102) : rand(48, 84),
          delay: i * 70 + (isAccent ? rand(0, 120) : 0),
          duration: isAccent ? rand(1200, 1700) : rand(1900, 2500),
          rotStart: rand(-45, 45),
          rotEnd: rand(-35, 35),
          driftX: rand(-75, 75),
        };
      });

      setParticles((prev) => [...prev, ...newParticles]);

      const maxMs =
        Math.max(...newParticles.map((n) => n.duration + n.delay)) + 200;
      setTimeout(() => {
        const ids = new Set(newParticles.map((n) => n.id));
        setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
      }, maxMs);
    },
    [],
  );

  const effectPortal =
    typeof document !== "undefined" &&
    (particles.length > 0 || ripples.length > 0)
      ? createPortal(
          <>
            {ripples.map((r) => (
              <AnimatedRipple key={r.id} ripple={r} />
            ))}
            {particles.map((p) => (
              <AnimatedParticle key={p.id} p={p} />
            ))}
          </>,
          document.body,
        )
      : null;

  return { trigger, effectPortal };
}
