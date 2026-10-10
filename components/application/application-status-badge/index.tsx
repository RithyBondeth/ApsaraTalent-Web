import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getApplicationStatusClass } from "@/utils/functions/ui";
import { useTranslations } from "next-intl";
import { IApplicationStatusBadgeProps } from "./props";

export function ApplicationStatusBadge({
  status,
  className,
}: IApplicationStatusBadgeProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("application");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Badge
      variant="outline"
      className={cn(
        "flex-shrink-0 whitespace-nowrap rounded-none px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]",
        getApplicationStatusClass(status),
        className,
      )}
    >
      {t(`status.${status}`)}
    </Badge>
  );
}
