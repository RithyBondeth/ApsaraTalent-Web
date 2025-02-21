import { LucideBellRing, LucideHandshake, LucideHome, LucideLogOut, LucideMessageCircleMore, LucideSearchCheck } from "lucide-react";
import LogoComponent from "../utils/logo";
import SidebarItem from "./sidebar-item";
import Profile from "./profile";
import { cn } from "@/lib/utils";

export default function Sidebar({className}: {className?: string}) {
    return (
        <div className={cn("sticky top-5 flex flex-col items-start justify-between p-5 border border-r-muted", className)}>
            <div className="w-full">
                <LogoComponent/>
                <div className="flex flex-col gap-3 mt-8">
                    <SidebarItem
                        icon={<LucideHome/>}
                        label="Feed"
                        link="/feed"
                    />
                    <SidebarItem
                        icon={<LucideSearchCheck/>}
                        label="Search"
                        link="/search"
                    />
                     <SidebarItem
                        icon={<LucideHandshake/>}
                        label="Matching"
                        link="/matching"
                    />
                    <SidebarItem
                        icon={<LucideMessageCircleMore/>}
                        label="Message"
                        link="/message"
                    />
                    <SidebarItem
                        icon={<LucideBellRing/>}
                        label="Notification"
                        link="/notification"
                    />
                    <Profile/>
                </div>
            </div>
            <div className="w-full">
                <SidebarItem
                    icon={<LucideLogOut/>}
                    label="Logout"
                    link="/logout"
                />
            </div>
        </div>
    );
}