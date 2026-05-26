"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TResumeTemplate } from "@/utils/types/resume/resume.type";
import { useTranslations } from "next-intl";
import { Layout } from "lucide-react";

export default function TemplateSelector({
  value,
  onChange,
}: {
  value: TResumeTemplate;
  onChange: (value: TResumeTemplate) => void;
}) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");
  const templates: { value: TResumeTemplate; label: string }[] = [
    { value: "modern", label: t("templateModern") },
    { value: "classic", label: t("templateClassic") },
    { value: "creative", label: t("templateCreative") },
    { value: "minimalist", label: t("templateMinimalist") },
    { value: "timeline", label: t("templateTimeline") },
    { value: "bold", label: t("templateBold") },
    { value: "compact", label: t("templateCompact") },
    { value: "elegant", label: t("templateElegant") },
    { value: "colorful", label: t("templateColorful") },
    { value: "professional", label: t("templateProfessional") },
    { value: "corporate", label: t("templateCorporate") },
    { value: "dark", label: t("templateDark") },
  ];

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Change ───────────────────────────────────────────
  const handleChange = (val: string) => {
    onChange(val as TResumeTemplate);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value}
        onValueChange={(v) => onChange(v as TResumeTemplate)}
      >
        <SelectTrigger className="h-8 w-[180px] bg-background text-xs">
          <div className="flex items-center gap-2">
            <Layout size={14} className="text-muted-foreground" />
            <SelectValue placeholder="Select Template" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {templates.map((tpl) => (
            <SelectItem key={tpl.value} value={tpl.value} className="text-xs">
              {tpl.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
