import { cn } from "@/lib/utils";
import { TypographySmall } from "@/components/utils/typography/typography-small";

interface IErrorMessageProps {
  className?: string;
  children: React.ReactNode;
}

export default function ErrorMessage(props: IErrorMessageProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <TypographySmall className={cn("text-xs text-red-500", props.className)}>
      {props.children}
    </TypographySmall>
  );
}
