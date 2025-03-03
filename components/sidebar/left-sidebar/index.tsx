import { LucideBellRing, LucideHandshake, LucideHome, LucideMessageCircleMore, LucideSearchCheck } from "lucide-react";
import LogoComponent from "../../utils/logo";
import MenuItem from "./menu-item";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TypographyP } from "@/components/utils/typography/typography-p";
import DropdownMore from "./dropdown-more";
import Link from "next/link";

export default function Sidebar({className}: {className?: string}) {
    return (
        <div className={cn("sticky top-5 flex flex-col items-start justify-between p-5 border border-r-muted", className)}>
            <div className="w-full">
                <Link href="/feed">
                    <LogoComponent/>
                </Link>
                <div className="flex flex-col gap-3 mt-8">
                    <MenuItem
                        icon={<LucideHome/>}
                        label="Feed"
                        link="/feed"
                    />
                    <MenuItem
                        icon={<LucideSearchCheck/>}
                        label="Search"
                        link="/search"
                    />
                     <MenuItem
                        icon={<LucideHandshake/>}
                        label="Matching"
                        link="/matching"
                    />
                    <MenuItem
                        icon={<LucideMessageCircleMore/>}
                        label="Message"
                        link="/message"
                    />
                    <MenuItem
                        icon={<LucideBellRing/>}
                        label="Notification"
                        link="/notification"
                    />
                    <Link href="/profile/employee">
                        <div className="flex items-center gap-3 mt-3 cursor-pointer">
                            <Avatar>
                                <AvatarFallback>BN</AvatarFallback>
                            </Avatar>
                            <TypographyP className="!m-0 !text-sm">Rithy Bondeth</TypographyP>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="w-full flex justify-center">
                <DropdownMore/>
            </div>
        </div>
    );
}