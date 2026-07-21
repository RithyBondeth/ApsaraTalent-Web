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
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import ReportProblemDialog from "@/components/report-problem/report-problem-dialog";
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
  const [openReportDialog, setOpenReportDialog] = useState<boolean>(false);

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
          <button
            type="button"
            aria-label={`${t("myProfile")}: ${user.name}`}
            className="group flex h-10 items-center gap-2 rounded-xl border border-border/70 bg-card px-1.5 pr-2 shadow-[0_1px_3px_hsl(var(--foreground)/0.04)] transition-colors duration-200 hover:border-brand/20 hover:bg-muted/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:border-brand/25 data-[state=open]:bg-brand-soft/55"
          >
            {/* Avatar Section */}
            <Avatar className="size-7 shrink-0 ring-2 ring-card shadow-sm">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-brand-soft text-[10px] font-bold text-brand-soft-foreground">
                {getNameInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            {/* Name and Role Section */}
            <div className="flex min-w-0 items-start flex-col gap-0.5 phone-xl:hidden">
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
          className="w-72 overflow-hidden rounded-2xl border border-border/70 bg-card/95 p-0 shadow-[0_16px_44px_hsl(var(--foreground)/0.14)] backdrop-blur-xl"
          side="bottom"
          align="end"
          sideOffset={8}
        >
          {/* Dropdown Header Section: Avatar, Name and Email */}
          <div className="relative overflow-hidden bg-[hsl(var(--illustration-surface))] px-4 py-4">
            <span className="absolute -right-5 -top-8 size-24 rounded-full border border-brand/15" />
            <span className="absolute right-16 top-5 size-2 rounded-full bg-brand/25" />
            <div className="relative flex items-center gap-3">
              <Avatar className="size-12 ring-2 ring-card shadow-[0_8px_20px_hsl(var(--foreground)/0.1)]">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-brand-soft font-bold text-brand-soft-foreground">
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
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-lg border border-brand/15 bg-brand-soft px-2 py-0.5 text-[10px] font-semibold capitalize text-brand-soft-foreground">
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
          <div className="p-2">
            {/* Dropdown Menu Group Section */}
            <DropdownMenuGroup>
              {/* My Profile Section */}
              <DropdownMenuItem
                asChild
                className="h-11 rounded-xl px-2.5 focus:bg-brand-soft/60"
              >
                <Link
                  href={`/profile/${currentUser?.role ?? USER_ROLE.EMPLOYEE}`}
                  prefetch={true}
                  className="flex items-center gap-2.5"
                >
                  <MenuIcon>
                    {isEmployee ? <LucideUser /> : <LucideBuilding />}
                  </MenuIcon>
                  {t("myProfile")}
                </Link>
              </DropdownMenuItem>
              {/* Favorite Section */}
              <DropdownMenuItem
                asChild
                className="h-11 rounded-xl px-2.5 focus:bg-brand-soft/60"
              >
                <Link
                  href="/favorite"
                  prefetch={true}
                  className="flex items-center gap-2.5"
                >
                  <MenuIcon>
                    <LucideBookMarked />
                  </MenuIcon>
                  {t("favorite")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1.5 bg-border/60" />

            {/* Dropdown Menu Group Section */}
            <DropdownMenuGroup>
              {/* Settings Section */}
              <DropdownMenuItem
                asChild
                className="h-11 rounded-xl px-2.5 focus:bg-brand-soft/60"
              >
                <Link
                  href="/setting"
                  prefetch={true}
                  className="flex items-center gap-2.5"
                >
                  <MenuIcon>
                    <LucideSettings />
                  </MenuIcon>
                  {t("settings")}
                </Link>
              </DropdownMenuItem>

              {/* Appearance Section */}
              <DropdownMenuItem
                onClick={handleThemeToggle}
                className="flex h-11 items-center gap-2.5 rounded-xl px-2.5 focus:bg-brand-soft/60"
              >
                <MenuIcon>
                  {resolvedTheme === "dark" ? <LucideSun /> : <LucideMoon />}
                </MenuIcon>
                {t("appearance")}
              </DropdownMenuItem>

              {/* Language Section */}
              <DropdownMenuItem
                onClick={() => setLanguage(language === "en" ? "km" : "en")}
                className="flex h-11 items-center gap-2.5 rounded-xl px-2.5 focus:bg-brand-soft/60"
              >
                <MenuIcon>
                  <Globe />
                </MenuIcon>
                <span className="min-w-0 flex-1">{t("language")}</span>
                <span className="rounded-lg bg-muted/70 px-2 py-1 text-[10px] font-medium text-muted-foreground">
                  {language === "en" ? "English" : "ខ្មែរ"}
                </span>
              </DropdownMenuItem>

              {/* Report Problem Section */}
              <DropdownMenuItem
                onClick={() => setOpenReportDialog(true)}
                className="flex h-11 items-center gap-2.5 rounded-xl px-2.5 focus:bg-brand-soft/60"
              >
                <MenuIcon>
                  <LucideInfo />
                </MenuIcon>
                {t("reportProblem")}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1.5 bg-border/60" />

            {/* Logout Section */}
            <DropdownMenuItem
              onClick={() => setOpenLogoutDialog(true)}
              className="flex h-11 items-center gap-2.5 rounded-xl px-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <MenuIcon className="border-destructive/10 bg-destructive/10 text-destructive">
                <LogOut />
              </MenuIcon>
              {t("logOut")}
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Dialog Section */}
      <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <div className="mb-1 flex size-12 items-center justify-center rounded-2xl border border-destructive/15 bg-destructive/10">
              <LogOut className="size-5 text-destructive" />
            </div>
            <DialogTitle className="tracking-[-0.02em]">
              {t("confirmLogout")}
            </DialogTitle>
            <DialogDescription>{t("logoutQuestion")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setOpenLogoutDialog(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={handleLogout}
            >
              {t("logout")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Problem Dialog Section */}
      <ReportProblemDialog
        open={openReportDialog}
        onOpenChange={setOpenReportDialog}
      />
    </>
  );
}
