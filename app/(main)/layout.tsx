"use client";
import CollapseSidebar from "@/components/sidebar/collapse-sidebar";
import RightSidebar from "@/components/sidebar/right-sidebar";
import { Button } from "@/components/ui/button";
import { LucideArrowLeft } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { sidebarList } from "@/utils/constants/sidebar.constant";
import { ThemeProviderClient } from "@/components/utils/themes/theme-provider-client";
import { useThemeStore } from "@/stores/themes/theme-store";
import { useLoginStore } from "@/stores/apis/auth/login.store";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useVerifyOTPStore } from "@/stores/apis/auth/verify-otp.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sidebarData = sidebarList.filter((item) => item.url === pathname);
  const { theme } = useThemeStore();
  const { isInitialized, accessToken, initialize } = useLoginStore();
  const verifyOTPStore = useVerifyOTPStore();
  const googleLoginStore = useGoogleLoginStore();
  const githubLoginStore = useGithubLoginStore();
  const linkedInLoginStore = useLinkedInLoginStore();
  const facebookLoginStore = useFacebookLoginStore();
  const { getCurrentUser } = useGetCurrentUserStore();

  useEffect(() => {
    initialize();
    verifyOTPStore.initialize();
    googleLoginStore.initialize();
    linkedInLoginStore.initialize();
    githubLoginStore.initialize();
    facebookLoginStore.initialize();
  }, []);

  useEffect(() => {
    if (
      !isInitialized ||
      !verifyOTPStore.isInitialized ||
      !googleLoginStore.isInitialized ||
      !githubLoginStore.isInitialized ||
      !linkedInLoginStore.isInitialized || 
      !facebookLoginStore.isInitialized
    )
      return;

    if (accessToken) getCurrentUser(accessToken);

    if (verifyOTPStore.accessToken) getCurrentUser(verifyOTPStore.accessToken);

    if (googleLoginStore.accessToken)
      getCurrentUser(googleLoginStore.accessToken);

    if (linkedInLoginStore.accessToken)
      getCurrentUser(linkedInLoginStore.accessToken);

    if (githubLoginStore.accessToken)
      getCurrentUser(githubLoginStore.accessToken);

    if(facebookLoginStore.accessToken)
      getCurrentUser(facebookLoginStore.accessToken);
  }, [
    isInitialized,
    accessToken,
    verifyOTPStore.isInitialized,
    verifyOTPStore.accessToken,
    googleLoginStore.isInitialized,
    googleLoginStore.accessToken,
    linkedInLoginStore.accessToken,
    linkedInLoginStore.isInitialized,
    githubLoginStore.accessToken,
    githubLoginStore.isInitialized,
    facebookLoginStore.accessToken,
    facebookLoginStore.isInitialized,
  ]);

  if (
    !isInitialized ||
    !verifyOTPStore.isInitialized ||
    !googleLoginStore.isInitialized ||
    !linkedInLoginStore.isInitialized ||
    !githubLoginStore.isInitialized || 
    !facebookLoginStore.isInitialized
  ) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <ClipLoader color="#000" />
      </div>
    );
  }

  // Exclude dynamic feed pages but include /feed
  if (
    (pathname.startsWith("/feed/") && pathname !== "/feed") ||
    pathname === "/profile/employee" ||
    pathname === "/profile/company"
  ) {
    return (
      <div className="relative">
        <Link href="/feed" className="absolute top-5 left-5 z-20">
          <Button variant={"outline"} size="icon">
            <LucideArrowLeft />
          </Button>
        </Link>
        <div className="container mx-auto p-5">{children}</div>
      </div>
    ); // No layout for /feed/[userId]
  }

  // Special layout for message page - no right sidebar
  if (pathname === "/message" || pathname.startsWith("/message/")) {
    return (
      <SidebarProvider>
        <CollapseSidebar />
        <div className="w-full h-screen message-xs:h-full flex flex-col">
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <TypographyP className="!m-0">
                  {sidebarData[0].description}
                </TypographyP>
              </div>
            </header>
          </SidebarInset>
          <div className="h-full">{children}</div>
        </div>
      </SidebarProvider>
    );
  }

  if (pathname === "/resume-builder") {
    return (
      <SidebarProvider>
        <CollapseSidebar />
        <div className="w-full h-screen message-xs:h-full flex flex-col">
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <TypographyP className="!m-0">AI Resume Builder</TypographyP>
              </div>
            </header>
          </SidebarInset>
          <div className="h-full">{children}</div>
        </div>
      </SidebarProvider>
    );
  }

  if (pathname.startsWith("/search")) {
    return (
      <SidebarProvider>
        <CollapseSidebar />
        <div className="w-full h-screen message-xs:h-full flex flex-col">
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <TypographyP className="!m-0">Search your favorite</TypographyP>
              </div>
            </header>
          </SidebarInset>
          <div className="h-full">{children}</div>
        </div>
      </SidebarProvider>
    );
  }

  // Default layout with both sidebars
  return (
    <ThemeProviderClient defaultTheme={theme}>
      <SidebarProvider>
        <CollapseSidebar />
        <div className="w-ful">
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <TypographyP className="!m-0">
                  {sidebarData[0].description}
                </TypographyP>
              </div>
            </header>
          </SidebarInset>
          <div className="!m-5">{children}</div>
        </div>
        <RightSidebar className="!min-w-[25%] laptop-sm:hidden" />
      </SidebarProvider>
    </ThemeProviderClient>
  );
}
