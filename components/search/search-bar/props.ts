import { FieldErrors, FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form"

export type TSearchBarProps<T extends FieldValues> = {
    register: UseFormRegister<T>;
    setValue: UseFormSetValue<T>;
    errors?: FieldErrors<T>;
}