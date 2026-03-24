import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Tag from "@/components/utils/tag";
import {
  LucideAlarmClock,
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideCircleDollarSign,
  LucideGraduationCap,
  LucideMapPin,
  LucideUsers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { TSearchCompanyCardProps } from "./prop";

/* ── Inline meta chip ── */
function MetaChip({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/70 px-3 py-1.5 rounded-full">
      <span className="[&>svg]:size-3.5 flex-shrink-0">{icon}</span>
      <span className="truncate">{text}</span>
    </span>
  );
}

export default function SearchCompanyCard(props: TSearchCompanyCardProps) {
  const router = useRouter();

  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-primary/20">
      <div className="p-4 sm:p-5 flex flex-col gap-3.5">
        {/* Header Row: Avatar + Title */}
        <div className="flex gap-4">
          <Avatar
            rounded="md"
            className="size-14 sm:size-16 flex-shrink-0 ring-[2px] ring-border/40"
          >
            <AvatarFallback className="text-xs font-semibold">
              {props.company.name.slice(0, 3).toUpperCase()}
            </AvatarFallback>
            <AvatarImage
              src={props.company.avatar}
              alt={props.company.name}
            />
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold leading-tight truncate">
              {props.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {props.company.name}
            </p>
            <p className="text-xs text-primary font-medium mt-0.5">
              {props.company.industry}
            </p>
          </div>
        </div>

        {/* Company Meta */}
        <div className="flex flex-wrap gap-2">
          <MetaChip
            icon={<LucideUsers />}
            text={`${props.company.companySize} employees`}
          />
          <MetaChip icon={<LucideMapPin />} text={props.company.location} />
          <MetaChip icon={<LucideBriefcaseBusiness />} text={props.type} />
        </div>

        {/* Requirements */}
        <div className="flex flex-wrap gap-2">
          <MetaChip
            icon={<LucideGraduationCap />}
            text={`Education: ${props.education}`}
          />
          <MetaChip
            icon={<LucideBriefcaseBusiness />}
            text={`Experience: ${props.experience}`}
          />
        </div>

        {/* Description */}
        {props.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {props.description}
          </p>
        )}

        {/* Skills Tags */}
        {props.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {props.skills.map((item, index) => (
              <Tag label={item} key={index} />
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <MetaChip icon={<LucideCircleDollarSign />} text={props.salary} />
          <MetaChip icon={<LucideAlarmClock />} text={props.postedDate} />
        </div>
        <Button
          size="sm"
          className="text-xs flex-shrink-0"
          onClick={() => router.replace(`/feed/company/${props.id}`)}
        >
          <LucideBuilding className="size-3.5" />
          View Company
        </Button>
      </div>
    </div>
  );
}
