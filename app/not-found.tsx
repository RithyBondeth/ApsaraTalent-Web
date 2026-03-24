import { Button } from "@/components/ui/button";
import { LucideArrowLeft, LucideSearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  /* ------------------------------- Render UI ------------------------------ */
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 text-center px-4">

      {/* ── Animated icon ── */}
      <div className="relative flex items-center justify-center">
        {/* Outer slow-pulse ring */}
        <div className="absolute size-36 rounded-full bg-primary/8 animate-pulse" />
        {/* Middle ring */}
        <div className="absolute size-28 rounded-full bg-primary/10" />
        {/* Icon container with gradient + glow */}
        <div className="relative flex items-center justify-center size-20 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/25 shadow-[0_4px_24px_hsl(var(--primary)/0.2)]">
          <LucideSearchX className="size-9 text-primary" />
        </div>
      </div>

      {/* ── Text ── */}
      <div className="flex flex-col gap-3">
        <p className="text-8xl font-bold tracking-tight text-primary">404</p>
        <h2 className="text-2xl font-semibold tracking-tight">
          Page not found
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>

      {/* ── Action ── */}
      <Button asChild className="gap-2 rounded-xl px-6">
        <Link href="/feed">
          <LucideArrowLeft className="size-4" />
          Back to Feed
        </Link>
      </Button>

    </div>
  );
}
