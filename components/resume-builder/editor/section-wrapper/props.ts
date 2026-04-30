import { TResumeSectionID } from "@/utils/types/resume/resume-section-id.type";

export interface ISectionWrapperProps {
  sectionId: TResumeSectionID;
  children: React.ReactNode;
  isDraggable?: boolean;
}
