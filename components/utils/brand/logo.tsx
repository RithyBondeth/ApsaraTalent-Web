import { cn } from "@/lib/utils";
import logo from "@/assets/utils/logo.svg";
import logoBlack from "@/assets/utils/logo-black.svg";
import logoWithoutTitle from "@/assets/utils/logo-icon.svg";
import Image from "next/image";

/* ----------------------------------- Helper ---------------------------------- */
interface ILogoProps {
  withoutTitle?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function LogoComponent({
  withoutTitle = false,
  height = 100,
  width = 200,
  className,
  priority = false,
}: ILogoProps) {
  /* ------------------------------- Render UI ------------------------------- */
  if (withoutTitle) {
    return (
      <Image
        src={logoWithoutTitle}
        alt="Apsara Talent logo"
        height={height}
        width={width}
        className={cn("h-auto w-auto", className)}
        priority={priority}
      />
    );
  }

  return (
    <>
      <Image
        src={logo}
        alt="Apsara Talent logo"
        height={height}
        width={width}
        className={cn("h-auto w-auto dark:hidden", className)}
        priority={priority}
      />
      <Image
        src={logoBlack}
        alt="Apsara Talent logo"
        height={height}
        width={width}
        className={cn("hidden h-auto w-auto dark:block", className)}
        priority={priority}
      />
    </>
  );
}
