import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyLead } from "@/components/utils/typography/typography-lead";
import {
  LucideChartSpline,
  LucidePencilRuler,
  LucideSearch,
} from "lucide-react";

export default function ResumeBuilderFeature() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col items-center gap-10 p-5 rounded-md shadow-md">
      {/* Title Section */}
      <TypographyH4>AI-Powered Features</TypographyH4>
      <div className="flex justify-between items-start gap-5 tablet-lg:flex-col">
        {/* Feature 1 Card Section */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-5 rounded-full bg-blue-100">
            <LucidePencilRuler
              className="text-blue-500 size-10"
              strokeWidth={"1.3px"}
            />
          </div>
          <TypographyLead className="text-md text-center text-primary font-medium">
            Smart Content Optimization
          </TypographyLead>
          <TypographyLead className="text-sm text-center">
            AI analyzes your experience and optimizes descriptions for maximum
            impact
          </TypographyLead>
        </div>

        {/* Feature 2 Card Section */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-5 rounded-full bg-green-100">
            <LucideSearch
              className="text-green-500 size-10"
              strokeWidth={"1.3px"}
            />
          </div>
          <TypographyLead className="text-md text-center text-primary font-medium">
            Smart Content Optimization
          </TypographyLead>
          <TypographyLead className="text-sm text-center">
            AI analyzes your experience and optimizes descriptions for maximum
            impact
          </TypographyLead>
        </div>

        {/* Feature 3 Card Section */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-5 rounded-full bg-purple-100">
            <LucideChartSpline
              className="text-purple-500 size-10"
              strokeWidth={"1.3px"}
            />
          </div>
          <TypographyLead className="text-md text-center text-primary font-medium">
            Smart Content Optimization
          </TypographyLead>
          <TypographyLead className="text-sm text-center">
            AI analyzes your experience and optimizes descriptions for maximum
            impact
          </TypographyLead>
        </div>
      </div>
    </div>
  );
}
