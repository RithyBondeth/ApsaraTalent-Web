import React from "react";
import { FieldError, Message } from "react-hook-form";

export interface IInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "prefix" | "suffix"
  > {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  validationMessage?: Message
}
