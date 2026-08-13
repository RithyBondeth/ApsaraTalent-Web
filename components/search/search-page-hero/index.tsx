import Image from "next/image";
import { ISearchPageHeroProps } from "./props";

export default function SearchPageHero(props: ISearchPageHeroProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <section className="flex min-h-[300px] w-full flex-row overflow-hidden border border-border bg-card">
      {/* Search Introduction and Controls Section */}
      <div className="flex w-3/5 min-w-0 flex-none flex-col justify-between gap-7 px-6 py-7 tablet-md:gap-4 tablet-md:px-4 tablet-md:py-5 sm:px-8 sm:py-9">
        {/* Eyebrow Section */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-px w-7 bg-primary" />
          <span className="line-clamp-1">{props.eyebrow}</span>
        </div>

        {/* Hero Copy Section */}
        <div className="max-w-3xl">
          <h1 className="max-w-[20ch] text-balance text-3xl font-black leading-[1.04] tracking-[-0.045em] text-foreground tablet-md:text-xl sm:text-4xl lg:text-5xl">
            {props.title}
          </h1>
          <p className="mt-3 max-w-[64ch] text-sm leading-6 text-muted-foreground tablet-md:line-clamp-3 tablet-md:text-xs tablet-md:leading-5 sm:text-base">
            {props.subtitle} {props.supportingText}
          </p>
        </div>

        {/* Supporting Note Section */}
        <p className="max-w-[70ch] border-l-2 border-foreground pl-3 text-xs leading-5 text-muted-foreground tablet-md:hidden">
          {props.mutedText}
        </p>

        {/* Search Controls Section */}
        <div className="w-full">{props.children}</div>
      </div>

      {/* Animated Search Visual Section */}
      <div className="feed-hero-visual search-hero-visual w-2/5 min-w-0 shrink-0">
        <div aria-hidden className="feed-hero-visual-grid" />

        {/* Network Status Section */}
        <div className="feed-hero-network-chip">
          <span className="feed-hero-network-icon" aria-hidden>
            {props.visualIcon}
          </span>
          <span>{props.eyebrow}</span>
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
              src={props.image}
              alt={props.imageAlt}
              height={260}
              width={360}
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
