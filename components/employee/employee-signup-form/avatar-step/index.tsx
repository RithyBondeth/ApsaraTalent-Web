"use client"

import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { IStepFormProps } from "../props";
import { TAvatarStepInfo } from "../validation";
import { DragDropFile } from "@/components/utils/dragdrop-file.";
import { useState } from "react";

export default function AvatarStepForm({ register }: IStepFormProps<TAvatarStepInfo>) {
    
    const [files, setFiles] = useState<File[]>([]);

    const handleFilesSelected = (files: File[]): void => {
        setFiles(files);
        console.log('Selected files:', files);
    };

    return (
        <div className="w-full flex flex-col items-center gap-5">
            <TypographyH4>Add your profile picture</TypographyH4>
            <div className="w-full flex justify-center">
                <DragDropFile
                    onFilesSelected={handleFilesSelected}
                    acceptedFileTypes="image/*"
                    maxFileSize={5242880} // 5MB
                    multiple={false}
                    className="max-w-md"
                    boxText="Drop your profile image here"
                    boxSubText="JPG, PNG or GIF files up to 5MB"
                />
            </div>
        </div>
    )
}