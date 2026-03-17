"use client";

import { Button } from "@/components/ui/button";
import ImagePopup from "@/components/utils/image-popup";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { TTemplateCardProps } from "./props";

/** Maps template title keywords to a gradient for the preview placeholder */
function getTemplateGradient(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("dark")) return "from-gray-900 to-slate-800";
  if (t.includes("bold")) return "from-slate-900 to-red-900";
  if (t.includes("creative")) return "from-purple-700 to-violet-600";
  if (t.includes("colorful")) return "from-cyan-500 to-purple-600";
  if (t.includes("elegant")) return "from-amber-200 to-stone-300";
  if (t.includes("corporate")) return "from-blue-900 to-blue-700";
  if (t.includes("timeline")) return "from-indigo-600 to-indigo-400";
  if (t.includes("minimalist")) return "from-slate-200 to-sky-100";
  if (t.includes("classic")) return "from-gray-300 to-gray-100";
  if (t.includes("professional")) return "from-sky-200 to-slate-100";
  if (t.includes("compact")) return "from-blue-700 to-blue-500";
  return "from-blue-900 to-blue-600"; // modern (default)
}

/**
 * Returns true for templates whose gradient is light-colored,
 * so the mini-resume skeleton should use dark lines instead of white.
 */
function isLightTemplate(title: string): boolean {
  const t = title.toLowerCase();
  return (
    t.includes("minimalist") ||
    t.includes("classic") ||
    t.includes("professional") ||
    t.includes("elegant")
  );
}

/** Style keyword badge per template */
function getStyleBadge(title: string): { label: string; className: string } {
  const t = title.toLowerCase();
  if (t.includes("dark"))
    return { label: "Dark", className: "bg-slate-800 text-slate-200" };
  if (t.includes("bold"))
    return { label: "Bold", className: "bg-red-600 text-white" };
  if (t.includes("creative"))
    return { label: "Creative", className: "bg-purple-600 text-white" };
  if (t.includes("colorful"))
    return { label: "Colorful", className: "bg-cyan-500 text-white" };
  if (t.includes("elegant"))
    return { label: "Elegant", className: "bg-amber-600 text-white" };
  if (t.includes("corporate"))
    return { label: "Corporate", className: "bg-blue-800 text-white" };
  if (t.includes("timeline"))
    return { label: "Timeline", className: "bg-indigo-600 text-white" };
  if (t.includes("minimalist"))
    return { label: "Minimal", className: "bg-sky-500 text-white" };
  if (t.includes("classic"))
    return { label: "Classic", className: "bg-gray-700 text-white" };
  if (t.includes("professional"))
    return { label: "Pro", className: "bg-sky-700 text-white" };
  if (t.includes("compact"))
    return { label: "Compact", className: "bg-blue-600 text-white" };
  return { label: "Modern", className: "bg-blue-700 text-white" };
}

export default function TemplateCard(props: TTemplateCardProps) {
  const [popupResume, setPopupResume] = useState<boolean>(false);
  const gradient = getTemplateGradient(props.title);
  const styleBadge = getStyleBadge(props.title);
  const light = isLightTemplate(props.title);

  return (
    <div
      className={`h-fit w-full flex flex-col rounded-lg cursor-pointer transition-all duration-200 shadow-sm border overflow-hidden ${
        props.selected
          ? "border-primary ring-2 ring-primary/30 shadow-md"
          : "border-muted hover:border-primary/40 hover:shadow-md"
      }`}
    >
      {/* Preview Area */}
      <div className="w-full h-48 relative group overflow-hidden">
        {props.image ? (
          <Image
            src={props.image}
            fill
            alt={props.title}
            className="object-cover object-top"
          />
        ) : (
          /* Gradient placeholder when no image is seeded yet */
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-3 select-none`}
          >
            {/* Mini resume skeleton */}
            <div
              className={`w-28 h-36 backdrop-blur-sm rounded p-2 flex flex-col gap-1.5 ${
                light
                  ? "bg-black/5 border border-black/15"
                  : "bg-white/10 border border-white/20"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full mx-auto ${
                  light ? "bg-black/20" : "bg-white/30"
                }`}
              />
              <div
                className={`h-1.5 w-14 rounded mx-auto ${
                  light ? "bg-black/25" : "bg-white/40"
                }`}
              />
              <div
                className={`h-1 w-10 rounded mx-auto ${
                  light ? "bg-black/15" : "bg-white/25"
                }`}
              />
              <div
                className={`border-t mt-1 pt-1 flex flex-col gap-1 ${
                  light ? "border-black/15" : "border-white/20"
                }`}
              >
                <div className={`h-1 w-full rounded ${light ? "bg-black/20" : "bg-white/30"}`} />
                <div className={`h-1 w-4/5 rounded ${light ? "bg-black/15" : "bg-white/25"}`} />
                <div className={`h-1 w-3/4 rounded ${light ? "bg-black/12" : "bg-white/20"}`} />
                <div className={`h-1 w-full rounded mt-0.5 ${light ? "bg-black/20" : "bg-white/30"}`} />
                <div className={`h-1 w-2/3 rounded ${light ? "bg-black/15" : "bg-white/25"}`} />
              </div>
            </div>
          </div>
        )}

        {/* Premium / Free badge */}
        <div
          className={`absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow ${
            props.isPremium
              ? "bg-amber-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {props.isPremium ? `💎 $${props.price}` : "✓ Free"}
        </div>

        {/* Style keyword badge */}
        <div
          className={`absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow ${styleBadge.className}`}
        >
          {styleBadge.label}
        </div>

        {/* Hover overlay with preview button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto">
          <button
            className="flex items-center gap-2 bg-white text-gray-900 rounded-full px-4 py-2 text-xs font-semibold shadow-lg hover:bg-gray-100 transition"
            onClick={(e) => {
              e.stopPropagation();
              setPopupResume(true);
            }}
          >
            <Eye size={14} />
            Preview
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="w-full p-3 flex flex-col gap-2">
        <div>
          <TypographyH4 className="text-sm font-semibold leading-tight">
            {props.title}
          </TypographyH4>
          <TypographyMuted className="text-xs leading-relaxed mt-1 line-clamp-2">
            {props.description}
          </TypographyMuted>
        </div>

        <div className="flex items-center justify-between mt-1">
          <Button
            size="sm"
            className="text-xs h-8"
            variant={props.selected ? "default" : "outline"}
            onClick={props.onUseTemplate}
          >
            {props.selected ? "✓ Selected" : "Use Template"}
          </Button>

          {props.isPremium && (
            <span className="text-xs text-amber-600 font-semibold">
              ${props.price}
            </span>
          )}
        </div>
      </div>

      <ImagePopup
        image={props.image}
        open={popupResume}
        setOpen={setPopupResume}
      />
    </div>
  );
}
