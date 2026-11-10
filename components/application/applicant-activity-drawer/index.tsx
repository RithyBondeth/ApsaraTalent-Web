"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/utils/functions/date";
import { useApplicationHistoryStore } from "@/stores/apis/job/application-history.store";
import { useApplicationNotesStore } from "@/stores/apis/job/application-notes.store";
import {
  LucideClock3,
  LucideLoader2,
  LucideStickyNote,
  LucideTrash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ApplicationStatusBadge } from "../application-status-badge";
import { IApplicantActivityDrawerProps } from "./props";

// The maximum note body accepted by the API DTO. Keeping the browser cap in
// step avoids a round-trip to learn a request is too long.
const NOTE_MAX = 4000;

export function ApplicantActivityDrawer({
  application,
  initialTab = "notes",
  onClose,
}: IApplicantActivityDrawerProps) {
  const t = useTranslations("application");
  const applicationId = application?.id ?? null;
  const [draft, setDraft] = useState("");

  const notesByApp = useApplicationNotesStore((s) => s.notesByApplication);
  const notesLoading = useApplicationNotesStore(
    (s) => s.loadingByApplication[applicationId ?? ""] ?? false,
  );
  const savingByApp = useApplicationNotesStore((s) => s.savingByApplication);
  const deletingId = useApplicationNotesStore((s) => s.deletingId);
  const fetchNotes = useApplicationNotesStore((s) => s.fetchNotes);
  const createNote = useApplicationNotesStore((s) => s.createNote);
  const deleteNote = useApplicationNotesStore((s) => s.deleteNote);

  const historyByApp = useApplicationHistoryStore(
    (s) => s.historyByApplication,
  );
  const historyLoading = useApplicationHistoryStore(
    (s) => s.loadingByApplication[applicationId ?? ""] ?? false,
  );
  const fetchHistory = useApplicationHistoryStore((s) => s.fetchHistory);

  const notes = useMemo(
    () => (applicationId ? (notesByApp[applicationId] ?? []) : []),
    [notesByApp, applicationId],
  );
  const history = useMemo(
    () => (applicationId ? (historyByApp[applicationId] ?? []) : []),
    [historyByApp, applicationId],
  );

  // Fetch on open. Deliberately re-fetch each time the drawer opens so a stage
  // move done from the board is reflected without the recruiter having to
  // reload — the trail is short, and staleness here reads as a bug.
  useEffect(() => {
    if (!applicationId) return;
    fetchNotes(applicationId);
    fetchHistory(applicationId);
    setDraft("");
  }, [applicationId, fetchNotes, fetchHistory]);

  const isSaving = applicationId
    ? (savingByApp[applicationId] ?? false)
    : false;

  const handleSubmit = async () => {
    if (!applicationId) return;
    const trimmed = draft.trim();
    if (!trimmed) return;
    const ok = await createNote(applicationId, trimmed);
    if (ok) {
      setDraft("");
      toast.success(t("notes.saved"));
    } else {
      toast.error(useApplicationNotesStore.getState().error ?? "");
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!applicationId) return;
    const ok = await deleteNote(applicationId, noteId);
    if (ok) toast.success(t("notes.deleted"));
    else toast.error(useApplicationNotesStore.getState().error ?? "");
  };

  const remaining = NOTE_MAX - draft.length;

  return (
    <Sheet
      open={application !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-4 p-0 sm:max-w-lg"
      >
        <SheetHeader className="flex-shrink-0 space-y-2 border-b border-border px-6 pb-4 pt-6">
          <SheetTitle className="flex items-center gap-3 text-lg font-black tracking-[-0.02em]">
            {application?.employeeName ?? t("unnamedApplicant")}
            {application && (
              <ApplicationStatusBadge status={application.status} />
            )}
          </SheetTitle>
          {application?.jobTitle && (
            <TypographyMuted className="text-xs">
              {application.jobTitle}
            </TypographyMuted>
          )}
        </SheetHeader>

        <Tabs
          defaultValue={initialTab}
          className="flex min-h-0 flex-1 flex-col px-6 pb-6"
        >
          <TabsList className="w-full justify-start">
            <TabsTrigger value="notes" className="gap-2">
              <LucideStickyNote className="size-3.5" />
              {t("notes.tab")}
              {notes.length > 0 && (
                <span className="ml-1 bg-muted-foreground/15 px-1.5 text-xs tabular-nums">
                  {notes.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <LucideClock3 className="size-3.5" />
              {t("history.tab")}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="notes"
            className="mt-4 flex min-h-0 flex-1 flex-col gap-3"
          >
            <div className="flex flex-col gap-2 border border-border bg-card p-3 shadow-hard-xs">
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t("notes.placeholder")}
                maxLength={NOTE_MAX}
                rows={3}
                className="rounded-none border-input"
              />
              <div className="flex items-center justify-between gap-2">
                <TypographyMuted className="text-xs tabular-nums">
                  {t("charactersLeft", { count: remaining })}
                </TypographyMuted>
                <Button
                  size="sm"
                  className="rounded-none"
                  disabled={isSaving || draft.trim().length === 0}
                  onClick={handleSubmit}
                >
                  {isSaving ? (
                    <LucideLoader2 className="size-3.5 animate-spin" />
                  ) : null}
                  {t("notes.save")}
                </Button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {notesLoading && notes.length === 0 ? (
                <TypographyMuted className="text-sm">…</TypographyMuted>
              ) : notes.length === 0 ? (
                <TypographyMuted className="text-sm">
                  {t("notes.empty")}
                </TypographyMuted>
              ) : (
                <ul className="stagger-list flex flex-col gap-2">
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      className="border border-border bg-card p-3 shadow-hard-xs"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                        <span>
                          {t("notes.author", {
                            name: note.authorName ?? t("notes.unknownAuthor"),
                          })}
                          {" · "}
                          {formatShortDate(note.createdAt)}
                        </span>
                        <button
                          type="button"
                          className={cn(
                            "inline-flex items-center gap-1 text-destructive/80 hover:text-destructive",
                            deletingId === note.id && "opacity-60",
                          )}
                          disabled={deletingId === note.id}
                          onClick={() => handleDelete(note.id)}
                          aria-label={t("notes.delete")}
                        >
                          <LucideTrash2 className="size-3.5" />
                        </button>
                      </div>
                      <p className="whitespace-pre-line text-sm leading-relaxed">
                        {note.body}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="history"
            className="mt-4 flex min-h-0 flex-1 flex-col"
          >
            {historyLoading && history.length === 0 ? (
              <TypographyMuted className="text-sm">…</TypographyMuted>
            ) : history.length === 0 ? (
              <TypographyMuted className="text-sm">
                {t("history.empty")}
              </TypographyMuted>
            ) : (
              <ol className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                {history.map((entry) => (
                  <li
                    key={entry.id}
                    className="border border-border bg-card p-3 shadow-hard-xs"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {entry.from === null
                          ? t("history.first")
                          : t("history.moved", {
                              from: t(`status.${entry.from}`),
                              to: t(`status.${entry.to}`),
                            })}
                      </span>
                      <span>{formatShortDate(entry.createdAt)}</span>
                    </div>
                    <TypographyMuted className="mt-1 text-xs">
                      {t("history.actor", {
                        name: entry.actorName ?? t("history.unknownActor"),
                      })}
                    </TypographyMuted>
                    {entry.note && (
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">
                        {entry.note}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
