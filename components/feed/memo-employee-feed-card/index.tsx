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
    <div className={isLiking ? "animate-card-pop-shrink" : undefined}>
      {/* Recommended Badge Section */}
      {isRecommended && (
        <div className="flex items-center gap-1 mb-1.5 px-1">
          <Sparkles className="size-3 text-primary" />
          <span className="text-[10px] font-semibold text-primary">
            {t("recommended")}
          </span>
        </div>
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
