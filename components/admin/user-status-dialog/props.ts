import type {
  TAdminUpdateStatusPayload,
  TUserStatus,
} from "@/utils/types/admin/admin.type";

export interface IUserStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Shown in the title so the admin can see who they are about to act on. */
  userName: string;
  /** The account's current effective status; the form opens on the opposite. */
  currentStatus: TUserStatus;
  saving: boolean;
  onSubmit: (payload: TAdminUpdateStatusPayload) => void;
}
