import { TCompanyProfileForm } from "@/app/(main)/profile/company/validation";
import { UseFormReturn } from "react-hook-form";

export interface IOpenPositionFormProps {
   positionId: number;
   positionUUID: string;
   positionLabel: string | undefined;
   title: string | undefined;
   description: string | undefined;
   experience: string | undefined;
   education: string | undefined;
   skills: string[];
   salary: string | undefined;
   deadlineDate: IDatePickerItemProps;
   isEdit: boolean;
   form: UseFormReturn<TCompanyProfileForm>;
   index: number;
   onRemove: () => void;
}
interface IDatePickerItemProps {
   defaultValue: Date;
   data: Date;
   onDataChange: (data: Date | undefined) => void; 
}