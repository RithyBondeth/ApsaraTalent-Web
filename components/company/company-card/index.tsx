"use client";

import { IJobPosition } from "@/utils/interfaces/user/company.interface";
import {
  LucideBookmark,
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideBuilding2,
  LucideCalendar,
  LucideCircleArrowRight,
  LucideClock,
  LucideEye,
  LucideHeartHandshake,
  LucideLoader2,
  LucideMapPin,
  LucideUsers,
} from "lucide-react";
import Image from "next/image";
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
      <>
        <div className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-none border border-border/70 bg-card shadow-[0_2px_8px_hsl(var(--foreground)/0.05)] transition-all duration-300 ease-out hover:z-10 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-[0_16px_48px_hsl(var(--foreground)/0.13)] active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_8px_hsl(var(--foreground)/0.05)]">
          {/* Cover Banner Section */}
          <div className="relative h-32 w-full shrink-0 overflow-hidden bg-gradient-to-br from-muted via-background to-muted/40 tablet-md:h-24">
            {props.cover && (
              <Image
                src={props.cover}
                alt="cover"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            )}
            {/* Like Button and Dialog Button Section */}
            <div className="absolute top-2 right-2 flex justify-center items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                aria-label="Like"
                className="size-8 rounded-none border border-border/70 bg-background/90 text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:bg-foreground hover:text-background"
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
                className="size-8 rounded-none border border-border/70 bg-background/90 text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:bg-foreground hover:text-background"
                onClick={handleClickDialog}
              >
                <LucideEye className="!size-4" />
              </Button>
            </div>
          </div>

          {/* Avatar and Identity Section */}
          <div className="z-10 -mt-7 flex items-end justify-between gap-3 px-4 tablet-md:-mt-6">
            <CachedAvatar
              src={props.avatar}
              alt={props.name}
              className="size-16 shrink-0 border-4 border-card shadow-none tablet-md:size-14"
              rounded="none"
              onClick={props.onProfileImageClick}
              preload={true}
              showLoadingState={true}
            >
              {getNameInitials(props.name)}
            </CachedAvatar>
          </div>

          {/* Main Content Section */}
          <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3 tablet-md:gap-2.5">
            {/* Name and Meta Section */}
            <div className="flex flex-col gap-1">
              <TypographyP className="!m-0 text-base font-black leading-tight tracking-[-0.02em]">
                {props.name}
              </TypographyP>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <TypographySmall className="text-[11px] flex items-center gap-1 text-muted-foreground">
                  <LucideBuilding2 className="size-3 shrink-0" />
                  <span className="truncate">{props.industry}</span>
                </TypographySmall>
                <TypographySmall className="text-[11px] flex items-center gap-1 text-muted-foreground">
                  <LucideMapPin className="size-3 shrink-0" />
                  <span className="truncate">
                    {translateLocation(props.location, tl)}
                  </span>
                </TypographySmall>
                <TypographySmall className="text-[11px] flex items-center gap-1 text-muted-foreground">
                  <LucideUsers className="size-3 shrink-0" />
                  <span>
                    {t("companyPeopleCount", { count: props.companySize })}
                  </span>
                </TypographySmall>
                {props.foundedYear && (
                  <TypographySmall className="text-[11px] flex items-center gap-1 text-muted-foreground">
                    <LucideCalendar className="size-3 shrink-0" />
                    <span>{t("established", { year: props.foundedYear })}</span>
                  </TypographySmall>
                )}
              </div>
            </div>

            {/* Description Section */}
            <TypographyMuted className="text-xs leading-relaxed line-clamp-2 tablet-md:line-clamp-1">
              {props.description}
            </TypographyMuted>

            {/* Open Positions Section */}
            {props.openPositions.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <TypographySmall className="text-[11px] font-semibold text-foreground/70 flex items-center gap-1">
                  <LucideBriefcaseBusiness className="size-3" />
                  {t("openPositionCount", {
                    count: props.openPositions.length,
                  })}
                </TypographySmall>
                <div className="flex flex-wrap gap-1.5">
                  {props.openPositions
                    .slice(0, 3)
                    .map((item: IJobPosition, index) => (
                      <Tag
                        key={index}
                        label={item.title}
                        neutral
                        className="!rounded-none border border-border hover:shadow-none"
                      />
                    ))}
                  {props.openPositions.length > 3 && (
                    <span className="text-[11px] text-muted-foreground self-center font-medium">
                      {t("moreItems", {
                        count: props.openPositions.length - 3,
                      })}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Benefits Section */}
            {props.benefits && props.benefits.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {props.benefits.slice(0, 3).map((b, i) => (
                  <Tag
                    key={i}
                    label={b.label}
                    neutral
                    className="!rounded-none border border-border hover:shadow-none"
                  />
                ))}
                {props.benefits.length > 3 && (
                  <span className="text-[11px] text-muted-foreground self-center font-medium">
                    {t("moreItems", { count: props.benefits.length - 3 })}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
            {!props.hideSaveButton && (
              <Button
                className="h-8 rounded-none px-3 text-xs"
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
            {props.viewHref ? (
              <Button
                className="h-8 rounded-none px-3 text-xs"
                size="sm"
                asChild
              >
                <Link href={props.viewHref} prefetch={true}>
                  {t("view")}
                  <LucideCircleArrowRight className="!size-3" />
                </Link>
              </Button>
            ) : (
              <Button
                className="h-8 rounded-none px-3 text-xs"
                size="sm"
                onClick={props.onViewClick}
              >
                {t("view")}
                <LucideCircleArrowRight className="!size-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Company Dialog Section */}
        <CompanyDialog
          open={openCompanyDialog}
          setOpen={setOpenCompanyDialog}
          {...props}
        />
      </>
    );
  }

  // ── Default Variant Section ───────────────────────────────────────────────
  return (
    <div className="h-fit w-full flex flex-col items-start gap-4 rounded-none border border-border border-t-[5px] border-t-foreground bg-card p-4 shadow-[5px_5px_0_hsl(var(--foreground)/0.055)] cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[8px_8px_0_hsl(var(--foreground)/0.08)] hover:border-foreground/40">
      {/* Main Content Section */}
      <div className="w-full flex flex-wrap items-start justify-between gap-3">
        {/* Header Section: Avatar + Info + Actions */}
        <div className="flex items-center gap-3">
          <CachedAvatar
            src={props.avatar}
            alt={props.name}
            className="size-20 laptop-sm:size-16"
            rounded="none"
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
            className="size-10 sm:size-12 rounded-none transition-all duration-300 ease-out hover:scale-105 active:scale-95"
            onClick={handleClickDialog}
          >
            <LucideEye className="!size-5 sm:!size-6 transition-all duration-300 ease-in-out" />
          </Button>
          <Button
            aria-label="Like"
            className="size-10 sm:size-12 rounded-none transition-all duration-300 ease-out hover:scale-105 active:scale-95"
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
            className="text-xs rounded-none"
            variant="outline"
            onClick={props.onSaveClick}
          >
            {t("save")}
            <LucideBookmark />
          </Button>
        )}
        <Button className="text-xs rounded-none" onClick={props.onViewClick}>
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
