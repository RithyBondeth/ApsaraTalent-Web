import { LucideProps } from "lucide-react";
import { FieldValues, UseFormSetValue } from "react-hook-form";

export interface IDragDropFileProps<T extends FieldValues> {
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number;
  multiple?: boolean;
  className?: string;
  boxText?: string;
  boxSubText?: string;
  preview?: string | null;
  setValue?: UseFormSetValue<T>;
  fileName?: "avatar" | "cover" | undefined | null;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}
