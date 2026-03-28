"use client";

import dynamic from "next/dynamic";

const ParticlesBackground = dynamic(
  () => import("@/components/utils/animations/particle-background"),
  { ssr: false },
);

export function ParticlesWrapper() {
  return <ParticlesBackground />;
}
