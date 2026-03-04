import { TEmployeeProfileForm } from "@/app/(main)/profile/employee/validation";
import { UseFormReturn } from "react-hook-form";

export interface IEmployeeEducationFormProps {
  educationIndex: number;
  educationUUID: string;
  school: string | undefined;
  degree: string | undefined;
  year: IDatePickerItemProps;
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
