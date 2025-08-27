import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import Image from "next/image";
import resumeBuilderImageSvg from "@/assets/svg/resume-builder-banner.svg";

export default function ResumeBuilderBanner() {
  return (
    <div className="w-full flex items-center justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center">
      <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center tablet-xl:mt-5">
        <TypographyH2 className="leading-relaxed tablet-xl:text-center">
          AI-Powered Resume Builder
        </TypographyH2>
        <TypographyH4 className="leading-relaxed tablet-xl:text-center">
          Build your beautiful resume with a smartest AI.
        </TypographyH4>
        <TypographyH4 className="leading-relaxed tablet-xl:text-center">
          Join thousands of professionals who landed their dream jobs with our
          AI-powered resumes.
        </TypographyH4>
        <TypographyMuted className="leading-relaxed tablet-xl:text-center">
          Create professional resumes in minutes with AI-powered technology.
          Choose from premium templates and let our AI optimize your content for
          maximum impact.
        </TypographyMuted>
      </div>
      <Image
        src={resumeBuilderImageSvg}
        alt="feed"
        height={300}
        width={400}
        className="tablet-xl:!w-full"
      />
    </div>
  );
}
