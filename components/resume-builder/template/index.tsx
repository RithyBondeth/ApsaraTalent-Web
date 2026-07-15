"use client";

import { Button } from "@/components/ui/button";
import ImagePopup from "@/components/utils/data-display/image-popup";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Eye } from "lucide-react";
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
      className={`h-fit w-full flex flex-col rounded-2xl cursor-pointer transition-all duration-300 ease-out border overflow-hidden ${
        props.selected
          ? "border-primary ring-2 ring-primary/25 shadow-[0_8px_32px_hsl(var(--foreground)/0.14)] -translate-y-1"
          : "border-border/70 shadow-[0_2px_8px_hsl(var(--foreground)/0.05)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_24px_hsl(var(--foreground)/0.12)]"
      }`}
    >
      {/* Preview Area Section */}
      <div className="w-full h-52 relative group overflow-hidden">
        {props.image ? (
          <Image
            src={props.image}
            fill
            alt={props.title}
            className="object-cover object-top"
          />
        ) : (
          /* Live Theme Preview Section: real palette/layout from the theme engine */
          <TemplateMiniPreview
            templateKey={props.templateKey}
            className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.04] origin-top"
          />
        )}

        {/* Hover Overlay with Preview Button Section */}
        {props.image && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto">
            <button
              className="flex items-center gap-2 bg-white text-gray-900 rounded-full px-4 py-2 text-xs font-semibold shadow-lg hover:bg-gray-100 transition"
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

      {/* Card Body Section */}
      <div className="w-full p-4 flex flex-col gap-3 bg-card">
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
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            className="text-xs h-8 rounded-full px-4"
            variant={props.selected ? "default" : "outline"}
            onClick={props.onUseTemplate}
          >
            {props.selected ? `✓ ${t("selectedTemplate")}` : t("useTemplate")}
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
