"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RESUME_TEMPLATE_KEYS,
  TResumeTemplate,
} from "@/utils/types/resume/resume.type";
import { RESUME_TEMPLATE_LABEL_KEYS } from "@/utils/constants/resume.constant";
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

  /* --------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex items-center gap-2">
      <Select
        value={value}
        onValueChange={(v) => onChange(v as TResumeTemplate)}
      >
        {/* Select Template Trigger Section */}
        <SelectTrigger className="h-8 w-[150px] rounded-none bg-background text-xs sm:w-[180px]">
          <div className="flex items-center gap-2">
            <Layout size={14} className="text-muted-foreground" />
            <SelectValue placeholder={t("selectTemplate")} />
          </div>
        </SelectTrigger>
        {/* Select Template Dropdown Section */}
        <SelectContent className="rounded-none border-border shadow-[5px_5px_0_hsl(var(--foreground)/0.08)] [&_[role=option]]:rounded-none">
          {RESUME_TEMPLATE_KEYS.map((templateKey) => (
            <SelectItem
              key={templateKey}
              value={templateKey}
              className="text-xs"
            >
              {t(RESUME_TEMPLATE_LABEL_KEYS[templateKey])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
