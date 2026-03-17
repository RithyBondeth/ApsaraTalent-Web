import { TCompanySignup } from "@/app/(auth)/signup/company/validation";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import AvatarCropDialog from "@/components/utils/dialogs/avatar-crop-dialog";
import { DragDropFile } from "@/components/utils/drag-drop-file.";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { useEffect, useState } from "react";

export default function AvatarCompanyStepForm({
  setValue,
  getValues,
}: IStepFormProps<TCompanySignup>) {
  const [preview, setPreview] = useState<string | null>(null); // Preview state for image
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Original image for cropping
  const [cropDialogOpen, setCropDialogOpen] = useState(false); // Crop dialog open state

  // Handle file selection and open the crop dialog
  const handleFilesSelected = (files: File[]): void => {
    const file = files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
      setCropDialogOpen(true);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    // Set the cropped file to the form field
    setValue?.("avatar", croppedFile, { shouldValidate: true });
    const objectUrl = URL.createObjectURL(croppedFile);
    setPreview(objectUrl); // Set preview for the cropped file
  };

  // Use effect to get the avatar value from form and set the preview when coming back to this step
  useEffect(() => {
    const avatar = getValues?.("avatar");
    if (avatar) {
      let objectUrl = "";
      if (avatar instanceof File) {
        objectUrl = URL.createObjectURL(avatar); // Create object URL for the file
      } else if (typeof avatar === "string") {
        objectUrl = avatar; // Use the avatar URL directly if it's a string
      }
      setPreview(objectUrl); // Set the preview
    }
  }, [getValues]);

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <TypographyH4>Add your company profile picture (Optional)</TypographyH4>
      <div className="w-full flex justify-center">
        {setValue && (
          <DragDropFile<TCompanySignup>
            onFilesSelected={handleFilesSelected}
            acceptedFileTypes="image/*"
            maxFileSize={5242880}
            multiple={false}
            boxText="Drop your company profile picture here"
            boxSubText="JPG, PNG or WEBP files up to 5MB"
            className="max-w-md"
            preview={preview}
            fileName="avatar"
            setValue={setValue}
          />
        )}
      </div>

      {selectedImage && (
        <AvatarCropDialog
          title="Crop Company Profile Picture"
          open={cropDialogOpen}
          setOpen={setCropDialogOpen}
          image={selectedImage}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
