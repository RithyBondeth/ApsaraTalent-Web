import {
    LucideArrowRight,
    LucideBookmarkX,
    LucideBriefcaseBusiness,
    LucideClock,
    LucideMapPin
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import Tag from "../../utils/tag";
import { TypographyH4 } from "../../utils/typography/typography-h4";
import { TypographyP } from "../../utils/typography/typography-p";
import { IFavoriteEmployeeCardProps } from "./props";

/* ── Reusable stat chip with gradient background ── */
function StatChip({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "red" | "green";
}) {
  const gradients = {
    blue: "from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/40 border-blue-200/70 dark:border-blue-800/40",
    red:  "from-red-50  to-red-100  dark:from-red-950/50  dark:to-red-900/40  border-red-200/70  dark:border-red-800/40",
    green:"from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/40 border-green-200/70 dark:border-green-800/40",
  };
  const iconColors = {
    blue:  "text-blue-500  dark:text-blue-400",
    red:   "text-red-500   dark:text-red-400",
    green: "text-green-500 dark:text-green-400",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`p-2.5 rounded-xl bg-gradient-to-br border shadow-sm ${gradients[color]}`}>
        <span className={iconColors[color]}>{icon}</span>
      </div>
      <div className="flex flex-col items-start">
        <TypographyP className="text-xs !m-0 text-muted-foreground">{label}</TypographyP>
        <TypographyP className="text-sm font-semibold !m-0">{value}</TypographyP>
      </div>
    </div>
  );
}

export default function FavoriteEmployeeCard(props: IFavoriteEmployeeCardProps) {
  const router = useRouter();

  return (
    <div className={`w-full flex items-start gap-3 rounded-xl border border-muted p-3 shadow-sm sm:gap-5 sm:p-5 tablet-xl:flex-col tablet-xl:items-start transition-all duration-300 ease-out hover:shadow-[0_8px_28px_hsl(var(--foreground)/0.08)] hover:border-primary/20${props.isRemoving ? " animate-card-pop-shrink" : ""}`}>
      <Avatar rounded="md" className="size-28 sm:size-36 lg:size-56 shrink-0">
        <AvatarFallback>{props.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        <AvatarImage src={props.avatar} />
      </Avatar>
      <div className="w-full flex flex-col items-start gap-3">
        <div className="w-full flex items-start justify-between gap-2 phone-xl:flex-col phone-xl:gap-3">
          <div className="flex flex-col items-start gap-1">
            <TypographyH4 className="text-lg">{props.name}</TypographyH4>
            <TypographyP className="text-sm font-medium !m-0 text-muted-foreground">
              @{props.username}
            </TypographyP>
          </div>
          <Tag label={"Full Time Available"} />
        </div>
        <TypographyP className="text-sm leading-relaxed !m-0">
          {props.description}
        </TypographyP>
        <div className="flex flex-wrap items-center gap-2">
          {props.skills.map((skill, index) => (
            <Tag label={skill} key={index} />
          ))}
        </div>
        <div className="mt-2 flex w-full items-center justify-between gap-3 tablet-md:flex-col tablet-md:items-start tablet-md:gap-5">
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 tablet-md:flex-col tablet-md:items-start">
            <StatChip
              color="blue"
              icon={<LucideBriefcaseBusiness size={15} />}
              label="Position"
              value={props.position}
            />
            <StatChip
              color="red"
              icon={<LucideClock size={15} />}
              label="Experience"
              value={`${props.experience} years experience`}
            />
            <StatChip
              color="green"
              icon={<LucideMapPin size={15} />}
              label="Location"
              value={props.location}
            />
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3 [&>button]:flex-1 sm:[&>button]:flex-none">
            <Button
              className="text-xs phone-xl:justify-center"
              variant="destructive"
              onClick={props.onRemoveFromFavorite}
            >
              Remove
              <LucideBookmarkX />
            </Button>
            <Button
              className="text-xs phone-xl:justify-center"
              onClick={() => router.replace(`/feed/employee/${props.id}`)}
            >
              View Detail
              <LucideArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
