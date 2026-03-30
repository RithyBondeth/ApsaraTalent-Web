import {
  EarthIcon,
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  LucideIcon,
  SendIcon,
  TwitterIcon,
} from "lucide-react";
import React from "react";
import { TPlatform } from "@/utils/types/user/platform.type";

export const getSocialPlatformTypeIcon = (
  platform: TPlatform,
): React.ReactNode => {
  const icons: Record<TPlatform, LucideIcon> = {
    Facebook: FacebookIcon,
    Instagram: InstagramIcon,
    Github: GithubIcon,
    Linkedin: LinkedinIcon,
    Telegram: SendIcon,
    Website: EarthIcon,
    Twitter: TwitterIcon,
  };
  const Icon = icons[platform];
  return Icon
    ? React.createElement(Icon, { strokeWidth: 1.5, size: 20 })
    : null;
};
