import { cn } from "@/lib/utils";
import * as React from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { TypographySmall } from "@/components/utils/typography/typography-small";

type TRHFMessage =
  | string
  | FieldError
  | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>>;

interface IInputProps extends Omit<
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

    const hasError = Boolean(message);

    return (
      <div className="relative w-full flex flex-col items-start gap-1.5">
        <div
          data-error={hasError}
          className={cn(
            "flex items-center h-12 w-full rounded-lg border border-input bg-background px-3 text-base transition-[color,border-color,box-shadow] duration-200",
            "hover:border-foreground/25",
            "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20",
            "data-[error=true]:border-destructive data-[error=true]:focus-within:border-destructive data-[error=true]:focus-within:ring-destructive/20",
            "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
        >
          {prefix && (
            <span className="mr-2 text-muted-foreground [&_svg]:size-[18px]">
              {prefix}
            </span>
          )}
          <input
            type={type}
            className={cn(
              "flex-1 min-w-0 bg-transparent outline-none placeholder:text-sm placeholder:text-muted-foreground/70",
              props.disabled ? "text-muted-foreground" : "text-foreground",
            )}
            ref={ref}
            {...props}
            aria-invalid={hasError || props["aria-invalid"]}
          />
          {suffix && (
            <span className="ml-2 text-muted-foreground [&_svg]:size-[18px] [&_svg]:cursor-pointer">
              {suffix}
            </span>
          )}
        </div>

        {hasError && (
          <TypographySmall
            className="field-validation-message text-xs text-destructive"
            title={typeof message === "string" ? message : String(message)}
          >
            {typeof message === "string" ? message : String(message)}
          </TypographySmall>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export { Input };
