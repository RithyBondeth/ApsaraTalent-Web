"use client";

import { Button } from "@/components/ui/button";
import ImagePopup from "@/components/utils/data-display/image-popup";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideCheck, LucideEye } from "lucide-react";
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
    <article
      className={`group h-full w-full cursor-pointer overflow-hidden border bg-card transition-[border-color,box-shadow,transform] duration-200 ease-out ${
        props.selected
          ? "-translate-y-0.5 border-foreground shadow-hard-lg"
          : "border-border shadow-hard hover:-translate-y-0.5 hover:border-foreground/35 hover:shadow-hard-lg"
      }`}
    >
      {/* Preview Area Section */}
      <div className="relative h-52 w-full overflow-hidden border-b border-border bg-muted/30">
        {/* Selection State Section */}
        <div
          className={`absolute left-3 top-3 z-20 flex h-7 items-center gap-1.5 border px-2 text-[10px] font-black uppercase tracking-[0.12em] transition-colors ${
            props.selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background/90 text-muted-foreground backdrop-blur"
          }`}
        >
          {props.selected ? <LucideCheck className="size-3" /> : null}
          {props.selected ? t("selectedTemplate") : t("templateLabel")}
        </div>

        {props.image ? (
          <Image
            src={props.image}
            fill
            alt={props.title}
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.025]"
          />
        ) : (
          /* Live Theme Preview Section: real palette/layout from the theme engine */
          <TemplateMiniPreview
            templateKey={props.templateKey}
            className="absolute inset-0 origin-top transition-transform duration-300 group-hover:scale-[1.025]"
          />
        )}

        {/* Hover Overlay with Preview Button Section */}
        {props.image && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
            <button
              type="button"
              className="flex items-center gap-2 border border-white bg-black/75 px-4 py-2 text-xs font-semibold text-white transition hover:bg-black"
              onClick={(e) => {
                e.stopPropagation();
                setPopupResume(true);
              }}
            >
              <LucideEye size={14} />
              {t("preview")}
            </button>
          </div>
        )}
      </div>

      {/* Card Body Section */}
      <div className="flex min-h-[156px] w-full flex-col justify-between gap-4 p-4">
        {/* Title and Description Section */}
        <div className="flex flex-col gap-1">
          <TypographyH4 className="!m-0 text-sm font-black leading-tight tracking-[-0.015em]">
            {props.title}
          </TypographyH4>
          <TypographyMuted className="line-clamp-3 text-xs leading-relaxed">
            {props.description}
          </TypographyMuted>
        </div>

        {/* Action Buttons Section */}
        <Button
          type="button"
          size="sm"
          className="h-9 w-full justify-between rounded-none px-3 text-xs"
          variant={props.selected ? "default" : "outline"}
          onClick={props.onUseTemplate}
        >
          <span>
            {props.selected ? t("selectedTemplate") : t("useTemplate")}
          </span>
          {props.selected ? <LucideCheck className="size-3.5" /> : null}
        </Button>
      </div>

      {/* Image Popup Section */}
      {props.image && (
        <ImagePopup
          image={props.image}
          open={popupResume}
          setOpen={setPopupResume}
        />
      )}
    </article>
  );
}
