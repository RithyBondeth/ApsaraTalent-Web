import { TCompanyProfileForm } from "@/app/(main)/profile/company/validation";
import { UseFormReturn } from "react-hook-form";

export interface IOpenPositionFormProps {
  positionUUID: string;
  title: string | undefined;
  description: string | undefined;
  experienceReqirement: string | undefined;
  educationRequirement: string | undefined;
  isEdit: boolean;
  form: UseFormReturn<TCompanyProfileForm>;
  index: number;
  onRemove: () => void;
}
