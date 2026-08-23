"use client";
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
import { AvailabilityBadge } from "@/components/utils/data-display/availability-badge";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import EmployeeDialog from "../employee-dialog";
import { IEmployeeCardProps } from "./props";
import { useTranslations } from "next-intl";
import { translateLocation } from "@/utils/functions/text";
import { AVATAR_INITIALS_LENGTH } from "@/utils/constants/ui.constant";

export default function EmployeeCard(props: IEmployeeCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("feed");
  const tl = useTranslations("locations");

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
  const latestExp = props.experiences?.[0] ?? null;
  const latestEdu = props.educations?.[0] ?? null;

  return (
    <>
      <article className="relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-none border border-border bg-card transition-all duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:border-foreground/35 hover:border-t-foreground hover:shadow-hard-lg active:translate-y-0 active:scale-[0.985] active:shadow-none">
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
            <TypographyP className="!m-0 text-base font-black leading-tight tracking-[-0.02em]">
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
              className="size-8 rounded-none border border-border text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
              onClick={props.onLikeClick}
              disabled={props.onLikeClickDisable}
            >
              {props.onLikeClickDisable ? (
                <LucideLoader2 className="!size-4 animate-spin text-rose-500" />
              ) : (
                <LucideHeartHandshake className="!size-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Quick view"
              className="size-8 rounded-none border border-border text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
              onClick={handleClickDialog}
            >
              <LucideEye className="!size-4" />
            </Button>
          </div>
        </div>

        {/* Status Badges Section */}
        <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3">
          <AvailabilityBadge availability={props.availability} />
        </div>

        {/* Skills Section */}
        {props.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-4 pb-3">
            {props.skills.slice(0, 4).map((skill) => (
              <Tag key={skill.id} label={skill.name} />
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
