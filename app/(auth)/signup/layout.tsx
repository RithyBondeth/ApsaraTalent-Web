import { ReactNode } from "react";
import AuthShell from "@/components/auth/auth-shell";

export default function SignupLayout({ children }: { children: ReactNode }) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <AuthShell
      wide
      eyebrowKey="signupPanelEyebrow"
      titleKey="signupPanelTitle"
      subtitleKey="signupPanelSubtitle"
    >
      <div className="auth-rise w-full">{children}</div>
    </AuthShell>
  );
}
