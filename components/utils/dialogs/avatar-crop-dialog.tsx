"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface AvatarCropDialogProps {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  image: string;
  onCropComplete: (file: File) => void;
  aspect?: number;
  cropShape?: "rect" | "round";
  fileName?: string;
}

export default function AvatarCropDialog({
  title,
  open,
  setOpen,
  image,
  onCropComplete,
  aspect = 1,
  cropShape = "round",
  fileName = "avatar.jpg",
}: AvatarCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null,
  );

  const handleCropComplete = (_: any, croppedPixels: CropArea) => {
    setCroppedAreaPixels(croppedPixels);
  };

  async function getCroppedImage(
    imageSrc: string,
    crop: CropArea,
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
  const confirmCrop = async () => {
    if (!croppedAreaPixels) return;

    const blob = await getCroppedImage(image, croppedAreaPixels);

    const croppedFile = new File([blob], fileName, {
      type: "image/jpeg",
    });

    onCropComplete(croppedFile);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

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
            />
          )}
        </div>

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
