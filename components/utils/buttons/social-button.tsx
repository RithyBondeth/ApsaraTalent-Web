import { TypographyP } from "@/components/utils/typography/typography-p";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

/* ----------------------------------- Helper ---------------------------------- */
interface ISocialButtonProps {
  image: StaticImageData;
  label: string;
  variant:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  className?: string;
  onClick: () => void;
}

export default function SocialButton(props: ISocialButtonProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Button
      type="button"
      variant={props.variant}
      className={cn(props.className, "py-5 rounded-none")}
      onClick={props.onClick}
    >
      <span className="grid w-full max-w-36 grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 text-left">
        {/* Social Image Section */}
        <span className="auth-social-icon grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-white p-1">
          <Image
            src={props.image}
            alt=""
            aria-hidden="true"
            height={28}
            width={28}
            className="size-full rounded-full object-contain [clip-path:circle(50%)]"
          />
        </span>

        {/* Social Label Section */}
        <TypographyP className="min-w-0 text-left">{props.label}</TypographyP>
      </span>
    </Button>
  );
}
