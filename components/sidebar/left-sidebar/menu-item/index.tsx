"use client"

import { TypographyP } from "@/components/utils/typography/typography-p";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { IMenuItemProps } from "./props";

export default function MenuItem(props: IMenuItemProps) {
    const router = useRouter();
    const pathname = usePathname();
    
    return (
        <div 
            className={cn(
                "w-full flex items-center justify-start cursor-pointer p-3 rounded-3xl transition-all duration-300 ease-out hover:bg-primary hover:text-primary-foreground hover:scale-[1.05] hover:shadow-md",
                pathname === props.link && 'bg-primary text-primary-foreground',
                props.className,
            )}
            onClick={() => router.push(props.link)}
        > 
            <span className="transition-all duration-300 ease-out">{props.icon}</span>
            <TypographyP className="!m-0 !ml-5 !text-sm transition-all duration-300 ease-out">{props.label}</TypographyP>
        </div>
    )
}