import type { ReactNode } from "react";

export interface IProfileDetailHeroProps {
  kind: "employee" | "company";
  eyebrow: string;
  name: string;
  headline?: string | null;
  avatar?: string | null;
  cover?: string | null;
  fallback?: ReactNode;
  status?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  onAvatarClick?: () => void;
}
