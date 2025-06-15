import { FieldErrors, FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form"
import { TLocations } from "@/utils/types/location.type"

export type TSearchBarProps<T extends FieldValues> = {
    register: UseFormRegister<T>;
    setValue: UseFormSetValue<T>;
    errors?: FieldErrors<T>;
    initialLocation?: TLocations;
}