import { TResumeTemplate } from "@/utils/types/resume/resume.type";
import { TResumeSectionID } from "@/utils/types/resume/resume-section-id.type";

export type TResumeContentSection = Exclude<TResumeSectionID, "header">;

export interface IResumeDesign {
  layout: "single" | "two-column" | "left-sidebar" | "right-sidebar";
  columnRatio: "narrow" | "balanced" | "wide";
  headerLayout: "stacked" | "split" | "centered" | "compact";
  avatarPlacement: "start" | "center" | "end";
  sidebarSections: Array<"summary" | "skills" | "education" | "careerScopes">;
  palette:
    | "ocean"
    | "cobalt"
    | "violet"
    | "emerald"
    | "amber"
    | "rose"
    | "graphite"
    | "midnight"
    | "sand";
  typography: "sans" | "serif" | "geometric" | "humanist" | "mono";
  density: "compact" | "balanced" | "spacious";
  headerStyle: "solid" | "soft" | "minimal";
  sectionStyle: "line" | "bar" | "pill" | "plain";
  cornerStyle: "square" | "soft" | "rounded";
  experienceStyle: "plain" | "cards" | "timeline";
  skillsStyle: "chips" | "grid" | "list";
  educationStyle: "plain" | "cards" | "timeline";
  summaryStyle: "plain" | "highlight" | "quote";
  decoration: "none" | "top-band" | "side-band" | "geometric";
  /** Optional user-picked #RRGGBB accent — overrides the palette's accent
   *  family (accent, soft tint, solid header). Never set by AI output. */
  customAccent?: string;
}

export interface IPersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  age?: number;
  profilePicture?: string;
  socials?: Record<string, string>;
  job?: string;
}

export interface IExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
}

export interface IBuildResume {
  personalInfo: IPersonalInfo;
  summary?: string;
  yearsOfExperience?: string;
  availability?: string;
  experience: IExperience[];
  skills: string[];
  education?: string;
  careerScopes?: string[];
  sectionOrder?: TResumeContentSection[];
  design?: IResumeDesign;
  template: TResumeTemplate;
}
