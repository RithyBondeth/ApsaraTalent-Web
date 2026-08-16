"use client";
import { cn } from "@/lib/utils";
import {
  Eye,
  LucideBookmark,
  LucideBriefcase,
  LucideCircleArrowRight,
  LucideGraduationCap,
  LucideHeartHandshake,
  LucideLoader2,
  LucideMapPin,
  MoveUpRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import CachedAvatar from "../../ui/cached-avatar";
import Tag from "@/components/utils/data-display/tag";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import EmployeeDialog from "../employee-dialog";
import { IEmployeeCardProps } from "./props";
import { useTranslations } from "next-intl";
import {
  translateLocation,
  formatAvailabilityWords,
} from "@/utils/functions/text";
import { AVATAR_INITIALS_LENGTH } from "@/utils/constants/ui.constant";

export default function EmployeeCard(props: IEmployeeCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("feed");
  const tl = useTranslations("locations");
  const isGrid = props.variant === "grid";

  /* -------------------------------- All States ------------------------------ */
  const [openProfileDialog, setOpenProfileDialog] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);

  /* --------------------------------- Methods --------------------------------- */
  // ─── Handle Click Dialog ─────────────────────────────────
  const handleClickDialog = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenProfileDialog(true);
  };

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    if (!openProfileDialog) {
      ignoreNextClick.current = true;
      setTimeout(() => {
        ignoreNextClick.current = false;
      }, 200);
    }
  }, [openProfileDialog]);

  /* -------------------------------- Render UI -------------------------------- */
  // ─── Grid Variant Section ─────────────────────────────────────
  if (isGrid) {
    const latestExp = props.experiences?.[0] ?? null;
    const latestEdu = props.educations?.[0] ?? null;

    return (
      <>
        <article className="relative flex h-full w-full cursor-pointer flex-col overflow-hidden bg-card transition-colors duration-200 ease-out hover:bg-muted/35">
          {/* Header Section: Avatar, Identity, Quick View and Like
              The name is the card's heading — 24px/500 on their model cards,
              which lands at text-lg here. Years-of-experience moved out of
              this row into the record strip below, so the header carries
              identity only and stops competing with itself. */}
          <div className="flex items-start gap-3 p-4">
            <CachedAvatar
              src={props.avatar}
              alt={props.username ?? "Profile"}
              className="size-14 shrink-0 border border-border shadow-none"
              rounded="none"
              onClick={props.onProfileImageClick}
              preload={true}
              showLoadingState={true}
            >
              {props.username?.slice(0, AVATAR_INITIALS_LENGTH)}
            </CachedAvatar>

            <div className="min-w-0 flex-1">
              <TypographyP className="pixel-display !m-0 truncate text-lg">
                {props.username}
              </TypographyP>
              <TypographyMuted className="mt-1 block truncate text-xs">
                {props.job}
              </TypographyMuted>
              {props.location && (
                <TypographySmall className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <LucideMapPin className="size-3 shrink-0" />
                  <span className="truncate">
                    {translateLocation(props.location, tl)}
                  </span>
                </TypographySmall>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-end gap-1">
              <Button
                size="icon"
                variant="ghost"
                aria-label="Like"
                className="size-8 border border-border text-muted-foreground transition-all duration-200 hover:bg-foreground hover:text-background"
                onClick={props.onLikeClick}
                disabled={props.onLikeClickDisable}
              >
                {props.onLikeClickDisable ? (
                  <LucideLoader2 className="!size-4 animate-spin text-primary" />
                ) : (
                  <LucideHeartHandshake className="!size-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Quick view"
                className="size-8 border border-border text-muted-foreground transition-all duration-200 hover:bg-foreground hover:text-background"
                onClick={handleClickDialog}
              >
                <Eye className="!size-4" />
              </Button>
            </div>
          </div>

          {/* Record Strip Section
              Two ruled cells carrying the two facts a recruiter scans first.
              Their model cards use exactly this: a divided strip of readings
              under the identity, mono caption over mono value, cells sharing
              one hairline rather than each drawing a box. */}
          <div className="grid grid-cols-2 border-y border-border">
            <div className="min-w-0 border-r border-border px-4 py-3">
              <span className="pixel-label block text-[10px] text-muted-foreground">
                {t("experience")}
              </span>
              <span className="pixel-numeral mt-1.5 block truncate text-sm text-foreground">
                {props.yearsOfExperience}
              </span>
            </div>
            <div className="min-w-0 px-4 py-3">
              <span className="pixel-label block text-[10px] text-muted-foreground">
                {t("availability")}
              </span>
              <span className="mt-1.5 block truncate text-sm text-foreground">
                {formatAvailabilityWords(props.availability)}
              </span>
            </div>
          </div>

          {/* Skills Section */}
          {props.skills.length > 0 && (
            <div className="border-b border-border px-4 py-3">
              <span className="pixel-label mb-2 block text-[10px] text-muted-foreground">
                {t("skills")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {props.skills.slice(0, 4).map((skill) => (
                  <Tag
                    key={skill.id}
                    label={skill.name}
                    neutral
                    className="border border-border hover:shadow-none"
                  />
                ))}
                {props.skills.length > 4 && (
                  <span className="pixel-numeral self-center text-[11px] text-muted-foreground">
                    +{props.skills.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Background Section — latest role and school, and the summary. */}
          <div className="flex flex-1 flex-col gap-1.5 px-4 py-3">
            {latestExp && (
              <TypographySmall className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                <LucideBriefcase className="mt-0.5 size-3 shrink-0" />
                <span className="line-clamp-1">{latestExp.title}</span>
              </TypographySmall>
            )}
            {latestEdu && (
              <TypographySmall className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                <LucideGraduationCap className="mt-0.5 size-3 shrink-0" />
                <span className="line-clamp-1">
                  {latestEdu.degree} · {latestEdu.school}
                </span>
              </TypographySmall>
            )}
            <TypographyMuted className="mt-1 line-clamp-2 text-xs leading-relaxed tablet-md:line-clamp-1">
              {props.description}
            </TypographyMuted>
          </div>

          {/* Footer Section */}
          <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
            {!props.hideSaveButton && (
              <Button
                className="h-8 gap-1 px-3 text-[11px]"
                variant="outline"
                size="sm"
                onClick={props.onSaveClick}
                disabled={props.onSaveClickDisable}
              >
                {props.onSaveClickDisable ? (
                  <LucideLoader2 className="!size-3 animate-spin" />
                ) : (
                  <LucideBookmark className="!size-3" />
                )}
                {t("save")}
              </Button>
            )}
            <Button
              className="h-8 gap-1 px-3 text-[11px]"
              size="sm"
              onClick={props.onViewClick}
            >
              {t("view")}
              <LucideCircleArrowRight className="!size-3" />
            </Button>
          </div>
        </article>

        <EmployeeDialog
          open={openProfileDialog}
          setOpen={setOpenProfileDialog}
          {...props}
        />
      </>
    );
  }

  // ─── Default Variant Section ──────────────────────────────────
  return (
    <div className="pixel-wash flex h-fit w-full cursor-pointer flex-col items-start gap-4 border border-border bg-card p-4 hover:border-foreground/40">
      {/* Profile Section */}
      <div className="flex w-full flex-wrap items-start justify-between gap-3">
        {/* Avatar, Username, JobTitle and Location Section */}
        <div className="flex items-center gap-3">
          <CachedAvatar
            src={props.avatar}
            alt={props.username ?? "Profile"}
            className="size-20 laptop-sm:size-16"
            rounded="none"
            onClick={props.onProfileImageClick}
            preload={true}
            showLoadingState={true}
          >
            {props.username?.slice(0, 3)}
          </CachedAvatar>
          <div className="flex min-w-0 flex-col items-start gap-1">
            <TypographyP className="max-w-full truncate font-medium">
              {props.username}
            </TypographyP>
            <TypographyMuted>{props.job}</TypographyMuted>
            <TypographySmall className="flex items-center gap-1 text-xs text-muted-foreground">
              <LucideMapPin className="size-3" />
              <span>{translateLocation(props.location, tl)}</span>
            </TypographySmall>
          </div>
        </div>
        {/* Action Buttons Section: View and Like Button */}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            aria-label="Quick view"
            className="size-10 sm:size-12"
            onClick={handleClickDialog}
          >
            <MoveUpRight className="!size-5 transition-all duration-300 ease-in-out sm:!size-6" />
          </Button>
          <Button
            aria-label="Like"
            className="size-10 sm:size-12"
            onClick={props.onLikeClick}
            disabled={props.onLikeClickDisable}
          >
            <LucideHeartHandshake
              className={cn(
                "!size-5 transition-all duration-300 ease-in-out sm:!size-6",
                props.onLikeClickDisable && "animate-pop-shrink",
              )}
            />
          </Button>
        </div>
      </div>
      {/* Skills Tags Section */}
      {props.skills.length > 0 && (
        <div className="flex w-full flex-wrap gap-2">
          {props.skills.slice(0, 5).map((skill) => (
            <Tag key={skill.id} label={skill.name} />
          ))}
          {props.skills.length > 5 && (
            <span className="self-center text-[11px] font-medium text-muted-foreground">
              {t("moreItems", { count: props.skills.length - 5 })}
            </span>
          )}
        </div>
      )}
      {/* Description Section */}
      <TypographyP className="!m-0 line-clamp-3 text-sm leading-relaxed">
        {props.description}
      </TypographyP>
      {/* Experience & Availability Section */}
      <div className="flex flex-wrap items-center gap-2">
        {props.educations.length > 0 &&
          props.educations.map((edu, index) => (
            <Tag key={index} label={edu.degree} />
          ))}
        <Tag label={props.yearsOfExperience} />
        <Tag label={formatAvailabilityWords(props.availability)} />
      </div>
      {/* Action Buttons Section: View and Save Buttons */}
      <div className="flex w-full items-center justify-end gap-2 phone-xl:justify-stretch tablet-lg:justify-stretch sm:gap-3 phone-xl:[&>button]:flex-1 tablet-lg:[&>button]:flex-1">
        {!props.hideSaveButton && (
          <Button
            className="text-sm"
            variant="outline"
            onClick={props.onSaveClick}
          >
            {t("save")}
            <LucideBookmark />
          </Button>
        )}
        <Button className="text-sm" onClick={props.onViewClick}>
          {t("view")}
          <LucideCircleArrowRight />
        </Button>
      </div>
      {/* Employee Dialog Section */}
      <EmployeeDialog
        open={openProfileDialog}
        setOpen={setOpenProfileDialog}
        {...props}
      />
    </div>
  );
}
