import {
    BellRing,
    BookMarked,
    Handshake,
    Home,
    MessageCircle,
    SearchCheck,
} from "lucide-react";

export const sidebarList = [
    {
      title: "Feed",
      description: 'Explore your connections',
      url: "/feed",
      icon: Home,
      isActive: true,
      badge: 0,
    },
    {
      title: "Search",
      description: 'Search for your opportunities',
      url: "/search",
      icon: SearchCheck,
      badge: 0,
    },
    {
      title: "Favorite",
      description: 'All of the favorite users',
      url: "/favorite",
      icon: BookMarked,
      badge: 0,
    },
    {
      title: "Matching",
      description: 'All of the matching users',
      url: "/matching",
      icon: Handshake,
      badge: 0,
    },
    {
      title: "Message",
      description: 'Chat and Message',
      url: "/message",
      icon: MessageCircle,
      badge: 0,
    },
    {
      title: "Notification",
      description: 'Stay updated with matches and messages',
      url: "/notification",
      icon: BellRing,
      badge: 0,
    },
  ];