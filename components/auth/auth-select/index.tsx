"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useId } from "react";
import { IAuthSelectProps } from "./props";

export function AuthSelect(props: IAuthSelectProps) {
  /* ------------------------------- Props -------------------------------- */
  const { label, options, value, onValueChange, icon, error, className } =
    props;

  /* ------------------------------- Utils --------------------------------- */
  const errorId = useId();

  /* ------------------------------ Render UI ------------------------------- */
  return (
    <div className={cn("auth-field-group", className)}>
      {/* Field Shell Section */}
      <div className="auth-field-shell" data-error={Boolean(error)}>
        {icon && (
          <span className="auth-field-icon" aria-hidden>
            {icon}
          </span>
        )}
        <div className="auth-field-main flex items-center">
          <Select value={value || ""} onValueChange={onValueChange}>
            <SelectTrigger
              className="auth-control-trigger justify-between [&>svg]:opacity-50"
              aria-label={label}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            >
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
