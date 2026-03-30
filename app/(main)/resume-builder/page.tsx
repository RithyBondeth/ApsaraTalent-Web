"use client";

import ResumeBuilderBanner from "@/components/resume-builder/banner";
import ResumeBuilderFeature from "@/components/resume-builder/feature";
import ResumeBuilderGenerate from "@/components/resume-builder/generate";
import TemplateCard from "@/components/resume-builder/template";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { useGetAllTemplateStore } from "@/stores/apis/resume/get-all-template.store";
import { useResumeEditStore } from "@/stores/apis/resume/resume-edit.store";
import { useTemplateSelectionStore } from "@/stores/apis/resume/template-selection.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { buildResumePayloadFromUser } from "./_utils/build-payload";
import { TResumeTemplate } from "@/utils/types/resume/resume.type";
import ResumeBuilderLoadingSkeleton from "@/components/resume-builder/skeleton";

// Module-level flag so templates are only fetched once per app session
let hasFetchedTemplates = false;

export default function ResumeBuilder() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const { setPayload } = useResumeEditStore();
  const { setSelectedTemplate, selectedTemplate } = useTemplateSelectionStore();

  /* ----------------------------- API Integration ---------------------------- */
  // API state
  const { templateData, queryAllTemplates } = useGetAllTemplateStore();
  const currentUser = useGetCurrentUserStore((state) => state.user);

  /* -------------------------------- All States ------------------------------ */
  // Maps DB template titles → ResumeTemplate enum values
  const templateMap: Record<string, TResumeTemplate> = {
    "Modern Professional": "modern",
    "Classic Professional": "classic",
    "Creative Design": "creative",
    "Minimalist Pro": "minimalist",
    "Timeline Resume": "timeline",
    "Bold Statement": "bold",
    "Compact One-Page": "compact",
    "Elegant Style": "elegant",
    "Colorful Vibrant": "colorful",
    "Professional Clean": "professional",
    "Corporate Executive": "corporate",
    "Dark Mode": "dark",
    // Legacy / alternate names
    "Corporate Standard": "corporate",
    Minimalist: "minimalist",
    Modern: "modern",
    Classic: "classic",
    Creative: "creative",
  };

  const validKeys: TResumeTemplate[] = [
    "modern",
    "classic",
    "creative",
    "minimalist",
    "timeline",
    "bold",
    "compact",
    "elegant",
    "colorful",
    "professional",
    "corporate",
    "dark",
  ];

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    if (hasFetchedTemplates) return;
    hasFetchedTemplates = true;
    queryAllTemplates();
  }, [queryAllTemplates]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Template Selection ─────────────────────────────────────────
  const handleSelectTemplate = (templateTitle: string) => {
    const mapped = templateMap[templateTitle];
    const titleAsKey = templateTitle.toLowerCase() as TResumeTemplate;
    const template =
      mapped ?? (validKeys.includes(titleAsKey) ? titleAsKey : null);
    if (template) {
      setSelectedTemplate(template);
    } else {
      console.warn("Unrecognized template title:", templateTitle);
    }
  };

  // ── Handle Generate Resume Payload ─────────────────────────────────────
  const handleGenerate = () => {
    if (!currentUser || !currentUser.employee) return;
    if (!selectedTemplate) return;
    const payload = buildResumePayloadFromUser(currentUser, selectedTemplate);
    setPayload(payload);
    router.push("/resume-builder/edit");
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col items-start gap-5 px-2.5 sm:px-5 lg:px-8 animate-page-in">
      {/* Banner Section */}
      <ResumeBuilderBanner />

      {/* Template Grid Section */}
      <div className="w-full">
        <div className="w-full flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
          <TypographyH4>Choose your template</TypographyH4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 my-3">
          {templateData && templateData.length > 0 ? (
            templateData.map((resume) => {
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
          ) : (
            <ResumeBuilderLoadingSkeleton />
          )}
        </div>
      </div>

      {/* Features Section */}
      <ResumeBuilderFeature />

      {/* Generate Section */}
      <ResumeBuilderGenerate
        disabled={!selectedTemplate}
        onGenerateClick={handleGenerate}
      />
    </div>
  );
}
