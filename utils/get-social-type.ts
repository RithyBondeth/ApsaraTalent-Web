import { EarthIcon, FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, LucideIcon, SendIcon } from "lucide-react";
import { TPlatform } from "./types/platform.type";
import React from "react";

export const getSocialPlatformTypeIcon = (platform: TPlatform): React.ReactNode => {
    const icons: Record<TPlatform, LucideIcon> = {
        Facebook: FacebookIcon,
        Instagram: InstagramIcon,
        Github: GithubIcon,
        LinkedIn: LinkedinIcon,
        Telegram: SendIcon,
        Website: EarthIcon, 
    };
    const Icon = icons[platform];
    return Icon ? React.createElement(Icon, { strokeWidth: 1.5, size: 20 }) : null;
} 