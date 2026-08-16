import EmployeeCard from "@/components/employee/employee-card";
import { Bot as Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { IMemoEmployeeFeedCardProps } from "./props";

// ---------------------------------------------------------------------------
// Memoized card wrappers — stable identity prevents full list re-renders
// ---------------------------------------------------------------------------
export const MemoEmployeeFeedCard = React.memo(function EmployeeFeedCard({
  employee,
  companyId,
  isLiking,
  isSaving,
  isFavorite,
  isRecommended,
  onView,
  onLike,
  onSave,
  onProfileImageClick,
  onSetProfileImage,
}: IMemoEmployeeFeedCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("feed");
  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div
      className={`relative flex h-full min-w-0 flex-col ${isLiking ? "animate-card-pop-shrink" : ""}`}
    >
      {/* Recommended Badge Section
          A pill on the card, not a ribbon above it. This used to be its own
          row outside the card with a left rule and 2px of padding, so at the
          grid edge it read as a label someone had trimmed off. On the card it
          is the same status-pill shape the models page puts on a model — mono,
          small, sitting over the corner it describes. */}
      {isRecommended && (
        <span className="pixel-label pointer-events-none absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded bg-background/85 px-2 py-1 text-[10px] text-foreground backdrop-blur-sm">
          <Sparkles className="size-3 text-primary" />
          {t("recommended")}
        </span>
      )}

      {/* Employee Card Section */}
      <EmployeeCard
        {...employee}
        id={employee.id}
        variant="grid"
        viewHref={`/feed/employee/${employee.id}`}
        onViewClick={() => onView(employee.id)}
        onSaveClick={() =>
          onSave(companyId, employee.id, employee.username ?? "Employee")
        }
        hideSaveButton={isFavorite}
        onLikeClick={() => onLike(companyId, employee.id)}
        onLikeClickDisable={isLiking}
        onSaveClickDisable={isSaving}
        onProfileImageClick={(e: React.MouseEvent) => {
          if (employee.avatar) {
            onProfileImageClick(e);
            onSetProfileImage(employee.avatar);
          }
        }}
      />
    </div>
  );
});
