"use client";

import ResumeBuilderBanner from "@/components/resume-builder/banner";
import ResumeBuilderFeature from "@/components/resume-builder/feature";
import ResumeBuilderGenerate from "@/components/resume-builder/generate";
import TemplateCard from "@/components/resume-builder/template";
import TemplateCardSkeleton from "@/components/resume-builder/template/skeleton";
import LoadingDialog, {
  LoadingStep,
} from "@/components/utils/dialogs/loading-dialog";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { useGetAllTemplateStore } from "@/stores/apis/resume/get-all-template.store";
import { useTemplateSelectionStore } from "@/stores/apis/resume/template-selection.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { generateResumeAPI, ResumeTemplate } from "./_apis/generate-resume.api";
import { buildResumePayloadFromUser } from "./_utils/build-payload";

let hasFetchedTemplates = false;
export default function ResumeBuilder() {
  const { toast } = useToast();

  // Template Helpers
  const [generating, setGenerating] = useState<boolean>(false);
  const [genProgress, setGenProgress] = useState<number>(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setSelectedTemplate, selectedTemplate } = useTemplateSelectionStore();

  /** Simulated build steps shown inside the loading dialog */
  const RESUME_STEPS: LoadingStep[] = [
    { label: "Reading your profile data", completeAt: 15 },
    { label: "Crafting your professional summary", completeAt: 30 },
    { label: "Laying out work experience", completeAt: 50 },
    { label: "Designing skills & education", completeAt: 65 },
    { label: "Applying template styling", completeAt: 80 },
    { label: "Rendering PDF", completeAt: 93 },
    { label: "Finalising & compressing", completeAt: 99 },
  ];

  /**
   * Starts a simulated progress ticker that crawls toward `cap`
   * without ever reaching it (real completion handled separately).
   */
  const startProgress = (cap: number = 95) => {
    setGenProgress(0);
    let current = 0;
    progressTimerRef.current = setInterval(() => {
      // Increment slows down as it approaches the cap
      const increment = Math.max(0.4, (cap - current) * 0.035);
      current = Math.min(cap, current + increment);
      setGenProgress(current);
      if (current >= cap) {
        clearInterval(progressTimerRef.current!);
      }
    }, 300);
  };

  const stopProgress = (finalValue: number = 100) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setGenProgress(finalValue);
  };

  // Maps DB template titles → ResumeTemplate enum values.
  // Add or adjust entries here as new templates are seeded into the database.
  const templateMap: Record<string, ResumeTemplate> = {
    // Standard names
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
    // Legacy / alternate names kept for backwards compatibility
    "Corporate Standard": "corporate",
    Minimalist: "minimalist",
    Modern: "modern",
    Classic: "classic",
    Creative: "creative",
  };

  // API Integration
  const { templateData, queryAllTemplates } = useGetAllTemplateStore();
  const currentUser = useGetCurrentUserStore((state) => state.user);

  // Query All Templates Effect
  useEffect(() => {
    if (hasFetchedTemplates) return;

    hasFetchedTemplates = true;
    queryAllTemplates();
  }, [queryAllTemplates]);

  // Handle Select Template
  const handleSelectTemplate = (templateTitle: string) => {
    const validKeys: ResumeTemplate[] = [
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
    const mapped = templateMap[templateTitle];
    const titleAsKey = templateTitle.toLowerCase() as ResumeTemplate;
    const template =
      mapped ?? (validKeys.includes(titleAsKey) ? titleAsKey : null);
    if (template) {
      setSelectedTemplate(template);
    } else {
      console.warn("Unrecognized template title:", templateTitle);
    }
  };

  return (
    <div className="w-full flex flex-col items-start gap-5 px-10">
      {/* Banner Section */}
      <ResumeBuilderBanner />

      {/* Template Section */}
      <div className="w-full">
        <div className="w-full flex justify-between items-center">
          <TypographyH4>Choose your template</TypographyH4>
        </div>
        <div className="grid grid-cols-3 gap-3 my-3 tablet-lg:grid-cols-1">
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
            : Array.from({ length: 12 }, (_, i) => (
                <TemplateCardSkeleton key={i} />
              ))}
        </div>
      </div>

      {/* Resume Feature Section */}
      <ResumeBuilderFeature />

      {/* Resume Generator Section */}
      <ResumeBuilderGenerate
        disabled={!selectedTemplate}
        onGenerateClick={async () => {
          if (!currentUser || !currentUser.employee) return;
          if (!selectedTemplate) return;
          const template = selectedTemplate;
          const payload = buildResumePayloadFromUser(currentUser, template);
          setGenerating(true);
          startProgress(95);
          try {
            const result = await generateResumeAPI(payload);
            // Snap to 100% before closing
            stopProgress(100);
            await new Promise((r) => setTimeout(r, 600));
            // Decode base64 and create Blob
            const byteCharacters = atob(result.data);
            const byteNumbers = new Array(byteCharacters.length)
              .fill(null)
              .map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: result.mimeType });
            const link = document.createElement("a");
            const objectUrl = window.URL.createObjectURL(blob);
            link.href = objectUrl;
            link.download = result.filename || "resume.pdf";
            link.click();
            window.URL.revokeObjectURL(objectUrl);
          } catch (error) {
            console.error("Failed to generate resume:", error);
            stopProgress(0);
            toast({
              title: "Resume generation failed",
              description: "Something went wrong. Please try again.",
              variant: "destructive",
            });
          } finally {
            setGenerating(false);
          }
        }}
      />

      {/* Loading Dialog Section */}
      <LoadingDialog
        loading={generating}
        title="Generating your resume..."
        steps={RESUME_STEPS}
        progress={genProgress}
      />
    </div>
  );
}
