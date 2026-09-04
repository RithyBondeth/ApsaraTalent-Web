"use client";

import { StatusPill } from "@/components/admin/status-pill";
import { UserStatusDialog } from "@/components/admin/user-status-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageState } from "@/components/utils/feedback/page-state";
import { useAdminStore } from "@/stores/apis/admin/admin.store";
import { formatShortDate } from "@/utils/functions/date";
import type { TAdminUpdateStatusPayload } from "@/utils/types/admin/admin.type";
import { LucideArrowLeft, LucideShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminUserDetailPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("admin.userDetail");
  const tStatus = useTranslations("admin.status");
  const tAction = useTranslations("admin.actions");
  const params = useParams<{ userId: string }>();
  const userId = params?.userId;

  /* ----------------------------- API Integration ---------------------------- */
  const {
    userDetail,
    loadingUserDetail,
    saving,
    error,
    getUser,
    updateUserStatus,
  } = useAdminStore();

  /* -------------------------------- All States ------------------------------ */
  const [dialogOpen, setDialogOpen] = useState(false);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    if (userId) void getUser(userId);
  }, [userId, getUser]);

  /* --------------------------------- Handlers ------------------------------- */
  const handleSubmit = async (payload: TAdminUpdateStatusPayload) => {
    if (!userId) return;
    const ok = await updateUserStatus(userId, payload);
    // The store surfaces the server's message in `error`; a toast here would
    // say "failed" while the panel below already says why.
    if (ok) {
      setDialogOpen(false);
      toast.success(t("statusUpdated"));
    }
  };

  /* -------------------------------- Render UI ------------------------------- */
  if (loadingUserDetail && !userDetail) {
    return (
      <div className="flex flex-col gap-5">
        {/* Back link — kept as a plain skeleton row rather than the live link
            because the surrounding chrome should feel loading, not half-live. */}
        <Skeleton className="h-4 w-32" />
        {/* Identity card, then the two activity sections below. Heights match
            what the real page renders at so first paint does not stretch. */}
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!userDetail) {
    return (
      <PageState
        variant="error"
        title={error ?? t("notFound")}
        action={{
          label: t("backToUsers"),
          href: "/admin/users",
        }}
      />
    );
  }

  const isAdmin = userDetail.role === "admin";

  return (
    <div className="flex flex-col gap-5">
      {/* Back Section */}
      <Link
        href="/admin/users"
        className="inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground hover:text-primary"
      >
        <LucideArrowLeft aria-hidden className="size-3.5" />
        {t("backToUsers")}
      </Link>

      {/* Identity Section */}
      <section className="border border-border bg-card p-6 shadow-hard">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground">
                {userDetail.name}
              </h1>
              <StatusPill
                status={userDetail.status}
                label={tStatus(userDetail.status)}
              />
              {/* A lapsed suspension the admin never lifted reads as active
                  above; say so rather than letting the two look contradictory. */}
              {userDetail.storedStatus !== userDetail.status ? (
                <span className="text-xs text-muted-foreground">
                  {t("statusLapsed", {
                    stored: tStatus(userDetail.storedStatus),
                  })}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {userDetail.email ?? userDetail.phone ?? "—"} · {userDetail.role}
            </p>
            {userDetail.statusReason ? (
              <p className="mt-3 border-l-[4px] border-l-warning-border bg-warning-subtle px-3 py-2 text-sm text-warning-accent">
                {userDetail.statusReason}
              </p>
            ) : null}
          </div>

          {/* Administrators are not moderatable from the panel — the API
              refuses it too, so the button would only ever produce a 403. */}
          {isAdmin ? (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <LucideShieldCheck aria-hidden className="size-4 shrink-0" />
              {t("adminImmune")}
            </p>
          ) : (
            <Button
              type="button"
              variant={
                userDetail.status === "active" ? "destructive" : "default"
              }
              onClick={() => setDialogOpen(true)}
            >
              {userDetail.status === "active"
                ? tAction("restrict")
                : tAction("reinstate")}
            </Button>
          )}
        </div>

        {/* Facts Section */}
        <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: t("joined"),
              value: formatShortDate(userDetail.createdAt),
            },
            {
              label: t("lastSeen"),
              value: userDetail.lastLoginAt
                ? formatShortDate(userDetail.lastLoginAt)
                : t("never"),
            },
            {
              label: t("emailVerified"),
              value: userDetail.isEmailVerified ? t("yes") : t("no"),
            },
            {
              label: t("openReports"),
              value: userDetail.openReportCount.toLocaleString(),
            },
          ].map((fact) => (
            <div key={fact.label}>
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        {error ? (
          <p className="mt-4 border border-destructive-border bg-destructive-subtle px-3 py-2 text-sm text-destructive-accent">
            {error}
          </p>
        ) : null}
      </section>

      {/* Reports Section */}
      <section className="border border-border bg-card p-6 shadow-hard">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-foreground">
          {t("reportsTitle")}
        </h2>
        {userDetail.reportsAgainst.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("reportsEmpty")}
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {userDetail.reportsAgainst.map((report) => (
              <li
                key={report.id}
                className="border border-border p-3 text-sm shadow-hard-xs"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {report.reason}
                  </span>
                  <StatusPill
                    status={report.status}
                    label={tStatus(report.status)}
                  />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatShortDate(report.createdAt)}
                  </span>
                </div>
                {report.details ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {report.details}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("reportedBy", {
                    name: report.reporter?.name ?? t("deletedUser"),
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* History Section */}
      <section className="border border-border bg-card p-6 shadow-hard">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-foreground">
          {t("historyTitle")}
        </h2>
        {userDetail.statusHistory.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("historyEmpty")}
          </p>
        ) : (
          <ol className="mt-4 space-y-3">
            {userDetail.statusHistory.map((entry) => (
              <li
                key={entry.id}
                className="border-l-[4px] border-l-border pl-3 text-sm"
              >
                <p className="font-semibold text-foreground">
                  {t(`action.${entry.action}`)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatShortDate(entry.createdAt)} ·{" "}
                  {entry.actorEmail ?? t("deletedAdmin")}
                </p>
                {entry.reason ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.reason}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Dialog Section */}
      <UserStatusDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userName={userDetail.name}
        currentStatus={userDetail.status}
        saving={saving}
        onSubmit={(payload) => void handleSubmit(payload)}
      />
    </div>
  );
}
