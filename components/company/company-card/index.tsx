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
import { translateLocation } from "@/utils/functions/text";

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
  // ── Prevent Reopening Immediately After Closing ─────────────────────────
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
        <div className="group relative w-full flex flex-col rounded-xl border border-muted bg-card overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_hsl(var(--foreground)/0.10)] hover:border-primary/30">
          {/* Cover Banner Section */}
          <div className="relative h-24 w-full shrink-0 bg-gradient-to-br from-primary/15 via-primary/8 to-muted/30 overflow-hidden">
            {props.cover && (
              <Image
                src={props.cover}
                alt="cover"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            )}
            {/* Like Button Section */}
            <Button
              size="icon"
              variant="ghost"
              aria-label="Like"
              className="absolute top-2 right-2 size-8 rounded-full bg-background/70 backdrop-blur-sm text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-200"
              onClick={props.onLikeClick}
              disabled={props.onLikeClickDisable}
            >
              <LucideHeartHandshake
                className={`!size-4${props.onLikeClickDisable ? " animate-pop-shrink text-rose-500" : ""}`}
              />
            </Button>
          </div>

          {/* Avatar + Identity row */}
          <div className="flex items-end justify-between gap-3 px-4 -mt-6 z-10">
            <CachedAvatar
              src={props.avatar}
              alt={props.name}
              className="size-14 shrink-0 ring-2 ring-card shadow-md"
              rounded="md"
              onClick={props.onProfileImageClick}
              preload={true}
              showLoadingState={true}
            >
              {props.name.slice(0, 2)}
            </CachedAvatar>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Quick view"
              className="size-8 mb-1 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
              onClick={handleClickDialog}
            >
              <LucideEye className="!size-4" />
            </Button>
          </div>

          {/* Main Content Section */}
          <div className="flex flex-col gap-3 px-4 pt-2 pb-3">
            {/* Name and Meta Section */}
            <div className="flex flex-col gap-1">
              <TypographyP className="!m-0 font-semibold text-sm leading-tight">
                {props.name}
              </TypographyP>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <TypographySmall className="text-[11px] flex items-center gap-1 text-muted-foreground">
                  <LucideBuilding2 className="size-3 shrink-0" />
                  <span className="truncate">{props.industry}</span>
                </TypographySmall>
                <TypographySmall className="text-[11px] flex items-center gap-1 text-muted-foreground">
                  <LucideMapPin className="size-3 shrink-0" />
                  <span className="truncate">{translateLocation(props.location, tl)}</span>
                </TypographySmall>
                <TypographySmall className="text-[11px] flex items-center gap-1 text-muted-foreground">
                  <LucideUsers className="size-3 shrink-0" />
                  <span>{t("companyPeopleCount", { count: props.companySize })}</span>
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
            <TypographyMuted className="text-xs leading-relaxed line-clamp-2">
              {props.description}
            </TypographyMuted>

            {/* Open Positions Section */}
            {props.openPositions.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <TypographySmall className="text-[11px] font-semibold text-foreground/70 flex items-center gap-1">
                  <LucideBriefcaseBusiness className="size-3" />
                  {t("openPositionCount", { count: props.openPositions.length })}
                </TypographySmall>
                <div className="flex flex-wrap gap-1.5">
                  {props.openPositions
                    .slice(0, 3)
                    .map((item: IJobPosition, index) => (
                      <Tag key={index} label={item.title} />
                    ))}
                  {props.openPositions.length > 3 && (
                    <span className="text-[11px] text-muted-foreground self-center font-medium">
                      {t("moreItems", { count: props.openPositions.length - 3 })}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Benefits Section */}
            {props.benefits && props.benefits.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {props.benefits.slice(0, 3).map((b, i) => (
                  <Tag key={i} label={b.label} />
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
          <div className="flex items-center justify-end gap-2 px-4 pb-3 pt-2 border-t border-muted/50">
            {!props.hideSaveButton && (
              <Button
                className="text-xs h-7 px-3 rounded-full"
                variant="outline"
                size="sm"
                onClick={props.onSaveClick}
              >
                <LucideBookmark className="!size-3" />
                {t("save")}
              </Button>
            )}
            {props.viewHref ? (
              <Button
                className="text-xs h-7 px-3 rounded-full"
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
                className="text-xs h-7 px-3 rounded-full"
                size="sm"
                onClick={props.onViewClick}
              >
                {t("view")}
                <LucideCircleArrowRight className="!size-3" />
              </Button>
            )}
          </div>
        </div>

        <CompanyDialog
          open={openCompanyDialog}
          setOpen={setOpenCompanyDialog}
          {...props}
        />
      </>
    );
  }

  // ── Default Variant Section ──────────────────────────────────────────────────────────
  return (
    <div className="h-fit w-full flex flex-col items-start gap-4 rounded-lg border border-muted p-3 shadow-sm cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_28px_hsl(var(--foreground)/0.1)] hover:border-primary/25">
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
