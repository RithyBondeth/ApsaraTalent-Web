import * as React from "react";
import { MOBILE_BREAKPOINT } from "@/utils/constants/ui.constant";

/* ------------------------------------ Usage ----------------------------------- */
/**
 * Returns true when the viewport width is below the mobile breakpoint
 * (defined by MOBILE_BREAKPOINT in ui.constant.ts).
 *
 * Usage:
 *   const isMobile = useIsMobile();
 *
 *   if (isMobile) return <MobileNav />;
 *   return <DesktopNav />;
 */

/* ------------------------------------ Hook ------------------------------------ */
export function useIsMobile() {
  /* -------------------------------- All States -------------------------------- */
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  /* --------------------------------- Effects ---------------------------------- */
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
