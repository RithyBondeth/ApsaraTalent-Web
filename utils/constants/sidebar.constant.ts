import {
    BellRing,
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
    },
    {
      title: "Search",
      description: 'Search for your opportunities',
      url: "/search",
      icon: SearchCheck,
    },
    {
      title: "Matching",
      description: 'All of the matching users',
      url: "/matching",
      icon: Handshake,
    },
    {
      title: "Message",
      description: 'Chat and Message',
      url: "/message",
      icon: MessageCircle,
    },
    {
      title: "Notification",
      description: 'Check for your notifications',
      url: "/notification",
      icon: BellRing,
    },
  ];