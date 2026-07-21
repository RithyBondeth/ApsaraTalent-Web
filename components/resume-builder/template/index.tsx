"use client";

import { Button } from "@/components/ui/button";
import ImagePopup from "@/components/utils/data-display/image-popup";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Check, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ITemplateCardProps } from "./props";
import { TemplateMiniPreview } from "./mini-preview";
import { useTranslations } from "next-intl";

export default function TemplateCard(props: ITemplateCardProps) {
  /* -------------------------------- All States ------------------------------ */
  const [popupResume, setPopupResume] = useState<boolean>(false);

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={`flex h-fit w-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 ease-out ${
        props.selected
          ? "-translate-y-0.5 border-brand/50 ring-4 ring-brand/10 shadow-[0_12px_32px_hsl(var(--foreground)/0.1)]"
          : "border-border/70 shadow-[0_2px_8px_hsl(var(--foreground)/0.04)] hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-[0_10px_28px_hsl(var(--foreground)/0.08)]"
      }`}
    >
      {/* Preview Area Section */}
      <div className="group relative h-60 w-full overflow-hidden border-b border-border/60 bg-[hsl(var(--illustration-surface))] p-4">
        <div className="relative mx-auto h-full max-w-[172px] overflow-hidden rounded-sm bg-white shadow-[0_8px_24px_rgba(38,35,30,0.14)] transition-transform duration-500 ease-out group-hover:scale-[1.025]">
          {props.image ? (
            <Image
              src={props.image}
              fill
              alt={props.title}
              className="object-contain object-top"
            />
          ) : (
            /* Live Theme Preview Section: real palette/layout from the theme engine */
            <TemplateMiniPreview
              templateKey={props.templateKey}
              className="absolute inset-0 origin-top"
            />
          )}

          {/* Hover Overlay with Preview Button Section */}
          {props.image && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
              <button
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-gray-900 shadow-lg transition hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setPopupResume(true);
                }}
              >
                <Eye size={14} />
                {t("preview")}
              </button>
            </div>
          )}
        </div>

        {props.selected && (
          <span className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-md">
            <Check size={14} strokeWidth={3} />
          </span>
        )}
      </div>

      {/* Card Body Section */}
      <div className="flex w-full flex-col gap-3 bg-card p-4">
        {/* Title and Description Section */}
        <div className="flex flex-col gap-1">
          <TypographyH4 className="!m-0 text-sm font-semibold leading-tight">
            {props.title}
          </TypographyH4>
          <TypographyMuted className="text-xs leading-relaxed line-clamp-2">
            {props.description}
          </TypographyMuted>
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center justify-between pt-0.5">
          <Button
            size="sm"
            className="h-9 rounded-xl px-4 text-xs"
            variant={props.selected ? "default" : "outline"}
            onClick={props.onUseTemplate}
          >
            {props.selected ? t("selectedTemplate") : t("useTemplate")}
          </Button>
        </div>
      </div>

      {/* Image Popup Section */}
      {props.image && (
        <ImagePopup
          image={props.image}
          open={popupResume}
          setOpen={setPopupResume}
        />
      )}
    </div>
  );
}
