import React from "react";

export interface IInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix" | "suffix"> {
    preffix?: React.ReactNode;
    suffix?: React.ReactNode;
}