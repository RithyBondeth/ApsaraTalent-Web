import MetaChip from "@/components/utils/data-display/meta-chip";
import {
  formatAvailabilityWords,
  getNameInitials,
  translateLocation,
} from "@/utils/functions/text";
import {
  LucideBriefcaseBusiness,
  LucideCalendarCheck,
  LucideClock,
  LucideLoader2,
  LucideMapPin,
  LucideMessageCircle,
  LucideUserX,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LazyAiMatchExplanationAction } from "@/components/matching/lazy-ai-actions";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import Tag from "@/components/utils/data-display/tag";
import { IMatchingEmployeeCardProps } from "./props";
import { getAvailabilityStyleClass } from "@/utils/functions/ui";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { memo, useState } from "react";
import { useTranslations } from "next-intl";

const MatchingEmployeeCard = memo(function MatchingEmployeeCard(
  props: IMatchingEmployeeCardProps,
) {
  /* ---------------------------------- Props --------------------------------- */
  const { onUnmatch, isUnmatching } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("matching");
  const tl = useTranslations("locations");
  const availabilityLabel = formatAvailabilityWords(props.availability);

  /* -------------------------------- All States ------------------------------ */
  const [unmatchDialogOpen, setUnmatchDialogOpen] = useState<boolean>(false);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <article className="group w-full overflow-hidden rounded-none border border-l-[5px] border-border border-l-foreground bg-card shadow-[5px_5px_0_hsl(var(--foreground)/0.055)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/35 hover:border-l-foreground hover:shadow-[8px_8px_0_hsl(var(--foreground)/0.08)]">
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
          {/* Header Section */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-black leading-tight tracking-[-0.02em] sm:text-lg">
                {props.name}
              </h3>
              <TypographyMuted className="mt-0.5 text-sm text-muted-foreground">
                @{props.username}
              </TypographyMuted>
            </div>
            <span
              className={`border-current/15 flex-shrink-0 whitespace-nowrap rounded-none border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${getAvailabilityStyleClass(props.availability)}`}
            >
              {availabilityLabel}
            </span>
          </div>

          {/* Description Section */}
          {props.description && (
            <TypographyMuted className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {props.description}
            </TypographyMuted>
          )}

          {/* Skills Tags Section */}
          {props.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {props.skills.slice(0, 6).map((skill, index) => (
                <Tag
                  label={skill}
                  key={index}
                  neutral
                  className="!rounded-none border border-border hover:shadow-none"
                />
              ))}
            </div>
          )}

          {/* Meta Chips Section: Position, Experience, Location */}
          <div className="flex flex-wrap gap-2">
            <MetaChip
              icon={<LucideBriefcaseBusiness />}
              text={props.position}
              className="rounded-none border border-border bg-muted/45"
            />
            <MetaChip
              icon={<LucideClock />}
              text={props.experience}
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
      <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
        {/* Left Section: AI Actions and Unmatch */}
        <div className="flex items-center gap-1.5">
          <LazyAiMatchExplanationAction
            eid={props.id}
            cid={props.companyId}
            companyName={props.name}
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
              <LucideLoader2 className="size-3.5 animate-spin" />
            ) : (
              <LucideUserX className="size-3.5" />
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
          {props.onScheduleClick && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 rounded-none px-3 text-xs"
              onClick={props.onScheduleClick}
            >
              <LucideCalendarCheck className="size-3.5" />
              {t("schedule")}
            </Button>
          )}
          <Button
            size="sm"
            className="h-8 rounded-none px-3 text-xs"
            onClick={props.onChatNowClick}
            disabled={props.isChatLoading}
          >
            {props.isChatLoading ? (
              <LucideLoader2 className="size-3.5 animate-spin" />
            ) : (
              <LucideMessageCircle className="size-3.5" />
            )}
            {t("chatNow")}
          </Button>
        </div>
      </div>
    </article>
  );
});

export default MatchingEmployeeCard;
