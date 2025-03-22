import { LucideProps } from "lucide-react";

export interface IDragDropFileProps {
    onFilesSelected: (files: File[]) => void;
    acceptedFileTypes?: string;
    maxFileSize?: number;
    multiple?: boolean;
    className?: string;
    boxText?: string;
    boxSubText?: string;
    icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}