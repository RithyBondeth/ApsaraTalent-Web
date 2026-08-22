"use client";

import {
  LucideChevronDown,
  LucideGlobe,
  LucideLogOut,
  LucideBookMarked,
  LucideBuilding,
  LucideInfo,
  LucideMoon,
  LucideSettings,
  LucideSun,
  LucideUser,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutConfirmationDialog } from "@/components/auth/logout-confirmation-dialog";
import { ReportProblemDialog } from "@/components/support/report-problem-dialog";
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
          <button className="group flex h-11 items-center gap-2 border border-border bg-card/80 px-2 transition-[background-color,border-color,box-shadow,transform] duration-200 hover:border-foreground/35 hover:bg-muted/60 hover:shadow-hard-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px">
            {/* Avatar Section */}
            <Avatar
              rounded="md"
              className="h-7 w-7 shrink-0 rounded-none border border-border transition-colors duration-200 group-hover:border-foreground/30"
            >
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-foreground text-[10px] font-bold text-background">
                {getNameInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            {/* Name and Role Section */}
            <div className="hidden min-w-0 flex-col items-start gap-0.5 sm:flex">
              <span className="max-w-[86px] truncate text-xs font-semibold leading-none lg:max-w-[104px]">
                {user.name}
              </span>
              <span className="text-[9px] font-semibold uppercase leading-none tracking-[0.12em] text-muted-foreground">
                {currentUser?.role ?? ""}
              </span>
            </div>

            {/* Chevron Icon Section */}
            <LucideChevronDown className="hidden size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 sm:block" />
          </button>
        </DropdownMenuTrigger>

        {/* Dropdown Content Section */}
        <DropdownMenuContent
          className="w-72 overflow-hidden rounded-none border border-foreground/20 p-0 shadow-hard-lg"
          side="bottom"
          align="end"
          sideOffset={9}
        >
          {/* Dropdown Header Section: Avatar, Name and Email */}
          <div className="border-b border-border bg-muted/40 px-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar
                rounded="md"
                className="h-11 w-11 rounded-none border border-foreground/15"
              >
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-foreground font-bold text-background">
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
                <span className="mt-2 inline-flex items-center gap-1 border border-foreground/15 bg-background px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-foreground">
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
              <DropdownMenuItem asChild>
                <Link
                  href={`/profile/${currentUser?.role ?? USER_ROLE.EMPLOYEE}`}
                  prefetch={true}
                  className="flex min-h-11 items-center gap-2.5 rounded-none px-2"
                >
                  <MenuIcon>
                    {isEmployee ? (
                      <LucideUser className="size-3.5 text-foreground" />
                    ) : (
                      <LucideBuilding className="size-3.5 text-foreground" />
                    )}
                  </MenuIcon>
                  {t("myProfile")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2 bg-border" />

            {/* Dropdown Menu Group Section */}
            <DropdownMenuGroup>
              {/* Settings Section */}
              <DropdownMenuItem asChild>
                <Link
                  href="/setting"
                  prefetch={true}
                  className="flex min-h-11 items-center gap-2.5 rounded-none px-2"
                >
                  <MenuIcon>
                    <LucideSettings className="size-3.5 text-foreground" />
                  </MenuIcon>
                  {t("settings")}
                </Link>
              </DropdownMenuItem>

              {/* Appearance Section */}
              <DropdownMenuItem
                onClick={handleThemeToggle}
                className="flex min-h-11 items-center gap-2.5 rounded-none px-2"
              >
                <MenuIcon>
                  {resolvedTheme === "dark" ? (
                    <LucideSun className="size-3.5 text-foreground" />
                  ) : (
                    <LucideMoon className="size-3.5 text-foreground" />
                  )}
                </MenuIcon>
                {t("appearance")}
              </DropdownMenuItem>

              {/* Language Section */}
              <DropdownMenuItem
                onClick={() => setLanguage(language === "en" ? "km" : "en")}
                className="flex min-h-11 items-center gap-2.5 rounded-none px-2"
              >
                <MenuIcon>
                  <LucideGlobe className="size-3.5 text-foreground" />
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
                  className="flex min-h-11 items-center gap-2.5 rounded-none px-2"
                >
                  <MenuIcon>
                    <LucideBookMarked className="size-3.5 text-foreground" />
                  </MenuIcon>
                  {t("favorite")}
                </Link>
              </DropdownMenuItem>

              {/* Report Problem Section */}
              <DropdownMenuItem
                onClick={() => setOpenReportDialog(true)}
                className="flex min-h-11 items-center gap-2.5 rounded-none px-2"
              >
                <MenuIcon>
                  <LucideInfo className="size-3.5 text-foreground" />
                </MenuIcon>
                {t("reportProblem")}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2 bg-border" />

            {/* Logout Section */}
            <DropdownMenuItem
              onClick={() => setOpenLogoutDialog(true)}
              className="flex min-h-11 items-center gap-2.5 rounded-none px-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <MenuIcon className="border-destructive/20 bg-destructive/10">
                <LucideLogOut className="size-3.5 text-destructive" />
              </MenuIcon>
              {t("logOut")}
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Dialog Section */}
      <ReportProblemDialog
        open={openReportDialog}
        onOpenChange={setOpenReportDialog}
      />

      <LogoutConfirmationDialog
        open={openLogoutDialog}
        onOpenChange={setOpenLogoutDialog}
        onConfirm={handleLogout}
        title={t("confirmLogout")}
        description={t("logoutQuestion")}
        cancelLabel={t("cancel")}
        confirmLabel={t("logout")}
      />
    </>
  );
}
