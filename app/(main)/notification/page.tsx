"use client";

import NotificationMatchCard from "@/components/notification/notification-match-card";
import NotificationMessageCard from "@/components/notification/notification-message-card";
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
          <LucideCheckCheck />
          Mark All As Read
        </Button>
      </div>
      <div className="flex flex-col gap-5">
        <NotificationMatchCard
          role={'company'}
          user={{
            id: "uuid1",
            name: "Neural Horizon",
            industry: "Artificial Intelligence", 
            avatar: "http://localhost:3000/storage/company-avatars/neuralarc-avatar-1748940621736-895400190.jpg",
          }}
          time={'5 minutes ago'}
        />
        <NotificationMessageCard />
      </div>
    </div>
  );
}
