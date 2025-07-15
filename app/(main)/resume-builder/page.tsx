"use client";

import ResumeBuilderBanner from "@/components/resume-builder/banner";
import ResumeBuilderFeature from "@/components/resume-builder/feature";
import ResumeBuilderGenerate from "@/components/resume-builder/generate";
import TemplateCard from "@/components/resume-builder/template";
import TemplateCardSkeleton from "@/components/resume-builder/template/skeleton";
import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { useGetAllTemplateStore } from "@/stores/apis/resume/get-all-template.store";
import { getUnifiedAccessToken } from "@/utils/auth/get-access-token";
import { useEffect, useState } from "react";

export default function ResumeBuilder() {
  const { loading, error, templateData, queryAllTemplates } = useGetAllTemplateStore();
  const accessToken = getUnifiedAccessToken();

  useEffect(() => {
    if (accessToken) queryAllTemplates(accessToken);
  }, [accessToken]);

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
          {templateData && templateData.length > 0 ? (
            templateData.map((resume) => (
              <TemplateCard
                key={resume.id}
                isPremium={resume.isPremium}
                price={resume.price!}
                image={resume.image}
                title={resume.title}
                description={resume.description}
                onUseTemplate={() => {}}
              />
            ))
          ) : (
            <TemplateCardSkeleton />
          )}
        </div>
      </div>
      <ResumeBuilderFeature />
      <ResumeBuilderGenerate />
    </div>
  );
}
