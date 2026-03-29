import { IPendingFile } from "@/utils/interfaces/chat";

export interface IMessageAttachmentStripProps {
  pendingFiles: IPendingFile[];
  atFileLimit: boolean;
  inputDisabled: boolean;
  isUploadingAny: boolean;
  readyCount: number;
  errorCount: number;
  onAddMoreFiles: () => void;
  onClearAll: () => void;
  onRemoveFile: (id: string) => void;
}
