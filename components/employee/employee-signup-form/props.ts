import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";

export interface IStepFormProps<
  T extends FieldValues,
  TParsed extends FieldValues = T,
> {
  register: UseFormRegister<T>;
  control?: Control<T, unknown, TParsed>;
  errors?: FieldErrors<T>;
  setValue?: UseFormSetValue<T>;
  getValues?: UseFormGetValues<T>;
  trigger?: UseFormTrigger<T>;
  showErrors?: boolean;
}
