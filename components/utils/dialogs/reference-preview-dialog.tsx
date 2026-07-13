"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/* ----------------------------------- Helper ---------------------------------- */
interface IReferencePreviewDialog {
  referenceUrl: string;
  openRefPreview: boolean;
  setOpenRefPreview: (openRefPreview: boolean) => void;
  previewRefType: "resume" | "coverletter";
  employeeName: string;
}

export default function ReferencePreviewDialog(props: IReferencePreviewDialog) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("dialog");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewAvailable, setPreviewAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!props.openRefPreview || !props.referenceUrl) return;
    const controller = new AbortController();
    let objectUrl: string | null = null;

    setLoading(true);
    setPreviewUrl(null);
    fetch(props.referenceUrl, {
      credentials: "include",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Document preview failed");
        return response.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setPreviewAvailable(blob.type === "application/pdf");
        setPreviewUrl(objectUrl);
      })
      .catch(() => {
        if (!controller.signal.aborted) setPreviewAvailable(false);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [props.openRefPreview, props.referenceUrl]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={props.openRefPreview} onOpenChange={props.setOpenRefPreview}>
      <DialogContent className="w-[95vw] sm:w-[85vw] lg:w-[60vw] max-w-5xl h-[85vh] p-0 overflow-hidden flex flex-col">
        {/* Dialog Header Section: Title */}
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-sm">
            {props.previewRefType === "resume"
              ? `${props.employeeName}'s Resume Preview`
              : `${props.employeeName}'s CoverLetter Preview`}
          </DialogTitle>
        </DialogHeader>

        {/* Document Preview Section */}
        <div className="flex-1 min-h-0 w-full">
          {(() => {
            if (!props.referenceUrl) {
              return (
                <div className="h-full flex items-center justify-center">
                  <TypographyMuted>{t("noDocumentFound")}</TypographyMuted>
                </div>
              );
            }

            if (loading) {
              return (
                <div className="h-full flex items-center justify-center">
                  <TypographyMuted>Loading document…</TypographyMuted>
                </div>
              );
            }

            if (!previewAvailable || !previewUrl) {
              return (
                <div className="h-full flex items-center justify-center px-6 text-center">
                  <TypographyMuted>
                    Preview is available for PDF documents. Download this file
                    to view it safely.
                  </TypographyMuted>
                </div>
              );
            }

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
