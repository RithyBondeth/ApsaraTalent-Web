"use client";

import { cn } from "@/lib/utils";
import { LucideEye, LucideEyeOff } from "lucide-react";
import * as React from "react";

/* ------------------------------- Helper -------------------------------- */
export interface IAuthFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix"
> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

const AuthField = React.forwardRef<HTMLInputElement, IAuthFieldProps>(
  (props: IAuthFieldProps, ref: React.Ref<HTMLInputElement>) => {
    /* ------------------------------- Props ------------------------------- */
    const {
      label,
      icon,
      error,
      type = "text",
      className,
      id,
      placeholder,
    } = props;

    /* ------------------------------- Utils ------------------------------- */
    const [reveal, setReveal] = React.useState(false);
    const generatedId = React.useId();
    const isPassword = type === "password";
    const inputType = isPassword ? (reveal ? "text" : "password") : type;

    const fieldId = id ?? props.name ?? generatedId;
    const errorId = `${fieldId}-error`;

    /* ----------------------------- Render UI ----------------------------- */
    return (
      <div className={cn("auth-field-group", className)}>
        {/* Field Label Section */}
        <label htmlFor={fieldId} className="sr-only">
          {label}
        </label>
        {/* Field Shell Section */}
        <div className="auth-field-shell" data-error={Boolean(error)}>
          {icon && (
            <span className="auth-field-icon" aria-hidden>
              {icon}
            </span>
          )}
          {/* Field Main Section */}
          <div className="auth-field-main">
            <input
              id={fieldId}
              ref={ref}
              type={inputType}
              placeholder={placeholder ?? label}
              className="auth-field-input"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              {...props}
            />
          </div>
          {/* Password Toggle Section */}
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              className="auth-field-toggle"
              onClick={() => setReveal((v) => !v)}
              aria-label={reveal ? "Hide password" : "Show password"}
            >
              {reveal ? (
                <LucideEyeOff className="size-[18px]" strokeWidth={1.6} />
              ) : (
                <LucideEye className="size-[18px]" strokeWidth={1.6} />
              )}
            </button>
          )}
        </div>
        {/* Error Message Section */}
        <p
          id={errorId}
          className="auth-field-error"
          data-visible={Boolean(error)}
          role={error ? "alert" : undefined}
          aria-hidden={!error}
        >
          {error ?? "\u00a0"}
        </p>
      </div>
    );
  },
);

AuthField.displayName = "AuthField";
export { AuthField };
