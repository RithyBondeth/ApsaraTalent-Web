import { IJobPosition } from "@/utils/interfaces/user/company.interface";
import {
  LucideBookmark,
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideCircleArrowRight,
  LucideClock,
  LucideEye,
  LucideHeartHandshake,
  LucideMapPin,
  LucideUsers,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import CachedAvatar from "../../ui/cached-avatar";
import IconLabel from "@/components/utils/data-display/icon-label";
import Tag from "@/components/utils/data-display/tag";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import CompanyDialog from "../company-dialog";
import { ICompanyCardProps } from "./props";

export default function CompanyCard(props: ICompanyCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
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
        <div className="group relative w-full flex flex-col rounded-xl border border-muted bg-card cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_hsl(var(--foreground)/0.08)] hover:border-primary/20">
          {/* Main Content  Section*/}
          <div className="flex flex-col gap-3 px-4 pt-4 pb-3">
            {/* Header Section: Avatar + Info + Actions */}
            <div className="flex items-start gap-3">
              <CachedAvatar
                src={props.avatar}
                alt={props.name}
                className="size-12 shrink-0 ring-2 ring-background shadow-sm"
                rounded="md"
                onClick={props.onProfileImageClick}
                preload={true}
                showLoadingState={true}
              >
                {props.name.slice(0, 2)}
              </CachedAvatar>

              <div className="flex-1 min-w-0">
                <TypographyP className="!m-0 font-semibold text-sm truncate leading-tight">
                  {props.name}
                </TypographyP>
                <div className="flex items-center gap-3 mt-0.5">
                  <TypographySmall className="text-[11px] flex items-center gap-1 text-muted-foreground">
                    <LucideUsers className="size-3 shrink-0" />
                    <span>
                      {props.companySize <= 1
                        ? `${props.companySize} employee`
                        : `${props.companySize} employees`}
                    </span>
                  </TypographySmall>
                  <TypographySmall className="text-[11px] flex items-center gap-1 text-muted-foreground">
                    <LucideMapPin className="size-3 shrink-0" />
                    <span className="truncate">{props.location}</span>
                  </TypographySmall>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                  onClick={handleClickDialog}
                >
                  <LucideEye className="!size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-200"
                  onClick={props.onLikeClick}
                  disabled={props.onLikeClickDisable}
                >
                  <LucideHeartHandshake
                    className={`!size-4${props.onLikeClickDisable ? " animate-pop-shrink text-rose-500" : ""}`}
                  />
                </Button>
              </div>
            </div>

            {/* Description Section */}
            <TypographyMuted className="text-xs leading-relaxed line-clamp-2">
              {props.description}
            </TypographyMuted>

            {/* Open Positions Tags Section */}
            {props.openPositions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {props.openPositions
                  .slice(0, 3)
                  .map((item: IJobPosition, index) => (
                    <Tag key={index} label={item.title} />
                  ))}
                {props.openPositions.length > 3 && (
                  <span className="text-[11px] text-muted-foreground self-center font-medium">
                    +{props.openPositions.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer Section: Save, View Buttons */}
          <div className="flex items-center justify-end gap-2 px-4 pb-3 pt-0">
            <Button
              className={`text-xs h-7 px-3 rounded-full ${
                props.hideSaveButton
                  ? "animate-pop-shrink pointer-events-none"
                  : "opacity-100 scale-100"
              }`}
              variant="outline"
              size="sm"
              onClick={props.onSaveClick}
            >
              <LucideBookmark className="!size-3" />
              Save
            </Button>
            {props.viewHref ? (
              <Button
                className="text-xs h-7 px-3 rounded-full"
                size="sm"
                asChild
              >
                <Link href={props.viewHref} prefetch={true}>
                  View
                  <LucideCircleArrowRight className="!size-3" />
                </Link>
              </Button>
            ) : (
              <Button
                className="text-xs h-7 px-3 rounded-full"
                size="sm"
                onClick={props.onViewClick}
              >
                View
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

  // ── Default variant: bordered card with shadow ──────────
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
              <span>
                {props.companySize <= 1
                  ? `${props.companySize} employee`
                  : `${props.companySize} employees`}
              </span>
            </TypographySmall>
            <TypographySmall className="text-xs flex items-center gap-1 text-muted-foreground">
              <LucideMapPin className="size-3 " />
              <span>{props.location}</span>
            </TypographySmall>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            className="size-10 sm:size-12 rounded-xl transition-all duration-300 ease-out hover:scale-110 active:scale-95"
            onClick={handleClickDialog}
          >
            <LucideEye className="!size-5 sm:!size-6 transition-all duration-300 ease-in-out" />
          </Button>
          <Button
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
          text="Industry"
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
            text={`${
              props.openPositions.length <= 1
                ? `${props.openPositions.length} Open Position`
                : `${props.openPositions.length} Open Positions`
            }`}
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
              text={
                props.availableTimes.length > 1
                  ? "Available times"
                  : "Available time"
              }
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
        <Button
          className={`text-xs ${
            props.hideSaveButton
              ? "animate-pop-shrink pointer-events-none"
              : "opacity-100 scale-100"
          }`}
          variant="outline"
          onClick={props.onSaveClick}
        >
          Save
          <LucideBookmark />
        </Button>
        <Button className="text-xs" onClick={props.onViewClick}>
          View
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
