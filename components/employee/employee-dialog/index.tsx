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
import { PixelPattern } from "@/components/utils/brand/pixel-pattern";

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
      <DialogContent className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 tablet-sm:!bottom-0 tablet-sm:!left-0 tablet-sm:!top-auto tablet-sm:max-h-[92dvh] tablet-sm:!w-full tablet-sm:!max-w-none tablet-sm:!translate-x-0 tablet-sm:!translate-y-0 sm:max-w-3xl">
        {/* Drag Handle Section — Mobile Only */}
        <div className="hidden shrink-0 justify-center pb-1 pt-3 tablet-sm:flex">
          <div className="h-1 w-10 bg-muted-foreground/30" />
        </div>

        {/* Shared landing-grid header section */}
        <div className="relative shrink-0">
          <div className="relative h-24 w-full overflow-hidden bg-muted/30">
            <PixelPattern
              seed="employee-dialog"
              cell={28}
              tone="ember"
              density={0.44}
            />
          </div>
          {/* Avatar Overlapping The Gradient Section */}
          <div className="absolute -bottom-9 left-4">
            <Avatar
              className="!size-20 shadow-lg ring-4 ring-background"
              rounded="md"
            >
              <AvatarImage src={props.avatar!} />
              <AvatarFallback className="text-lg font-medium uppercase">
                {getNameInitials(fullName)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Name, JobTitle, Location, Years of Experience, Availability and Profile Progress Section */}
        <div className="shrink-0 border-b border-border px-5 pb-5 pt-12 sm:px-6">
          <DialogTitle className="text-base font-medium leading-tight">
            {fullName}
          </DialogTitle>
          <DialogDescription className="mt-0.5 text-sm text-muted-foreground">
            {props.job}
          </DialogDescription>

          {/* Location, Years of Experience, Availability Section */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {props.location && (
              <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                <LucideMapPin className="h-3 w-3 shrink-0" />
                {translateLocation(props.location, tl)}
              </span>
            )}
            {props.yearsOfExperience && (
              <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 text-xs text-muted-foreground">
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
        <div className="grid min-h-0 flex-1 overflow-y-auto border-b border-border md:grid-cols-2">
          {/* Empty State Section */}
          {isEmpty && (
            <TypographyMuted className="p-6 text-center text-sm md:col-span-2">
              {t("dialogEmptyProfile")}
            </TypographyMuted>
          )}

          {/* About Section */}
          {props.description && (
            <section className="border-b border-border p-5 sm:p-6 md:col-span-2">
              <TypographyP className="mb-1.5 text-sm font-medium [&:not(:first-child)]:mt-0">
                {t("dialogAbout")}
              </TypographyP>
              <TypographyMuted className="text-sm leading-relaxed text-muted-foreground">
                {props.description}
              </TypographyMuted>
            </section>
          )}

          {/* Skills Section */}
          {props.skills && props.skills.length > 0 && (
            <section className="border-b border-border p-5 sm:p-6 md:border-b-0 md:border-r">
              <TypographyP className="mb-2 text-sm font-medium [&:not(:first-child)]:mt-0">
                {t("dialogSkills")}
              </TypographyP>
              <div className="flex flex-wrap gap-1.5">
                {props.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {props.educations && props.educations.length > 0 && (
            <section className="p-5 sm:p-6">
              <TypographyP className="mb-2 text-sm font-medium [&:not(:first-child)]:mt-0">
                {t("dialogEducation")}
              </TypographyP>
              <div className="space-y-2.5">
                {props.educations.map((edu, index) => (
                  <div
                    key={edu.id ?? index}
                    className="flex gap-3 border border-border/40 bg-muted/50 p-3"
                  >
                    <div className="mt-0.5 shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center bg-primary/10">
                        <LucideGraduationCap className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <TypographyP className="truncate text-sm font-medium leading-tight [&:not(:first-child)]:mt-0">
                        {edu.school}
                      </TypographyP>
                      <TypographyMuted className="mt-0.5 text-xs text-muted-foreground">
                        {edu.degree}
                      </TypographyMuted>
                      {edu.year && (
                        <TypographyMuted className="mt-0.5 text-xs text-muted-foreground/70">
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
        <div className="shrink-0 bg-background px-5 py-4 sm:px-6">
          <Link href={`/feed/employee/${props.id}`} className="w-full">
            <Button className="w-full gap-2">
              <LucideUser className="h-4 w-4" />
              {t("dialogViewProfile")}
              <LucideExternalLink className="ml-auto h-3.5 w-3.5 opacity-70" />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
