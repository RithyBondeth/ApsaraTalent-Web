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

/* ── Availability badge with color coding ─────────────────── */
function AvailabilityBadge({ availability }: { availability: string }) {
  const lower = availability.toLowerCase();
  const config = lower.includes("full")
    ? {
        color:
          "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300",
        dot: "bg-green-500",
      }
    : lower.includes("part")
      ? {
          color:
            "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
          dot: "bg-blue-500",
        }
      : lower.includes("free")
        ? {
            color:
              "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300",
            dot: "bg-purple-500",
          }
        : {
            color: "bg-muted text-muted-foreground",
            dot: "bg-muted-foreground",
          };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${config.color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dot}`} />
      {availability}
    </span>
  );
}

export default function EmployeeDialog(props: IEmployeeDialogProps) {
  const fullName =
    [props.firstname, props.lastname].filter(Boolean).join(" ") ||
    props.username ||
    "Talent";

  const completion = useMemo(
    () => getEmployeeProfileCompletion(props),
    [props],
  );

  return (
    <Dialog open={props.open} onOpenChange={(isOpen) => props.setOpen(isOpen)}>
      <DialogContent className="p-0 gap-0 flex flex-col overflow-hidden sm:max-w-lg sm:rounded-xl max-h-[90dvh] tablet-sm:!left-0 tablet-sm:!translate-x-0 tablet-sm:!translate-y-0 tablet-sm:!top-auto tablet-sm:!bottom-0 tablet-sm:!w-full tablet-sm:!max-w-none tablet-sm:rounded-t-2xl tablet-sm:!rounded-b-none tablet-sm:max-h-[92dvh]">
        {/* Drag handle — mobile only */}
        <div className="hidden tablet-sm:flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Gradient header */}
        <div className="relative shrink-0">
          <div className="w-full h-24 bg-gradient-to-br from-primary/90 via-primary/60 to-primary/30" />
          {/* Avatar overlapping the gradient */}
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

        {/* Name + job + meta chips */}
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

          {/* Profile Progress */}
          <div className="mt-3">
            <ProfileProgressBar percentage={completion.percentage} />
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-5">
          {/* About */}
          {props.description && (
            <section>
              <p className="text-sm font-semibold mb-1.5">About</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {props.description}
              </p>
            </section>
          )}

          {/* Skills */}
          {props.skills && props.skills.length > 0 && (
            <section>
              <p className="text-sm font-semibold mb-2">Skills</p>
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

          {/* Education */}
          {props.educations && props.educations.length > 0 && (
            <section>
              <p className="text-sm font-semibold mb-2">Education</p>
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
                      <p className="text-sm font-medium leading-tight truncate">
                        {edu.school}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {edu.degree}
                      </p>
                      {edu.year && (
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {edu.year}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky CTA */}
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
