import CompanyCard from "@/components/company/company-card";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import React from "react";

// ---------------------------------------------------------------------------
// Memoized card wrappers — stable identity prevents full list re-renders
// ---------------------------------------------------------------------------
interface ICompanyFeedCardProps {
  company: ICompany;
  employeeId: string;
  isLiking: boolean;
  isFavorite: boolean;
  onView: (id: string) => void;
  onLike: (employeeId: string, companyId: string) => void;
  onSave: (employeeId: string, companyId: string, name: string) => void;
  onProfileImageClick: (e: React.MouseEvent) => void;
  onSetProfileImage: (url: string) => void;
}

export const CompanyFeedCard = React.memo(function CompanyFeedCard({
  company,
  employeeId,
  isLiking,
  isFavorite,
  onView,
  onLike,
  onSave,
  onProfileImageClick,
  onSetProfileImage,
}: ICompanyFeedCardProps) {
  return (
    <div
      className={`break-inside-avoid mb-5${isLiking ? " animate-card-pop-shrink" : ""}`}
    >
      <CompanyCard
        {...company}
        id={company.id}
        onViewClick={() => onView(company.id)}
        onSaveClick={() =>
          onSave(employeeId, company.id, company.name ?? "Company")
        }
        hideSaveButton={isFavorite}
        onLikeClick={() => onLike(employeeId, company.id)}
        onLikeClickDisable={isLiking}
        onProfileImageClick={(e: React.MouseEvent) => {
          if (company.avatar) {
            onProfileImageClick(e);
            onSetProfileImage(company.avatar);
          }
        }}
      />
    </div>
  );
});
