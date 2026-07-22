"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { useId } from "react";
import { IAuthDateFieldProps } from "./props";

export function AuthDateField(props: IAuthDateFieldProps) {
  /* ------------------------------- Props ------------------------------- */
  const {
    label,
    date,
    onDateChange,
    icon,
    error,
    dateFormat = "dd MMM yyyy",
    className,
  } = props;

  /* ------------------------------- Utils ------------------------------- */
  const errorId = useId();

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <div className={cn("auth-field-group", className)}>
      {/* Field Shell Section */}
      <div className="auth-field-shell" data-error={Boolean(error)}>
        {icon && (
          <span className="auth-field-icon" aria-hidden>
            {icon}
          </span>
        )}
        {/* Field Main Section */}
        <div className="auth-field-main flex items-center">
          <DatePicker
            date={date}
            onDateChange={onDateChange}
            placeholder={label}
            dateFormat={dateFormat}
            className="auth-control-trigger [&>svg]:opacity-50"
            aria-label={label}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
          />
        </div>
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
}
