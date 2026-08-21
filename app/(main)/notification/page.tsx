"use client";

import NotificationInterviewCard from "@/components/notification/notification-interview-card";
import NotificationLikeCard from "@/components/notification/notification-like-card";
import NotificationMatchCard from "@/components/notification/notification-match-card";
import NotificationMessageCard from "@/components/notification/notification-message-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore } from "@/stores/apis/notification/notification.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { TNotificationFilterType } from "@/utils/types/app/notification.type";
import {
  BellRing,
  LucideBell,
  LucideCheckCheck,
  LucideTrash2,
  MailOpen,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { PageBanner } from "@/components/utils/layout/page-banner";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import NotificationLoadingSkeleton, {
  NotificationCardSkeleton,
} from "@/components/notification/skeleton";
import { INotification } from "@/utils/interfaces/notification/notification.interface";
import { PageState } from "@/components/utils/feedback/page-state";

/* ---------------------------------- Helper --------------------------------- */
/** Fallback name parser for old notifications that pre-date the senderName data field. */
function parseSenderNameFromMessage(
  type: string | null,
  message: string,
): string {
  if (type === "like") {
    const m = message.match(/^(.+?) liked your/);
    if (m) return m[1];
  }
  if (type === "match") {
    const m1 = message.match(/^(.+?) and (?:you|your company) liked/);
    if (m1) return m1[1];
    const m2 = message.match(/^You and (.+?) liked/);
    if (m2) return m2[1];
  }
  if (type === "interview") {
    const m = message.match(/^(.+?) wants to schedule/);
    if (m) return m[1];
  }
  return "";
}

/** Derive a display-friendly user object from a notification's data fields. */
function resolveNotificationUser(notification: INotification, role: string) {
  const id =
    (notification.data?.senderId as string) ??
    (role === USER_ROLE.EMPLOYEE
      ? (notification.data?.companyId as string)
      : (notification.data?.employeeId as string)) ??
    "";

  const name =
    (notification.data?.senderName as string) ||
    parseSenderNameFromMessage(notification.type, notification.message ?? "");

  return {
    id,
    name,
    position: (notification.data?.position as string | null) ?? null,
    industry: (notification.data?.industry as string | null) ?? null,
    avatar:
      (notification.data?.senderAvatar as string) ??
      (notification.data?.avatar as string) ??
      "/avatars/default.png",
  };
}

export default function NotificationPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("notification");

  /* ----------------------------- API Integration ---------------------------- */
  const { user } = useGetCurrentUserStore();

  const {
    notifications,
    loading,
    error,
    unreadCount,
    queryNotifications,
    markRead,
    markAllRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotificationStore();

  /* -------------------------------- All States ------------------------------ */
  const [notificationFilter, setNotificationFilter] =
    useState<TNotificationFilterType>("all");

  const role = user?.role ?? USER_ROLE.EMPLOYEE;

  /* --------------------------------- Effects --------------------------------- */
  // On mount: mark all as read (optimistic badge clear + server sync)
  useEffect(() => {
    void markAllRead();
  }, [markAllRead]);

  // Fetch notifications on mount and whenever filter changes
  useEffect(() => {
    void queryNotifications({
      page: 1,
      limit: 50,
      ...(notificationFilter === "unread" && { unreadOnly: true }),
    });
  }, [notificationFilter, queryNotifications]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Filtered Notifications ─────────────────────────────────────────
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (notificationFilter === "all") return true;
      if (notificationFilter === "unread") return !n.isRead;
      if (notificationFilter === "match") return n.type === "match";
      if (notificationFilter === "message") return n.type === "chat";
      if (notificationFilter === "like") return n.type === "like";
      if (notificationFilter === "interview") return n.type === "interview";
      return true;
    });
  }, [notifications, notificationFilter]);

  /* ----------------------------- Loading State ------------------------------ */
  if (loading && notifications.length === 0)
    return <NotificationLoadingSkeleton />;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="notification-editorial animate-page-in mx-auto flex w-full max-w-[1500px] flex-col items-start gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <PageBanner
        eyebrow={t("activityCenter")}
        title={t("bannerTitle")}
        subtitle={`${t("bannerSubtitle1")} ${t("bannerSubtitle2")}`}
        // Withheld until the first fetch resolves — otherwise "0 unread" shows
        // while the list is still loading and then jumps.
        stats={
          loading && notifications.length === 0
            ? undefined
            : [
                {
                  icon: BellRing,
                  label: t("statAll"),
                  value: notifications.length,
                },
                {
                  icon: MailOpen,
                  label: t("statUnread"),
                  value: unreadCount,
                },
              ]
        }
      />

      <section className="flex w-full flex-col gap-5">
        <div className="flex w-full items-end justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black tracking-[0.16em] text-muted-foreground">
              01
            </span>
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-foreground sm:text-2xl">
                {t("recentActivity")}
              </h2>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {t("notificationCount", {
                  count: filteredNotifications.length,
                })}
              </p>
            </div>
          </div>
          <div className="grid size-9 shrink-0 place-items-center bg-primary text-primary-foreground">
            <BellRing className="size-4" />
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex w-full flex-col gap-3 border border-t-[5px] border-border border-t-foreground bg-card p-3 shadow-hard sm:flex-row sm:items-center sm:justify-between">
          {/* Pill Tabs Filter Section */}
          <div className="scrollbar-none flex items-center gap-1 overflow-x-auto bg-muted/45 p-1 tablet-sm:hidden">
            {(
              [
                "all",
                "match",
                "message",
                "like",
                "interview",
                "unread",
              ] as TNotificationFilterType[]
            ).map((f) => {
              const labels: Record<TNotificationFilterType, string> = {
                all: t("filterAll"),
                match: t("filterMatches"),
                message: t("filterMessages"),
                like: t("filterLikes"),
                interview: t("filterInterviews"),
                unread: t("filterUnread"),
              };
              const active = notificationFilter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setNotificationFilter(f)}
                  aria-pressed={active}
                  className={`min-h-10 shrink-0 px-3 py-1.5 text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {labels[f]}
                </button>
              );
            })}
          </div>

          {/* Responsive Dropdown Section */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden tablet-sm:flex">
              <Button className="h-11 w-full rounded-none text-xs tablet-sm:w-auto">
                {t("filterLabel")}{" "}
                {
                  (
                    {
                      all: t("filterAll"),
                      match: t("filterMatches"),
                      message: t("filterMessages"),
                      like: t("filterLikes"),
                      interview: t("filterInterviews"),
                      unread: t("filterUnread"),
                    } as Record<TNotificationFilterType, string>
                  )[notificationFilter]
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-none">
              <DropdownMenuItem onClick={() => setNotificationFilter("all")}>
                {t("filterAll")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setNotificationFilter("match")}>
                {t("filterMatches")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setNotificationFilter("message")}
              >
                {t("filterMessages")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setNotificationFilter("like")}>
                {t("filterLikes")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setNotificationFilter("interview")}
              >
                {t("filterInterviews")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setNotificationFilter("unread")}>
                {t("filterUnread")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Action Buttons Section */}
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button
              className="h-9 flex-1 rounded-none text-xs sm:flex-none"
              variant="outline"
              onClick={() => void markAllRead()}
              disabled={unreadCount === 0 || notifications.length === 0}
            >
              <LucideCheckCheck />
              {t("markAllRead")}
            </Button>
            <Button
              className="h-9 flex-1 rounded-none text-xs sm:flex-none"
              variant="outline"
              onClick={deleteAllNotifications}
              disabled={notifications.length === 0}
            >
              <LucideTrash2 />
              {t("deleteAll")}
            </Button>
          </div>
        </div>

        {/* Notification List Section */}
        <div className="flex w-full flex-col gap-3">
          {loading && (
            <>
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
            </>
          )}
          {/* Error State Section */}
          {!loading && error && (
            <PageState
              variant="error"
              title={error}
              description={t("loadErrorDescription")}
              compact
              className="my-6 sm:my-8"
              action={{
                label: t("retry"),
                onClick: () =>
                  void queryNotifications({
                    page: 1,
                    limit: 50,
                    ...(notificationFilter === "unread" && {
                      unreadOnly: true,
                    }),
                  }),
              }}
            />
          )}

          {/* Empty State Section */}
          {!loading && !error && filteredNotifications.length === 0 && (
            <PageState
              variant="empty"
              title={t("emptyList")}
              description={t("emptyListDescription")}
              icon={LucideBell}
              compact
              className="my-6 sm:my-8"
              action={
                notificationFilter !== "all"
                  ? {
                      label: t("filterAll"),
                      onClick: () => setNotificationFilter("all"),
                    }
                  : undefined
              }
            />
          )}

          {/* Notification Cards Section */}
          {!loading &&
            !error &&
            filteredNotifications.map((notification: INotification) => {
              const notifUser = resolveNotificationUser(notification, role);

              if (notification.type === "chat") {
                return (
                  <NotificationMessageCard
                    key={notification.id}
                    id={notification.id}
                    seen={notification.isRead}
                    timestamp={notification.createdAt}
                    role={role}
                    user={notifUser}
                    preview={notification.message}
                    onMarkRead={markRead}
                    onDelete={deleteNotification}
                  />
                );
              }

              if (notification.type === "match") {
                return (
                  <NotificationMatchCard
                    key={notification.id}
                    id={notification.id}
                    seen={notification.isRead}
                    timestamp={notification.createdAt}
                    role={role}
                    user={notifUser}
                    onMarkRead={markRead}
                    onDelete={deleteNotification}
                  />
                );
              }

              if (notification.type === "like") {
                return (
                  <NotificationLikeCard
                    key={notification.id}
                    id={notification.id}
                    seen={notification.isRead}
                    timestamp={notification.createdAt}
                    role={role}
                    user={notifUser}
                    onMarkRead={markRead}
                    onDelete={deleteNotification}
                  />
                );
              }

              if (notification.type === "interview") {
                const rawMsg = notification.message ?? "";
                const dataInterviewTitle =
                  (notification.data?.interviewTitle as string) || "";
                const dataSenderName =
                  (notification.data?.senderName as string) || "";

                // Backwards-compat: extract parts from old English message format
                const scheduledSep = " wants to schedule an interview: ";
                const sepIdx = rawMsg.indexOf(scheduledSep);
                const parsedSenderName =
                  sepIdx !== -1 ? rawMsg.slice(0, sepIdx) : "";
                const parsedInterviewTitle =
                  sepIdx !== -1
                    ? rawMsg.slice(sepIdx + scheduledSep.length)
                    : "";

                const resolvedSenderName = dataSenderName || parsedSenderName;
                const resolvedInterviewTitle =
                  dataInterviewTitle || parsedInterviewTitle;

                return (
                  <NotificationInterviewCard
                    key={notification.id}
                    id={notification.id}
                    seen={notification.isRead}
                    timestamp={notification.createdAt}
                    role={role}
                    eventType={
                      (notification.data?.eventType as string) ??
                      "interview_scheduled"
                    }
                    senderName={resolvedSenderName}
                    interviewTitle={resolvedInterviewTitle}
                    status={notification.data?.status as string | undefined}
                    rawMessage={
                      !resolvedInterviewTitle ? rawMsg || undefined : undefined
                    }
                    user={notifUser}
                    onMarkRead={markRead}
                    onDelete={deleteNotification}
                  />
                );
              }

              return (
                <NotificationLikeCard
                  key={notification.id}
                  id={notification.id}
                  seen={notification.isRead}
                  timestamp={notification.createdAt}
                  role={role}
                  user={notifUser}
                  onMarkRead={markRead}
                  onDelete={deleteNotification}
                />
              );
            })}
        </div>
      </section>
    </div>
  );
}
