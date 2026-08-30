"use client";

import { cn } from "@/lib/utils";
import {
  LucideBell,
  LucideBookmark,
  LucideHouse,
  LucideMessageCircle,
  LucideSearch,
  LucideWifi,
} from "lucide-react";
import { ILandingPhoneProps } from "./props";

/* ---------------------------------------------------------------------------
 * The device mockups.
 *
 * These previously drew an inverted app — dark screen, light text, round
 * avatars, a cover banner — inside a squat frame with a speaker grille, which
 * is a pre-2017 handset. The frame is now a current iPhone (Dynamic Island,
 * 19.5:9, concentric corner radii, side buttons, home indicator) and the screen
 * runs the actual product: the app's status bar, the real feed card and the
 * real bottom tab bar, all on the app's own tokens.
 *
 * The shell is --scrim, not --foreground: a phone body should stay dark in
 * both themes, and --foreground would hand it a white bezel on the dark theme.
 * ------------------------------------------------------------------------- */
function StatusBar() {
  return (
    <div className="relative z-10 flex items-center justify-between px-5 pb-1 pt-[14px] text-[9px] font-semibold tabular-nums">
      <span>9:41</span>
      <span className="flex items-center gap-[5px]">
        {/* Signal Bars Section */}
        <span className="flex items-end gap-[1.5px]">
          {[3, 5, 7, 9].map((h) => (
            <span
              key={h}
              style={{ height: `${h}px` }}
              className="w-[2px] rounded-[1px] bg-current"
            />
          ))}
        </span>
        <LucideWifi className="size-[10px]" strokeWidth={2.5} />
        {/* Battery Section */}
        <span className="flex items-center gap-[1px]">
          <span className="border-current/60 relative h-[9px] w-[16px] rounded-[3px] border p-[1.5px]">
            <span className="block h-full w-[70%] rounded-[1px] bg-current" />
          </span>
          <span className="bg-current/60 h-[3px] w-[1px] rounded-r-sm" />
        </span>
      </span>
    </div>
  );
}

function TabBar(props: { active: number }) {
  const items = [
    LucideHouse,
    LucideSearch,
    LucideBookmark,
    LucideMessageCircle,
    LucideBell,
  ];
  return (
    <div className="absolute inset-x-0 bottom-0 border-t border-border bg-background/95 pb-[14px] pt-1.5 backdrop-blur-xl">
      <div className="flex items-stretch justify-around px-2">
        {items.map((Icon, i) => (
          <span
            key={i}
            className={cn(
              "flex h-[22px] w-[26px] items-center justify-center rounded-none border",
              i === props.active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-transparent text-muted-foreground",
            )}
          >
            <Icon
              className="size-[11px]"
              strokeWidth={i === props.active ? 2.2 : 1.6}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export function LandingPhone(props: ILandingPhoneProps) {
  /* ------------------------------- Props ------------------------------- */
  const { children, bar, activeTab = 0 } = props;

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <div className="landing-match-device relative w-full max-w-[248px]">
      {/* Side Button Section */}
      <span
        aria-hidden
        className="absolute -left-[2px] top-[84px] h-7 w-[2px] rounded-l bg-scrim"
      />
      <span
        aria-hidden
        className="absolute -left-[2px] top-[120px] h-7 w-[2px] rounded-l bg-scrim"
      />
      <span
        aria-hidden
        className="absolute -right-[2px] top-[104px] h-11 w-[2px] rounded-r bg-scrim"
      />

      {/* Device Body Section — radii are concentric: 40 outer, 32 inner + 8 bezel */}
      <div className="relative rounded-[40px] bg-scrim p-2 shadow-[0_30px_70px_hsl(var(--scrim)/0.38)]">
        {/* Device Screen Section — the app's own surface, not an inversion */}
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[32px] bg-background text-foreground">
          {/* Dynamic Island Section */}
          <span
            aria-hidden
            className="absolute left-1/2 top-[9px] z-20 h-[20px] w-[62px] -translate-x-1/2 rounded-full bg-scrim"
          />

          <StatusBar />

          {/* Detail Page Header Section */}
          {bar}

          {/* App Content Section */}
          <div className="px-2.5 pb-3 pt-2">{children}</div>

          <TabBar active={activeTab} />
        </div>
      </div>
    </div>
  );
}
