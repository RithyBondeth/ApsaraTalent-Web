import {
  LucideBarChart3,
  LucideBellRing,
  LucideBookMarked,
  LucideCalendarCheck,
  LucideHandshake,
  LucideHome,
  LucideMessageCircle,
  LucideSearchCheck,
} from "lucide-react";

/* --------------------------------- Sidebar -------------------------------- */
export const sidebarList = [
  {
    title: "Feed",
    description: "Explore your connections",
    url: "/feed",
    icon: LucideHome,
    isActive: true,
    badge: 0,
  },
  {
    title: "Search",
    description: "Search for your opportunities",
    url: "/search",
    icon: LucideSearchCheck,
    badge: 0,
  },
  {
    title: "Favorite",
    description: "All of the favorite users",
    url: "/favorite",
    icon: LucideBookMarked,
    badge: 0,
  },
  {
    title: "Matching",
    description: "All of the matching users",
    url: "/matching",
    icon: LucideHandshake,
    badge: 0,
  },
  {
    title: "Interview",
    description: "Manage your interviews",
    url: "/interview",
    icon: LucideCalendarCheck,
    badge: 0,
  },
  {
    title: "Message",
    description: "Chat and Message",
    url: "/message",
    icon: LucideMessageCircle,
    badge: 0,
  },
  {
    title: "Notification",
    description: "Stay updated with matches and messages",
    url: "/notification",
    icon: LucideBellRing,
    badge: 0,
  },
  {
    title: "Dashboard",
    description: "View your analytics",
    url: "/dashboard",
    icon: LucideBarChart3,
    badge: 0,
  },
] as const;

/* ------------------------- Mobile Navigation URLs ------------------------- */
export const MOBILE_PRIMARY_URLS: string[] = [
  "/feed",
  "/search",
  "/matching",
  "/message",
] as const;

/* ---------------------------- Level-Only Badges --------------------------- */
/*
  URLs whose badge is a collection size (a level the user controls) rather than
  an unread / action-required signal (an event). These are excluded from the
  mobile "More" rollup: adding a level to event counts yields a number that
  describes nothing, and a permanent favourites total — which only ever changes
  when the user themselves changes it — drowns out the notification and
  interview counts sitting behind the same tab.
*/
export const LEVEL_BADGE_URLS: string[] = ["/favorite"] as const;
