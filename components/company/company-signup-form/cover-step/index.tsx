import { TCompanySignup } from "@/app/(auth)/signup/company/validation";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import AvatarCropDialog from "@/components/utils/dialogs/avatar-crop-dialog";
import { DragDropFile } from "@/components/utils/forms/drag-drop-file";
import ErrorMessage from "@/components/utils/feedback/error-message";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { LucideBuilding } from "lucide-react";
import { useEffect, useState } from "react";

export default function CoverCompanyStepForm({
  setValue,
  getValues,
  errors,
}: IStepFormProps<TCompanySignup>) {
  /* -------------------------------- All States ------------------------------ */
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState<boolean>(false);

  /* --------------------------------- Methods -------------------------------- */
  // ── Handle Files Selected ────────────────────────────────────────
  const handleFilesSelected = (files: File[]): void => {
    const file = files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
      setCropDialogOpen(true);
    }
  };

  // ── Handle Crop Complete ────────────────────────────────────────
  const handleCropComplete = (croppedFile: File) => {
    setValue?.("cover", croppedFile, { shouldValidate: true });
    const objectUrl = URL.createObjectURL(croppedFile);
    setPreview(objectUrl);
  };

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const cover = getValues?.("cover");
    if (cover) {
      let objectUrl = "";
      if (cover instanceof File) objectUrl = URL.createObjectURL(cover);
      else if (typeof cover === "string") objectUrl = cover;

      setPreview(objectUrl);
    }
  }, [getValues]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Title Section */}
      <TypographyH4>Add your company cover picture (Optional)</TypographyH4>
      {/* Form Section */}
      <div className="w-full flex justify-center">
        {setValue && (
          <DragDropFile<TCompanySignup>
            onFilesSelected={handleFilesSelected}
            acceptedFileTypes="image/*"
            maxFileSize={5242880}
            multiple={false}
            boxText="Drop your company cover picture here"
            boxSubText="JPG, PNG or WEBP files up to 5MB"
            className="max-w-md"
            preview={preview}
            icon={LucideBuilding}
            fileName="cover"
            setValue={setValue}
            onEdit={() => setCropDialogOpen(true)}
          />
        )}
      </div>

      {/* Validation Message Section */}
      {errors?.cover?.message && (
        <ErrorMessage>{errors.cover.message as string}</ErrorMessage>
      )}

      {/* Crop Avatar Dialog Section */}
      {selectedImage && (
        <AvatarCropDialog
          title="Crop Company Cover Picture"
          open={cropDialogOpen}
          setOpen={setCropDialogOpen}
          image={selectedImage}
          onCropComplete={handleCropComplete}
          aspect={16 / 9}
          cropShape="rect"
          fileName="cover.jpg"
        />
      )}
    </div>
  );
}
