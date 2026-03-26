"use client";

import { TRecentMatch } from "@/stores/apis/matching/analytics.store";
import CachedAvatar from "@/components/ui/cached-avatar";
import { Handshake } from "lucide-react";

interface RecentMatchesListProps {
  matches: TRecentMatch[];
  isEmployee: boolean;
}

export function RecentMatchesList({
  matches,
  isEmployee,
}: RecentMatchesListProps) {
  if (!matches || matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Handshake className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">
          No matches yet. Keep swiping to find your perfect{" "}
          {isEmployee ? "company" : "candidate"}!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {matches.map((match) => (
        <div
          key={match.id}
          className="flex items-center gap-3 rounded-xl border border-border/50 bg-accent/30 p-3 transition-colors hover:bg-accent/60"
        >
          <CachedAvatar
            src={match.avatar}
            alt={match.name}
            className="size-10 shrink-0 ring-1 ring-border"
            rounded="md"
            preload={true}
            showLoadingState={true}
          >
            {match.name.slice(0, 2)}
          </CachedAvatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{match.name}</p>
            <p className="text-[11px] text-muted-foreground">
              {formatTimeAgo(match.matchedAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
