import { LucideBellRing, LucideContactRound, LucideMenu, LucideMessageCircleHeart, LucideSearchCheck } from "lucide-react";
import LogoComponent from "../utils/logo";
import SidebarItem from "./sidebar-item";
import Profile from "./profile";

export default function Sidebar() {
    return (
        <div className="w-[20%] absolute top-0 left-0 bottom-0 flex flex-col items-start justify-between p-5 border border-r-muted">
            <div>
                <LogoComponent/>
                <div className="flex flex-col gap-1 mt-8">
                    <SidebarItem
                        icon={<LucideContactRound/>}
                        label="Home"
                        link="/home"
                    />
                    <SidebarItem
                        icon={<LucideSearchCheck/>}
                        label="Search"
                        link="/search"
                    />
                    <SidebarItem
                        icon={<LucideMessageCircleHeart/>}
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
            <div>
                <SidebarItem
                    icon={<LucideMenu/>}
                    label="More"
                    link="/settings"
                />
            </div>
        </div>
    );
}