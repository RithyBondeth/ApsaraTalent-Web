import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import {
  Control,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

export interface IFormPanelProps {
  register: UseFormRegister<IBuildResume>;
  control: Control<IBuildResume>;
  setValue: UseFormSetValue<IBuildResume>;
  getValues: UseFormGetValues<IBuildResume>;
}
