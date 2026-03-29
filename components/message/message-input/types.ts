export interface PendingFile {
  id: string;
  preview: string | null;
  status: "uploading" | "ready" | "error";
  error?: string;
  uploaded?: {
    url: string;
    type: "image" | "document" | "audio";
    filename: string;
    duration?: number;
    amplitude?: number[];
  };
  filename: string;
}
