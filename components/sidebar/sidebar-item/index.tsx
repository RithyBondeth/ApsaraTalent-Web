"use client"

import { TypographyP } from "@/components/utils/typography/typography-p";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function SidebarItem({ icon, label, link }: { icon: ReactNode, label: string, link: string }) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div 
            className={
                cn('w-full flex items-center justify-start cursor-pointer p-3 rounded-2xl duration-200 hover:bg-primary hover:text-primary-foreground', 
                pathname === link && 'bg-primary text-primary-foreground'
            )}
            onClick={() => router.push(link)}
        > 
            <span className="">{icon}</span>
            <TypographyP className="!m-0 !ml-5 !text-sm">{label}</TypographyP>
        </div>
    )
}