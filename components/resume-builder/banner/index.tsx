import Image from "next/image";
import { resumeBuilderBannerSvg } from "@/utils/constants/asset.constant";
import { useTranslations } from "next-intl";
import { LucideSparkles } from "lucide-react";

export default function ResumeBuilderBanner() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section className="flex min-h-[300px] w-full flex-row overflow-hidden border border-border bg-card">
      {/* Copy Section */}
      <div className="flex w-3/5 min-w-0 flex-none flex-col justify-between gap-6 px-6 py-7 tablet-md:gap-4 tablet-md:px-4 tablet-md:py-5 sm:px-8 sm:py-9">
        {/* AI Badge Section */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-px w-7 bg-foreground" />
          <span className="line-clamp-1">{t("aiPoweredFeatures")}</span>
        </div>

        {/* Hero Copy Section */}
        <div>
          <h1 className="max-w-[18ch] text-balance text-3xl font-black leading-[1.02] tracking-[-0.045em] text-foreground tablet-md:text-xl sm:text-4xl lg:text-5xl">
            {t("bannerTitle")}
          </h1>
          <p className="mt-3 max-w-[58ch] text-sm leading-6 text-muted-foreground tablet-md:line-clamp-3 tablet-md:text-xs tablet-md:leading-5 sm:text-base">
            {t("bannerSubtitle1")} {t("bannerMuted")}
          </p>
        </div>

        {/* Feature Note Section */}
        <div className="flex max-w-[66ch] items-start gap-2 border-l-2 border-foreground pl-3 text-xs leading-5 text-muted-foreground tablet-md:hidden">
          <LucideSparkles className="mt-0.5 size-3.5 shrink-0 text-foreground" />
          <span>{t("featureDesc")}</span>
        </div>
      </div>

      {/* Animated Illustration Section */}
      <div className="feed-hero-visual resume-builder-hero-visual w-2/5 min-w-0 shrink-0">
        <div aria-hidden className="feed-hero-visual-grid" />

        {/* AI Status Section */}
        <div className="feed-hero-network-chip">
          <span className="feed-hero-network-icon" aria-hidden>
            <LucideSparkles />
          </span>
          <span>{t("aiPoweredFeatures")}</span>
          <span aria-hidden className="feed-hero-network-status" />
        </div>

        {/* Artwork Frame Section */}
        <div aria-hidden className="feed-hero-art-stage">
          <span className="feed-hero-node feed-hero-node-one" />
          <span className="feed-hero-node feed-hero-node-two" />
          <span className="feed-hero-node feed-hero-node-three" />
          <div className="feed-hero-art-frame">
            <div className="feed-hero-art-grid" />
            <div className="feed-hero-art-glow" />
            <Image
              src={resumeBuilderBannerSvg}
              alt="resume builder"
              height={250}
              width={350}
              className="feed-hero-artwork"
              priority
            />
            <span className="feed-hero-corner feed-hero-corner-nw" />
            <span className="feed-hero-corner feed-hero-corner-ne" />
            <span className="feed-hero-corner feed-hero-corner-sw" />
            <span className="feed-hero-corner feed-hero-corner-se" />
          </div>
        </div>

        {/* Signal Bars Section */}
        <div aria-hidden className="feed-hero-signal-bars">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}
