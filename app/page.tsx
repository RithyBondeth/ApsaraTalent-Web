import Header from "@/components/header";
import Image from "next/image";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import landingSvg from "@/assets/svg/landing.svg";
import ParticlesBackground from "@/components/utils/particle-background";
import { TypographyH1 } from "@/components/utils/typography/typography-h1";

export default function IndexPage() {
  return (
    <div className="h-screen flex items-start justify-between relative tablet-md:flex-col tablet-md:h-screen tablet-md:overflow-hidden tablet-md:justify-start">
      <ParticlesBackground />
      <Header className="absolute top-0 left-0 right-0 z-20" />
      <div className="w-1/2 z-10 h-full flex justify-center items-center tablet-md:w-full tablet-md:h-1/3 tablet-md:pt-16 tablet-md:mt-10 phone-xl:!mt-16 phone-340:!mt-24">
        <div className="size-[70%] tablet-md:w-full tablet-md:h-full tablet-md:px-6 tablet-md:flex tablet-md:-col tablet-md:justify-center tablet-xl:flex tablet-xl:justify-center tablet-xl:items-center">
          <div className="flex flex-col items-start gap-5 mb-10 tablet-md:gap-3 tablet-md:mb-0 tablet-md:text-left tablet-md:items-center h-fit">
            <TypographyH1 className="!leading-tight tablet-sm:text-3xl phone-lg:!text-2xl tablet-md:!leading-tight">
              Empowering Connections Between Talent and Opportunity
            </TypographyH1>
            <TypographyMuted className="!leading-relaxed tablet-md:text-md">
              Whether you&apos;re a freelancer seeking new opportunities or a
              professional advancing your career, our platform connects you with
              the right opportunities.
              <span className="tablet-md:hidden">
                For businesses and employers, find top-tier talent to drive
                success and innovation.
              </span>
            </TypographyMuted>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center items-center tablet-md:w-full tablet-md:h-1/2 phone-340:hidden">
        <div className="w-[85%] h-full relative tablet-md:w-full tablet-md:h-full tablet-md:max-h-full">
          <Image
            src={landingSvg}
            alt="landing"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain tablet-md:object-scale-down"
          />
        </div>
      </div>
    </div>
  );
}
