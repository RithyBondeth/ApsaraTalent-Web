"use client";

import { Button } from "@/components/ui/button";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useNotificationPreferenceStore } from "@/stores/apis/notification/notification-preference.store";
import { LucideBellOff, LucideCheck, LucideTriangleAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * The page an "unsubscribe" link in an email footer points at.
 *
 * It asks before it acts, and the request it then makes is a POST. Corporate
 * mail scanners and link-preview bots fetch every URL in an incoming message,
 * so a page that unsubscribed on load would opt people out before they had
 * read the email — the click has to come from a person.
 *
 * Public by design: the token in the query string is the only credential, and
 * requiring a login here would defeat the point of a one-click unsubscribe.
 */
function UnsubscribeContent() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("unsubscribe");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  /* ----------------------------- API Integration ---------------------------- */
  const { unsubscribe, saving } = useNotificationPreferenceStore();

  /* -------------------------------- All States ------------------------------ */
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  /* --------------------------------- Methods -------------------------------- */
  const handleUnsubscribe = async () => {
    const ok = await unsubscribe(token);
    setState(ok ? "done" : "error");
  };

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-md flex-col gap-5 border border-border bg-card p-6 shadow-hard sm:p-8">
        <div className="flex size-10 items-center justify-center border border-border bg-muted/60 [&>svg]:size-5">
          {state === "done" ? <LucideCheck /> : <LucideBellOff />}
        </div>

        {!token ? (
          <>
            <h1 className="text-lg font-black tracking-[-0.01em]">
              {t("invalidTitle")}
            </h1>
            <TypographyMuted className="text-sm leading-6">
              {t("invalidBody")}
            </TypographyMuted>
          </>
        ) : state === "done" ? (
          <>
            <h1 className="text-lg font-black tracking-[-0.01em]">
              {t("doneTitle")}
            </h1>
            <TypographyMuted className="text-sm leading-6">
              {t("doneBody")}
            </TypographyMuted>
            {/* The one thing this page cannot do is put it back: the token
                travels through mail servers nobody here controls, so re-opting
                in has to happen behind a login. */}
            <Button asChild variant="outline">
              <Link href="/setting">{t("manageSettings")}</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-lg font-black tracking-[-0.01em]">
              {t("confirmTitle")}
            </h1>
            <TypographyMuted className="text-sm leading-6">
              {t("confirmBody")}
            </TypographyMuted>

            {state === "error" && (
              <p className="flex items-start gap-2 border border-destructive-border bg-destructive-subtle p-3 text-sm text-destructive-accent">
                <LucideTriangleAlert className="mt-0.5 size-4 shrink-0" />
                {t("errorBody")}
              </p>
            )}

            <Button onClick={handleUnsubscribe} disabled={saving}>
              {saving ? t("working") : t("confirmAction")}
            </Button>
          </>
        )}
      </div>
    </main>
  );
}

export default function UnsubscribePage() {
  // useSearchParams needs a Suspense boundary to keep the route from opting the
  // whole page into client-side rendering at build time.
  return (
    <Suspense>
      <UnsubscribeContent />
    </Suspense>
  );
}
