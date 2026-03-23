import { cn } from "@/lib/utils";
import * as React from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { TypographySmall } from "../utils/typography/typography-small";

type TRHFMessage =
  | string
  | FieldError
  | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>>;

export interface IInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix" | "suffix"
> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  validationMessage?: TRHFMessage;
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  ({ className, type, prefix, suffix, validationMessage, ...props }, ref) => {
    const message =
      typeof validationMessage === "string"
        ? validationMessage
        : validationMessage?.message;

    return (
      <div className="w-full flex flex-col items-start gap-1">
        <div
          className={cn(
            "flex items-center h-12 w-full rounded-md border border-input bg-background px-3 text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
        >
          {prefix && (
            <span className="mr-2 text-muted-foreground">{prefix}</span>
          )}
          <input
            type={type}
            className={cn(
              "flex-1 bg-transparent outline-none placeholder:text-sm",
              props.disabled ? "text-muted-foreground" : "text-foreground",
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <span className="ml-2 text-muted-foreground">{suffix}</span>
          )}
        </div>

        {Boolean(message) && (
          <TypographySmall className="text-xs text-red-500">
            {typeof message === "string" ? message : String(message)}
          </TypographySmall>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export { Input };
