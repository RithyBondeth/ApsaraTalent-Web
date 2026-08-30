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
import MetaChip from "@/components/utils/data-display/meta-chip";
import Tag from "@/components/utils/data-display/tag";
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
      <DialogContent
        variant="flush"
        className="max-h-[90dvh] tablet-sm:!bottom-0 tablet-sm:!left-0 tablet-sm:!top-auto tablet-sm:max-h-[92dvh] tablet-sm:!w-full tablet-sm:!max-w-none tablet-sm:!translate-x-0 tablet-sm:!translate-y-0"
      >
        {/* Drag Handle Section — Mobile Only */}
        <div className="hidden shrink-0 justify-center pb-1 pt-3 tablet-sm:flex">
          <div className="h-1 w-10 rounded-none bg-muted-foreground/30" />
        </div>

        {/* Gradient Header Section */}
        <div className="relative shrink-0">
          <div className="h-24 w-full bg-gradient-to-br from-primary/90 via-primary/60 to-primary/30" />
          {/* Avatar Overlapping The Gradient Section */}
          <div className="absolute -bottom-9 left-4">
            <Avatar
              className="!size-20 !rounded-none shadow-lg ring-4 ring-background"
              rounded="md"
            >
              <AvatarImage src={props.avatar!} />
              <AvatarFallback className="text-lg font-semibold uppercase">
                {getNameInitials(fullName)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Name, JobTitle, Location, Years of Experience, Availability and Profile Progress Section */}
        <div className="shrink-0 px-4 pt-12">
          <DialogTitle className="text-base font-bold leading-tight">
            {fullName}
          </DialogTitle>
          <DialogDescription className="mt-0.5 text-sm text-muted-foreground">
            {props.job}
          </DialogDescription>

          {/* Location, Years of Experience, Availability Section */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {props.location && (
              <MetaChip
                icon={<LucideMapPin />}
                text={translateLocation(props.location, tl)}
              />
            )}
            {props.yearsOfExperience && (
              <MetaChip
                icon={<LucideBriefcase />}
                text={props.yearsOfExperience}
              />
            )}
            {props.availability && (
              <AvailabilityBadge availability={props.availability} />
            )}
          </div>
        </div>

        {/* Scrollable Body Section */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
          {/* Empty State Section */}
          {isEmpty && (
            <TypographyMuted className="py-6 text-center text-sm">
              {t("dialogEmptyProfile")}
            </TypographyMuted>
          )}

          {/* About Section */}
          {props.description && (
            <section>
              <TypographyP className="mb-1.5 text-sm font-semibold [&:not(:first-child)]:mt-0">
                {t("dialogAbout")}
              </TypographyP>
              <TypographyMuted className="text-sm leading-relaxed text-muted-foreground">
                {props.description}
              </TypographyMuted>
            </section>
          )}

          {/* Skills Section */}
          {props.skills && props.skills.length > 0 && (
            <section>
              <TypographyP className="mb-2 text-sm font-semibold [&:not(:first-child)]:mt-0">
                {t("dialogSkills")}
              </TypographyP>
              <div className="flex flex-wrap gap-1.5">
                {props.skills.map((skill) => (
                  <Tag key={skill.id} label={skill.name} />
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {props.educations && props.educations.length > 0 && (
            <section>
              <TypographyP className="mb-2 text-sm font-semibold [&:not(:first-child)]:mt-0">
                {t("dialogEducation")}
              </TypographyP>
              <div className="space-y-2.5">
                {props.educations.map((edu, index) => (
                  <div
                    key={edu.id ?? index}
                    className="flex gap-3 rounded-none border border-border/40 bg-muted/50 p-3"
                  >
                    <div className="mt-0.5 shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-none bg-primary/10">
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
        <div className="shrink-0 border-t border-border/60 bg-background px-4 pb-4 pt-2">
          <Link href={`/feed/employee/${props.id}`} className="w-full">
            <Button className="w-full gap-2 rounded-none">
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
