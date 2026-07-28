import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { LucideArrowLeft, LucideSearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  /* ------------------------------- Render UI ------------------------------ */
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center min-h-screen gap-8 text-center px-6 border-x border-border bg-card shadow-[6px_0_0_hsl(var(--foreground)/0.025)]">
      {/* Animated Icon Section */}
      <div className="relative flex items-center justify-center">
        {/* Outer Slow-Pulse Ring Section */}
        <div className="absolute size-36 rotate-12 rounded-none border border-primary/10 bg-primary/5 animate-pulse" />
        {/* Middle Ring Section */}
        <div className="absolute size-28 -rotate-6 rounded-none border border-primary/15 bg-primary/10" />
        {/* Icon Container with Gradient + Glow Section */}
        <div className="relative flex items-center justify-center size-20 rounded-none bg-foreground border border-foreground shadow-[5px_5px_0_hsl(var(--foreground)/0.14)]">
          <LucideSearchX className="size-9 text-background" />
        </div>
      </div>

      {/* Text Section */}
      <div className="flex flex-col gap-3">
        <TypographyP className="text-8xl font-bold tracking-tight text-primary">
          404
        </TypographyP>
        <TypographyH2 className="text-2xl font-semibold tracking-tight">
          Page not found
        </TypographyH2>
        <TypographyP className="text-muted-foreground text-sm max-w-sm leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </TypographyP>
      </div>

      {/* Action Section */}
      <Button asChild className="gap-2 rounded-none px-6 shadow-[4px_4px_0_hsl(var(--foreground)/0.12)]">
        <Link href="/feed">
          <LucideArrowLeft className="size-4" />
          Back to Feed
        </Link>
      </Button>
    </div>
  );
}
