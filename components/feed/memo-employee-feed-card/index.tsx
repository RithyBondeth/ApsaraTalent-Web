import EmployeeCard from "@/components/employee/employee-card";
import { Sparkles } from "lucide-react";
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
      className={`flex h-full min-w-0 flex-col ${isLiking ? "animate-card-pop-shrink" : ""}`}
    >
      {/* Recommended Badge Section */}
      {isRecommended && (
        <div className="mb-2 flex items-center gap-1.5 border-l-2 border-foreground pl-2">
          <Sparkles className="size-3 text-foreground" />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            {t("recommended")}
          </span>
        </div>
      )}

      {/* Employee Card Section */}
      <EmployeeCard
        {...employee}
        id={employee.id}
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
