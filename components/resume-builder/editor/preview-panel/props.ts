import { IBuildResume } from "@/utils/interfaces/resume";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

export interface IPreviewPanelProps {
  data: IBuildResume;
  setValue: UseFormSetValue<IBuildResume>;
  getValues: UseFormGetValues<IBuildResume>;
  updating?: boolean;
}
