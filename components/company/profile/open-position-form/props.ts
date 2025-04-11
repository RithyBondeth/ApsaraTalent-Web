import { TOpenPositionForm } from "@/app/(main)/profile/company/validation";
import { UseFormReturn } from "react-hook-form";

export interface IOpenPositionFormProps {
   positionLabel: string | undefined;
   title: string | undefined;
   description: string | undefined;
   experience: string | undefined;
   education: string | undefined;
   skill: string[];
   salary: string | undefined;
   deadlineDate: IDatePickerItemProps;
   isEdit: boolean;
   form: UseFormReturn<TOpenPositionForm>;
   index: number;
}
interface IDatePickerItemProps {
   defaultValue: Date;
   data: Date;
   onDataChange: (data: Date | undefined) => void; 
}