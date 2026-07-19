"use client";

import { createContext, useContext } from "react";
import { IResumeTemplateTheme } from "@/utils/interfaces/resume/resume-theme.interface";
import { RESUME_TEMPLATE_THEMES } from "@/utils/constants/resume-theme.constant";

export const ResumeTemplateThemeContext = createContext<IResumeTemplateTheme>(
  RESUME_TEMPLATE_THEMES.modern,
);

export function useResumeTemplateTheme(): IResumeTemplateTheme {
  return useContext(ResumeTemplateThemeContext);
}
