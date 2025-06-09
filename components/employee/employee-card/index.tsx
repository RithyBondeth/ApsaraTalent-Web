"use client";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import Tag from "../../utils/tag";
import { TypographyMuted } from "../../utils/typography/typography-muted";
import { TypographyP } from "../../utils/typography/typography-p";
import { TypographySmall } from "../../utils/typography/typography-small";
import {
  LucideBookmark,
  LucideCircleArrowRight,
  LucideEye,
  LucideHeartHandshake,
  LucideMapPin,
  LucideUser,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { IEmployeeCardProps } from "./props";
import EmployeeDialog from "../employee-dialog";

export default function EmployeeCard(props: IEmployeeCardProps) {
  const [openProfileDialog, setOpenProfileDialog] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);

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

    setOpenProfileDialog(true);
  };

  useEffect(() => {
    if (!openProfileDialog) {
      // Prevent reopening immediately after closing
      ignoreNextClick.current = true;
      setTimeout(() => {
        ignoreNextClick.current = false;
      }, 200);
    }
  }, [openProfileDialog]);

  return (
    <div className="h-fit w-full flex flex-col items-start gap-5 p-3 rounded-lg border border-muted cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary">
      {/* Profile Section */}
      <div className="w-full flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-20" onClick={props.onProfileImageClick}>
            <AvatarImage src={props.avatar!} />
            <AvatarFallback className="uppercase">
              {!props.avatar && props.username?.slice(0, 3)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-1">
            <TypographyP className="font-semibold">
              {props.username}
            </TypographyP>
            <TypographyMuted>{props.job}</TypographyMuted>
            <TypographySmall className="text-xs flex items-center gap-1 text-muted-foreground">
              <LucideMapPin className="size-3 " />
              <span>{props.location}</span>
            </TypographySmall>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            className="size-12 rounded-full transition-all duration-300 ease-in-out hover:scale-105"
            onClick={handleClickDialog}
          >
            <LucideEye className="!size-6 transition-all duration-300 ease-in-out" />
          </Button>
          <Button className="size-12 rounded-full transition-all duration-300 ease-in-out hover:scale-105">
            <LucideHeartHandshake className="!size-6 transition-all duration-300 ease-in-out" />
          </Button>
        </div>
      </div>

      {/* Tag Section */}
      <div className="w-full flex flex-wrap gap-2">
        {props.skills.map((skill) => (
          <Tag key={skill.id} label={skill.name} />
        ))}
      </div>

      {/* Description Section */}
      <TypographyP className="!m-0 text-sm leading-relaxed">
        {props.description}
      </TypographyP>

      {/* Experience Section */}
      <div className="flex flex-wrap gap-2 items-center">
        <Tag
          label={
            props.yearsOfExperience === 1
              ? `${props.yearsOfExperience} year experience`
              : `${props.yearsOfExperience} years experience`
          }
        />
        <Tag
          label={
            props.availability.split("_")[0].toUpperCase() +
            " " +
            props.availability.split("_")[1].toUpperCase()
          }
        />
      </div>

      {/* button Section */}
      <div className="w-full flex items-center justify-end gap-3">
        <Button
          className="text-sm"
          variant="outline"
          onClick={props.onSaveClick}
        >
          Save
          <LucideBookmark />
        </Button>
        <Button
          className="text-sm"
          variant="secondary"
          onClick={props.onViewClick}
        >
          View
          <LucideCircleArrowRight />
        </Button>
      </div>
      <EmployeeDialog
        open={openProfileDialog}
        setOpen={setOpenProfileDialog}
        {...props}
      />
    </div>
  );
}
