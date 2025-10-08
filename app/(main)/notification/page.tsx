"use client";

import { Button } from "@/components/ui/button";
import { LucideCheckCheck } from "lucide-react";

export default function NotificationPage() {
  return (
    <div className="w-full flex flex-col px-5">
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
    </div>
  );
}
