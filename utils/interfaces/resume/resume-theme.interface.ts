import { IResumeDesign } from "./resume.interface";

export interface IResumeTemplateTheme {
  accent: string;
  accentSoft: string;
  background: string;
  headerBackground: string;
  headerText: string;
  text: string;
  textSecondary: string;
  muted: string;
  layout: IResumeDesign["layout"];
  font: string;
  radius: string;
  bodyFontSize: number;
  lineHeight: number;
  sidebarWidth: number;
  headerPadding: string;
  contentPadding: string;
  avatarSize: number;
  nameSize: number;
  sectionGap: number;
  experiencePadding: string;
  chipRadius: string;
  avatarRadius: string;
  sectionStyle: IResumeDesign["sectionStyle"];
  headerStyle: IResumeDesign["headerStyle"];
  columnRatio: IResumeDesign["columnRatio"];
  headerLayout: IResumeDesign["headerLayout"];
  avatarPlacement: IResumeDesign["avatarPlacement"];
  sidebarSections: IResumeDesign["sidebarSections"];
  experienceStyle: IResumeDesign["experienceStyle"];
  skillsStyle: IResumeDesign["skillsStyle"];
  educationStyle: IResumeDesign["educationStyle"];
  summaryStyle: IResumeDesign["summaryStyle"];
  decoration: IResumeDesign["decoration"];
}
