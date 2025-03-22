import React from "react";

export interface IInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix" | "suffix"> {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    validationMessage?: string;
}