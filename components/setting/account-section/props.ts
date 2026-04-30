export interface IAccountSectionProps {
  displayName: string;
  avatarSrc?: string;
  email?: string;
  role?: string;
  isTwoFactorEnabled?: boolean;
  lastLogin: string;
  memberSince: string;
  onResetPassword: () => void;
}
