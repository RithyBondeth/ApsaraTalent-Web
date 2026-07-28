import * as React from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

import { cn } from "@/lib/utils";
import { TypographySmall } from "@/components/utils/typography/typography-small";

type RHFMessage =
  | string
  | FieldError
  | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>>;

interface TextareaProps extends Omit<
  React.ComponentProps<"textarea">,
  "prefix"
> {
  autoResize?: boolean;
  validationMessage?: RHFMessage;
  prefix?: React.ReactNode;
  action?: React.ReactNode;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      autoResize = false,
      validationMessage,
      prefix,
      action,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(
      ref,
      () => textareaRef.current as HTMLTextAreaElement,
    );

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (textarea && autoResize) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [autoResize]);

    React.useEffect(() => {
      adjustHeight();
    }, [props.value, adjustHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        adjustHeight();
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

    const message =
      typeof validationMessage === "string"
        ? validationMessage
        : validationMessage?.message;
    const hasError = Boolean(message);
    const validationMessageId = `${props.id ?? generatedId}-validation`;
    const describedBy = [
      props["aria-describedby"],
      hasError ? validationMessageId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className="relative w-full flex flex-col items-start gap-1">
        <div className="relative w-full">
          {prefix && (
            <span className="pointer-events-none absolute left-3 top-3.5 z-10 text-muted-foreground [&_svg]:size-[18px]">
              {prefix}
            </span>
          )}
          {action && (
            <span className="absolute right-2 top-2 z-10">{action}</span>
          )}
          <textarea
            {...props}
            ref={textareaRef}
            onChange={handleChange}
            aria-invalid={hasError || props["aria-invalid"]}
            aria-describedby={describedBy}
            className={cn(
              "flex min-h-[80px] w-full rounded-none border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm !leading-loose",
              prefix && "pl-10",
              action && "pr-24",
              autoResize && "resize-none overflow-hidden",
              className,
            )}
          />
        </div>
        {hasError && (
          <TypographySmall
            id={validationMessageId}
            role="alert"
            className="field-validation-message field-validation-message-textarea text-xs text-red-500"
            title={typeof message === "string" ? message : String(message)}
          >
            {typeof message === "string" ? message : String(message)}
          </TypographySmall>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
