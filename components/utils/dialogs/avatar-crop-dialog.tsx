"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const Cropper = dynamic(() => import("react-easy-crop"), {
  ssr: false,
});

/* ------------------------------- Helpers ------------------------------ */
type TCropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface IAvatarCropDialogProps {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  image: string;
  onCropComplete: (file: File) => void;
  aspect?: number;
  cropShape?: "rect" | "round";
  fileName?: string;
}

export default function AvatarCropDialog(props: IAvatarCropDialogProps) {
  /* -------------------------------- Props -------------------------------- */
  const {
    title,
    open,
    setOpen,
    image,
    onCropComplete,
    aspect = 1,
    cropShape = "rect",
    fileName = "avatar.jpg",
  } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("common");
  const tr = useTranslations("resumeBuilder");

  /* -------------------------------- All States ------------------------------ */
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<TCropArea | null>(
    null,
  );
  const [mediaStatus, setMediaStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  /* /* ------------------------------ All Effects ---------------------------- */
  useEffect(() => {
    if (!open) return;

    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setMediaStatus(image ? "loading" : "error");
  }, [image, open]);

  /* --------------------------------- Methods -------------------------------- */
  // ── Handle Crop Complete ─────────────────────────────────────────
  const handleCropComplete = (_: unknown, croppedPixels: TCropArea): void => {
    setCroppedAreaPixels(croppedPixels);
  };

  // ── Get Cropped Image ─────────────────────────────────────────────
  async function getCroppedImage(
    imageSrc: string,
    crop: TCropArea,
  ): Promise<Blob> {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("The crop image failed to load."));
      image.src = imageSrc;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("The crop canvas is unavailable.");

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
            return;
          }

          reject(new Error("The cropped image could not be created."));
        },
        "image/jpeg",
        0.9,
      );
    });
  }

  // ── Confirm Crop ─────────────────────────────────────────────────────
  const confirmCrop = async () => {
    if (!croppedAreaPixels || mediaStatus !== "ready") return;

    try {
      const blob = await getCroppedImage(image, croppedAreaPixels);

      const croppedFile = new File([blob], fileName, {
        type: "image/jpeg",
      });

      onCropComplete(croppedFile);
      setOpen(false);
    } catch {
      setMediaStatus("error");
      toast.error(tr("imageReadFailed"));
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg rounded-none sm:rounded-none [&>button]:rounded-none">
        {/* Dialog Header Section: Title */}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("cropImage")}
          </DialogDescription>
        </DialogHeader>

        {/* Image Section */}
        <div className="relative h-[320px] w-full overflow-hidden border border-border bg-muted">
          {image && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={cropShape}
              showGrid={false}
              onMediaLoaded={() => setMediaStatus("ready")}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              rotation={0}
              minZoom={1}
              maxZoom={3}
              zoomSpeed={1}
              restrictPosition={true}
              keyboardStep={10}
              style={{}}
              classes={{}}
              mediaProps={{
                alt: title,
                onError: () => setMediaStatus("error"),
              }}
              cropperProps={{}}
            />
          )}

          {mediaStatus === "loading" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted">
              <Loader2 className="size-7 animate-spin text-muted-foreground" />
              <span className="sr-only">{tr("imageReadFailed")}</span>
            </div>
          )}

          {mediaStatus === "error" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted px-8 text-center text-sm text-muted-foreground">
              {tr("imageReadFailed")}
            </div>
          )}
        </div>

        {/* Crop Section */}
        <div className="mt-4 flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">{t("zoom")}</span>

          <Slider
            className="[&>span>span]:rounded-none [&>span]:rounded-none"
            value={[zoom]}
            min={1}
            max={3}
            step={0.05}
            disabled={mediaStatus !== "ready"}
            onValueChange={(value) => setZoom(value[0])}
          />
        </div>

        {/* Dialog Footer Section: Cancel and CropImage Buttons */}
        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={() => setOpen(false)}
          >
            {t("cancel")}
          </Button>

          <Button
            type="button"
            className="rounded-none"
            disabled={mediaStatus !== "ready" || !croppedAreaPixels}
            onClick={confirmCrop}
          >
            {t("cropImage")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
