import MetaChip from "../../utils/meta-chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Tag from "@/components/utils/tag";
import {
  LucideClock,
  LucideGraduationCap,
  LucideMapPin,
  LucideUser,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { TSearchEmployeeCardProps } from "./props";
import { getAvailabilityStyleClass } from "@/utils/extensions/get-availability-class";

export default function SearchEmployeeCard(props: TSearchEmployeeCardProps) {
  const router = useRouter();

  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-primary/20">
      <div className="p-4 sm:p-5 flex flex-col gap-3.5">
        {/* Header Row: Avatar + Info */}
        <div className="flex gap-4">
          <Avatar
            rounded="md"
            className="size-14 sm:size-16 flex-shrink-0 ring-[2px] ring-border/40"
          >
            <AvatarImage src={props.avatar} />
            <AvatarFallback className="text-xs font-semibold">
              {props.username?.slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-bold leading-tight truncate">
                  {props.firstname} {props.lastname}
                </h3>
                <p className="text-sm text-primary font-medium mt-0.5">
                  {props.job}
                </p>
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${getAvailabilityStyleClass(props.availability)}`}
              >
                {props.availability}
              </span>
            </div>
          </div>
        </div>

        {/* Meta Chips */}
        <div className="flex flex-wrap gap-2">
          <MetaChip
            icon={<LucideUser />}
            text={`${props.yearOfExperience} yrs exp`}
          />
          <MetaChip icon={<LucideMapPin />} text={props.location} />
          <MetaChip icon={<LucideClock />} text={props.availability} />
          <MetaChip icon={<LucideGraduationCap />} text={props.education} />
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
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end">
        <Button
          size="sm"
          className="text-xs"
          onClick={() => router.replace(`/feed/employee/${props.id}`)}
        >
          <LucideUser className="size-3.5" />
          View Profile
        </Button>
      </div>
    </div>
  );
}
