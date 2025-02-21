"use client"

import { TypographyP } from "@/components/utils/typography/typography-p";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function SidebarItem({ icon, label, link, className }: { icon: ReactNode, label: string, link: string, className?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    
    return (
        <div 
            className={cn(
                "w-full flex items-center justify-start cursor-pointer p-3 rounded-3xl transition-all duration-300 ease-out hover:bg-primary hover:text-primary-foreground hover:scale-[1.05] hover:shadow-md",
                pathname === link && 'bg-primary text-primary-foreground',
                className,
                 
            )}
            onClick={() => router.push(link)}
        > 
    <span className="transition-all duration-300 ease-out">{icon}</span>
    <TypographyP className="!m-0 !ml-5 !tsext-sm transition-all duration-300 ease-out">
        {label}
    </TypographyP>
</div>
    )
}