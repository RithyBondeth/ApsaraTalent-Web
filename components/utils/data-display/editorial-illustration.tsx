import Image from "next/image";
import { cn } from "@/lib/utils";

/* --------------------------------- Helpers --------------------------------- */
export type TEditorialIllustrationVariant =
  | "conversation"
  | "discovery"
  | "activity"
  | "trust"
  | "companySearch"
  | "employeeSearch"
  | "matching"
  | "interview"
  | "notification"
  | "messaging"
  | "terms"
  | "experience"
  | "education"
  | "openPosition";

interface IEditorialIllustrationProps {
  variant: TEditorialIllustrationVariant;
  className?: string;
  priority?: boolean;
}

const illustrationByVariant: Record<
  TEditorialIllustrationVariant,
  { src: string; position: string }
> = {
  conversation: {
    src: "/illustrations/talent-conversation.webp",
    position: "center 62%",
  },
  discovery: {
    src: "/illustrations/talent-discovery.webp",
    position: "center",
  },
  activity: {
    src: "/illustrations/talent-activity.webp",
    position: "center",
  },
  trust: {
    src: "/illustrations/talent-trust.webp",
    position: "center",
  },
  companySearch: {
    src: "/illustrations/company-search.webp",
    position: "center",
  },
  employeeSearch: {
    src: "/illustrations/employee-search.webp",
    position: "center",
  },
  matching: {
    src: "/illustrations/talent-matching.webp",
    position: "center",
  },
  interview: {
    src: "/illustrations/job-interview.webp",
    position: "center",
  },
  notification: {
    src: "/illustrations/hiring-notification.webp",
    position: "center",
  },
  messaging: {
    src: "/illustrations/recruiter-messaging.webp",
    position: "center",
  },
  terms: {
    src: "/illustrations/employment-terms.webp",
    position: "center",
  },
  experience: {
    src: "/illustrations/career-experience.webp",
    position: "center",
  },
  education: {
    src: "/illustrations/education-profile.webp",
    position: "center",
  },
  openPosition: {
    src: "/illustrations/open-position.webp",
    position: "center",
  },
};

/** Recruitment-focused editorial artwork for feature and authentication empty states. */
export function EditorialIllustration({
  variant,
  className,
  priority = false,
}: IEditorialIllustrationProps) {
  /* --------------------------------- Util --------------------------------- */
  const illustration = illustrationByVariant[variant];

  /* ------------------------------- Render UI ------------------------------- */
  return (
    <div
      className={cn(
        "relative h-40 w-52 shrink-0 overflow-hidden rounded-[1.75rem] border border-border/70 bg-[hsl(var(--illustration-surface))] shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      <Image
        src={illustration.src}
        alt=""
        fill
        sizes="(max-width: 640px) 208px, 430px"
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out hover:scale-[1.02] dark:brightness-[0.82] dark:saturate-[0.82]"
        style={{ objectPosition: illustration.position }}
      />
    </div>
  );
}
