"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);

// Expose gsap in dev for console debugging (stripped from production builds)
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  (window as typeof window & { gsap?: typeof gsap }).gsap = gsap;
}

/* ------------------------------ Media Queries ------------------------------ */
const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";
const FINE_POINTER =
  "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)";

/* --------------------------------- Helpers -------------------------------- */
/**
 * Splits an element's text into animatable unit spans (`.gsap-unit`).
 *
 * - "word" granularity wraps each word in an inline-block span.
 * - "grapheme" granularity wraps words in non-breaking wrappers, then splits
 *   each word into grapheme clusters (Khmer-safe via Intl.Segmenter).
 * - Element children (e.g. gradient spans) are kept whole so that
 *   `background-clip: text` is never broken by transformed descendants.
 * - Idempotent: re-running on an already-split element is a no-op.
 */
function splitTextIntoUnits(
  el: HTMLElement,
  granularity: "word" | "grapheme" = "word",
) {
  if (el.dataset.gsapSplit) return;

  const hasSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl;
  const segment = (text: string, mode: "word" | "grapheme"): string[] => {
    if (hasSegmenter) {
      const segmenter = new Intl.Segmenter(undefined, { granularity: mode });
      return Array.from(segmenter.segment(text), (s) => s.segment);
    }
    return mode === "grapheme" ? Array.from(text) : text.split(/(\s+)/);
  };

  const makeUnit = (text: string): HTMLSpanElement => {
    const span = document.createElement("span");
    span.className = "gsap-unit";
    span.style.display = "inline-block";
    span.textContent = text;
    return span;
  };

  const nodes = Array.from(el.childNodes);
  el.innerHTML = "";

  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      segment(node.textContent ?? "", "word").forEach((word) => {
        if (!word) return;
        if (/^\s+$/.test(word)) {
          el.appendChild(document.createTextNode(word));
          return;
        }
        if (granularity === "word") {
          el.appendChild(makeUnit(word));
          return;
        }
        // Grapheme mode: non-breaking word wrapper -> grapheme unit spans
        const wrapper = document.createElement("span");
        wrapper.style.display = "inline-block";
        wrapper.style.whiteSpace = "nowrap";
        segment(word, "grapheme").forEach((grapheme) => {
          if (grapheme) wrapper.appendChild(makeUnit(grapheme));
        });
        el.appendChild(wrapper);
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.tagName === "BR") {
        el.appendChild(element);
        return;
      }
      element.classList.add("gsap-unit");
      element.style.display = "inline-block";
      el.appendChild(element);
    }
  });

  el.dataset.gsapSplit = granularity;
}

/**
 * Magnetic hover effect for `[data-magnetic]` elements — the element is
 * gently attracted toward the cursor and snaps back elastically on leave.
 * Optional attraction strength via the attribute value (default 0.25).
 */
function setupMagneticElements(scope: HTMLElement): () => void {
  const cleanups: Array<() => void> = [];

  scope.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || "") || 0.25;
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.45)",
        overwrite: "auto",
      });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

/**
 * 3D tilt + cursor spotlight for `[data-tilt-card]` elements. The card tilts
 * toward the cursor while `--spot-x/--spot-y` CSS variables feed the
 * `.card-spotlight` radial-gradient overlay.
 */
function setupTiltCards(scope: HTMLElement): () => void {
  const cleanups: Array<() => void> = [];

  scope.querySelectorAll<HTMLElement>("[data-tilt-card]").forEach((card) => {
    gsap.set(card, { transformPerspective: 900 });
    const rotX = gsap.quickTo(card, "rotationX", {
      duration: 0.5,
      ease: "power3.out",
    });
    const rotY = gsap.quickTo(card, "rotationY", {
      duration: 0.5,
      ease: "power3.out",
    });

    const onMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      rotY((px - 0.5) * 10);
      rotX((0.5 - py) * 10);
      card.style.setProperty("--spot-x", `${px * 100}%`);
      card.style.setProperty("--spot-y", `${py * 100}%`);
    };
    const onLeave = () => {
      rotX(0);
      rotY(0);
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    cleanups.push(() => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

/* --------------------------------- Usage --------------------------------- */
/**
 * Attaches GSAP scroll-triggered animations to any element inside the
 * returned ref that carries a `data-gsap` attribute.
 *
 * Usage:
 *   const containerRef = useGsapScrollAnimation<HTMLDivElement>();
 *
 *   <div ref={containerRef}>
 *     <h2  data-gsap="split-chars">Title</h2>
 *     <p   data-gsap="blur-reveal">Body</p>
 *     <ul  data-gsap="stagger-children"><li>...</li></ul>
 *     <div data-gsap="parallax" data-speed="0.3">Drifts on scroll</div>
 *   </div>
 *
 *   Variants: fade-up | fade-down | fade-left | fade-right | scale-up
 *             blur-reveal | split-words | split-chars | stagger-children
 *             parallax (data-speed) | zoom-parallax
 *
 *   Extras (scoped to the same container):
 *     svg[data-gsap-draw] > [data-draw-path]     — DrawSVG scrubbed drawing
 *     svg[data-gsap-draw] > [data-draw-traveler] — dot traveling along path
 *     [data-tilt-card]  — 3D tilt + cursor spotlight (fine pointers only)
 *     [data-magnetic]   — magnetic hover (fine pointers only)
 *
 *   All entrance animations are skipped for prefers-reduced-motion users.
 */

/* ------------------------------------ Hook ------------------------------------ */
export function useGsapScrollAnimation<T extends HTMLElement>() {
  /* -------------------------------- All States -------------------------------- */
  const containerRef = useRef<T>(null);

  /* --------------------------------- Effects ---------------------------------- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia(container);
    const query = (selector: string) =>
      gsap.utils.toArray<HTMLElement>(container.querySelectorAll(selector));

    mm.add(MOTION_OK, () => {
      // ── fade-up / fade-down ────────────────────────────────
      (["fade-up", "fade-down"] as const).forEach((variant) => {
        query(`[data-gsap='${variant}']`).forEach((el, i) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: variant === "fade-up" ? 40 : -30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: i * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            },
          );
        });
      });

      // ── fade-left / fade-right ─────────────────────────────
      (["fade-left", "fade-right"] as const).forEach((variant) => {
        query(`[data-gsap='${variant}']`).forEach((el, i) => {
          gsap.fromTo(
            el,
            { opacity: 0, x: variant === "fade-left" ? -50 : 50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              delay: i * 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            },
          );
        });
      });

      // ── scale-up ───────────────────────────────────────────
      query("[data-gsap='scale-up']").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.92, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // ── blur-reveal — fade + unblur + rise ─────────────────
      query("[data-gsap='blur-reveal']").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, scale: 0.97, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.9,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // ── split-words — animate each word individually ───────
      query("[data-gsap='split-words']").forEach((el) => {
        splitTextIntoUnits(el, "word");
        const units = el.querySelectorAll(".gsap-unit");
        gsap.fromTo(
          units,
          { opacity: 0, y: 20, rotateX: -40 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // ── split-chars — grapheme cascade (Khmer-safe) ────────
      query("[data-gsap='split-chars']").forEach((el) => {
        splitTextIntoUnits(el, "grapheme");
        const units = el.querySelectorAll(".gsap-unit");
        gsap.fromTo(
          units,
          { opacity: 0, y: 26, rotateX: -70, transformPerspective: 600 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: { each: 0.02, from: "start" },
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // ── stagger-children — grid-aware cascade ──────────────
      query("[data-gsap='stagger-children']").forEach((el) => {
        gsap.fromTo(
          el.children,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: { each: 0.09, grid: "auto", from: "start" },
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // ── parallax — scrubbed drift through the viewport ─────
      query("[data-gsap='parallax']").forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "") || 0.2;
        gsap.fromTo(
          el,
          { y: speed * 100 },
          {
            y: -speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section") ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // ── zoom-parallax — scale in while scrolling through ───
      query("[data-gsap='zoom-parallax']").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.85, autoAlpha: 0.55 },
          {
            scale: 1,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section") ?? el,
              start: "top 85%",
              end: "center center",
              scrub: 1,
            },
          },
        );
      });

      // ── SVG path drawing + traveling dot ───────────────────
      container
        .querySelectorAll<SVGSVGElement>("svg[data-gsap-draw]")
        .forEach((svg) => {
          const path = svg.querySelector<SVGPathElement>("[data-draw-path]");
          if (!path) return;
          const traveler = svg.querySelector<SVGGElement>(
            "[data-draw-traveler]",
          );

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: svg,
              start: "top 82%",
              end: "bottom 35%",
              scrub: 1,
            },
          });
          tl.fromTo(
            path,
            { drawSVG: "0%" },
            { drawSVG: "100%", ease: "none" },
            0,
          );
          if (traveler) {
            tl.to(
              traveler,
              {
                motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
                ease: "none",
              },
              0,
            );
          }
        });
    });

    // ── Fine-pointer only: magnetic + tilt interactions ──────
    mm.add(FINE_POINTER, () => {
      const cleanupMagnetic = setupMagneticElements(container);
      const cleanupTilt = setupTiltCards(container);
      return () => {
        cleanupMagnetic();
        cleanupTilt();
      };
    });

    return () => mm.revert();
  }, []);
  return containerRef;
}

/* --------------------------------- Usage --------------------------------- */
/**
 * Runs a coordinated hero entrance animation on mount, plus ambient motion
 * (floating particles, mouse-parallax layers, magnetic CTAs, scroll exit).
 *
 * Usage:
 *   const containerRef = useGsapHeroAnimation<HTMLElement>();
 *
 *   <section ref={containerRef}>
 *     <div data-hero-layer="1.4">background orb</div>   // mouse parallax depth
 *     <span data-hero-particle />                       // floating dust
 *     <div data-hero-content>                           // scroll-exit target
 *       <span data-hero="badge">New</span>
 *       <h1   data-hero="heading">Headline</h1>         // grapheme cascade
 *       <p    data-hero="description">Subtitle</p>
 *       <div  data-hero="cta"><Link data-magnetic/></div>
 *       <div  data-hero="stats">Stats row</div>
 *       <span data-hero="scroll">Scroll indicator</span>
 *     </div>
 *   </section>
 *
 *   // Re-mount the parent with a new key to replay on language switch.
 *   // Reduced-motion users get everything shown instantly, no motion.
 */

/* ------------------------------------ Hook ------------------------------------ */
export function useGsapHeroAnimation<T extends HTMLElement>() {
  /* -------------------------------- All States -------------------------------- */
  const containerRef = useRef<T>(null);

  /* --------------------------------- Effects ---------------------------------- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia(container);

    // ── Reduced motion: show everything, animate nothing ─────
    mm.add(MOTION_REDUCED, () => {
      gsap.set(
        container.querySelectorAll("[data-hero], [data-hero-particle]"),
        { autoAlpha: 1 },
      );
    });

    mm.add(MOTION_OK, () => {
      // ── Entrance timeline ──────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-hero='badge']",
        { opacity: 0, y: 20, scale: 0.9, filter: "blur(6px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.6 },
        0.2,
      );

      const headingEl = container.querySelector<HTMLElement>(
        "[data-hero='heading']",
      );
      if (headingEl) {
        splitTextIntoUnits(headingEl, "grapheme");
        const units = headingEl.querySelectorAll(".gsap-unit");

        tl.fromTo(
          headingEl,
          { opacity: 0 },
          { opacity: 1, duration: 0.01 },
          0.35,
        );
        tl.fromTo(
          units,
          { opacity: 0, y: 34, rotateX: -70, transformPerspective: 600 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: { each: 0.016, from: "start" },
            ease: "back.out(1.4)",
          },
          0.35,
        );
      }

      tl.fromTo(
        "[data-hero='description']",
        { opacity: 0, y: 30, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
        0.9,
      );
      tl.fromTo(
        "[data-hero='cta']",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7 },
        1.1,
      );
      tl.fromTo(
        "[data-hero='stats']",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.3,
      );
      const scrollIndicator = container.querySelector("[data-hero='scroll']");
      if (scrollIndicator) {
        tl.fromTo(
          scrollIndicator,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          1.55,
        );
      }

      // ── Floating particles — endless gentle drift ──────────
      container
        .querySelectorAll<HTMLElement>("[data-hero-particle]")
        .forEach((particle, i) => {
          gsap.to(particle, {
            autoAlpha: gsap.utils.random(0.25, 0.7),
            duration: 1.2,
            delay: 0.8 + i * 0.08,
          });
          gsap.to(particle, {
            y: gsap.utils.random(-70, -25),
            x: gsap.utils.random(-25, 25),
            duration: gsap.utils.random(4, 8),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.25,
          });
        });

      // ── Scroll exit — content drifts up + fades on scroll ──
      const content = container.querySelector("[data-hero-content]");
      if (content) {
        gsap.to(content, {
          yPercent: -12,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom 55%",
            scrub: true,
          },
        });
      }
    });

    // ── Fine pointers: mouse-parallax layers + magnetic CTAs ─
    mm.add(FINE_POINTER, () => {
      const movers = Array.from(
        container.querySelectorAll<HTMLElement>("[data-hero-layer]"),
      ).map((layer) => ({
        x: gsap.quickTo(layer, "x", { duration: 1.4, ease: "power2.out" }),
        y: gsap.quickTo(layer, "y", { duration: 1.4, ease: "power2.out" }),
        depth: parseFloat(layer.dataset.heroLayer || "") || 1,
      }));

      const onMove = (event: MouseEvent) => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        movers.forEach((mover) => {
          mover.x(nx * 46 * mover.depth);
          mover.y(ny * 46 * mover.depth);
        });
      };
      window.addEventListener("mousemove", onMove);

      const cleanupMagnetic = setupMagneticElements(container);
      return () => {
        window.removeEventListener("mousemove", onMove);
        cleanupMagnetic();
      };
    });

    return () => mm.revert();
  }, []);
  return containerRef;
}

/* --------------------------------- Usage --------------------------------- */
/**
 * Infinite marquee whose speed and direction react to scroll velocity.
 * Attach the ref to a `w-max flex` track containing the content TWICE
 * (second copy aria-hidden) — the track loops via xPercent -50.
 */

/* ------------------------------------ Hook ------------------------------------ */
export function useGsapMarquee<T extends HTMLElement>() {
  /* -------------------------------- All States -------------------------------- */
  const trackRef = useRef<T>(null);

  /* --------------------------------- Effects ---------------------------------- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const tween = gsap.fromTo(
        track,
        { xPercent: 0 },
        { xPercent: -50, ease: "none", duration: 24, repeat: -1 },
      );
      // Park the playhead deep into the repeats so negative timeScale
      // (scrolling up) can play backwards indefinitely.
      tween.totalTime(tween.duration() * 500);

      let settleTween: gsap.core.Tween | null = null;
      const trigger = ScrollTrigger.create({
        onUpdate(self) {
          const velocity = self.getVelocity();
          if (Math.abs(velocity) < 60) return;
          settleTween?.kill();
          tween.timeScale(gsap.utils.clamp(-5, 5, velocity / 240) || 1);
          settleTween = gsap.to(tween, {
            timeScale: velocity < 0 ? -1 : 1,
            duration: 1.2,
            ease: "power2.out",
          });
        },
      });

      return () => {
        trigger.kill();
        settleTween?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);
  return trackRef;
}

/* --------------------------------- Usage --------------------------------- */
/**
 * Scroll progress bar — attach the ref to a fixed, origin-left element;
 * it scales from 0 to 1 across the full page scroll.
 */

/* ------------------------------------ Hook ------------------------------------ */
