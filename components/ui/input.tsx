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
    const generatedId = React.useId();
    const message =
      typeof validationMessage === "string"
        ? validationMessage
        : validationMessage?.message;

    const hasError = Boolean(message);
    const validationMessageId = `${props.id ?? generatedId}-validation`;
    const describedBy =
      [props["aria-describedby"], hasError ? validationMessageId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className="relative flex w-full flex-col items-start gap-1.5">
        <div
          data-error={hasError}
          className={cn(
            "flex h-12 w-full items-center rounded-md border border-input bg-background px-3 text-base transition-[color,border-color,box-shadow] duration-200",
            "hover:border-foreground/40",
            // A hard 2px ring with no alpha falloff. The old 3px/20% ring read
            // as a soft glow, which is the one lighting effect this UI avoids.
            "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring",
            "data-[error=true]:border-destructive data-[error=true]:focus-within:border-destructive data-[error=true]:focus-within:ring-destructive",
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
              "min-w-0 flex-1 bg-transparent outline-none placeholder:text-sm placeholder:text-muted-foreground/70",
              props.disabled ? "text-muted-foreground" : "text-foreground",
            )}
            ref={ref}
            {...props}
            aria-invalid={hasError || props["aria-invalid"]}
            aria-describedby={describedBy}
          />
          {suffix && (
            <span className="ml-2 text-muted-foreground [&_svg]:size-[18px] [&_svg]:cursor-pointer">
              {suffix}
            </span>
          )}
        </div>

        {hasError && (
          <TypographySmall
            id={validationMessageId}
            role="alert"
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
