export interface IExperienceSuggestion {
  index: number;
  improvedDescription: string;
  improvedAchievements: string[];
}

export interface IOptimizeResumeResponse {
  overallFeedback: string;
  suggestedSummary: string;
  experienceSuggestions: IExperienceSuggestion[];
  suggestedSkills: string[];
}

export interface IGenerateCoverLetterPdfResponse {
  filename: string;
  mimeType: string;
  data: string; // base64
}

export interface IAiMatchExplanationResponse {
  score: number;
  verdict: string;
  explanation: string;
  strengths: string[];
  gaps: string[];
}

export interface IAiInterviewPrepQuestion {
  question: string;
  questionKm: string;
  category: string;
  tip: string;
  tipKm: string;
}

export interface ISkillGapMissing {
  t: "missing";
  skill: string;
  criticality: "high" | "medium" | "low";
  positions: string[];
  tip: string;
}

export interface ISkillGapSummary {
  t: "summary";
  overallGap: "none" | "small" | "moderate" | "large";
  estimatedWeeks: number;
  topPriority: string;
}
