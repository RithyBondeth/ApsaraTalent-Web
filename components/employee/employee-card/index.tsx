"use client";
import {
  LucideBookmark,
  LucideCircleArrowRight,
  LucideEye,
  LucideHeartHandshake,
  LucideMapPin,
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

export default function EmployeeCard(props: IEmployeeCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const isGrid = props.variant === "grid";

  /* -------------------------------- All States ------------------------------ */
  const [openProfileDialog, setOpenProfileDialog] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Click Dialog ─────────────────────────────────────────
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
  // ─── Grid variant: seamless card with divider, no vertical gap ────────────
  if (isGrid) {
    return (
      <>
        <div className="group relative w-full flex flex-col bg-card border border-muted/60 cursor-pointer transition-all duration-200 ease-out hover:bg-accent/40">
          {/* Top Accent Bar On Hover Section */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

          {/* Main Content Section */}
          <div className="flex flex-col gap-2.5 p-4">
            {/* Header Section: Avatar, Username, JobTitle, Location, Like Button */}
            <div className="flex items-start gap-3">
              <CachedAvatar
                src={props.avatar}
                alt={props.username ?? "Profile"}
                className="size-11 shrink-0 ring-1 ring-border"
                rounded="md"
                onClick={props.onProfileImageClick}
                preload={true}
                showLoadingState={true}
              >
                {props.username?.slice(0, 2)}
              </CachedAvatar>

              <div className="flex-1 min-w-0">
                <TypographyP className="!m-0 font-semibold text-sm truncate leading-tight">
                  {props.username}
                </TypographyP>
                <TypographyMuted className="text-[11px] truncate mt-0.5 block">
                  {props.job}
                </TypographyMuted>
                <TypographySmall className="text-[11px] flex items-center gap-1 text-muted-foreground mt-0.5">
                  <LucideMapPin className="size-3 shrink-0" />
                  <span className="truncate">{props.location}</span>
                </TypographySmall>
              </div>

              {/* Like Button */}
              <Button
                size="icon"
                variant="ghost"
                className="size-8 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-200 shrink-0"
                onClick={props.onLikeClick}
                disabled={props.onLikeClickDisable}
              >
                <LucideHeartHandshake
                  className={`!size-4${props.onLikeClickDisable ? " animate-pop-shrink text-rose-500" : ""}`}
                />
              </Button>
            </div>

            {/* Skills Tags Section */}
            {props.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
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

            {/* Description Section */}
            <TypographyMuted className="text-xs leading-relaxed line-clamp-2">
              {props.description}
            </TypographyMuted>

            {/* Experience & Availability Section */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {props.educations.length > 0 &&
                props.educations
                  .slice(0, 2)
                  .map((edu, index) => <Tag key={index} label={edu.degree} />)}
              <Tag label={props.yearsOfExperience} />
              <Tag label={props.availability} />
            </div>

            {/* Footer Section: View and Save Buttons */}
            <div className="flex items-center justify-between pt-1 border-t border-muted/50">
              <Button
                size="icon"
                variant="ghost"
                className="size-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                onClick={handleClickDialog}
              >
                <LucideEye className="!size-4" />
              </Button>

              <div className="flex items-center gap-1.5">
                <Button
                  className={`text-[11px] h-7 px-2.5 rounded-full gap-1 ${
                    props.hideSaveButton
                      ? "animate-pop-shrink pointer-events-none"
                      : "opacity-100 scale-100"
                  }`}
                  variant="ghost"
                  size="sm"
                  onClick={props.onSaveClick}
                >
                  <LucideBookmark className="!size-3" />
                  Save
                </Button>
                <Button
                  className="text-[11px] h-7 px-3 rounded-full gap-1"
                  size="sm"
                  onClick={props.onViewClick}
                >
                  View
                  <LucideCircleArrowRight className="!size-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Dialog Section */}
        <EmployeeDialog
          open={openProfileDialog}
          setOpen={setOpenProfileDialog}
          {...props}
        />
      </>
    );
  }

  // ─── Default variant: bordered card with shadow ────────────
  return (
    <div className="h-fit w-full flex flex-col items-start gap-4 rounded-lg border border-muted p-3 shadow-sm cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_28px_hsl(var(--foreground)/0.1)] hover:border-primary/25">
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
              <span>{props.location}</span>
            </TypographySmall>
          </div>
        </div>

        {/* Action Buttons Section: View and Like Button */}
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

      {/* Skills Tags Section */}
      <div className="w-full flex flex-wrap gap-2">
        {props.skills.map((skill) => (
          <Tag key={skill.id} label={skill.name} />
        ))}
      </div>

      {/* Description Section */}
      <TypographyP className="!m-0 text-sm leading-relaxed">
        {props.description}
      </TypographyP>

      {/* Experience & Availability Section */}
      <div className="flex flex-wrap gap-2 items-center">
        {props.educations.length > 0 &&
          props.educations.map((edu, index) => (
            <Tag key={index} label={edu.degree} />
          ))}
        <Tag label={props.yearsOfExperience} />
        <Tag label={props.availability} />
      </div>

      {/* Action Buttons Section: View and Save Buttons */}
      <div className="w-full flex items-center justify-end gap-2 sm:gap-3 tablet-lg:justify-stretch tablet-lg:[&>button]:flex-1 phone-xl:justify-stretch phone-xl:[&>button]:flex-1">
        <Button
          className={`text-sm ${
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
        <Button className="text-sm" onClick={props.onViewClick}>
          View
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
