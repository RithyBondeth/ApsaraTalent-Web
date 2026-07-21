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
  LucideSparkles,
  LucideTimer,
} from "lucide-react";
import Link from "next/link";
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
      <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_1px_2px_hsl(var(--foreground)/0.03),0_8px_24px_hsl(var(--foreground)/0.035)] transition duration-200 hover:border-primary/30 hover:shadow-[0_12px_32px_hsl(var(--foreground)/0.08)]">
        {/* Employee Card Header Section */}
        <div className="flex items-start gap-3.5 px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
          {/* Avatar Section */}
          <CachedAvatar
            src={props.avatar}
            alt={props.username ?? "Profile"}
            className="size-14 shrink-0 border border-border shadow-sm"
            rounded="md"
            onClick={props.onProfileImageClick}
            preload={true}
            showLoadingState={true}
          >
            {props.username?.slice(0, AVATAR_INITIALS_LENGTH)}
          </CachedAvatar>

          {/* Employee Info Section */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold leading-tight text-foreground">
              {props.username}
            </h3>
            <p className="mt-1 truncate text-xs font-medium text-primary">
              {props.job}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {props.location && (
                <span className="inline-flex items-center gap-1">
                  <LucideMapPin className="size-3.5" />
                  {translateLocation(props.location, tl)}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <LucideTimer className="size-3.5" />
                {props.yearsOfExperience}
              </span>
            </div>
          </div>

          {/* Save Button Section */}
          {!props.hideSaveButton ? (
            <Button
              size="icon"
              variant="ghost"
              aria-label={t("save")}
              className="size-10 shrink-0 rounded-xl border border-border/80 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              onClick={props.onSaveClick}
              disabled={props.onSaveClickDisable}
            >
              {props.onSaveClickDisable ? (
                <LucideLoader2 className="!size-4 animate-spin" />
              ) : (
                <LucideBookmark className="!size-4" />
              )}
            </Button>
          ) : (
            <span
              title={t("saved")}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <LucideBookmark className="size-4 fill-current" />
              <span className="sr-only">{t("saved")}</span>
            </span>
          )}
        </div>

        {/* Employee Card Content Section */}
        <div className="flex flex-1 flex-col gap-3 px-4 pb-4 sm:px-5 sm:pb-5">
          {/* Recommendation Section */}
          {props.isRecommended && (
            <div className="flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/[0.055] px-3 py-2.5 text-xs leading-relaxed text-[hsl(var(--brand-soft-foreground))] dark:text-[hsl(var(--brand-soft-foreground))]">
              <LucideSparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                <strong className="font-semibold">{t("topMatch")}</strong>
                <span className="mx-1 text-muted-foreground">·</span>
                {t("talentRecommendationReason")}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            <Tag label={formatAvailabilityWords(props.availability)} />
            {props.skills.slice(0, 3).map((skill) => (
              <Tag key={skill.id} label={skill.name} />
            ))}
            {props.skills.length > 3 && (
              <span className="self-center text-xs font-medium text-muted-foreground">
                +{props.skills.length - 3}
              </span>
            )}
          </div>

          {/* Employee Experience and Education Section */}
          <div className="flex flex-col gap-1.5">
            {latestExp && (
              <TypographySmall className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <LucideBriefcase className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <span className="line-clamp-1">{latestExp.title}</span>
              </TypographySmall>
            )}
            {latestEdu && (
              <TypographySmall className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <LucideGraduationCap className="mt-0.5 size-3.5 shrink-0" />
                <span className="line-clamp-1">
                  {latestEdu.degree} · {latestEdu.school}
                </span>
              </TypographySmall>
            )}
          </div>

          <TypographyMuted className="line-clamp-2 text-sm leading-relaxed">
            {props.description}
          </TypographyMuted>

          {/* Action Buttons Section */}
          <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border/60 pt-4">
            <Button
              variant="outline"
              className="h-11 rounded-xl border-border text-xs font-semibold hover:border-primary/35 hover:bg-primary/5 hover:text-primary"
              onClick={props.onLikeClick}
              disabled={props.onLikeClickDisable}
            >
              {props.onLikeClickDisable ? (
                <LucideLoader2 className="!size-4 animate-spin" />
              ) : (
                <LucideHeartHandshake className="!size-4" />
              )}
              {t("interested")}
            </Button>
            {props.viewHref ? (
              <Button
                className="h-11 rounded-xl text-xs font-semibold shadow-none"
                asChild
              >
                <Link href={props.viewHref} prefetch={true}>
                  {t("viewProfile")}
                  <LucideCircleArrowRight className="!size-4" />
                </Link>
              </Button>
            ) : (
              <Button
                className="h-11 rounded-xl text-xs font-semibold shadow-none"
                onClick={props.onViewClick}
              >
                {t("viewProfile")}
                <LucideCircleArrowRight className="!size-4" />
              </Button>
            )}
          </div>
        </div>
      </article>
    );
  }

  // ─── Default Variant Section ──────────────────────────────────
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
