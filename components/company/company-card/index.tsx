"use client";

import { cn } from "@/lib/utils";
import { IJobPosition } from "@/utils/interfaces/user/company.interface";
import {
  Eye,
  LucideBookmark,
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideBuilding2,
  LucideCircleArrowRight,
  LucideClock,
  LucideHeartHandshake,
  LucideLoader2,
  LucideMapPin,
  LucideUsers,
  MoveUpRight,
} from "lucide-react";
import { PixelPattern } from "@/components/utils/brand/pixel-pattern";
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
  // A cover that 404s or is blocked by next/image config used to leave a
  // broken-image glyph in the corner; falling back to the field hides it.
  const [coverFailed, setCoverFailed] = useState<boolean>(false);
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
        <div className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden bg-card transition-colors duration-200 ease-out hover:bg-muted/35">
          {/* Cover Banner Section
              The strip always renders so cards keep a common height, and it
              falls back to the pixel field when there is no cover — or when
              one fails to load, which is what used to leave a broken-image
              glyph in the corner.
              The field, not the mosaic: this is quiet ground behind a header,
              and a saturated mosaic here competed with the card's own content.
              Seeded from the id so each company's ground is its own. */}
          <div className="relative h-20 w-full shrink-0 overflow-hidden bg-muted/30 tablet-md:h-16">
            {props.cover && !coverFailed ? (
              <Image
                src={props.cover}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                onError={() => setCoverFailed(true)}
              />
            ) : (
              <PixelPattern
                seed={props.id ?? props.name}
                cell={16}
                density={0.42}
              />
            )}
          </div>

          {/* Header Section — avatar, identity and actions in one row, the
              same shape the employee card uses, so the two are one family. */}
          <div className="flex items-start gap-3 p-4">
            <CachedAvatar
              src={props.avatar}
              alt={props.name}
              className="size-14 shrink-0 border border-border shadow-none"
              rounded="none"
              onClick={props.onProfileImageClick}
              preload={true}
              showLoadingState={true}
            >
              {getNameInitials(props.name)}
            </CachedAvatar>

            <div className="min-w-0 flex-1">
              <TypographyP className="pixel-display !m-0 truncate text-lg">
                {props.name}
              </TypographyP>
              <TypographySmall className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                <LucideBuilding2 className="size-3 shrink-0" />
                <span className="truncate">{props.industry}</span>
              </TypographySmall>
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

          {/* Record Strip Section — the same divided readings the employee card
              uses, so the two card types are visibly one family. */}
          <div className="grid grid-cols-3 border-y border-border">
            <div className="min-w-0 border-r border-border px-3 py-3">
              <span className="pixel-label block text-[10px] text-muted-foreground">
                {t("location")}
              </span>
              <span className="mt-1.5 block truncate text-xs text-foreground">
                {translateLocation(props.location, tl)}
              </span>
            </div>
            <div className="min-w-0 border-r border-border px-3 py-3">
              <span className="pixel-label block text-[10px] text-muted-foreground">
                {t("people")}
              </span>
              <span className="pixel-numeral mt-1.5 block truncate text-xs text-foreground">
                {props.companySize}
              </span>
            </div>
            <div className="min-w-0 px-3 py-3">
              <span className="pixel-label block text-[10px] text-muted-foreground">
                {t("founded")}
              </span>
              <span className="pixel-numeral mt-1.5 block truncate text-xs text-foreground">
                {props.foundedYear ?? "—"}
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3 tablet-md:gap-2.5">
            {/* Description Section */}
            <TypographyMuted className="line-clamp-2 text-xs leading-relaxed tablet-md:line-clamp-1">
              {props.description}
            </TypographyMuted>

            {/* Open Positions Section */}
            {props.openPositions.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <TypographySmall className="pixel-label flex items-center gap-1.5 text-[10px] text-muted-foreground">
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
                        className="border border-border hover:shadow-none"
                      />
                    ))}
                  {props.openPositions.length > 3 && (
                    <span className="pixel-numeral self-center text-[11px] text-muted-foreground">
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
                    className="border border-border hover:shadow-none"
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
                className="h-8 px-3 text-xs"
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
              <Button className="h-8 px-3 text-xs" size="sm" asChild>
                <Link href={props.viewHref} prefetch={true}>
                  {t("view")}
                  <LucideCircleArrowRight className="!size-3" />
                </Link>
              </Button>
            ) : (
              <Button
                className="h-8 px-3 text-xs"
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
    <div className="flex h-fit w-full cursor-pointer flex-col items-start gap-4 border-b border-border bg-card p-5 transition-colors duration-200 ease-out hover:bg-muted/35">
      {/* Main Content Section */}
      <div className="flex w-full flex-wrap items-start justify-between gap-3">
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
          <div className="flex min-w-0 flex-col items-start gap-1">
            <TypographyP className="max-w-full truncate font-medium">
              {props.name}
            </TypographyP>
            <TypographySmall className="flex items-center gap-1 text-xs text-muted-foreground">
              <LucideUsers className="size-3" />
              <span>{t("employeeCount", { count: props.companySize })}</span>
            </TypographySmall>
            <TypographySmall className="flex items-center gap-1 text-xs text-muted-foreground">
              <LucideMapPin className="size-3" />
              <span>{translateLocation(props.location, tl)}</span>
            </TypographySmall>
          </div>
        </div>

        {/* Action Buttons Section */}
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

      {/* Industry and Description Section */}
      <div className="flex w-full flex-col gap-3">
        <IconLabel
          text={t("industryLabel")}
          icon={<LucideBuilding strokeWidth={"1.5px"} />}
          className="[&>p]:font-medium [&>p]:text-primary"
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
            className="[&>p]:font-medium [&>p]:text-primary"
          />
          <div className="flex w-full flex-wrap gap-2">
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
              className="[&>p]:font-medium [&>p]:text-primary"
            />
            <div className="flex w-full flex-wrap gap-2">
              {props.availableTimes.map((item, index) => (
                <Tag key={index} label={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Section: Save, View Buttons */}
      <div className="flex w-full items-center justify-end gap-2 phone-xl:justify-stretch tablet-lg:justify-stretch sm:gap-3 phone-xl:[&>button]:flex-1 tablet-lg:[&>button]:flex-1">
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
