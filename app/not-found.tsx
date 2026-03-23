import { Button } from "@/components/ui/button";
import { LucideArrowLeft, LucideSearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  /* ------------------------------- Render UI ------------------------------ */
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
      <div className="flex items-center justify-center size-24 rounded-full bg-muted">
        <LucideSearchX className="size-12 text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-7xl font-bold tracking-tight text-primary">404</p>
        <h2 className="text-2xl font-semibold tracking-tight">
          Page not found
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>

      <Button asChild>
        <Link href="/feed" className="gap-2">
          <LucideArrowLeft className="size-4" />
          Back to Feed
        </Link>
      </Button>
    </div>
  );
}
