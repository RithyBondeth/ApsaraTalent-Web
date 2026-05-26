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
import { LucideCheckCheck, LucideTrash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  notificationEmptySvg,
  notificationBannerSvg,
} from "@/utils/constants/asset.constant";
import NotificationLoadingSkeleton, {
  NotificationCardSkeleton,
} from "@/components/notification/skeleton";
import { INotification } from "@/utils/interfaces/notification/notification.interface";

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
    (role === "employee"
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
    unreadCount,
    queryNotifications,
    markRead,
    markAllRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotificationStore();

  /* -------------------------------- All States ------------------------------ */
  const [mounted, setMounted] = useState<boolean>(false);
  const [notificationFilter, setNotificationFilter] =
    useState<TNotificationFilterType>("all");

  const role = user?.role ?? "employee";

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => setMounted(true), []);

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
    <div className="w-full flex flex-col gap-4 sm:gap-5 px-2.5 sm:px-5 animate-page-in">
      {/* Banner Section */}
      {/* Desktop Banner Section 1050px */}
      <div className="w-full flex items-center justify-between gap-6 lg:gap-10 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-6 py-8 sm:px-8 tablet-xl:hidden">
        <div className="flex flex-col items-start gap-3">
          <TypographyH2 className="leading-relaxed">
            {t("bannerTitle")}
          </TypographyH2>
          <TypographyH4 className="leading-relaxed">
            {t("bannerSubtitle1")}
          </TypographyH4>
          <TypographyH4 className="leading-relaxed">
            {t("bannerSubtitle2")}
          </TypographyH4>
          <TypographyMuted className="leading-relaxed">
            {t("bannerMuted")}
          </TypographyMuted>
        </div>
        {mounted && (
          <Image
            src={notificationBannerSvg}
            alt="notifications"
            height={250}
            width={350}
            className="h-auto max-w-[340px] shrink-0"
            priority
          />
        )}
      </div>

      {/* Tablet Banner Section 651px–1050px */}
      <div className="hidden tablet-xl:flex tablet-md:!hidden w-full items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-5 py-5 overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <TypographyH3 className="!leading-snug">
            {t("bannerTitle")}
          </TypographyH3>
          <TypographyMuted className="!leading-snug">
            {t("bannerSubtitle1")}
          </TypographyMuted>
          <TypographyMuted className="!leading-snug">
            {t("bannerSubtitle2")}
          </TypographyMuted>
        </div>
        {mounted && (
          <Image
            src={notificationBannerSvg}
            alt="notifications"
            width={160}
            height={160}
            className="shrink-0 h-auto object-contain"
            priority
          />
        )}
      </div>

      {/* Mobile Banner Section ≤650px */}
      <div className="hidden tablet-md:flex w-full items-center gap-3 rounded-2xl bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-muted/40 border border-border/50 px-4 py-3 overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h2 className="font-bold text-sm leading-snug text-foreground">
            {t("bannerTitle")}
          </h2>
          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
            {t("bannerSubtitle1")}
          </p>
        </div>
        {mounted && (
          <Image
            src={notificationBannerSvg}
            alt="notifications"
            width={88}
            height={88}
            className="flex-shrink-0 object-contain"
            priority
          />
        )}
      </div>

      {/* Header Section */}
      <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Pill Tabs Filter Section */}
        <div className="flex items-center gap-1 bg-muted/60 rounded-full p-1 overflow-x-auto scrollbar-none tablet-sm:hidden">
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
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  active
                    ? "bg-background text-foreground shadow-sm"
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
            <Button className="h-9 w-full text-xs tablet-sm:w-auto">
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
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setNotificationFilter("all")}>
              {t("filterAll")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setNotificationFilter("match")}>
              {t("filterMatches")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setNotificationFilter("message")}>
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
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            className="h-9 flex-1 sm:flex-none text-xs"
            variant="outline"
            onClick={() => void markAllRead()}
            disabled={unreadCount === 0 || notifications.length === 0}
          >
            <LucideCheckCheck />
            {t("markAllRead")}
          </Button>
          <Button
            className="h-9 flex-1 sm:flex-none text-xs"
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
      <div className="flex flex-col gap-5">
        {loading && (
          <>
            <NotificationCardSkeleton />
            <NotificationCardSkeleton />
            <NotificationCardSkeleton />
          </>
        )}
        {/* Empty State Section */}
        {!loading && filteredNotifications.length === 0 && (
          <div className="w-full flex flex-col items-center justify-center my-16">
            <Image
              src={notificationEmptySvg}
              alt="Notification"
              height={200}
              width={200}
              className="animate-float"
            />
            <TypographyP className="!m-0 text-sm font-medium text-muted-foreground">
              {t("emptyList")}
            </TypographyP>
          </div>
        )}

        {/* Notification Cards Section */}
        {!loading &&
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
                sepIdx !== -1 ? rawMsg.slice(sepIdx + scheduledSep.length) : "";

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
    </div>
  );
}
