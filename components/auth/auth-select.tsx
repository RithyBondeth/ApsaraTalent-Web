"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ------------------------------- Helpers -------------------------------- */
export interface IAuthSelectOption {
  value: string;
  label: string;
}

export interface IAuthSelectProps {
  label: string;
  options: IAuthSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
}

export function AuthSelect(props: IAuthSelectProps) {
  /* ------------------------------- Props -------------------------------- */
  const { label, options, value, onValueChange, icon, error, className } =
    props;

  /* ------------------------------- Utils --------------------------------- */
  const errorId = React.useId();

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
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
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
