"use client";

import NotificationMatchCard from "@/components/notification/notification-match-card";
import NotificationMessageCard from "@/components/notification/notification-message-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  INotification,
  useNotificationStore,
} from "@/stores/apis/notification/notification.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { TNotificationFilterType } from "@/utils/types/notification.type";
import { LucideCheckCheck } from "lucide-react";
import NotificationSvgImage from "@/assets/svg/notification.svg";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { TypographyP } from "@/components/utils/typography/typography-p";
import NotificationCardSkeleton from "./skeleton";

/* ------------------------------------- Utils ------------------------------------- */
/** Derive a display-friendly user object from a notification's title + data fields. */
function resolveNotificationUser(notification: INotification) {
  return {
    id: notification.data?.senderId ?? "",
    name: notification.title,
    position: (notification.data?.position as string | null) ?? null,
    industry: (notification.data?.industry as string | null) ?? null,
    avatar: (notification.data?.avatar as string) ?? "/avatars/default.png",
  };
}

export default function NotificationPage() {
  /* ----------------------------- API Integration ---------------------------- */
  // Current User
  const { user } = useGetCurrentUserStore();
  const role = user?.role ?? "employee";

  // Notification APIs
  const {
    notifications,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markRead,
    markAllRead,
  } = useNotificationStore();

  /* -------------------------------- All States ------------------------------- */
  const [notificationFilter, setNotificationFilter] =
    useState<TNotificationFilterType>("all");

  /* --------------------------------- Effects --------------------------------- */
  // Fetch on mount
  useEffect(() => {
    void fetchNotifications({ page: 1, limit: 50 });
    void fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Re-fetch when switching to "unread" filter
  useEffect(() => {
    if (notificationFilter === "unread") {
      void fetchNotifications({ page: 1, limit: 50, unreadOnly: true });
    } else {
      void fetchNotifications({ page: 1, limit: 50, unreadOnly: false });
    }
  }, [notificationFilter, fetchNotifications]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Filter notifications based on the current filter ──────────────
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (notificationFilter === "all") return true;
      if (notificationFilter === "unread") return !n.isRead;
      if (notificationFilter === "match") return n.type === "match";
      if (notificationFilter === "message") return n.type === "chat";
      return true;
    });
  }, [notifications, notificationFilter]);

  // ── Get notification button variant ──────────────────────────────
  const notificationButtonVariant = (currentFilter: TNotificationFilterType) =>
    notificationFilter === currentFilter ? "default" : "secondary";

  // ── Handle mark all read ─────────────────────────────────────────
  const handleMarkAllRead = async () => {
    await markAllRead();
    void fetchUnreadCount();
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5 px-2.5 sm:px-5">
      {/* Header Section */}
      <div className="w-full flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 [&>button]:text-xs tablet-sm:hidden">
          <Button
            variant={notificationButtonVariant("all")}
            onClick={() => setNotificationFilter("all")}
          >
            All
          </Button>
          <Button
            variant={notificationButtonVariant("match")}
            onClick={() => setNotificationFilter("match")}
          >
            Matches
          </Button>
          <Button
            variant={notificationButtonVariant("message")}
            onClick={() => setNotificationFilter("message")}
          >
            Messages
          </Button>
          <Button
            variant={notificationButtonVariant("unread")}
            onClick={() => setNotificationFilter("unread")}
          >
            Unread
          </Button>
        </div>

        {/* Responsive Dropdown Section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hidden tablet-sm:flex">
            <Button className="h-9 w-full text-xs sm:w-auto">
              Filter:{" "}
              {notificationFilter.charAt(0).toUpperCase() +
                notificationFilter.slice(1).toLowerCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setNotificationFilter("all")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setNotificationFilter("match")}>
              Matches
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setNotificationFilter("message")}>
              Messages
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setNotificationFilter("unread")}>
              Unread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          className="h-9 w-full text-xs sm:w-auto"
          variant="outline"
          onClick={handleMarkAllRead}
        >
          <LucideCheckCheck />
          Mark All As Read
        </Button>
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
            />
            <TypographyP className="!m-0 text-sm font-medium text-muted-foreground">
              No notifications yet
            </TypographyP>
          </div>
        )}

        {/* Notification Cards Section */}
        {!loading &&
          filteredNotifications.map((notification: INotification) => {
            const notifUser = resolveNotificationUser(notification);

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
                />
              );
            }

            // Fallback: unknown type — skip
            return null;
          })}
      </div>
    </div>
  );
}
