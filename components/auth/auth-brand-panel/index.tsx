"use client";

import LogoComponent from "@/components/utils/brand/logo";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { IAuthBrandPanelProps } from "./props";

export default function AuthBrandPanel(props: IAuthBrandPanelProps) {
  /* ------------------------------- Props ------------------------------- */
  const {
    eyebrowKey = "loginPanelEyebrow",
    titleKey = "loginPanelTitle",
    subtitleKey = "loginPanelSubtitle",
    className,
  } = props;

  /* ------------------------------- Utils ------------------------------- */
  const t = useTranslations("auth");

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <div
      className={cn(
        "auth-panel relative isolate hidden flex-col p-10 lg:flex xl:p-14",
        className,
      )}
    >
      <div className="auth-panel-rail" aria-hidden />

      {/* The actual Apsara mark is the only pixel artwork in auth. */}
      <div className="relative z-10 flex items-start">
        <LogoComponent className="!h-14 w-auto text-[hsl(var(--auth-ink))]" />
      </div>

      {/* Route-specific message replaces decorative artwork with useful context. */}
      <div className="relative z-10 my-auto max-w-[34rem] py-10">
        <p className="auth-eyebrow pixel-label mb-5">{t(eyebrowKey)}</p>
        <h2 className="auth-panel-title pixel-display">
          {t(titleKey)}
        </h2>
        <p className="auth-panel-subtitle mt-5 max-w-md">
          {t(subtitleKey)}
        </p>
      </div>

      {/* A compact product map makes the panel informative, not ornamental. */}
      <div className="auth-panel-points relative z-10">
        {[t("brandPoint1"), t("brandPoint2"), t("brandPoint3")].map(
          (point, index) => (
            <div className="auth-panel-point" key={point}>
              <span className="auth-panel-number pixel-label">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{point}</span>
            </div>
          ),
        )}
      </div>

      <div className="auth-panel-footer relative z-10 mt-8 flex items-center justify-between">
        <span>{t("brandStatTalent")}</span>
        <span aria-hidden className="auth-panel-footer-line" />
        <span>{t("brandStatCompanies")}</span>
      </div>
    </div>
  );
}
