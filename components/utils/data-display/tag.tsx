import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { cn } from "@/lib/utils";

/* ----------------------------------- Helper --------------------------------- */
interface ITagInterface {
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

/* ---------------------------------------------------------------------------
 * A neutral label chip: skills, career scopes, languages, availability.
 *
 * It used to take a `neutral` flag, and without it drew its fill from
 * getRandomBadgeColor — a hash of the label's character codes into the six
 * categorical hues. That gave "Python" indigo and "React" orange for no reason
 * anyone could read: the hue carried no meaning, and it collided with the hues
 * that do (a skill hashing to indigo looked exactly like a benefit chip).
 * Every reading surface had already opted out by passing `neutral`, so the flag
 * and the hash are both gone. Colour on a label now means something.
 * ------------------------------------------------------------------------- */
export default function Tag(props: ITagInterface) {
  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div
      className={cn(
        "flex w-fit cursor-pointer items-center rounded-none border border-border/60 bg-muted/50 px-3 py-1.5 transition-all duration-200 ease-out hover:border-foreground/30 active:scale-95",
        props.icon && "gap-1",
        props.className,
      )}
    >
      {/* Icon Section */}
      {props.icon && (
        <span className="text-foreground/75 [&>svg]:!size-4">{props.icon}</span>
      )}

      {/* Label Section */}
      <TypographyMuted className="text-xs font-medium leading-none text-foreground/75">
        {props.label}
      </TypographyMuted>
    </div>
  );
}
