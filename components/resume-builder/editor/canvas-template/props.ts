import { IBuildResume } from "@/utils/interfaces/resume-interface/resume.interface";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

export interface ICanvasTemplateProps {
  data: IBuildResume;
  setValue: UseFormSetValue<IBuildResume>;
  getValues: UseFormGetValues<IBuildResume>;
}
