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
  LucideUser,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
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
  clearAuthCookiesServerSide,
} from "@/utils/auth/cookie-manager";
import { setCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ISidebarDropdownFooterProps } from "./props";

export function SidebarDropdownFooter({ user }: ISidebarDropdownFooterProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const { isMobile } = useSidebar();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const t = useTranslations("sidebarFooter");

  /* -------------------------------- All States ------------------------------ */
  const [openLogoutDialog, setOpenLogoutDialog] = useState<boolean>(false);

  /* ----------------------------- API Integration ---------------------------- */
  // Current User and App Settings
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();

  // Logout
  const normalLogout = useLoginStore((state) => state.clearToken);
  const otpLogout = useVerifyOTPStore((state) => state.clearToken);
  const googleLogout = useGoogleLoginStore((state) => state.clearToken);
  const githubLogout = useGithubLoginStore((state) => state.clearToken);
  const linkedInLogout = useLinkedInLoginStore((state) => state.clearToken);
  const facebookLogout = useFacebookLoginStore((state) => state.clearToken);

  // Clear Current User Token
  const clearCurrentUser = useGetCurrentUserStore((state) => state.clearUser);

  // Clear Favorites ID
  const clearEmployeeFavorites = useEmployeeFavCompanyStore(
    (state) => state.clearFavorites,
  );
  const clearCompanyFavorites = useCompanyFavEmployeeStore(
    (state) => state.clearFavorite,
  );

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    setTheme(theme);
    setCookie("theme", theme);
  }, [theme, setTheme]);

  useEffect(() => {
    setCookie("language", language);
  }, [language]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Logout ─────────────────────────────────────────
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

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* User Info Section: Avatar, Name and Email */}
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* Avatar Section */}
              <Avatar className="h-8 w-8 rounded-lg shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Name and Email Section */}
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>

              {/* Chevron Icon Section */}
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* Dropdown Content Section */}
          <DropdownMenuContent
            className="max-h-[min(70vh,32rem)] w-[--radix-dropdown-menu-trigger-width] min-w-56 overflow-y-auto rounded-lg"
            side={isMobile ? "top" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* Dropdown Header Section: Avatar, Name and Email */}
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

            {/* Dropdown Menu Group Section */}
            <DropdownMenuGroup>
              {/* My Profile Section */}
              <DropdownMenuItem asChild>
                <Link
                  href={`/profile/${currentUser?.role ?? "employee"}`}
                  prefetch={true}
                >
                  {currentUser?.role === "employee" ? (
                    <LucideUser className="text-violet-500" />
                  ) : (
                    <LucideBuilding className="text-violet-500" />
                  )}
                  {t("myProfile")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {/* Dropdown Menu Group Section */}
            <DropdownMenuGroup>
              {/* Settings Section */}
              <DropdownMenuItem asChild>
                <Link href="/setting" prefetch={true}>
                  <LucideSettings className="text-slate-500" />
                  {t("settings")}
                </Link>
              </DropdownMenuItem>

              {/* Appearance Section */}
              <DropdownMenuItem onClick={toggleTheme}>
                {resolvedTheme === "dark" ? (
                  <LucideSun className="text-amber-400" />
                ) : (
                  <LucideMoon className="text-indigo-400" />
                )}
                {t("appearance")}
              </DropdownMenuItem>

              {/* Language Section */}
              <DropdownMenuItem
                onClick={() => setLanguage(language === "en" ? "km" : "en")}
              >
                <Globe className="text-emerald-500" />
                {t("language")}: {language === "en" ? "English" : "ខ្មែរ"}
              </DropdownMenuItem>

              {/* Favorite Section */}
              <DropdownMenuItem asChild>
                <Link href="/favorite" prefetch={true}>
                  <LucideBookMarked className="text-pink-500" />
                  {t("favorite")}
                </Link>
              </DropdownMenuItem>

              {/* Report Problem Section */}
              <DropdownMenuItem>
                <LucideInfo className="text-orange-400" />
                {t("reportProblem")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            {/* Logout Section */}
            <DropdownMenuItem onClick={() => setOpenLogoutDialog(true)}>
              <LogOut className="text-destructive" />
              <span className="text-destructive">{t("logOut")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* Logout Dialog Section */}
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
