"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { getNameInitials } from "@/utils/functions/text";
import { LucideLoader2, LucideSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { INewChatDialogProps } from "./props";

export default function NewChatDialog(props: INewChatDialogProps) {
  /* --------------------------------- Props --------------------------------- */
  const { open, onOpenChange, candidates, loading, startingId, onSelect } =
    props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("message");
  const [keyword, setKeyword] = useState("");

  // Only matched people can be messaged, so this filters an already-permitted
  // list rather than searching all users.
  const filtered = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    if (!term) return candidates;
    return candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(term) ||
        candidate.subtitle?.toLowerCase().includes(term),
    );
  }, [candidates, keyword]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" className="gap-4">
        {/* Heading Section */}
        <DialogHeader>
          <DialogTitle className="text-base font-black tracking-[-0.01em]">
            {t("newChat")}
          </DialogTitle>
          <DialogDescription>{t("newChatDescription")}</DialogDescription>
        </DialogHeader>

        {/* Search Section */}
        <div className="relative">
          <LucideSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={t("newChatSearch")}
            className="rounded-none pl-9"
            aria-label={t("newChatSearch")}
          />
        </div>

        {/* Candidates Section */}
        <div className="max-h-72 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <LucideLoader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-2 py-10 text-center">
              <TypographyMuted className="text-sm">
                {candidates.length === 0
                  ? t("newChatEmpty")
                  : t("newChatNoResults")}
              </TypographyMuted>
            </div>
          ) : (
            <ul className="flex flex-col">
              {filtered.map((candidate) => {
                const isStarting = startingId === candidate.id;
                return (
                  <li key={candidate.id}>
                    <button
                      type="button"
                      // Disabled only for the row being opened, so a slow
                      // request cannot be double-submitted while the rest of
                      // the list stays usable.
                      disabled={Boolean(startingId)}
                      onClick={() => onSelect(candidate)}
                      className="flex w-full items-center gap-3 border-b border-border px-2 py-3 text-left transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Avatar className="h-9 w-9 shrink-0 rounded-none border border-border">
                        <AvatarImage
                          src={candidate.avatar}
                          alt={candidate.name}
                        />
                        <AvatarFallback className="rounded-none text-xs font-medium">
                          {getNameInitials(candidate.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {candidate.name}
                        </p>
                        {candidate.subtitle && (
                          <TypographyMuted className="truncate text-xs">
                            {candidate.subtitle}
                          </TypographyMuted>
                        )}
                      </div>

                      {isStarting && (
                        <LucideLoader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
