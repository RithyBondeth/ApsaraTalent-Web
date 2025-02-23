"use client"

import UserCard from "@/components/user-card";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import Image from "next/image";
import feedBlackSvg from "@/assets/svg/feed-black.svg";
import feedWhiteSvg from "@/assets/svg/feed-white.svg";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useState } from "react";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";

export default function FeedPage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
      setMounted(true);
    }, []);
    
    // Determine which image to display (avoid SSR issues)
    const currentTheme = mounted ? resolvedTheme : "light";
    const feedImage = currentTheme === "dark" ? feedBlackSvg : feedWhiteSvg;

    const userList = [
        {
            avatar: "JAN",
            name: "John Doe",
            job: "Software Engineer",
            location: "Phnom Penh, Cambodia",
            skills: ["Software Engineer", "Graphic Designer"],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
            resume: "resume.pdf",
            status: [{ label: 'Profile Completion', value: '90%' }, { label: 'Accomplishment', value: '20+' }, { label: 'Likes', value: '35' }],
            experience: "5+ years experience",
            availability: "Available for full time",
            educations: [
                { school: 'Cambodia Academic Digital and Technology', degree: 'Computer Science' }, 
                { school: 'Royal University of Phnom Penh', degree: 'English' },
            ]
        },
        {
            avatar: "JAN",
            name: "John Doe",
            job: "Software Engineer",
            location: "Phnom Penh, Cambodia",
            skills: ["Software Engineer", "Graphic Designer"],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
            resume: "resume.pdf",
            status: [{ label: 'Profile Completion', value: '90%' }, { label: 'Accomplishment', value: '20+' }, { label: 'Likes', value: '35' }],
            experience: "5+ years experience",
            availability: "Available for full time",
            educations: [
                { school: 'Cambodia Academic Digital and Technology', degree: 'Computer Science' }, 
                { school: 'Royal University of Phnom Penh', degree: 'English' },
            ]
        }
    ]

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
                {userList.map((user) => (
                    <UserCard
                        key={user.name}
                        avatar={user.avatar}
                        name={user.name}
                        job={user.job}
                        location={user.location}
                        skills={user.skills}
                        description={user.description}
                        resume={user.resume}
                        status={user.status}
                        experience={user.experience}
                        availability={user.availability}
                        educations={user.educations}
                    />
                ))}
            </div>
        </div>
    )
}