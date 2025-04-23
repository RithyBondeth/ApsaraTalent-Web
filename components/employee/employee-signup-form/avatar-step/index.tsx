import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import { useState, useEffect } from "react";
import ErrorMessage from "@/components/utils/error-message";
import { DragDropFile } from "@/components/utils/drag-drop-file.";
import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";

export default function AvatarStepForm({
  setValue,
  getValues,
  errors,
}: IStepFormProps<TEmployeeSignUp>) {
  const [preview, setPreview] = useState<string | null>(null); // Preview state for image

  // Handle file selection and set the file in the form
  const handleFilesSelected = (files: File[]): void => {
    const file = files?.[0];
    if (file) {
      // Set the selected file to the form field
      setValue?.("avatar", file, { shouldValidate: true });
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl); // Set preview for the selected file
    }
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
      <TypographyH4>Add your profile picture</TypographyH4>
      <div className="w-full flex justify-center">
        {setValue && (
          <DragDropFile<TEmployeeSignUp>
            preview={preview} // Directly pass the preview state
            onFilesSelected={handleFilesSelected}
            acceptedFileTypes="image/*"
            maxFileSize={5242880}
            multiple={false}
            boxText="Drop your company profile picture here"
            boxSubText="JPG, PNG or GIF files up to 5MB"
            fileName='avatar'
            setValue={setValue}
          />
        )}
      </div>
      {errors?.avatar && <ErrorMessage>{errors.avatar.message}</ErrorMessage>}
    </div>
  );
}
