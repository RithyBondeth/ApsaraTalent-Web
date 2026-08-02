import { cn } from "@/lib/utils";
import { TypographySmall } from "@/components/utils/typography/typography-small";

/* ----------------------------------- Helper ---------------------------------- */
interface IErrorMessageProps {
  className?: string;
  children: React.ReactNode;
}

export default function ErrorMessage(props: IErrorMessageProps) {
  /* ---------------------------------- Props ---------------------------------- */
  const { className, children } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <TypographySmall
      className={cn("auth-inline-error text-xs text-destructive", className)}
    >
      {children}
    </TypographySmall>
  );
}
