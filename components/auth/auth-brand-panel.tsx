"use client";

import { cn } from "@/lib/utils";
import {
  EditorialIllustration,
  type TEditorialIllustrationVariant,
} from "@/components/utils/data-display/editorial-illustration";
import LogoComponent from "@/components/utils/brand/logo";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

/* --------------------------------- Helpers --------------------------------- */
interface IAuthBrandPanelProps {
  className?: string;
  illustration?: TEditorialIllustrationVariant;
}

/** Route-aware recruitment artwork shared by authentication screens. */
const authIllustrationByRoute: Array<{
  route: string;
  illustration: TEditorialIllustrationVariant;
}> = [
  {
    route: "/login/phone-number/phone-otp",
    illustration: "notification",
  },
  { route: "/login/phone-number", illustration: "messaging" },
  { route: "/login/email-verification", illustration: "trust" },
  { route: "/forgot-password", illustration: "trust" },
  { route: "/reset-password", illustration: "trust" },
  { route: "/signup/company", illustration: "employeeSearch" },
  { route: "/signup/employee", illustration: "companySearch" },
  { route: "/signup/option", illustration: "matching" },
  { route: "/signup", illustration: "discovery" },
  { route: "/login", illustration: "conversation" },
];

/** Get the illustration based on the current route */
function getAuthIllustration(pathname: string) {
  return (
    authIllustrationByRoute.find(({ route }) => pathname.startsWith(route))
      ?.illustration ?? "matching"
  );
}

export function AuthBrandPanel({
  className,
  illustration,
}: IAuthBrandPanelProps) {
  /* --------------------------------- Utils --------------------------------- */
  const t = useTranslations("auth");
  const pathname = usePathname();
  const illustrationVariant = illustration ?? getAuthIllustration(pathname);

  /* ------------------------------- Render UI ------------------------------- */
  return (
    <aside
      className={cn(
        "auth-brand-panel relative my-4 mr-4 flex h-[calc(100dvh_-_2rem)] w-[42%] shrink-0 flex-col overflow-hidden rounded-[1.5rem] border px-8 py-7 text-[#292621] tablet-md:hidden lg:px-10 lg:py-9",
        className,
      )}
      aria-label={t("authPanelLabel")}
    >
      {/* Brand Section */}
      <div className="auth-panel-brand relative z-10 flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-lg border border-black/[0.08] bg-white/50">
          <LogoComponent
            withoutTitle
            width={22}
            height={22}
            className="size-5"
          />
        </span>
        <span className="text-[13px] font-semibold tracking-[-0.01em]">
          Apsara Talent
        </span>
      </div>

      {/* Content Section */}
      <div
        key={pathname}
        className="auth-panel-content relative z-10 my-auto flex w-full max-w-[500px] flex-col self-center py-7"
      >
        <span className="auth-panel-eyebrow mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/45">
          {t("authPanelEyebrow")}
        </span>
        <h2 className="auth-panel-title max-w-[460px] text-[clamp(1.85rem,2.7vw,3rem)] font-semibold leading-[1.04] tracking-[-0.04em]">
          {t("authPanelTitle")}
        </h2>
        <p className="auth-panel-copy mt-3 max-w-[420px] text-sm leading-6 text-black/55">
          {t("authPanelSubtitle")}
        </p>

        <div className="auth-visual-stage relative mt-7 overflow-hidden rounded-[1.1rem] border border-black/[0.07] bg-white/20">
          <EditorialIllustration
            variant={illustrationVariant}
            className="auth-panel-illustration h-[min(34vh,330px)] w-full max-w-none rounded-none border-0 shadow-none"
            priority
          />
        </div>
      </div>

      {/* Footer Section */}
      <p className="auth-panel-foot relative z-10 text-[11px] font-medium text-black/40">
        Apsara Talent · Cambodia
      </p>
    </aside>
  );
}
