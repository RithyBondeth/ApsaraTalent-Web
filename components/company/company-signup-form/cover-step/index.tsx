import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { DragDropFile } from "@/components/utils/drag-drop-file.";
import { ImagePlus } from "lucide-react";
import { TCompanySignup } from "@/app/(auth)/signup/company/validation";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";

export default function CoverCompanyStepForm({ register }: IStepFormProps<TCompanySignup>) {
    const handleFilesSelected = (files: File[]): void => {
        console.log('Selected files:', files);
    };

    return (
        <div className="w-full flex flex-col items-center gap-5">
            <TypographyH4>Add your company cover picture</TypographyH4>
            <div className="w-full flex justify-center">
                    <DragDropFile
                        onFilesSelected={handleFilesSelected}
                        acceptedFileTypes="image/*"
                        maxFileSize={5242880}
                        multiple={false}
                        boxText="Drop your company cover image here"
                        boxSubText="JPG, PNG or GIF files up to 5MB"
                        icon={ImagePlus}
                        className="max-w-md"
                        {...register('cover')}
                   />
            </div>
        </div>
    )
}