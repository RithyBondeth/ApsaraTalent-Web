import Header from "@/components/header";
import Image from "next/image";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Button } from "@/components/ui/button";
import { LucideBriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import landingSvg from "@/assets/svg/landing.svg";

export default function IndexPage() {
  return (
   <div className="h-screen w-screen flex items-stretch justify-between relative">
      <Header className="absolute top-0 left-0 right-0 z-10"/>
      <div className="w-1/2 flex justify-center items-center">
        <div className="size-[70%] flex flex-col items-stretch justify-start">
            <div className="flex flex-col items-start mb-10">
              <TypographyH2 className="leading-relaxed"><span className="underline underline-offset-2">Empowering</span> Connections Between Talent and Opportunity</TypographyH2>
              <TypographyMuted className="leading-loose">
                Whether you’re a freelancer seeking new opportunities or a professional advancing your career, our platform 
                connects you with the right opportunities.For businesses and employers, find top-tier talent to drive success 
                and innovation.
              </TypographyMuted>
            </div>
            <Link href="/signup">
              <Button prefixIcon={<LucideBriefcaseBusiness/>}>Create a new account</Button>
            </Link>
        </div>
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center gap-12 relative">
          <div className="w-[85%] h-full relative">
            <Image src={landingSvg} alt="landing" fill className="object-contain"/>
          </div>
      </div>
   </div>
  );
}
