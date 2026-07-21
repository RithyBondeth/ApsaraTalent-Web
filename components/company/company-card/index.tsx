"use client";

import { IJobPosition } from "@/utils/interfaces/user/company.interface";
import {
  LucideBookmark,
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideCircleArrowRight,
  LucideClock,
  LucideEye,
  LucideHeartHandshake,
  LucideLoader2,
  LucideMapPin,
  LucideSparkles,
  LucideUsers,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import CachedAvatar from "../../ui/cached-avatar";
import Tag from "@/components/utils/data-display/tag";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import CompanyDialog from "../company-dialog";
import { ICompanyCardProps } from "./props";
import IconLabel from "@/components/utils/data-display/icon-label";
import { useTranslations } from "next-intl";
import { translateLocation, getNameInitials } from "@/utils/functions/text";

export default function CompanyCard(props: ICompanyCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("feed");
  const tl = useTranslations("locations");
  const isGrid = props.variant === "grid";

  /* -------------------------------- All States ------------------------------ */
  const [openCompanyDialog, setOpenCompanyDialog] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Click Dialog ─────────────────────────────────────────
  const handleClickDialog = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenCompanyDialog(true);
  };

  /* --------------------------------- Effects --------------------------------- */
  // ── Prevent Reopening Immediately After Closing ────────────────
  useEffect(() => {
    if (!openCompanyDialog) {
      ignoreNextClick.current = true;
      setTimeout(() => (ignoreNextClick.current = false), 200);
    }
  }, [openCompanyDialog]);

  /* -------------------------------- Render UI -------------------------------- */
  // ── Grid variant: flat card, top border divider, no vertical gap ──────────
  if (isGrid) {
    return (
      <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_1px_2px_hsl(var(--foreground)/0.03),0_8px_24px_hsl(var(--foreground)/0.035)] transition duration-200 hover:border-primary/30 hover:shadow-[0_12px_32px_hsl(var(--foreground)/0.08)]">
        <div className="flex items-start gap-3.5 px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
          {/* Avatar Section */}
          <CachedAvatar
            src={props.avatar}
            alt={props.name}
            className="size-14 shrink-0 border border-border shadow-sm"
            rounded="md"
            onClick={props.onProfileImageClick}
            preload={true}
            showLoadingState={true}
          >
            {getNameInitials(props.name)}
          </CachedAvatar>

          {/* Company Info Section */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold leading-tight text-foreground">
              {props.name}
            </h3>
            <p className="mt-1 truncate text-xs font-medium text-primary">
              {props.industry}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <LucideMapPin className="size-3.5" />
                {translateLocation(props.location, tl)}
              </span>
              <span className="inline-flex items-center gap-1">
                <LucideUsers className="size-3.5" />
                {t("companyPeopleCount", { count: props.companySize })}
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

        {/* Company Content Section */}
        <div className="flex flex-1 flex-col gap-3 px-4 pb-4 sm:px-5 sm:pb-5">
          {/* Recommendation Section */}
          {props.isRecommended && (
            <div className="flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/[0.055] px-3 py-2.5 text-xs leading-relaxed text-[hsl(var(--brand-soft-foreground))] dark:text-[hsl(var(--brand-soft-foreground))]">
              <LucideSparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                <strong className="font-semibold">{t("topMatch")}</strong>
                <span className="mx-1 text-muted-foreground">·</span>
                {t("companyRecommendationReason")}
              </span>
            </div>
          )}

          <TypographyMuted className="line-clamp-2 text-sm leading-relaxed">
            {props.description}
          </TypographyMuted>

          {props.openPositions.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
                <LucideBriefcaseBusiness className="size-3.5 text-primary" />
                {t("openPositionCount", { count: props.openPositions.length })}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {props.openPositions
                  .slice(0, 3)
                  .map((item: IJobPosition, index) => (
                    <Tag key={index} label={item.title} />
                  ))}
                {props.openPositions.length > 3 && (
                  <span className="self-center text-xs font-medium text-muted-foreground">
                    {t("moreItems", { count: props.openPositions.length - 3 })}
                  </span>
                )}
              </div>
            </div>
          )}

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
                  {t("viewJobs")}
                  <LucideCircleArrowRight className="!size-4" />
                </Link>
              </Button>
            ) : (
              <Button
                className="h-11 rounded-xl text-xs font-semibold shadow-none"
                onClick={props.onViewClick}
              >
                {t("viewJobs")}
                <LucideCircleArrowRight className="!size-4" />
              </Button>
            )}
          </div>
        </div>
      </article>
    );
  }

  // ── Default Variant Section ───────────────────────────────────────────────
  return (
    <div className="h-fit w-full flex flex-col items-start gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-[0_2px_8px_hsl(var(--foreground)/0.05)] cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_36px_hsl(var(--foreground)/0.11)] hover:border-primary/25">
      {/* Main Content Section */}
      <div className="w-full flex flex-wrap items-start justify-between gap-3">
        {/* Header Section: Avatar + Info + Actions */}
        <div className="flex items-center gap-3">
          <CachedAvatar
            src={props.avatar}
            alt={props.name}
            className="size-20 laptop-sm:size-16"
            rounded="md"
            onClick={props.onProfileImageClick}
            preload={true}
            showLoadingState={true}
          >
            {props.name.slice(0, 3)}
          </CachedAvatar>
          <div className="flex flex-col items-start gap-1 min-w-0">
            <TypographyP className="font-semibold truncate max-w-full">
              {props.name}
            </TypographyP>
            <TypographySmall className="text-xs flex items-center gap-1 text-muted-foreground">
              <LucideUsers className="size-3 " />
              <span>{t("employeeCount", { count: props.companySize })}</span>
            </TypographySmall>
            <TypographySmall className="text-xs flex items-center gap-1 text-muted-foreground">
              <LucideMapPin className="size-3 " />
              <span>{translateLocation(props.location, tl)}</span>
            </TypographySmall>
          </div>
        </div>

        {/* Action Buttons Section */}
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

      {/* Industry and Description Section */}
      <div className="w-full flex flex-col gap-3">
        <IconLabel
          text={t("industryLabel")}
          icon={<LucideBuilding strokeWidth={"1.5px"} />}
          className="[&>p]:text-primary [&>p]:font-medium"
        />
        <TypographyMuted className="leading-relaxed">
          {props.description}
        </TypographyMuted>
      </div>

      {/* OpenPosition and Availability Tag Section */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <IconLabel
            text={t("openPositionCount", { count: props.openPositions.length })}
            icon={<LucideBriefcaseBusiness strokeWidth={"1.5px"} />}
            className="[&>p]:text-primary [&>p]:font-medium"
          />
          <div className="w-full flex flex-wrap gap-2">
            {props.openPositions.map((item: IJobPosition, index) => (
              <Tag key={index} label={item.title} />
            ))}
          </div>
        </div>
        {props.availableTimes && props.availableTimes.length > 0 && (
          <div className="flex flex-col gap-3">
            <IconLabel
              text={t("availableTime", { count: props.availableTimes.length })}
              icon={<LucideClock strokeWidth={"1.5px"} />}
              className="[&>p]:text-primary [&>p]:font-medium"
            />
            <div className="w-full flex flex-wrap gap-2">
              {props.availableTimes.map((item, index) => (
                <Tag key={index} label={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Section: Save, View Buttons */}
      <div className="w-full flex items-center justify-end gap-2 sm:gap-3 tablet-lg:justify-stretch tablet-lg:[&>button]:flex-1 phone-xl:justify-stretch phone-xl:[&>button]:flex-1">
        {!props.hideSaveButton && (
          <Button
            className="text-xs"
            variant="outline"
            onClick={props.onSaveClick}
          >
            {t("save")}
            <LucideBookmark />
          </Button>
        )}
        <Button className="text-xs" onClick={props.onViewClick}>
          {t("view")}
          <LucideCircleArrowRight />
        </Button>
      </div>

      {/* Company Dialog Section */}
      <CompanyDialog
        open={openCompanyDialog}
        setOpen={setOpenCompanyDialog}
        {...props}
      />
    </div>
  );
}
