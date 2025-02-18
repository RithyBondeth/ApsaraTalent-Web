"use client"

import { TypographyP } from "@/components/utils/typography/typography-p";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function SidebarItem({ icon, label, link }: { icon: ReactNode, label: string, link: string }) {
    const router = useRouter();

    return (
        <div className="flex items-center cursor-pointer py-3" onClick={() => router.push(link)}> 
            <span className="ml-2">{icon}</span>
            <TypographyP className="!m-0 !ml-5 !text-sm">{label}</TypographyP>
        </div>
    )
}