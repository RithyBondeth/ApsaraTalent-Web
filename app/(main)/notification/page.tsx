"use client";

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
import { NotificationSvgImage } from "@/utils/constants/asset.constant";
import { NotificationCardSkeleton } from "@/components/notification/skeleton";
import { INotification } from "@/utils/interfaces/notification/notification.interface";

/* ---------------------------------- Helper --------------------------------- */
/** Derive a display-friendly user object from a notification's title + data fields. */
function resolveNotificationUser(notification: INotification, role: string) {
  // For "like" notifications the relevant ID is the OTHER party:
  // if the current user is an employee → the liker is the company (companyId)
  // if the current user is a company → the liker is the employee (employeeId)
  const id =
    (notification.data?.senderId as string) ??
    (role === "employee"
      ? (notification.data?.companyId as string)
      : (notification.data?.employeeId as string)) ??
    "";

  return {
    id,
    name: notification.title,
    position: (notification.data?.position as string | null) ?? null,
    industry: (notification.data?.industry as string | null) ?? null,
    avatar: (notification.data?.avatar as string) ?? "/avatars/default.png",
  };
}

export default function NotificationPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("notification");

  /* ----------------------------- API Integration ---------------------------- */
  // Current User
  const { user } = useGetCurrentUserStore();
  const role = user?.role ?? "employee";

  // Notification APIs
  const {
    notifications,
    loading,
    queryNotifications,
    queryUnreadCount,
    markRead,
    markAllRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotificationStore();

  /* -------------------------------- All States ------------------------------ */
  const [notificationFilter, setNotificationFilter] =
    useState<TNotificationFilterType>("all");

  /* --------------------------------- Effects --------------------------------- */
  // Fetch on mount
  useEffect(() => {
    void queryNotifications({ page: 1, limit: 50 });
    void queryUnreadCount();
  }, [queryNotifications, queryUnreadCount]);

  // Re-fetch when switching to "unread" filter
  useEffect(() => {
    if (notificationFilter === "unread") {
      void queryNotifications({ page: 1, limit: 50, unreadOnly: true });
    } else {
      void queryNotifications({ page: 1, limit: 50, unreadOnly: false });
    }
  }, [notificationFilter, queryNotifications]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Filter notifications based on the current filter ──────────────
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (notificationFilter === "all") return true;
      if (notificationFilter === "unread") return !n.isRead;
      if (notificationFilter === "match") return n.type === "match";
      if (notificationFilter === "message") return n.type === "chat";
      if (notificationFilter === "like") return n.type === "like";
      return true;
    });
  }, [notifications, notificationFilter]);

  // ── Get notification button variant ──────────────────────────────
  const notificationButtonVariant = (currentFilter: TNotificationFilterType) =>
    notificationFilter === currentFilter ? "default" : "secondary";

  // ── Handle mark all read ─────────────────────────────────────────
  const handleMarkAllRead = async () => {
    await markAllRead();
    void queryUnreadCount();
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5 px-2.5 sm:px-5 animate-page-in">
      {/* Header Section */}
      <div className="w-full flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 [&>button]:text-xs tablet-sm:hidden">
          <Button
            variant={notificationButtonVariant("all")}
            onClick={() => setNotificationFilter("all")}
          >
            {t("filterAll")}
          </Button>
          <Button
            variant={notificationButtonVariant("match")}
            onClick={() => setNotificationFilter("match")}
          >
            {t("filterMatches")}
          </Button>
          <Button
            variant={notificationButtonVariant("message")}
            onClick={() => setNotificationFilter("message")}
          >
            {t("filterMessages")}
          </Button>
          <Button
            variant={notificationButtonVariant("like")}
            onClick={() => setNotificationFilter("like")}
          >
            {t("filterLikes")}
          </Button>
          <Button
            variant={notificationButtonVariant("unread")}
            onClick={() => setNotificationFilter("unread")}
          >
            {t("filterUnread")}
          </Button>
        </div>

        {/* Responsive Dropdown Section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hidden tablet-sm:flex">
            <Button className="h-9 w-full text-xs sm:w-auto">
              {t("filterLabel")}{" "}
              {(
                {
                  all: t("filterAll"),
                  match: t("filterMatches"),
                  message: t("filterMessages"),
                  like: t("filterLikes"),
                  unread: t("filterUnread"),
                } as Record<TNotificationFilterType, string>
              )[notificationFilter]}
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
            <DropdownMenuItem onClick={() => setNotificationFilter("unread")}>
              {t("filterUnread")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Action Buttons Section */}
        <div className="flex items-center gap-2 tablet-sm:flex-col tablet-sm:w-full">
          <Button
            className="h-9 w-full text-xs sm:w-auto"
            variant="outline"
            onClick={handleMarkAllRead}
          >
            <LucideCheckCheck />
            {t("markAllRead")}
          </Button>
          <Button
            className="h-9 w-full text-xs sm:w-auto"
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
        {/* Loading Skeleton Section */}
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
              src={NotificationSvgImage}
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
                  message={notification.message}
                  onMarkRead={markRead}
                  onDelete={deleteNotification}
                />
              );
            }

            // Fallback: unknown type — render as a generic like card
            return (
              <NotificationLikeCard
                key={notification.id}
                id={notification.id}
                seen={notification.isRead}
                timestamp={notification.createdAt}
                role={role}
                user={notifUser}
                message={notification.message}
                onMarkRead={markRead}
                onDelete={deleteNotification}
              />
            );
          })}
      </div>
    </div>
  );
}
