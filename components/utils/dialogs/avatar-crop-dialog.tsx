"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Cropper = dynamic(() => import("react-easy-crop"), { ssr: false });

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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
    cropShape = "round",
    fileName = "avatar.jpg",
  } = props;

  /* -------------------------------- All States ------------------------------ */
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<TCropArea | null>(
    null,
  );

  /* --------------------------------- Methods --------------------------------- */
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
    image.src = imageSrc;

    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx?.drawImage(
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

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob as Blob), "image/png");
    });
  }

  // ── Confirm Crop ─────────────────────────────────────────────────────
  const confirmCrop = async () => {
    if (!croppedAreaPixels) return;

    const blob = await getCroppedImage(image, croppedAreaPixels);

    const croppedFile = new File([blob], fileName, {
      type: "image/jpeg",
    });

    onCropComplete(croppedFile);
    setOpen(false);
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        {/* Dialog Header Section: Title */}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Image Section */}
        <div className="relative w-full h-[320px] rounded-md overflow-hidden bg-muted">
          {image && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={cropShape}
              showGrid={false}
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
              mediaProps={{}}
              cropperProps={{}}
            />
          )}
        </div>

        {/* Crop Section */}
        <div className="flex flex-col gap-2 mt-4">
          <span className="text-sm text-muted-foreground">Zoom</span>

          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.05}
            onValueChange={(value) => setZoom(value[0])}
          />
        </div>

        {/* Dialog Footer Section: Cancel and CropImage Buttons */}
        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button type="button" onClick={confirmCrop}>
            Crop Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
