import Header from "@/components/header";
import { TypographyH1 } from "@/components/utils/typography/typography-h1";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import Image from "next/image";
import { landingSvg } from "@/utils/constants/asset.constant";
import { ParticlesWrapper } from "@/components/utils/particles-wrapper";

/*-------------------------------------------- Render UI --------------------------------------------*/
export default function IndexPage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col lg:flex-row lg:items-center lg:justify-between overflow-hidden">
      {/* Animation Background Section */}
      <ParticlesWrapper />

      {/* Header Section */}
      <Header className="absolute top-0 left-0 right-0 z-20" />

      {/* Content Section */}
      <div className="w-full z-10 h-fit flex justify-center items-center lg:w-1/2 pt-24 pb-8 sm:pt-28 lg:pt-0 lg:pb-0">
        <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col items-start gap-4 sm:gap-5 mb-8 sm:mb-10">
            <TypographyH1 className="!leading-normal">
              Empowering Connections Between Talent and Opportunity
            </TypographyH1>
            <TypographyMuted className="!leading-loose text-md">
              Whether you’re a freelancer seeking new opportunities or a
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

      {/* Image Poster Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 pb-8 lg:px-0 lg:pb-0">
        <div className="relative w-full max-w-[560px] lg:max-w-none lg:w-[85%] h-[260px] sm:h-[340px] md:h-[380px] lg:h-[420px] xl:h-[520px]">
          <Image
            src={landingSvg}
            alt="landing"
            fill
            className="object-contain"
            sizes="(max-width: 1023px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
