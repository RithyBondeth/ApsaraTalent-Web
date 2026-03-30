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
      className={cn(props.className, "py-5 rounded-md")}
      onClick={props.onClick}
    >
      {/* Social Image Section */}
      <Image
        src={props.image}
        alt="social"
        height={30}
        width={30}
        className="rounded-full"
      />

      {/* Social Label Section */}
      <TypographyP>{props.label}</TypographyP>
    </Button>
  );
}
