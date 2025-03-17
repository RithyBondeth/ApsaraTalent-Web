import { UseFormRegister, FieldValues } from "react-hook-form";

export interface IStepFormProps<T extends FieldValues> {
    register: UseFormRegister<T>;
}