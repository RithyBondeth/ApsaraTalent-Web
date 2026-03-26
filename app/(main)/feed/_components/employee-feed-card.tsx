import EmployeeCard from "@/components/employee/employee-card";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import React from "react";

// ---------------------------------------------------------------------------
// Memoized card wrappers — stable identity prevents full list re-renders
// ---------------------------------------------------------------------------
interface IEmployeeFeedCardProps {
  employee: IEmployee;
  companyId: string;
  isLiking: boolean;
  isFavorite: boolean;
  onView: (id: string) => void;
  onLike: (companyId: string, employeeId: string) => void;
  onSave: (companyId: string, employeeId: string, name: string) => void;
  onProfileImageClick: (e: React.MouseEvent) => void;
  onSetProfileImage: (url: string) => void;
}

export const EmployeeFeedCard = React.memo(function EmployeeFeedCard({
  employee,
  companyId,
  isLiking,
  isFavorite,
  onView,
  onLike,
  onSave,
  onProfileImageClick,
  onSetProfileImage,
}: IEmployeeFeedCardProps) {
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
