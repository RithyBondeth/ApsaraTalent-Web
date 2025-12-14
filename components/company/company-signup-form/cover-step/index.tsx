import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import { TCompanySignup } from "@/app/(auth)/signup/company/validation";
import { useState, useEffect } from "react";
import ErrorMessage from "@/components/utils/error-message";
import { DragDropFile } from "@/components/utils/drag-drop-file.";
import { LucideBuilding } from "lucide-react";

export default function CoverCompanyStepForm({
  setValue,
  getValues,
  errors,
}: IStepFormProps<TCompanySignup>) {
  const [preview, setPreview] = useState<string | null>(null); // Preview state for image

  // Handle file selection and set the file in the form
  const handleFilesSelected = (files: File[]): void => {
    const file = files?.[0];
    if (file) {
      // Set the selected file to the form field
      setValue?.("cover", file, { shouldValidate: true });
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl); // Set preview for the selected file
    }
  };

  // Use effect to get the cover value from form and set the preview when coming back to this step
  useEffect(() => {
    const cover = getValues?.("cover");
    if (cover) {
      let objectUrl = "";
      if (cover instanceof File) {
        objectUrl = URL.createObjectURL(cover); // Create object URL for the file
      } else if (typeof cover === "string") {
        objectUrl = cover; // Use the cover URL directly if it's a string
      }
      setPreview(objectUrl); // Set the preview
    }
  }, [getValues]);

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <TypographyH4>Add your company cover picture</TypographyH4>
      <div className="w-full flex justify-center">
        {setValue && (
          <DragDropFile<TCompanySignup>
            onFilesSelected={handleFilesSelected}
            acceptedFileTypes="image/*"
            maxFileSize={5242880}
            multiple={false}
            boxText="Drop your company cover picture here"
            boxSubText="JPG, PNG or GIF files up to 5MB"
            className="max-w-md"
            preview={preview}
            icon={LucideBuilding}
            fileName="cover"
            setValue={setValue}
          />
        )}
      </div>
      {errors?.cover && <ErrorMessage>{errors.cover.message}</ErrorMessage>}
    </div>
  );
}
