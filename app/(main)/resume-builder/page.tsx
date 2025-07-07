import ResumeBuilderBanner from "@/components/resume-builder/banner";
import ResumeBuilderFeature from "@/components/resume-builder/feature";
import ResumeBuilderGenerate from "@/components/resume-builder/generate";
import TemplateCard from "@/components/resume-builder/template";
import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";

export default function ResumeBuilder() {
  return (
    <div className="w-full flex flex-col items-start gap-5 px-10">
      <ResumeBuilderBanner />
      <div className="w-full">
        <div className="w-full flex justify-between items-center">
          <TypographyH4>Choose your template</TypographyH4>
          <div className="flex items-center gap-2">
            <Button className="text-xs">All</Button>
            <Button className="text-xs">Free</Button>
            <Button className="text-xs">Premium</Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 my-3">
          {[1, 2, 3].map((template) => (
            <TemplateCard
              key={template}
              isPremium={true}
              price={1.99}
              image="https://resumesector.com/wp-content/uploads/2024/12/Modern-Resume-728x1024.jpg"
              title="Modern Professional"
              description="Clean and minimalist design perfect for tech professionals"
              onUseTemplate={() => {}}
            />
          ))}
        </div>
      </div>
      <ResumeBuilderFeature />
      <ResumeBuilderGenerate />
    </div>
  );
}
