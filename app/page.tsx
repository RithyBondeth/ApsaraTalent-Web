import Header from "@/components/header";
import Image from "next/image";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import landingSvg from "@/assets/svg/landing.svg";
import ParticlesBackground from "@/components/utils/particle-background";
import { TypographyH1 } from "@/components/utils/typography/typography-h1";

export default function IndexPage() {
  return (
   <div className="h-screen flex items-center justify-between relative tablet-md:flex-col">
      <ParticlesBackground/>
      <Header className="absolute top-0 left-0 right-0 z-20"/>
      <div className="w-1/2 z-10 h-full flex justify-center items-center tablet-md:w-full tablet-md:mt-14">
        <div className="size-[70%] tablet-md:mt-10 tablet-md:mx-10 tablet-md:w-full tablet-md:h-fit">
            <div className="flex flex-col items-start gap-5 mb-10 tablet-md:gap-3">
              <TypographyH1 className="!leading-normal tablet-sm:text-3xl phone-xl:!text-2xl">Empowering Connections Between Talent and Opportunity</TypographyH1>
              <TypographyMuted className="!leading-loose">
                Whether you’re a freelancer seeking new opportunities or a professional advancing your career, our platform 
                connects you with the right opportunities.<span className="tablet-md:hidden">For businesses and employers, find top-tier talent to drive success 
                and innovation.</span>
              </TypographyMuted>
            </div>
        </div>
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center items-center tablet-md:w-full">
          <div className="w-[85%] h-full relative tablet-md:w-full">
            <Image src={landingSvg} alt="landing" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain"/>
          </div>
      </div>
   </div>
  );
}
