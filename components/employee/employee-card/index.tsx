"use client";
import {
  LucideBookmark,
  LucideBriefcase,
  LucideCircleArrowRight,
  LucideEye,
  LucideGraduationCap,
  LucideHeartHandshake,
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

export default function EmployeeCard(props: IEmployeeCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("feed");
  const tl = useTranslations("locations");
  const isGrid = props.variant === "grid";

  /* -------------------------------- All States ------------------------------ */
  const [openProfileDialog, setOpenProfileDialog] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);

  /* --------------------------------- Methods --------------------------------- */
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
  // ─── Grid Variant Section ──────────────────────────────────────────────────
  if (isGrid) {
    const latestExp = props.experiences?.[0] ?? null;
    const latestEdu = props.educations?.[0] ?? null;

    return (
      <>
        <div className="relative w-full flex flex-col bg-card border border-border/70 rounded-2xl overflow-hidden cursor-pointer shadow-[0_2px_8px_hsl(var(--foreground)/0.05)] transition-all duration-300 ease-out hover:z-10 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_hsl(var(--foreground)/0.13)] hover:border-primary/25">
          {/* Header Section: Avatar, Identity, Quick View and Like */}
          <div className="flex items-start gap-3 p-4 pb-3">
            <CachedAvatar
              src={props.avatar}
              alt={props.username ?? "Profile"}
              className="size-14 shrink-0 ring-2 ring-border shadow-sm"
              rounded="md"
              onClick={props.onProfileImageClick}
              preload={true}
              showLoadingState={true}
            >
              {props.username?.slice(0, 2)}
            </CachedAvatar>

            <div className="flex-1 min-w-0">
              <TypographyP className="!m-0 font-semibold text-sm leading-tight">
                {props.username}
              </TypographyP>
              <TypographyMuted className="text-xs truncate mt-0.5 block font-medium">
                {props.job}
              </TypographyMuted>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                {props.location && (
                  <TypographySmall className="text-[11px] flex items-center gap-1 text-muted-foreground">
                    <LucideMapPin className="size-3 shrink-0" />
                    <span className="truncate">
                      {translateLocation(props.location, tl)}
                    </span>
                  </TypographySmall>
                )}
                <TypographySmall className="text-[11px] flex items-center gap-1 text-muted-foreground">
                  <LucideTimer className="size-3 shrink-0" />
                  <span>{props.yearsOfExperience}</span>
                </TypographySmall>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                aria-label="Like"
                className="size-8 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-200"
                onClick={props.onLikeClick}
                disabled={props.onLikeClickDisable}
              >
                <LucideHeartHandshake
                  className={`!size-4${props.onLikeClickDisable ? " animate-pop-shrink text-rose-500" : ""}`}
                />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Quick view"
                className="size-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                onClick={handleClickDialog}
              >
                <LucideEye className="!size-4" />
              </Button>
            </div>
          </div>

          {/* Status Badges Section */}
          <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3">
            <Tag label={formatAvailabilityWords(props.availability)} />
          </div>

          {/* Skills Section */}
          {props.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-3">
              {props.skills.slice(0, 4).map((skill) => (
                <Tag key={skill.id} label={skill.name} />
              ))}
              {props.skills.length > 4 && (
                <span className="text-[11px] text-muted-foreground self-center font-medium">
                  +{props.skills.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Experience and Education Section */}
          <div className="flex flex-col gap-1 px-4 pb-3">
            {latestExp && (
              <TypographySmall className="text-[11px] flex items-start gap-1.5 text-muted-foreground">
                <LucideBriefcase className="size-3 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{latestExp.title}</span>
              </TypographySmall>
            )}
            {latestEdu && (
              <TypographySmall className="text-[11px] flex items-start gap-1.5 text-muted-foreground">
                <LucideGraduationCap className="size-3 shrink-0 mt-0.5" />
                <span className="line-clamp-1">
                  {latestEdu.degree} · {latestEdu.school}
                </span>
              </TypographySmall>
            )}
          </div>

          {/* Description Section */}
          <div className="px-4 pb-3 flex-1">
            <TypographyMuted className="text-xs leading-relaxed line-clamp-2">
              {props.description}
            </TypographyMuted>
          </div>

          {/* Footer Section */}
          <div className="flex items-center justify-end gap-2 px-4 pb-3 pt-2 border-t border-border/50">
            {!props.hideSaveButton && (
              <Button
                className="text-[11px] h-7 px-2.5 rounded-full gap-1"
                variant="outline"
                size="sm"
                onClick={props.onSaveClick}
              >
                <LucideBookmark className="!size-3" />
                {t("save")}
              </Button>
            )}
            <Button
              className="text-[11px] h-7 px-3 rounded-full gap-1"
              size="sm"
              onClick={props.onViewClick}
            >
              {t("view")}
              <LucideCircleArrowRight className="!size-3" />
            </Button>
          </div>
        </div>

        <EmployeeDialog
          open={openProfileDialog}
          setOpen={setOpenProfileDialog}
          {...props}
        />
      </>
    );
  }

  // ─── Default Variant Section ─────────────────────────────────────────────────────────
  return (
    <div className="h-fit w-full flex flex-col items-start gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-[0_2px_8px_hsl(var(--foreground)/0.05)] cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_36px_hsl(var(--foreground)/0.11)] hover:border-primary/25">
      {/* Profile Section */}
      <div className="w-full flex flex-wrap items-start justify-between gap-3">
        {/* Avatar, Username, JobTitle and Location Section */}
        <div className="flex items-center gap-3">
          <CachedAvatar
            src={props.avatar}
            alt={props.username ?? "Profile"}
            className="size-20 laptop-sm:size-16"
            rounded="md"
            onClick={props.onProfileImageClick}
            preload={true}
            showLoadingState={true}
          >
            {props.username?.slice(0, 3)}
          </CachedAvatar>
          <div className="flex flex-col items-start gap-1 min-w-0">
            <TypographyP className="font-semibold truncate max-w-full">
              {props.username}
            </TypographyP>
            <TypographyMuted>{props.job}</TypographyMuted>
            <TypographySmall className="text-xs flex items-center gap-1 text-muted-foreground">
              <LucideMapPin className="size-3 " />
              <span>{translateLocation(props.location, tl)}</span>
            </TypographySmall>
          </div>
        </div>
        {/* Action Buttons Section: View and Like Button */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            aria-label="Quick view"
            className="size-10 sm:size-12 rounded-xl transition-all duration-300 ease-out hover:scale-110 active:scale-95"
            onClick={handleClickDialog}
          >
            <LucideEye className="!size-5 sm:!size-6 transition-all duration-300 ease-in-out" />
          </Button>
          <Button
            aria-label="Like"
            className="size-10 sm:size-12 rounded-xl transition-all duration-300 ease-out hover:scale-110 active:scale-95"
            onClick={props.onLikeClick}
            disabled={props.onLikeClickDisable}
          >
            <LucideHeartHandshake
              className={`!size-5 sm:!size-6 transition-all duration-300 ease-in-out${props.onLikeClickDisable ? " animate-pop-shrink" : ""}`}
            />
          </Button>
        </div>
      </div>
      {/* Skills Tags Section */}
      {props.skills.length > 0 && (
        <div className="w-full flex flex-wrap gap-2">
          {props.skills.slice(0, 5).map((skill) => (
            <Tag key={skill.id} label={skill.name} />
          ))}
          {props.skills.length > 5 && (
            <span className="text-[11px] text-muted-foreground self-center font-medium">
              {t("moreItems", { count: props.skills.length - 5 })}
            </span>
          )}
        </div>
      )}
      {/* Description Section */}
      <TypographyP className="!m-0 text-sm leading-relaxed line-clamp-3">
        {props.description}
      </TypographyP>
      {/* Experience & Availability Section */}
      <div className="flex flex-wrap gap-2 items-center">
        {props.educations.length > 0 &&
          props.educations.map((edu, index) => (
            <Tag key={index} label={edu.degree} />
          ))}
        <Tag label={props.yearsOfExperience} />
        <Tag label={formatAvailabilityWords(props.availability)} />
      </div>
      {/* Action Buttons Section: View and Save Buttons */}
      <div className="w-full flex items-center justify-end gap-2 sm:gap-3 tablet-lg:justify-stretch tablet-lg:[&>button]:flex-1 phone-xl:justify-stretch phone-xl:[&>button]:flex-1">
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
