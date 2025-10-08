"use client";

import NotificationCard from "@/components/notification/notification-card";
import { Button } from "@/components/ui/button";
import { LucideCheckCheck } from "lucide-react";

export default function NotificationPage() {
  return (
    <div className="w-full flex flex-col gap-5 px-5">
      <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3 [&>button]:text-xs">
            <Button>All</Button>
            <Button variant={"secondary"}>Matches</Button>
            <Button variant={"secondary"}>Messages</Button>
            <Button variant={"secondary"}>Unread</Button>
          </div>
          <Button className="text-xs" variant={"outline"}>
            <LucideCheckCheck/>
            Mark All As Read
          </Button>
      </div>
      <div className="flex flex-col">
        <NotificationCard/>
      </div>
    </div>
  );
}
