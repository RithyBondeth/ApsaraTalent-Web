import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { IStepFormProps } from "../props";
import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { DragDropFile } from "@/components/utils/drag-drop-file.";
import ErrorMessage from "@/components/utils/error-message";

export default function AvatarStepForm({ setValue, errors }: IStepFormProps<TEmployeeSignUp>) {
    const handleFilesSelected = (files: File[]): void => {
        const file = files?.[0];
        if (file) {
          setValue?.("avatar", file, { shouldValidate: true });
        }
    };

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <TypographyH4>Add your profile picture</TypographyH4>
      <div className="w-full flex justify-center">
        <DragDropFile
          onFilesSelected={handleFilesSelected}
          acceptedFileTypes="image/*"
          maxFileSize={5242880}
          multiple={false}
          boxText="Drop your profile image here"
          boxSubText="JPG, PNG or GIF files up to 5MB"
          className="max-w-md"
        />
      </div>
      {errors?.avatar && (
        <ErrorMessage>{errors.avatar.message}</ErrorMessage>
      )}
    </div>
  );
}
