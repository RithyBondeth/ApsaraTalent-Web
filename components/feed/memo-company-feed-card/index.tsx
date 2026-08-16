import CompanyCard from "@/components/company/company-card";
import { Bot as Sparkles } from "lucide-react";
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

      {/* Company Card Section */}
      <CompanyCard
        {...company}
        id={company.id}
        variant="grid"
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
