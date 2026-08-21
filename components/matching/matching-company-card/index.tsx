import MetaChip from "@/components/utils/data-display/meta-chip";
import {
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideCalendarCheck,
  LucideClock,
  LucideLoader2,
  LucideMapPin,
  LucideMessageCircle,
  LucideUserX,
  LucideUsers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import Tag from "@/components/utils/data-display/tag";
import MatchScoreBadge from "@/components/matching/match-score-badge";
import { IMatchingCompanyCardProps } from "./props";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import { translateLocation, getNameInitials } from "@/utils/functions/text";
import {
  LazyAiCoverLetterAction,
  LazyAiMatchExplanationAction,
  LazyAiSkillGapAction,
} from "@/components/matching/lazy-ai-actions";

const MatchingCompanyCard = memo(function MatchingCompanyCard(
  props: IMatchingCompanyCardProps,
) {
  /* ---------------------------------- Props --------------------------------- */
  const { onUnmatch, isUnmatching } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("matching");
  const tl = useTranslations("locations");

  /* -------------------------------- All States ------------------------------ */
  const [unmatchDialogOpen, setUnmatchDialogOpen] = useState<boolean>(false);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <article className="group w-full overflow-hidden rounded-none border border-l-[5px] border-border border-l-foreground bg-card shadow-hard transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/35 hover:border-l-foreground hover:shadow-hard-lg">
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        {/* Avatar Section */}
        <Avatar
          rounded="md"
          className="size-14 flex-shrink-0 !rounded-none border border-border sm:size-16"
        >
          <AvatarFallback className="text-sm font-semibold">
            {getNameInitials(props.name)}
          </AvatarFallback>
          <AvatarImage src={props.avatar} />
        </Avatar>

        {/* Content Section */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Header Section: Name, Industry, Founded Year and Score Badge */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate text-base font-black leading-tight tracking-[-0.02em] sm:text-lg">
                {props.name}
              </h3>
              <MatchScoreBadge score={props.matchScore} />
            </div>
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
            <TypographyMuted className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {props.description}
            </TypographyMuted>
          )}

          {/* Open Positions Tags Section */}
          {props.openPosition.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {props.openPosition.slice(0, 6).map((op) => (
                <Tag
                  label={op.title}
                  key={op.id}
                  className="!rounded-none border border-border hover:shadow-none"
                />
              ))}
            </div>
          )}

          {/* Meta Chips Section */}
          <div className="flex flex-wrap gap-2">
            <MetaChip
              icon={<LucideUsers />}
              text={t("memberCount", { count: props.companySize })}
              className="rounded-none border border-border bg-muted/45"
            />
            <MetaChip
              icon={<LucideBriefcaseBusiness />}
              text={t("positionCount", { count: props.openPosition.length })}
              className="rounded-none border border-border bg-muted/45"
            />
            <MetaChip
              icon={<LucideMapPin />}
              text={translateLocation(props.location, tl)}
              className="rounded-none border border-border bg-muted/45"
            />
          </div>
        </div>
      </div>

      {/* Action Bar Section */}
      <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/25 px-4 py-2.5 sm:px-5">
        {/* Left Section: AI Actions and Unmatch */}
        <div className="flex items-center gap-1">
          {/* AI Match Explanation Modal Section */}
          <LazyAiMatchExplanationAction
            eid={props.employeeId}
            cid={props.id}
            companyName={props.name}
            compact
          />

          {/* AI Cover Letter Modal Section */}
          <LazyAiCoverLetterAction
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
          <LazyAiSkillGapAction
            eid={props.employeeId}
            cid={props.id}
            companyName={props.name}
            compact
          />

          {/* Unmatch Button Section */}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 rounded-none px-2 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label={t("unmatch")}
            disabled={isUnmatching}
            onClick={() => setUnmatchDialogOpen(true)}
          >
            {isUnmatching ? (
              <LucideLoader2 className="size-3.5 shrink-0 animate-spin" />
            ) : (
              <LucideUserX className="size-3.5 shrink-0" />
            )}
            <span className="hidden sm:inline">{t("unmatch")}</span>
          </Button>

          <Dialog open={unmatchDialogOpen} onOpenChange={setUnmatchDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {t("unmatchConfirmTitle", { name: props.name })}
                </DialogTitle>
                <DialogDescription>{t("unmatchConfirmDesc")}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setUnmatchDialogOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setUnmatchDialogOpen(false);
                    onUnmatch();
                  }}
                >
                  {t("unmatchConfirm")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Right Section: Schedule and Chat Now Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Schedule Button Section */}
          {props.onScheduleClick && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 rounded-none px-2.5 text-xs sm:px-3"
              aria-label={t("schedule")}
              onClick={props.onScheduleClick}
            >
              <LucideCalendarCheck className="size-3.5 shrink-0" />
              <span className="hidden sm:inline">{t("schedule")}</span>
            </Button>
          )}

          {/* Chat Now Button Section */}
          <Button
            size="sm"
            className="h-8 rounded-none px-2.5 text-xs sm:px-3"
            aria-label={t("chatNow")}
            onClick={props.onChatNowClick}
            disabled={props.isChatLoading}
          >
            {props.isChatLoading ? (
              <LucideLoader2 className="size-3.5 shrink-0 animate-spin" />
            ) : (
              <LucideMessageCircle className="size-3.5 shrink-0" />
            )}
            <span className="hidden sm:inline">{t("chatNow")}</span>
          </Button>
        </div>
      </div>
    </article>
  );
});

export default MatchingCompanyCard;
