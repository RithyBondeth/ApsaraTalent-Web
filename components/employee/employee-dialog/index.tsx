"use client";

import {
  LucideBriefcase,
  LucideExternalLink,
  LucideGraduationCap,
  LucideMapPin,
  LucideUser,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog";
import { IEmployeeDialogProps } from "./props";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { AvailabilityBadge } from "@/components/utils/data-display/availability-badge";
import { useTranslations } from "next-intl";
import { translateLocation, getNameInitials } from "@/utils/functions/text";

export default function EmployeeDialog(props: IEmployeeDialogProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("feed");
  const tl = useTranslations("locations");

  const fullName =
    [props.firstname, props.lastname].filter(Boolean).join(" ") ||
    props.username ||
    "Talent";

  const isEmpty =
    !props.description &&
    (!props.skills || props.skills.length === 0) &&
    (!props.educations || props.educations.length === 0);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={props.open} onOpenChange={(isOpen) => props.setOpen(isOpen)}>
      <DialogContent className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden rounded-none p-0 sm:max-w-lg sm:rounded-none tablet-sm:!bottom-0 tablet-sm:!left-0 tablet-sm:!top-auto tablet-sm:!w-full tablet-sm:!max-w-none tablet-sm:!translate-x-0 tablet-sm:!translate-y-0 tablet-sm:!rounded-none tablet-sm:max-h-[92dvh] [&>button]:rounded-none">
        {/* Drag Handle Section — Mobile Only */}
        <div className="hidden tablet-sm:flex justify-center pt-3 pb-1 shrink-0">
          <div className="h-1 w-10 rounded-none bg-muted-foreground/30" />
        </div>

        {/* Gradient Header Section */}
        <div className="relative shrink-0">
          <div className="w-full h-24 bg-gradient-to-br from-primary/90 via-primary/60 to-primary/30" />
          {/* Avatar Overlapping The Gradient Section */}
          <div className="absolute -bottom-9 left-4">
            <Avatar
              className="!size-20 !rounded-none ring-4 ring-background shadow-lg"
              rounded="md"
            >
              <AvatarImage src={props.avatar!} />
              <AvatarFallback className="uppercase text-lg font-semibold">
                {getNameInitials(fullName)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Name, JobTitle, Location, Years of Experience, Availability and Profile Progress Section */}
        <div className="pt-12 px-4 shrink-0">
          <DialogTitle className="text-base font-bold leading-tight">
            {fullName}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-0.5">
            {props.job}
          </DialogDescription>

          {/* Location, Years of Experience, Availability Section */}
          <div className="mt-3 flex flex-wrap gap-1.5 [&>span]:rounded-none [&>span>span]:rounded-none">
            {props.location && (
              <span className="inline-flex items-center gap-1 rounded-none bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                <LucideMapPin className="h-3 w-3 shrink-0" />
                {translateLocation(props.location, tl)}
              </span>
            )}
            {props.yearsOfExperience && (
              <span className="inline-flex items-center gap-1 rounded-none bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                <LucideBriefcase className="h-3 w-3 shrink-0" />
                {props.yearsOfExperience}
              </span>
            )}
            {props.availability && (
              <AvailabilityBadge availability={props.availability} />
            )}
          </div>
        </div>

        {/* Scrollable Body Section */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-5">
          {/* Empty State Section */}
          {isEmpty && (
            <TypographyMuted className="text-sm text-center py-6">
              {t("dialogEmptyProfile")}
            </TypographyMuted>
          )}

          {/* About Section */}
          {props.description && (
            <section>
              <TypographyP className="[&:not(:first-child)]:mt-0 text-sm font-semibold mb-1.5">
                {t("dialogAbout")}
              </TypographyP>
              <TypographyMuted className="text-sm text-muted-foreground leading-relaxed">
                {props.description}
              </TypographyMuted>
            </section>
          )}

          {/* Skills Section */}
          {props.skills && props.skills.length > 0 && (
            <section>
              <TypographyP className="[&:not(:first-child)]:mt-0 text-sm font-semibold mb-2">
                {t("dialogSkills")}
              </TypographyP>
              <div className="flex flex-wrap gap-1.5">
                {props.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-none bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {props.educations && props.educations.length > 0 && (
            <section>
              <TypographyP className="[&:not(:first-child)]:mt-0 text-sm font-semibold mb-2">
                {t("dialogEducation")}
              </TypographyP>
              <div className="space-y-2.5">
                {props.educations.map((edu, index) => (
                  <div
                    key={edu.id ?? index}
                    className="flex gap-3 rounded-none border border-border/40 bg-muted/50 p-3"
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-none bg-primary/10">
                        <LucideGraduationCap className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <TypographyP className="[&:not(:first-child)]:mt-0 text-sm font-medium leading-tight truncate">
                        {edu.school}
                      </TypographyP>
                      <TypographyMuted className="text-xs text-muted-foreground mt-0.5">
                        {edu.degree}
                      </TypographyMuted>
                      {edu.year && (
                        <TypographyMuted className="text-xs text-muted-foreground/70 mt-0.5">
                          {edu.year}
                        </TypographyMuted>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky CTA Section */}
        <div className="shrink-0 px-4 pb-4 pt-2 border-t border-border/60 bg-background">
          <Link href={`/feed/employee/${props.id}`} className="w-full">
            <Button className="w-full gap-2 rounded-none">
              <LucideUser className="h-4 w-4" />
              {t("dialogViewProfile")}
              <LucideExternalLink className="h-3.5 w-3.5 ml-auto opacity-70" />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
