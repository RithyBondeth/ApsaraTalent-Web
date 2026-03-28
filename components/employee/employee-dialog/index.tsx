import {
  LucideBriefcase,
  LucideExternalLink,
  LucideGraduationCap,
  LucideMapPin,
  LucideUser,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog";
import { ProfileProgressBar } from "../../profile/profile-progress-bar/";
import { getEmployeeProfileCompletion } from "@/utils/functions/profile-completion";
import { IEmployeeDialogProps } from "./props";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { AvailabilityBadge } from "@/components/utils/data-display/availability-badge";

export default function EmployeeDialog(props: IEmployeeDialogProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const fullName =
    [props.firstname, props.lastname].filter(Boolean).join(" ") ||
    props.username ||
    "Talent";

  const completion = useMemo(
    () => getEmployeeProfileCompletion(props),
    [props],
  );

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={props.open} onOpenChange={(isOpen) => props.setOpen(isOpen)}>
      <DialogContent className="p-0 gap-0 flex flex-col overflow-hidden sm:max-w-lg sm:rounded-xl max-h-[90dvh] tablet-sm:!left-0 tablet-sm:!translate-x-0 tablet-sm:!translate-y-0 tablet-sm:!top-auto tablet-sm:!bottom-0 tablet-sm:!w-full tablet-sm:!max-w-none tablet-sm:rounded-t-2xl tablet-sm:!rounded-b-none tablet-sm:max-h-[92dvh]">
        {/* Drag Handle — Mobile Only */}
        <div className="hidden tablet-sm:flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Gradient Header Section */}
        <div className="relative shrink-0">
          <div className="w-full h-24 bg-gradient-to-br from-primary/90 via-primary/60 to-primary/30" />
          {/* Avatar Overlapping The Gradient */}
          <div className="absolute -bottom-9 left-4">
            <Avatar
              className="!size-20 ring-4 ring-background shadow-lg"
              rounded="md"
            >
              <AvatarImage src={props.avatar!} />
              <AvatarFallback className="uppercase text-lg font-semibold">
                {fullName.slice(0, 2)}
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

          <div className="flex flex-wrap gap-1.5 mt-3">
            {props.location && (
              <span className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                <LucideMapPin className="h-3 w-3 shrink-0" />
                {props.location}
              </span>
            )}
            {props.yearsOfExperience && (
              <span className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                <LucideBriefcase className="h-3 w-3 shrink-0" />
                {props.yearsOfExperience}
              </span>
            )}
            {props.availability && (
              <AvailabilityBadge availability={props.availability} />
            )}
          </div>

          {/* Profile Progress Section */}
          <div className="mt-3">
            <ProfileProgressBar percentage={completion.percentage} />
          </div>
        </div>

        {/* Scrollable Body Section */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-5">
          {/* About Section */}
          {props.description && (
            <section>
              <TypographyP className="[&:not(:first-child)]:mt-0 text-sm font-semibold mb-1.5">
                About
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
                Skills
              </TypographyP>
              <div className="flex flex-wrap gap-1.5">
                {props.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium hover:bg-muted/80 transition-colors"
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
                Education
              </TypographyP>
              <div className="space-y-2.5">
                {props.educations.map((edu, index) => (
                  <div
                    key={edu.id ?? index}
                    className="flex gap-3 p-3 rounded-xl bg-muted/50 border border-border/40"
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
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
            <Button className="w-full gap-2">
              <LucideUser className="h-4 w-4" />
              View Profile
              <LucideExternalLink className="h-3.5 w-3.5 ml-auto opacity-70" />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
