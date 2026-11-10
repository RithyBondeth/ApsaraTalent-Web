import { TApplicationStatus } from "@/utils/types/application/application-status.type";

export interface IBulkActionToolbarProps {
  selectedCount: number;
  isBusy: boolean;
  onClear: () => void;
  onMove: (status: TApplicationStatus) => void;
  onRejectSelection: () => void;
}
