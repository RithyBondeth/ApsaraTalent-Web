"use client";

import {
    ChevronsUpDown,
    Globe,
    LogOut,
    LucideBookMarked,
    LucideBuilding,
    LucideInfo,
    LucideMoon,
    LucideSettings,
    LucideSun,
    LucideUser
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useLoginStore } from "@/stores/apis/auth/login.store";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useVerifyOTPStore } from "@/stores/apis/auth/verify-otp.store";
import { useCompanyFavEmployeeStore } from "@/stores/apis/favorite/company-fav-employee.store";
import { useEmployeeFavCompanyStore } from "@/stores/apis/favorite/employee-fav-company.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useLanguageStore } from "@/stores/languages/language-store";
import { useThemeStore } from "@/stores/themes/theme-store";
import {
    clearAuthCookies,
    clearAuthCookiesServerSide
} from "@/utils/auth/cookie-manager";
import { setCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ISidebarDropdownFooterProps } from "./props";

export function SidebarDropdownFooter({ user }: ISidebarDropdownFooterProps) {
  const { isMobile } = useSidebar();
  const { theme, toggleTheme } = useThemeStore();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [openLogoutDialog, setOpenLogoutDialog] = useState<boolean>(false);
  const { language, setLanguage } = useLanguageStore();
  const t = useTranslations("sidebarFooter");

  useEffect(() => {
    setTheme(theme);
    setCookie("theme", theme);
  }, [theme, setTheme]);

  useEffect(() => {
    setCookie("language", language);
  }, [language]);

  const currentUser = useGetCurrentUserStore((state) => state.user);

  const normalLogout = useLoginStore((state) => state.clearToken);
  const otpLogout = useVerifyOTPStore((state) => state.clearToken);
  const googleLogout = useGoogleLoginStore((state) => state.clearToken);
  const githubLogout = useGithubLoginStore((state) => state.clearToken);
  const linkedInLogout = useLinkedInLoginStore((state) => state.clearToken);
  const facebookLogout = useFacebookLoginStore((state) => state.clearToken);
  const clearCurrentUser = useGetCurrentUserStore((state) => state.clearUser);
  const clearEmployeeFavorites = useEmployeeFavCompanyStore(
    (state) => state.clearFavorites,
  );
  const clearCompanyFavorites = useCompanyFavEmployeeStore(
    (state) => state.clearFavorite,
  );

  const handleLogout = async () => {
    setOpenLogoutDialog(false);

    // Clear all potential authentication tokens from stores
    normalLogout();
    otpLogout();
    googleLogout();
    githubLogout();
    linkedInLogout();
    facebookLogout();

    // Clear favorite stores and their persisted cache (prevents cross-user stale IDs)
    clearEmployeeFavorites();
    clearCompanyFavorites();
    useEmployeeFavCompanyStore.persist.clearStorage();
    useCompanyFavEmployeeStore.persist.clearStorage();

    // Clear current user persist
    clearCurrentUser();

    // Try server-side cookie clearing first (for httpOnly cookies)
    await clearAuthCookiesServerSide();

    // Also try client-side clearing as backup
    clearAuthCookies();
    router.push("/");
    window.location.reload();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push(`/profile/${currentUser?.role}`)}
              >
                {currentUser?.role === "employee" ? (
                  <LucideUser />
                ) : (
                  <LucideBuilding />
                )}
                {t("myProfile")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/setting")}>
                <LucideSettings />
                {t("settings")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
                {resolvedTheme === "dark" ? <LucideSun /> : <LucideMoon />}
                {t("appearance")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage(language === "en" ? "km" : "en")}
              >
                <Globe />
                {t("language")}: {language === "en" ? "English" : "ខ្មែរ"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/favorite")}>
                <LucideBookMarked />
                {t("favorite")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LucideInfo />
                {t("reportProblem")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpenLogoutDialog(true)}>
              <LogOut />
              {t("logOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
        <DialogContent>
          <DialogTitle>{t("confirmLogout")}</DialogTitle>
          <TypographySmall>{t("logoutQuestion")}</TypographySmall>
          <DialogFooter>
            <Button
              variant={"outline"}
              onClick={() => setOpenLogoutDialog(false)}
            >
              {t("cancel")}
            </Button>
            <Button variant={"destructive"} onClick={handleLogout}>
              {t("logout")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  );
}
