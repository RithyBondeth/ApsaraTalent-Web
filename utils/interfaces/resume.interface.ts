export interface IResumeTemplate {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number | null;
  isPremium: boolean;
}

export type ResumeTemplate =
  | "modern"
  | "classic"
  | "creative"
  | "minimalist"
  | "timeline"
  | "bold"
  | "compact"
  | "elegant"
  | "colorful"
  | "professional"
  | "corporate"
  | "dark";
