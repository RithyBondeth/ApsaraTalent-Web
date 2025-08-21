"use client"

import {
ChevronsUpDown,
  LogOut,
  LucideBookMarked,
  LucideBuilding,
  LucideInfo,
  LucideMoon,
  LucideSettings,
  LucideSun,
  LucideUser,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useThemeStore } from '@/stores/themes/theme-store'
import { useTheme } from 'next-themes'
import { setCookie } from 'cookies-next/client'
import { useEffect, useState } from "react";
import { ISidebarDropdownFooterProps } from "./props";
import { useRouter } from "next/navigation";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useLoginStore } from "@/stores/apis/auth/login.store";
import { useVerifyOTPStore } from "@/stores/apis/auth/verify-otp.store";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";
import { clearAuthCookies, clearAuthCookiesServerSide } from "@/utils/auth/cookie-manager";

export function SidebarDropdownFooter({ user }: ISidebarDropdownFooterProps) {
  const { isMobile } = useSidebar()
  const { theme, toggleTheme } = useThemeStore();
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [openLogoutDialog, setOpenLogoutDialog] = useState<boolean>(false);

  useEffect(() => {
      setTheme(theme)
      setCookie('theme', theme);
  }, [theme, setTheme]);

  const currentUser = useGetCurrentUserStore((state) => state.user);
  
  const normalLogout = useLoginStore((state) => state.clearToken);
  const otpLogout = useVerifyOTPStore((state) => state.clearToken);
  const googleLogout = useGoogleLoginStore((state) => state.clearToken);
  const githubLogout = useGithubLoginStore((state) => state.clearToken);
  const linkedInLogout = useLinkedInLoginStore((state) => state.clearToken);
  const facebookLogout = useFacebookLoginStore((state) => state.clearToken);

  const handleLogout = async () => {
    setOpenLogoutDialog(false);
         
    // Clear all potential authentication tokens from stores
    normalLogout();
    otpLogout();    
    googleLogout();
    githubLogout();
    linkedInLogout();
    facebookLogout();

    // Try server-side cookie clearing first (for httpOnly cookies)
    await clearAuthCookiesServerSide();
    
    // Also try client-side clearing as backup
    clearAuthCookies();
    router.push("/")
  }
  
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
                <AvatarFallback className="rounded-lg">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
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
                  <AvatarFallback className="rounded-lg">{user.name.slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push(`/profile/${currentUser?.role}`)}>
                {currentUser?.role === 'employee' ? <LucideUser /> : <LucideBuilding/>}
                My Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/setting')}>
                <LucideSettings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
              {resolvedTheme === 'dark' ? <LucideSun/> : <LucideMoon/>}
                Appearance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/favorite')}>
                <LucideBookMarked />
                Favorite
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LucideInfo />
                Report a problem
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpenLogoutDialog(true)}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
        <DialogContent>
          <DialogTitle>Confirm Logout</DialogTitle>
          <TypographySmall>Are you sure you want to logout?</TypographySmall>
          <DialogFooter>
            <Button variant={'outline'} onClick={() => setOpenLogoutDialog(false)}>Cancel</Button>
            <Button variant={'destructive'} onClick={handleLogout}>Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  )
}
