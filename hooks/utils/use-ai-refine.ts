import { useState } from "react";
import { streamFetch } from "@/utils/functions/stream-fetch";
import { API_RESUME_REFINE_BIO_STREAM_URL } from "@/utils/constants/apis/resume.api.constant";

/* ---------------------------------- Types --------------------------------- */
/** Context that enriches the AI prompt for better output quality. */
export interface IRefineContext {
  // Employee bio / job title context
  jobTitle?: string;
  skills?: string[];
  experience?: string;
  availability?: string;
  careerScopes?: string[];
  // Company bio context
  companyName?: string;
  industry?: string;
  openPositions?: string[];
  benefits?: string[];
  values?: string[];
}

/* ---------------------------------- Hook ---------------------------------- */
/**
 * Real streaming AI bio / field refinement hook.
 *
 * Usage:
 *   const { isRefining, refineContent } = useAIRefine();
 *   const result = await refineContent(
 *     currentText,
 *     "summary",          // "summary" | "jobTitle" | "companyBio"
 *     contextObject,      // optional — enriches the AI prompt
 *     (text) => form.setValue("field", text, { shouldDirty: true }), // optional streaming callback
 *   );
 *   if (result) toast.success("Refined!");
 */
export function useAIRefine() {
  /* ------------------------------- All States ------------------------------- */
  const [isRefining, setIsRefining] = useState<boolean>(false);

  /* --------------------------------- Methods -------------------------------- */
  // ── Handle Refine Content ───────────────────────
  const refineContent = async (
    content: string,
    type:
      | "summary"
      | "jobTitle"
      | "companyBio"
      | "experience"
      | "achievement"
      | "skills"
      | "education",
    context?: IRefineContext,
    onChunk?: (accumulated: string) => void,
  ): Promise<string | null> => {
    setIsRefining(true);

    // Map hook type → backend API type (RefineProfileBioType enum values)
    const apiType =
      type === "summary"
        ? "employeeBio"
        : type === "jobTitle"
          ? "employeeJobTitle"
          : type === "companyBio"
            ? "companyBio"
            : type === "experience"
              ? "experienceDescription"
              : type === "achievement"
                ? "achievementBullet"
                : type === "skills"
                  ? "skillSuggestion"
                  : "educationDescription";

    let accumulated = "";

    try {
      await streamFetch(
        API_RESUME_REFINE_BIO_STREAM_URL,
        {
          method: "POST",
          body: {
            type: apiType,
            currentText: content ?? "",
            ...context,
          },
        },
        (event) => {
          if (event.t === "chunk") {
            accumulated += event.v;
            onChunk?.(accumulated);
          } else if (event.t === "error") {
            console.warn("[AI Refine] stream error:", event.v);
          }
        },
      );

      return accumulated.trim() || null;
    } catch (err) {
      console.warn("[AI Refine] fetch failed:", err);
      return null;
    } finally {
      setIsRefining(false);
    }
  };

  /* -------------------------------- Render UI ------------------------------- */
  return { isRefining, refineContent };
}
