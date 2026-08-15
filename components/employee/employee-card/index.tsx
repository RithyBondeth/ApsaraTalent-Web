"use client";
import { cn } from "@/lib/utils";
import {
  LucideBookmark,
  LucideBriefcase,
  LucideCircleArrowRight,
  LucideEye,
  LucideGraduationCap,
  LucideHeartHandshake,
  LucideLoader2,
  LucideMapPin,
  LucideTimer,
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
        <article className="relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-none bg-card transition-colors duration-200 ease-out hover:bg-muted/35">
          {/* Header Section: Avatar, Identity, Quick View and Like */}
          <div className="flex items-start gap-3 p-4 pb-3">
            <CachedAvatar
              src={props.avatar}
              alt={props.username ?? "Profile"}
              className="size-16 shrink-0 border border-border shadow-none"
              rounded="none"
              onClick={props.onProfileImageClick}
              preload={true}
              showLoadingState={true}
            >
              {props.username?.slice(0, AVATAR_INITIALS_LENGTH)}
            </CachedAvatar>

            <div className="min-w-0 flex-1">
              <TypographyP className="pixel-display !m-0 text-base">
                {props.username}
              </TypographyP>
              <TypographyMuted className="mt-0.5 block truncate text-xs font-medium">
                {props.job}
              </TypographyMuted>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                {props.location && (
                  <TypographySmall className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <LucideMapPin className="size-3 shrink-0" />
                    <span className="truncate">
                      {translateLocation(props.location, tl)}
                    </span>
                  </TypographySmall>
                )}
                <TypographySmall className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <LucideTimer className="size-3 shrink-0" />
                  <span>{props.yearsOfExperience}</span>
                </TypographySmall>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-1">
              <Button
                size="icon"
                variant="ghost"
                aria-label="Like"
                className="size-8 rounded-none border border-border text-muted-foreground transition-all duration-200 hover:bg-foreground hover:text-background"
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
                className="size-8 rounded-none border border-border text-muted-foreground transition-all duration-200 hover:bg-foreground hover:text-background"
                onClick={handleClickDialog}
              >
                <LucideEye className="!size-4" />
              </Button>
            </div>
          </div>

          {/* Status Badges Section */}
          <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3">
            <Tag
              label={formatAvailabilityWords(props.availability)}
              neutral
              className="!rounded-none border border-border hover:shadow-none"
            />
          </div>

          {/* Skills Section */}
          {props.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-3">
              {props.skills.slice(0, 4).map((skill) => (
                <Tag
                  key={skill.id}
                  label={skill.name}
                  neutral
                  className="!rounded-none border border-border hover:shadow-none"
                />
              ))}
              {props.skills.length > 4 && (
                <span className="self-center text-[11px] font-medium text-muted-foreground">
                  +{props.skills.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Experience and Education Section */}
          <div className="flex flex-col gap-1 px-4 pb-3">
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
          </div>

          {/* Description Section */}
          <div className="flex-1 px-4 pb-3">
            <TypographyMuted className="line-clamp-2 text-xs leading-relaxed tablet-md:line-clamp-1">
              {props.description}
            </TypographyMuted>
          </div>

          {/* Footer Section */}
          <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
            {!props.hideSaveButton && (
              <Button
                className="h-8 gap-1 rounded-none px-3 text-[11px]"
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
              className="h-8 gap-1 rounded-none px-3 text-[11px]"
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
    <div className="hover: flex h-fit w-full cursor-pointer flex-col items-start gap-4 rounded-none border border-t-[5px] border-border border-t-foreground bg-card p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-foreground/40">
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
            className="size-10 rounded-none transition-all duration-300 ease-out hover:scale-105 active:scale-95 sm:size-12"
            onClick={handleClickDialog}
          >
            <LucideEye className="!size-5 transition-all duration-300 ease-in-out sm:!size-6" />
          </Button>
          <Button
            aria-label="Like"
            className="size-10 rounded-none transition-all duration-300 ease-out hover:scale-105 active:scale-95 sm:size-12"
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
            className="rounded-none text-sm"
            variant="outline"
            onClick={props.onSaveClick}
          >
            {t("save")}
            <LucideBookmark />
          </Button>
        )}
        <Button className="rounded-none text-sm" onClick={props.onViewClick}>
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
