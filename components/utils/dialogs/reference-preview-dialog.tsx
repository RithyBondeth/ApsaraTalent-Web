import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

export default function ReferencePreviewDialog(props: {
  referenceUrl: string;
  openRefPreview: boolean;
  setOpenRefPreview: (openRefPreview: boolean) => void;
  previewRefType: "resume" | "coverletter";
  employeeName: string;
}) {
  /* --------------------------------- Methods --------------------------------- */
  // ── Get File Ext ─────────────────────────────────────────
  const getFileExt = (url: string) => {
    try {
      const clean = url.split("?")[0];
      return clean.split(".").pop()?.toLowerCase() ?? "";
    } catch {
      return "";
    }
  };

  const buildPreviewUrl = (url: string) => {
    const ext = getFileExt(url);
    // If it's a PDF, show directly
    if (ext === "pdf") return url;
    // If it's doc/docx, use Google Docs Viewer (requires public accessible URL)
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
      url,
    )}`;
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={props.openRefPreview} onOpenChange={props.setOpenRefPreview}>
      <DialogContent className="w-[95vw] sm:w-[85vw] lg:w-[60vw] max-w-5xl h-[85vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-sm">
            {props.previewRefType === "resume"
              ? `${props.employeeName}'s Resume Preview`
              : `${props.employeeName}'s CoverLetter Preview`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 w-full">
          {(() => {
            const url = props.referenceUrl;
            if (!url) {
              return (
                <div className="h-full flex items-center justify-center">
                  <TypographyMuted>No document found.</TypographyMuted>
                </div>
              );
            }

            const previewUrl = buildPreviewUrl(url);

            return (
              <iframe
                key={previewUrl}
                src={previewUrl}
                className="w-full h-full border-0"
                title={
                  props.previewRefType === "resume"
                    ? "Resume Preview"
                    : "Cover Letter Preview"
                }
              />
            );
          })()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
