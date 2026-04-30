import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

export interface ICanvasTemplateProps {
  data: IBuildResume;
  setValue: UseFormSetValue<IBuildResume>;
  getValues: UseFormGetValues<IBuildResume>;
}
