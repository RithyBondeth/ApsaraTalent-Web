"use client";

import {
  ChevronDown,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import MenuIcon from "./menu-icon";
import { INavbarUserMenuProps } from "./props";
import { getNameInitials } from "@/utils/functions/text";
import { USER_ROLE } from "@/utils/constants/auth.constant";

export function NavbarUserMenu(props: INavbarUserMenuProps) {
  /* --------------------------------- Props --------------------------------- */
  const { user } = props;

  /* ---------------------------------- Utils -------------------------------- */
  const { resolvedTheme, setTheme } = useTheme();
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const router = useRouter();
  const t = useTranslations("sidebarFooter");

  /* -------------------------------- All States ----------------------------- */
  const [openLogoutDialog, setOpenLogoutDialog] = useState<boolean>(false);

  /* ----------------------------- API Integration --------------------------- */
  // Current User
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const isEmployee = currentUser?.role === USER_ROLE.EMPLOYEE;

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
  // Theme Effect
  useEffect(() => {
    setTheme(theme);
    setCookie("theme", theme);
  }, [theme, setTheme]);

  // Language Effect
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

    // Clear favorite stores and their persisted cache
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

  // ── Handle Theme Toggle ─────────────────────────────────────────
  const handleThemeToggle = () => {
    toggleTheme();
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <>
      <DropdownMenu>
        {/* User Menu Trigger Section */}
        <DropdownMenuTrigger asChild>
          <button className="group flex items-center gap-2 rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/40 px-2 py-1.5 shadow-sm transition-all duration-200 hover:border-border/80 hover:shadow-md hover:from-accent hover:to-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {/* Avatar Section */}
            <Avatar className="h-7 w-7 shrink-0 ring-2 ring-border/60 transition-all duration-200 group-hover:ring-primary/40">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                {getNameInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            {/* Name and Role Section */}
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="max-w-[90px] truncate text-xs font-semibold leading-none sm:max-w-[140px]">
                {user.name}
              </span>
              <span className="text-[10px] leading-none text-muted-foreground capitalize">
                {currentUser?.role ?? ""}
              </span>
            </div>

            {/* Chevron Icon Section */}
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>

        {/* Dropdown Content Section */}
        <DropdownMenuContent
          className="w-64 overflow-hidden rounded-2xl border border-border/70 p-0 shadow-[0_8px_32px_hsl(var(--foreground)/0.12)]"
          side="bottom"
          align="end"
          sideOffset={8}
        >
          {/* Dropdown Header Section: Avatar, Name and Email */}
          <div className="bg-gradient-to-br from-primary/[0.08] via-transparent to-muted/40 px-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 ring-2 ring-background shadow-sm">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 font-bold text-primary">
                  {getNameInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-tight">
                  {user.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary capitalize">
                  {isEmployee ? (
                    <LucideUser className="size-2.5" />
                  ) : (
                    <LucideBuilding className="size-2.5" />
                  )}
                  {currentUser?.role ?? USER_ROLE.EMPLOYEE}
                </span>
              </div>
            </div>
          </div>

          {/* Dropdown Menu Content Section */}
          <div className="p-1.5">
            {/* Dropdown Menu Group Section */}
            <DropdownMenuGroup>
              {/* My Profile Section */}
              <DropdownMenuItem asChild>
                <Link
                  href={`/profile/${currentUser?.role ?? USER_ROLE.EMPLOYEE}`}
                  prefetch={true}
                  className="flex items-center gap-2.5"
                >
                  <MenuIcon className="bg-violet-500/10">
                    {isEmployee ? (
                      <LucideUser className="size-3.5 text-violet-500" />
                    ) : (
                      <LucideBuilding className="size-3.5 text-violet-500" />
                    )}
                  </MenuIcon>
                  {t("myProfile")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1.5 bg-border/60" />

            {/* Dropdown Menu Group Section */}
            <DropdownMenuGroup>
              {/* Settings Section */}
              <DropdownMenuItem asChild>
                <Link
                  href="/setting"
                  prefetch={true}
                  className="flex items-center gap-2.5"
                >
                  <MenuIcon className="bg-slate-500/10">
                    <LucideSettings className="size-3.5 text-slate-500" />
                  </MenuIcon>
                  {t("settings")}
                </Link>
              </DropdownMenuItem>

              {/* Appearance Section */}
              <DropdownMenuItem
                onClick={handleThemeToggle}
                className="flex items-center gap-2.5"
              >
                <MenuIcon
                  className={
                    resolvedTheme === "dark"
                      ? "bg-amber-500/10"
                      : "bg-indigo-500/10"
                  }
                >
                  {resolvedTheme === "dark" ? (
                    <LucideSun className="size-3.5 text-amber-500" />
                  ) : (
                    <LucideMoon className="size-3.5 text-indigo-500" />
                  )}
                </MenuIcon>
                {t("appearance")}
              </DropdownMenuItem>

              {/* Language Section */}
              <DropdownMenuItem
                onClick={() => setLanguage(language === "en" ? "km" : "en")}
                className="flex items-center gap-2.5"
              >
                <MenuIcon className="bg-emerald-500/10">
                  <Globe className="size-3.5 text-emerald-500" />
                </MenuIcon>
                <span>
                  {t("language")}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {language === "en" ? "English" : "ខ្មែរ"}
                  </span>
                </span>
              </DropdownMenuItem>

              {/* Favorite Section */}
              <DropdownMenuItem asChild>
                <Link
                  href="/favorite"
                  prefetch={true}
                  className="flex items-center gap-2.5"
                >
                  <MenuIcon className="bg-pink-500/10">
                    <LucideBookMarked className="size-3.5 text-pink-500" />
                  </MenuIcon>
                  {t("favorite")}
                </Link>
              </DropdownMenuItem>

              {/* Report Problem Section */}
              <DropdownMenuItem className="flex items-center gap-2.5">
                <MenuIcon className="bg-orange-500/10">
                  <LucideInfo className="size-3.5 text-orange-500" />
                </MenuIcon>
                {t("reportProblem")}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1.5 bg-border/60" />

            {/* Logout Section */}
            <DropdownMenuItem
              onClick={() => setOpenLogoutDialog(true)}
              className="flex items-center gap-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <MenuIcon className="bg-destructive/10">
                <LogOut className="size-3.5 text-destructive" />
              </MenuIcon>
              {t("logOut")}
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Dialog Section */}
      <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogTitle>{t("confirmLogout")}</DialogTitle>
          <TypographySmall className="text-muted-foreground">
            {t("logoutQuestion")}
          </TypographySmall>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenLogoutDialog(false)}
            >
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              {t("logout")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
