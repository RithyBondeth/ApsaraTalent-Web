import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { streamFetch } from "@/utils/functions/network";
import { API_RESUME_REFINE_BIO_STREAM_URL } from "@/utils/constants/apis/resume.api.constant";

/* --------------------------------- Usage --------------------------------- */
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

/* ----------------------------------- Hook ----------------------------------- */
export function useAIRefine() {
  /* ------------------------------- All States ------------------------------- */
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const requestControllerRef = useRef<AbortController | null>(null);

  /* ------------------------------ Effects ------------------------------- */
  useEffect(
    () => () => {
      requestControllerRef.current?.abort();
    },
    [],
  );

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
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;

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
          signal: controller.signal,
        },
        (event) => {
          if (event.t === "chunk") {
            accumulated += event.v;
            onChunk?.(accumulated);
          } else if (event.t === "error") {
            console.warn("[AI Refine] stream error:", event.v);
            // The hook has no error UI of its own, so surface an AI quota /
            // rate-limit hit directly to the user.
            if (event.code === 429) toast.error(event.v);
          }
        },
      );

      return accumulated.trim() || null;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return null;
      console.warn("[AI Refine] fetch failed:", err);
      return null;
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setIsRefining(false);
      }
    }
  };

  /* -------------------------------- Render UI ------------------------------- */
  return { isRefining, refineContent };
}
