import MetaChip from "@/components/utils/data-display/meta-chip";
import {
  formatAvailabilityWords,
  getNameInitials,
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
import { AiMatchExplanationModal } from "@/components/matching/ai-match-explanation-modal";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import Tag from "@/components/utils/data-display/tag";
import { IMatchingEmployeeCardProps } from "./props";
import { getAvailabilityStyleClass } from "@/utils/functions/ui/get-availability-class";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import { translateLocation } from "@/utils/functions/text";

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
    <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-primary/20">
      <div className="p-4 sm:p-5 flex gap-4 sm:gap-5">
        {/* Avatar Section */}
        <Avatar
          rounded="md"
          className="size-16 sm:size-20 flex-shrink-0 ring-[2px] ring-border/40"
        >
          <AvatarFallback className="text-sm font-semibold">
            {getNameInitials(props.name)}
          </AvatarFallback>
          <AvatarImage src={props.avatar} />
        </Avatar>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-bold leading-tight truncate">
                {props.name}
              </h3>
              <TypographyMuted className="text-sm text-muted-foreground mt-0.5">
                @{props.username}
              </TypographyMuted>
            </div>
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${getAvailabilityStyleClass(props.availability)}`}
            >
              {availabilityLabel}
            </span>
          </div>

          {/* Description Section */}
          {props.description && (
            <TypographyMuted className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {props.description}
            </TypographyMuted>
          )}

          {/* Skills Tags Section */}
          {props.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {props.skills.map((skill, index) => (
                <Tag label={skill} key={index} />
              ))}
            </div>
          )}

          {/* Meta Chips Section: Position, Experience, Location */}
          <div className="flex flex-wrap gap-2">
            <MetaChip
              icon={<LucideBriefcaseBusiness />}
              text={props.position}
            />
            <MetaChip icon={<LucideClock />} text={props.experience} />
            <MetaChip
              icon={<LucideMapPin />}
              text={translateLocation(props.location, tl)}
            />
          </div>
        </div>
      </div>

      {/* Action Bar Section */}
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-between gap-2">
        {/* Left Section: AI Actions and Unmatch */}
        <div className="flex items-center gap-1.5">
          <AiMatchExplanationModal
            eid={props.id}
            cid={props.companyId}
            companyName={props.name}
          />

          {/* Unmatch Button Section */}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
              className="h-8 text-xs px-3"
              onClick={props.onScheduleClick}
            >
              <LucideCalendarCheck className="size-3.5" />
              {t("schedule")}
            </Button>
          )}
          <Button
            size="sm"
            className="h-8 text-xs px-3"
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
    </div>
  );
});

export default MatchingEmployeeCard;
