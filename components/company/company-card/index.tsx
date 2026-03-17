"use client";

import { IJobPosition } from "@/utils/interfaces/user-interface/company.interface";
import {
    LucideBookmark,
    LucideBriefcaseBusiness,
    LucideBuilding,
    LucideCircleArrowRight,
    LucideClock,
    LucideEye, LucideHeartHandshake, LucideMapPin,
    LucideUsers
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import CachedAvatar from "../../ui/cached-avatar";
import IconLabel from "../../utils/icon-label";
import Tag from "../../utils/tag";
import { TypographyMuted } from "../../utils/typography/typography-muted";
import { TypographyP } from "../../utils/typography/typography-p";
import { TypographySmall } from "../../utils/typography/typography-small";
import CompanyDialog from "../company-dialog";
import { ICompanyCardProps } from "./props";

export default function CompanyCard(props: ICompanyCardProps) {
  // Utils
  const [openCompanyDialog, setOpenCompanyDialog] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);

  // Handle Click Dialog
  const handleClickDialog = (e: React.MouseEvent) => {
    // Prevent reopening immediately after closing
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }

    // Check if the click happened inside the DialogContent
    if ((e.target as HTMLElement).closest(".dialog-content")) {
      return;
    }

    setOpenCompanyDialog(true);
  };

  // Prevent reopening immediately after closing
  useEffect(() => {
    if (!openCompanyDialog) {
      ignoreNextClick.current = true;
      setTimeout(() => (ignoreNextClick.current = false), 200);
    }
  }, [openCompanyDialog]);

  return (
    <div className="h-fit w-full flex flex-col items-start gap-6 p-3 rounded-lg shadow-sm border border-muted cursor-pointer">
      {/* Profile Section */}
      <div className="w-full flex items-start justify-between phone-xl:flex-col phone-xl:gap-5">
        <div className="flex items-center gap-3">
          <CachedAvatar
            src={props.avatar}
            alt={props.name}
            className="size-24"
            rounded="md"
            onClick={props.onProfileImageClick}
            preload={true}
            showLoadingState={true}
          >
            {props.name.slice(0, 3)}
          </CachedAvatar>
          <div className="flex flex-col items-start gap-1">
            <TypographyP className="font-semibold">{props.name}</TypographyP>
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
        <div className="flex items-center gap-1 tablet-xl:flex-col tablet-lg:!flex-row">
          <Button
            className="size-12 rounded-md transition-all duration-300 ease-in-out hover:scale-105"
            onClick={handleClickDialog}
          >
            <LucideEye className="!size-6 transition-all duration-300 ease-in-out" />
          </Button>
          <Button
            className="size-12 rounded-md transition-all duration-300 ease-in-out hover:scale-105"
            onClick={props.onLikeClick}
            disabled={props.onLikeClickDisable}
          >
            <LucideHeartHandshake className="!size-6 transition-all duration-300 ease-in-out" />
          </Button>
        </div>
      </div>

      {/* Industry Section */}
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

      {/* Tag Section */}
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
        {props.availableTimes && (
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

      {/* button Section */}
      <div className="w-full flex items-center justify-end gap-3">
        {!props.hideSaveButton && (
          <Button
            className="text-xs"
            variant="outline"
            onClick={props.onSaveClick}
          >
            Save
            <LucideBookmark />
          </Button>
        )}
        <Button className="text-xs" onClick={props.onViewClick}>
          View
          <LucideCircleArrowRight />
        </Button>
      </div>

      {/* Hidden Dialog Section */}
      <CompanyDialog
        open={openCompanyDialog}
        setOpen={setOpenCompanyDialog}
        {...props}
      />
    </div>
  );
}
