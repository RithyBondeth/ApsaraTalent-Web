"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import React, { useEffect } from 'react'
import { LucideBookmark, LucideInfo, LucideLogOut, LucideMenu, LucideMoon, LucideSettings, LucideSun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores/theme-store'
import { useTheme } from 'next-themes'
import { setCookie } from 'cookies-next/client'

function DropdownMore() {
    const { theme, toggleTheme } = useThemeStore();
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        setTheme(theme)
        setCookie('theme', theme);
    }, [theme, setTheme]);
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild className='w-full focus:outline-none focus:ring-0 focus-visible:ring-0'>
            <Button variant='secondary'>
                <LucideMenu/>
                More
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-popper-anchor-width)]">
            <DropdownMenuGroup>
                <DropdownMenuItem>
                    <LucideSettings/>
                    Setting
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                    {resolvedTheme === 'dark' ? <LucideSun/> : <LucideMoon/>}
                    Appearance
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <LucideBookmark/>
                    Saved
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <LucideInfo/>
                    Report a problem
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <LucideLogOut/>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownMore