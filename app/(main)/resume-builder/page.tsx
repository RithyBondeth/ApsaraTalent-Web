"use client";

import ResumeBuilderBanner from "@/components/resume-builder/banner";
import ResumeBuilderFeature from "@/components/resume-builder/feature";
import ResumeBuilderGenerate from "@/components/resume-builder/generate";
import TemplateCard from "@/components/resume-builder/template";
import TemplateCardSkeleton from "@/components/resume-builder/template/skeleton";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { useGetAllTemplateStore } from "@/stores/apis/resume/get-all-template.store";
import { useTemplateSelectionStore } from "@/stores/apis/resume/template-selection.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";

import { useEffect, useState } from "react";
import { buildResumePayloadFromUser } from "./_utils/build-payload";
import { generateResumeAPI } from "./_apis/generate-resume.api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import ApsaraLoadingSpinner from "@/components/utils/apsara-loading-spinner";

export default function ResumeBuilder() {
  const { templateData, queryAllTemplates } = useGetAllTemplateStore();
  
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    queryAllTemplates();
  }, [queryAllTemplates]);

  const { setSelectedTemplate, selectedTemplate } = useTemplateSelectionStore();

  const templateMap: Record<string, "modern" | "classic" | "creative"> = {
    "Minimalist Pro": "modern",
    "Modern Professional": "classic",
    "Corporate Standard": "creative",
  };

  const handleSelectTemplate = (templateTitle: string) => {
    const template = templateMap[templateTitle];
    if (template) {
      setSelectedTemplate(template);
    } else {
      console.warn("Unrecognized template title:", templateTitle);
    }
  };

  useEffect(() => {
    console.log("Current User: ", currentUser?.employee);
  })

  return (
    <div className="w-full flex flex-col items-start gap-5 px-10">
      <ResumeBuilderBanner />
      <div className="w-full">
        <div className="w-full flex justify-between items-center">
          <TypographyH4>Choose your template</TypographyH4>
        </div>
        <div className="grid grid-cols-3 gap-3 my-3">
          {templateData && templateData.length > 0
            ? templateData.map((resume) => {
                const mapped = templateMap[resume.title];
                const isSelected = mapped && selectedTemplate === mapped;
                return (
                  <TemplateCard
                    key={resume.id}
                    isPremium={resume.isPremium}
                    price={resume.price!}
                    image={resume.image}
                    title={resume.title}
                    description={resume.description}
                    onUseTemplate={() => handleSelectTemplate(resume.title)}
                    selected={!!isSelected}
                  />
                );
              })
            : [1, 2, 3].map((item) => <TemplateCardSkeleton key={item} />)}
        </div>
      </div>
      <ResumeBuilderFeature />
      <ResumeBuilderGenerate disabled={!selectedTemplate} onGenerateClick={async () => {
        if (!currentUser || !currentUser.employee) return;
        if (!selectedTemplate) return;
        const template = selectedTemplate ?? "creative";
        const payload = buildResumePayloadFromUser(currentUser, template);
        setGenerating(true);
        try {
          const result = await generateResumeAPI(payload);
          // Decode base64 and create Blob
          const byteCharacters = atob(result.data);
          const byteNumbers = new Array(byteCharacters.length)
            .fill(null)
            .map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: result.mimeType });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = result.filename || "resume.pdf";
          link.click();
        } catch (error) {
          console.error("Failed to generate resume:", error);
        } finally {
          setGenerating(false);
        }
      }}/>

      <Dialog open={generating}>
        <DialogContent>
          <div className="w-full flex flex-col items-center justify-center gap-3 py-4">
            <ApsaraLoadingSpinner size={80} loop/>
            <DialogTitle>Generating your resume…</DialogTitle>
            <TypographyMuted className="text-center">
              This may take a few seconds. Please don’t close the tab.
            </TypographyMuted>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
