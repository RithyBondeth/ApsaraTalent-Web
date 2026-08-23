"use client";

import { IJobPosition } from "@/utils/interfaces/user/company.interface";
import {
  LucideBookmark,
  LucideBriefcaseBusiness,
  LucideBuilding2,
  LucideCalendar,
  LucideCircleArrowRight,
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
import { BenefitValueChip } from "@/components/utils/data-display/benefit-value-chip";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import CompanyDialog from "../company-dialog";
import { ICompanyCardProps } from "./props";
import { useTranslations } from "next-intl";
import { translateLocation, getNameInitials } from "@/utils/functions/text";

export default function CompanyCard(props: ICompanyCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("feed");
  const tl = useTranslations("locations");

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
  return (
    <>
      <div className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-none border border-border bg-card transition-all duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:border-foreground/35 hover:border-t-foreground hover:shadow-hard-lg active:translate-y-0 active:scale-[0.985] active:shadow-none">
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
          <div className="absolute right-2 top-2 flex items-center justify-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Like"
              className="size-8 rounded-none border border-border bg-background/90 text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
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
              className="size-8 rounded-none border border-border bg-background/90 text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
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
              <TypographySmall className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <LucideBuilding2 className="size-3 shrink-0" />
                <span className="truncate">{props.industry}</span>
              </TypographySmall>
              <TypographySmall className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <LucideMapPin className="size-3 shrink-0" />
                <span className="truncate">
                  {translateLocation(props.location, tl)}
                </span>
              </TypographySmall>
              <TypographySmall className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <LucideUsers className="size-3 shrink-0" />
                <span>
                  {t("companyPeopleCount", { count: props.companySize })}
                </span>
              </TypographySmall>
              {props.foundedYear && (
                <TypographySmall className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <LucideCalendar className="size-3 shrink-0" />
                  <span>{t("established", { year: props.foundedYear })}</span>
                </TypographySmall>
              )}
            </div>
          </div>

          {/* Description Section */}
          <TypographyMuted className="line-clamp-2 text-xs leading-relaxed tablet-md:line-clamp-1">
            {props.description}
          </TypographyMuted>

          {/* Open Positions Section */}
          {props.openPositions.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <TypographySmall className="flex items-center gap-1 text-[11px] font-semibold text-foreground/70">
                <LucideBriefcaseBusiness className="size-3" />
                {t("openPositionCount", {
                  count: props.openPositions.length,
                })}
              </TypographySmall>
              <div className="flex flex-wrap gap-1.5">
                {props.openPositions
                  .slice(0, 3)
                  .map((item: IJobPosition, index) => (
                    <Tag key={index} label={item.title} />
                  ))}
                {props.openPositions.length > 3 && (
                  <span className="self-center text-[11px] font-medium text-muted-foreground">
                    {t("moreItems", {
                      count: props.openPositions.length - 3,
                    })}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Benefits Section */}
          {/* The chip, not a neutral Tag: this row sits directly under the
              open-positions row, and as two identical neutral tag rows there
              was nothing to tell a job title from a benefit. */}
          {props.benefits && props.benefits.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {props.benefits.slice(0, 3).map((b, i) => (
                <BenefitValueChip
                  key={i}
                  kind="benefit"
                  label={b.label}
                  className="px-2 py-1"
                />
              ))}
              {props.benefits.length > 3 && (
                <span className="self-center text-[11px] font-medium text-muted-foreground">
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
            <Button className="h-8 rounded-none px-3 text-xs" size="sm" asChild>
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
