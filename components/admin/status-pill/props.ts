import type {
  TReportStatus,
  TUserStatus,
} from "@/utils/types/admin/admin.type";

export interface IStatusPillProps {
  /**
   * Both status vocabularies share one pill. They never appear in the same
   * column, and giving each its own component would duplicate the token map
   * that is the only thing either of them does.
   */
  status: TUserStatus | TReportStatus;
  label: string;
  className?: string;
}
