"use client";

import { cn } from "@/lib/utils";
import { GridRunners } from "@/components/ui/grid-runners";
import { useTranslations } from "next-intl";
import Image, { type StaticImageData } from "next/image";
import { useCallback, useRef } from "react";

/* ------------------------------- Helper -------------------------------- */
interface IAuthBrandPanelProps {
  image?: StaticImageData;
  imageAlt?: string;
  eyebrowKey?: string;
  titleKey?: string;
  subtitleKey?: string;
  className?: string;
}

export default function AuthBrandPanel(props: IAuthBrandPanelProps) {
  /* ------------------------------- Props ------------------------------- */
  const {
    image,
    imageAlt = "",
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
        "auth-panel relative hidden lg:flex flex-col p-12 xl:p-14",
        className,
      )}
    >
      {/* Ambient Art Layers Section */}
      <div className="auth-panel-grid" aria-hidden />
      <GridRunners className="auth-grid-runners" />
      <div className="auth-nimbus" aria-hidden />
      <div className="auth-spotlight" aria-hidden />

      {/* Hero Artwork Section */}
      <div className="relative z-[1] flex flex-1 items-center justify-center py-8">
        {image && (
          <div
            className="auth-hero-wrap auth-rise w-full max-w-[420px]"
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            <div className="auth-hero-float">
              <Image
                src={image}
                alt={imageAlt}
                priority
                className="mx-auto h-auto w-full max-h-[42vh] object-contain select-none"
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* Editorial Caption Section */}
      <div className="relative z-10 max-w-md">
        <p className="auth-eyebrow mb-3.5">{t(eyebrowKey)}</p>
        <h2 className="text-[1.9rem] xl:text-[2.15rem] font-semibold leading-[1.12] tracking-[-0.02em]">
          {t(titleKey)}
        </h2>
        <p className="mt-3.5 max-w-sm text-[14.5px] leading-relaxed text-[hsl(var(--auth-ink)/0.58)]">
          {t(subtitleKey)}
        </p>
      </div>
    </div>
  );
}
