import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { DragDropFile } from "@/components/utils/drag-drop-file.";
import { LucideBuilding } from "lucide-react";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import { TCompanySignup } from "@/app/(auth)/signup/company/validation";

export default function AvatarCompanyStepForm({ register }: IStepFormProps<TCompanySignup>) {
    const handleFilesSelected = (files: File[]): void => {
        console.log('Selected files:', files);
    };

    return (
        <div className="w-full flex flex-col items-center gap-5">
            <TypographyH4>Add your company profile picture</TypographyH4>
            <div className="w-full flex justify-center">
                    <DragDropFile
                        onFilesSelected={handleFilesSelected}
                        acceptedFileTypes="image/*"
                        maxFileSize={5242880}
                        multiple={false}
                        boxText="Drop your company profile picture here"
                        boxSubText="JPG, PNG or GIF files up to 5MB"
                        icon={LucideBuilding}
                        className="max-w-md"
                        {...register('avatar')}
                   />
            </div>
        </div>
    )
}