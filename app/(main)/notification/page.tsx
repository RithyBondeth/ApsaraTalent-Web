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
import { LucideCheckCheck } from "lucide-react";
import { useState } from "react";

export default function NotificationPage() {
  type TNotificationFilterType = "all" | "match" | "message" | "unread";
  const [notificationFilter, setNotificationFilter] =
    useState<TNotificationFilterType>("all");
  const notificationButtonVariant = (currentFilter: TNotificationFilterType) =>
    notificationFilter === currentFilter ? "default" : "secondary";

  return (
    <div className="w-full flex flex-col gap-5 px-5">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3 [&>button]:text-xs tablet-sm:hidden">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hidden tablet-sm:flex">
            <Button>
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
        <Button className="text-xs" variant={"outline"}>
          <LucideCheckCheck />
          Mark All As Read
        </Button>
      </div>
      <div className="flex flex-col gap-5">
        <NotificationMatchCard
          seen={true}
          role={"company"}
          user={{
            id: "uuid1",
            name: "Neural Horizon",
            industry: "Artificial Intelligence",
            position: null,
            avatar:
              "http://localhost:3000/storage/company-avatars/neuralarc-avatar-1748940621736-895400190.jpg",
          }}
          timestamp={"2025-06-02 07:02:13.864662"}
        />
        <NotificationMatchCard
          seen={false}
          role={"employee"}
          user={{
            id: "uuid2",
            name: "Rithy Bondeth",
            position: "Full Stack Developer",
            industry: null,
            avatar:
              "http://localhost:3000/storage/employee-avatars/bondeth-avatar-1748847738561-216110095.jpg",
          }}
          timestamp={"2025-10-02 07:02:13.864662"}
        />
        <NotificationMessageCard
          seen={false}
          role={"employee"}
          user={{
            id: "uuid2",
            name: "Rithy Bondeth",
            position: "Full Stack Developer",
            industry: null,
            avatar:
              "http://localhost:3000/storage/employee-avatars/bondeth-avatar-1748847738561-216110095.jpg",
          }}
          timestamp={"2025-10-02 07:02:13.864662"}
        />
      </div>
    </div>
  );
}
