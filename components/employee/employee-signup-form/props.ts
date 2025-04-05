import { UseFormRegister, FieldValues, FieldErrors, Control, UseFormSetValue, UseFormGetValues, UseFormTrigger } from "react-hook-form";

export interface IStepFormProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    control?: Control<T>;
    errors?: FieldErrors<T>;
    setValue?: UseFormSetValue<T>;
    getValues?: UseFormGetValues<T>;
    trigger?: UseFormTrigger<T>;
}