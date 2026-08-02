"use client";

import { cn } from "@/lib/utils";
import { LucideEye, LucideEyeOff } from "lucide-react";
import { forwardRef, useId, useState } from "react";
import { IAuthFieldProps } from "./props";

const AuthField = forwardRef<HTMLInputElement, IAuthFieldProps>(
  (props, ref) => {
    /* ------------------------------- Props ------------------------------- */
    const {
      label,
      icon,
      error,
      type = "text",
      className,
      id,
      placeholder,
      ...inputProps
    } = props;

    /* ------------------------------- Utils ------------------------------- */
    const [reveal, setReveal] = useState<boolean>(false);
    const generatedId = useId();
    const isPassword = type === "password";
    const inputType = isPassword ? (reveal ? "text" : "password") : type;

    const fieldId = id ?? inputProps.name ?? generatedId;
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
              {...inputProps}
              id={fieldId}
              ref={ref}
              type={inputType}
              placeholder={placeholder ?? label}
              className="auth-field-input"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
          </div>
          {/* Password Toggle Section */}
          {isPassword && (
            <button
              type="button"
              className="auth-field-toggle"
              onClick={() => setReveal((value) => !value)}
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
