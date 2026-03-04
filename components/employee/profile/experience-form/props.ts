import { TEmployeeProfileForm } from "@/app/(main)/profile/employee/validation";
import { UseFormReturn } from "react-hook-form";

export interface IEmployeeExperienceFormProps {
  experienceIndex: number;
  experienceUUID: string;
  title: string | undefined;
  description: string | undefined;
  startDate: IDatePickerItemProps;
  endDate: IDatePickerItemProps;
  isEdit: boolean;
  form: UseFormReturn<TEmployeeProfileForm>;
  index: number;
  onRemove: () => void;
}

interface IDatePickerItemProps {
  defaultValue: Date;
  data: Date;
  onDataChange: (data: Date | undefined) => void;
}
