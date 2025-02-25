"use client"

import EmployeeCard from "@/components/employee-card";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import Image from "next/image";
import feedBlackSvg from "@/assets/svg/feed-black.svg";
import feedWhiteSvg from "@/assets/svg/feed-white.svg";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useState } from "react";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { useRouter } from "next/navigation";
import { userList } from "@/data/user-data";
import { useRoleStore } from "@/stores/role-store";
import CompanyCard from "@/components/company-card";
import { companyList } from "@/data/company-data";
export default function FeedPage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { role } = useRoleStore();
    
    useEffect(() => {
      setMounted(true);
    }, []);
   
    // Determine which image to display (avoid SSR issues)
    const currentTheme = mounted ? resolvedTheme : "light";
    const feedImage = currentTheme === "dark" ? feedBlackSvg : feedWhiteSvg;

    return (
        <div className="w-full flex flex-col items-start gap-5">
        
            {/* Header Section */}
            <div className='w-full flex items-start justify-between gap-5'>
                <div className="flex flex-col items-start gap-3">
                    <TypographyH2 className="leading-relaxed">Apply to your favorite jobs from anywhere.</TypographyH2>
                    <TypographyH4 className="leading-relaxed">Connect with professionals around the world.</TypographyH4>
                    <TypographyMuted className="leading-relaxed">Find your dream job with ease and apply to it from anywhere.</TypographyMuted>
                </div>
                <Image src={feedImage} alt='feed' height={300} width={400}/>
            </div>
            
            {/* Feed Card Section */}
            <div className="w-full grid grid-cols-2 gap-5">
                {companyList.map((company) => (
                    <CompanyCard
                        key={company.id}
                        {...company}
                        onViewClick={() => {}}
                        onSaveClick={() => {}}
                    />
                ))}
                {userList.map((user) => (
                    <EmployeeCard
                        key={user.id}
                        {...user}
                        onSaveClick={() => {}}
                        onViewClick={() => router.push(`/feed/${role === "employee" ? "employee" : "company"}/${user.id}`)}
                    />
                ))}
            </div>
        </div>
    )
}