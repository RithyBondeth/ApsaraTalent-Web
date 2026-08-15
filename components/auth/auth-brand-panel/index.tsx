"use client";

import { PixelMosaic } from "@/components/utils/brand/pixel-mosaic";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";
import { IAuthBrandPanelProps } from "./props";

/* ---------------------------------------------------------------------------
 * The artwork here used to be one of seven SVGs in assets/auth/, 34–86 KB each
 * and 387 KB in total, each loaded with `priority` and each `alt=""` — so the
 * browser was told to race for a decoration that carried no information. None
 * used currentColor, so they stayed lit the same way whichever theme the panel
 * was in, which is the whole reason the panel needed its own ink token.
 *
 * This is the same call the page banners already made (see PageBanner). The
 * mosaic replacing them is markup, follows the theme through --pixel-*, and is
 * seeded per route so each auth screen still has its own face.
 * ------------------------------------------------------------------------- */

export default function AuthBrandPanel(props: IAuthBrandPanelProps) {
  /* ------------------------------- Props ------------------------------- */
  const {
    eyebrowKey = "loginPanelEyebrow",
    titleKey = "loginPanelTitle",
    subtitleKey = "loginPanelSubtitle",
    className,
  } = props;

  /* ------------------------------- Utils ------------------------------- */
  const t = useTranslations("auth");
  const panelRef = useRef<HTMLDivElement>(null);

  /* ------------------------------- Effects ------------------------------ */
  // ── Handle Pointer Spotlight and Gentle Artwork Parallax ──────────────
  const handlePointer = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const relX = (e.clientX - r.left) / r.width - 0.5;
    const relY = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--mx", `${(relX + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(relY + 0.5) * 100}%`);
    el.style.setProperty("--img-x", `${relX * 16}px`);
    el.style.setProperty("--img-y", `${relY * 12}px`);
  }, []);

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <div
      ref={panelRef}
      onMouseMove={handlePointer}
      className={cn(
        "auth-panel relative hidden flex-col p-12 lg:flex xl:p-14",
        className,
      )}
    >
      {/* Ambient Art Layers Section */}
      <div className="auth-panel-grid" aria-hidden />
      <div className="auth-nimbus" aria-hidden />
      <div className="auth-spotlight" aria-hidden />

      {/* Hero Artwork Section */}
      <div className="relative z-[1] flex flex-1 items-center justify-center py-8">
        <div
          className="auth-hero-wrap auth-rise w-full max-w-[380px]"
          style={{ "--d": "120ms" } as React.CSSProperties}
        >
          <div className="auth-hero-float">
            {/* Seeded from titleKey — already unique per auth route, so login,
                signup and reset each get their own mark without another prop
                to keep in sync at seven call sites. */}
            <PixelMosaic seed={titleKey} columns={12} density="medium" />
          </div>
        </div>
      </div>

      {/* Editorial Caption Section */}
      <div className="relative z-10 max-w-md">
        <p className="auth-eyebrow pixel-label mb-3.5">{t(eyebrowKey)}</p>
        <h2 className="pixel-display text-[1.9rem] xl:text-[2.15rem]">
          {t(titleKey)}
        </h2>
        <p className="mt-3.5 max-w-sm text-[14.5px] leading-relaxed text-[hsl(var(--auth-ink)/0.58)]">
          {t(subtitleKey)}
        </p>
      </div>
    </div>
  );
}
