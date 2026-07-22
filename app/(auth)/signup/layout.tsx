import { ReactNode } from "react";
import AuthShell from "@/components/auth/auth-shell";
import { signupSvg } from "@/utils/constants/asset.constant";

export default function SignupLayout({ children }: { children: ReactNode }) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <AuthShell
      wide
      image={signupSvg}
      imageAlt="Join Apsara Talent"
      eyebrowKey="signupPanelEyebrow"
      titleKey="signupPanelTitle"
      subtitleKey="signupPanelSubtitle"
    >
      <div className="auth-rise w-full">{children}</div>
    </AuthShell>
  );
}
