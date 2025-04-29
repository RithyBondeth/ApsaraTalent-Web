"use client"

import EmployeeCard from "@/components/employee/employee-card";
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
import CompanyCard from "@/components/company/company-card";
import { userList } from "@/data/user-data";
export default function FeedPage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
      setMounted(true);
    }, []);
   
    // Determine which image to display (avoid SSR issues)
    const currentTheme = mounted ? resolvedTheme : "light";
    const feedImage = currentTheme === "dark" ? feedBlackSvg : feedWhiteSvg;
    
    const companyList = userList.filter((user) => user.role === 'company');
    const employeeList = userList.filter((user) => user.role === 'employee');
    
    return (
        <div className="w-full flex flex-col items-start gap-5">
        
            {/* Header Section */}
            <div className='w-full flex items-start justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center'>
                <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
                    <TypographyH2 className="leading-relaxed tablet-xl:text-center">Apply to your favorite jobs from anywhere.</TypographyH2>
                    <TypographyH4 className="leading-relaxed tablet-xl:text-center">Connect with professionals around the world.</TypographyH4>
                    <TypographyMuted className="leading-relaxed tablet-xl:text-center">Find your dream job with ease and apply to it from anywhere.</TypographyMuted>
                </div>
                <Image src={feedImage} alt='feed' height={300} width={400} className="tablet-xl:!w-full"/>
            </div>
            
            {/* Feed Card Section */}
            <div className="w-full grid grid-cols-2 gap-5 tablet-lg:grid-cols-1">
                {companyList.map((user) => (
                    <CompanyCard
                        key={user.id}
                        {...user.company!}
                        onViewClick={() => router.push('feed/company/1')}
                        onSaveClick={() => {}}
                    />
                ))}
                {employeeList.map((user) => (
                    <EmployeeCard
                        key={user.id}
                        {...user.employee!}
                        onSaveClick={() => {}}
                        onViewClick={() => router.push(`/feed/employee/1`)}
                    />
                ))}
            </div>
        </div>
    )
}