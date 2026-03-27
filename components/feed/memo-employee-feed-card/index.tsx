import EmployeeCard from "@/components/employee/employee-card";
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
  onView,
  onLike,
  onSave,
  onProfileImageClick,
  onSetProfileImage,
}: IMemoEmployeeFeedCardProps) {
  return (
    <div className={isLiking ? "animate-card-pop-shrink" : ""}>
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
