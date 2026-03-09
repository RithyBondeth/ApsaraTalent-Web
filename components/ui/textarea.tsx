import * as React from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

import { cn } from "@/lib/utils";
import { TypographySmall } from "../utils/typography/typography-small";

type RHFMessage = string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  autoResize?: boolean;
  validationMessage?: RHFMessage;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, validationMessage, ...props }, ref) => {
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

    return (
      <div className="w-full flex flex-col items-start gap-1">
        <textarea
          {...props}
          ref={textareaRef}
          onChange={handleChange}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm !leading-loose",
            autoResize && "resize-none overflow-hidden",
            className,
          )}
        />
        {Boolean(message) && (
          <TypographySmall className="text-xs text-red-500">
            {typeof message === "string" ? message : String(message)}
          </TypographySmall>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
