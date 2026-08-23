"use client";

import { ILandingLaptopProps } from "./props";

/* ---------------------------------------------------------------------------
 * The laptop frame.
 *
 * The resume builder is a two-pane desktop workspace — a form column beside a
 * live preview — so putting it on a phone would misrepresent how it is used.
 * This is the same hardware language as the phone: a --scrim shell that stays
 * dark in both themes, concentric radii, and a screen running the app's own
 * surface rather than an inversion.
 * ------------------------------------------------------------------------- */
export function LandingLaptop(props: ILandingLaptopProps) {
  /* ------------------------------- Props ------------------------------- */
  const { children } = props;

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <div className="landing-laptop relative w-full max-w-[560px]">
      {/* Lid Section */}
      <div className="rounded-[14px] bg-scrim p-[9px] pb-[11px] shadow-[0_30px_70px_hsl(var(--scrim)/0.34)]">
        {/* Camera Section */}
        <div className="flex h-[7px] items-center justify-center">
          <span className="size-[3px] rounded-full bg-background/25" />
        </div>

        {/* Screen Section — the app's own surface */}
        <div className="relative flex aspect-[16/10] flex-col overflow-hidden rounded-[5px] bg-background text-foreground">
          {children}
        </div>
      </div>

      {/* Hinge and Base Section */}
      <div className="relative mx-auto h-[10px] w-[112%] max-w-none -translate-x-[5.35%] rounded-b-[10px] bg-scrim">
        {/* Notch Section */}
        <span
          aria-hidden
          className="absolute left-1/2 top-0 h-[3px] w-16 -translate-x-1/2 rounded-b-[3px] bg-background/15"
        />
      </div>

      {/* Desk Shadow Section */}
      <div
        aria-hidden
        className="mx-auto h-3 w-[86%] rounded-[50%] bg-scrim/20 blur-md"
      />
    </div>
  );
}
