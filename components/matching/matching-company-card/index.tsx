import MetaChip from "@/components/utils/data-display/meta-chip";
import {
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideCalendarCheck,
  LucideClock,
  LucideLoader2,
  LucideMapPin,
  LucideMessageCircle,
  LucideUsers,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import Tag from "@/components/utils/data-display/tag";
import { IMatchingCompanyCardProps } from "./props";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { memo } from "react";
import { useTranslations } from "next-intl";
import { translateLocation } from "@/utils/functions/text";
import { AiMatchExplanationModal } from "@/components/matching/ai-match-explanation-modal";
import { AiCoverLetterModal } from "@/components/matching/ai-cover-letter-modal";
import { AiSkillGapModal } from "@/components/matching/ai-skill-gap-modal";

const MatchingCompanyCard = memo(function MatchingCompanyCard(
  props: IMatchingCompanyCardProps,
) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("matching");
  const tl = useTranslations("locations");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-primary/20">
      <div className="p-4 sm:p-5 flex gap-4 sm:gap-5">
        {/* Avatar Section */}
        <Avatar
          rounded="md"
          className="size-16 sm:size-20 flex-shrink-0 ring-[2px] ring-border/40"
        >
          <AvatarFallback className="text-sm font-semibold">
            {props.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
          <AvatarImage src={props.avatar} />
        </Avatar>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Header Section: Name, Industry, Founded Year and Score Badge */}
          <div>
            <h3 className="text-base font-bold leading-tight truncate">
              {props.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <LucideBuilding className="size-3.5" />
                {props.industry}
              </span>
              <span className="inline-flex items-center gap-1">
                <LucideClock className="size-3.5" />
                {t("founded", { year: props.foundedYear })}
              </span>
            </div>
          </div>

          {/* Description Section */}
          {props.description && (
            <TypographyMuted className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {props.description}
            </TypographyMuted>
          )}

          {/* Open Positions Tags Section */}
          {props.openPosition.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {props.openPosition.map((op) => (
                <Tag label={op.title} key={op.id} />
              ))}
            </div>
          )}

          {/* Meta Chips Section */}
          <div className="flex flex-wrap gap-2">
            <MetaChip
              icon={<LucideUsers />}
              text={t("memberCount", { count: props.companySize })}
            />
            <MetaChip
              icon={<LucideBriefcaseBusiness />}
              text={t("positionCount", { count: props.openPosition.length })}
            />
            <MetaChip
              icon={<LucideMapPin />}
              text={translateLocation(props.location, tl)}
            />
          </div>
        </div>
      </div>

      {/* Action Bar Section */}
      <div className="px-4 sm:px-5 py-2.5 border-t border-border/60 bg-muted/30 flex items-center justify-between gap-2">
        {/* AI Actions Section: Icon-only on mobile (< sm), full label on sm+ */}
        <div className="flex items-center gap-1">
          {/* AI Match Explanation Modal Section */}
          <AiMatchExplanationModal
            eid={props.employeeId}
            cid={props.id}
            companyName={props.name}
            compact
          />

          {/* AI Cover Letter Modal Section */}
          <AiCoverLetterModal
            employeeName={props.employeeName}
            employeeJob={props.employeeJob}
            employeeSkills={props.employeeSkills}
            employeeExperience={props.employeeExperience}
            employeeDescription={props.employeeDescription}
            companyName={props.name}
            companyIndustry={props.industry}
            companyDescription={props.description}
            openPositions={props.openPosition.map((p) => p.title)}
            compact
          />

          {/* AI Skill Gap Modal Section */}
          <AiSkillGapModal
            eid={props.employeeId}
            cid={props.id}
            companyName={props.name}
            compact
          />
        </div>

        {/* Primary Actions Section: Icon-only on mobile, labelled on sm+ */}
        <div className="flex items-center gap-1.5">
          {/* Schedule Button Section */}
          {props.onScheduleClick && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs px-2.5 sm:px-3"
              onClick={props.onScheduleClick}
            >
              <LucideCalendarCheck className="size-3.5 shrink-0" />
              <span className="hidden sm:inline">{t("schedule")}</span>
            </Button>
          )}

          {/* Chat Now Button Section */}
          <Button
            size="sm"
            className="h-8 text-xs px-2.5 sm:px-3"
            onClick={props.onChatNowClick}
            disabled={props.isChatLoading}
          >
            {props.isChatLoading ? (
              <LucideLoader2 className="size-3.5 animate-spin shrink-0" />
            ) : (
              <LucideMessageCircle className="size-3.5 shrink-0" />
            )}
            <span className="hidden sm:inline">{t("chatNow")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

export default MatchingCompanyCard;
