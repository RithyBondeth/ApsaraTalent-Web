"use client";

import {
  LucideCircleCheck,
  LucideInfo,
  LucideLoaderCircle,
  LucideOctagonX,
  LucideTriangleAlert,
  LucideX,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme, theme = "system" } = useTheme();
  const statusIconClassName = "apsara-toast-status-icon";

  return (
    <Sonner
      {...props}
      theme={(props.theme ?? resolvedTheme ?? theme) as ToasterProps["theme"]}
      position={props.position ?? "bottom-right"}
      expand={props.expand ?? true}
      visibleToasts={props.visibleToasts ?? 4}
      duration={props.duration ?? 4500}
      gap={props.gap ?? 10}
      closeButton={props.closeButton ?? true}
      richColors={props.richColors ?? false}
      dir={props.dir ?? "auto"}
      offset={props.offset ?? { right: 20, bottom: 20 }}
      mobileOffset={props.mobileOffset ?? 12}
      swipeDirections={props.swipeDirections ?? ["right", "bottom"]}
      containerAriaLabel={props.containerAriaLabel ?? "Notifications"}
      className={["apsara-toaster", props.className].filter(Boolean).join(" ")}
      icons={{
        success: (
          <LucideCircleCheck aria-hidden className={statusIconClassName} />
        ),
        info: <LucideInfo aria-hidden className={statusIconClassName} />,
        warning: (
          <LucideTriangleAlert aria-hidden className={statusIconClassName} />
        ),
        error: <LucideOctagonX aria-hidden className={statusIconClassName} />,
        loading: (
          <LucideLoaderCircle
            aria-hidden
            className={`${statusIconClassName} apsara-toast-spinner`}
          />
        ),
        close: <LucideX aria-hidden className="apsara-toast-close-icon" />,
        ...props.icons,
      }}
      style={{
        fontFamily: "var(--font-ubuntu), var(--font-kantumruy), sans-serif",
        ...props.style,
      }}
      toastOptions={{
        unstyled: true,
        closeButton: true,
        ...props.toastOptions,
        classNames: {
          toast: "apsara-toast",
          title: "apsara-toast-title",
          description: "apsara-toast-description",
          content: "apsara-toast-content",
          icon: "apsara-toast-icon",
          loader: "apsara-toast-loader",
          actionButton: "apsara-toast-action",
          cancelButton: "apsara-toast-cancel",
          closeButton: "apsara-toast-close",
          success: "apsara-toast-success",
          info: "apsara-toast-info",
          warning: "apsara-toast-warning",
          error: "apsara-toast-error",
          loading: "apsara-toast-loading",
          default: "apsara-toast-default",
          ...props.toastOptions?.classNames,
        },
      }}
    />
  );
};

export { Toaster };
