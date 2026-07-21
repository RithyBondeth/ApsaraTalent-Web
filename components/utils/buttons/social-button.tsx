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
      className={cn(
        "auth-social-button h-11 rounded-lg border-border bg-background py-5 shadow-none hover:border-foreground/25 hover:bg-muted/40",
        props.className,
      )}
      onClick={props.onClick}
    >
      {/* Social Image Section */}
      <Image
        src={props.image}
        alt={`${props.label} icon`}
        height={30}
        width={30}
        className="rounded-full"
        priority
      />

      {/* Social Label Section */}
      <TypographyP>{props.label}</TypographyP>
    </Button>
  );
}
