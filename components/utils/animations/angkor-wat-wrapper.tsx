"use client";

import dynamic from "next/dynamic";

const AngkorWatScene = dynamic(
  () => import("@/components/utils/animations/angkor-wat-scene"),
  { ssr: false },
);

export function AngkorWatWrapper() {
  /* --------------------------------- Render UI -------------------------------- */
  return <AngkorWatScene />;
}
