import { ReactNode } from "react";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";

export default function SignupLayout({ children }: { children: ReactNode }) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="auth-page auth-signup-page flex h-[100dvh] min-h-0 w-full items-stretch overflow-hidden">
      {/* Children Section */}
      <div className="auth-form-pane relative flex h-full min-h-0 w-[58%] items-center justify-center overflow-hidden px-7 py-6 sm:px-10 tablet-xl:w-full tablet-xl:px-4 tablet-xl:pb-4 tablet-xl:pt-16">
        <div className="auth-signup-content relative z-10 w-full max-w-[680px]">
          {children}
        </div>
      </div>

      {/* Auth Panel Section */}
      <AuthBrandPanel className="w-[42%] tablet-xl:hidden" />
    </div>
  );
}
