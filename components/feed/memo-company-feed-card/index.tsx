import CompanyCard from "@/components/company/company-card";
import { LucideSparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { IMemoCompanyFeedCardProps } from "./props";

// ---------------------------------------------------------------------------
// Memoized card wrappers — stable identity prevents full list re-renders
// ---------------------------------------------------------------------------
export const MemoCompanyFeedCard = React.memo(function CompanyFeedCard({
  company,
  employeeId,
  isLiking,
  isSaving,
  isFavorite,
  isRecommended,
  onView,
  onLike,
  onSave,
  onProfileImageClick,
  onSetProfileImage,
}: IMemoCompanyFeedCardProps) {
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
          <LucideSparkles className="size-3 text-foreground" />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            {t("recommended")}
          </span>
        </div>
      )}

      {/* Company Card Section */}
      <CompanyCard
        {...company}
        id={company.id}
        viewHref={`/feed/company/${company.id}`}
        onViewClick={() => onView(company.id)}
        onSaveClick={() =>
          onSave(employeeId, company.id, company.name ?? "Company")
        }
        hideSaveButton={isFavorite}
        onLikeClick={() => onLike(employeeId, company.id)}
        onLikeClickDisable={isLiking}
        onSaveClickDisable={isSaving}
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
