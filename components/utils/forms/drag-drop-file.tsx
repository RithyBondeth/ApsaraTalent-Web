import { LucideCircleX, LucideProps, LucideUserCircle } from "lucide-react";
import Image from "next/image";
import React, {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

interface IDragDropFileProps<T extends FieldValues> {
  onFilesSelected: (files: File[]) => void;
  onEdit?: () => void;
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

export const DragDropFile = <T extends FieldValues>({
  onFilesSelected,
  acceptedFileTypes = "image/*",
  maxFileSize = 10485760,
  multiple = false,
  className = "",
  boxText = "Drag and drop image here, or click to select",
  boxSubText = "JPG, PNG or WEBP files up to 5MB",
  icon = LucideUserCircle,
  preview,
  setValue,
  fileName,
}: IDragDropFileProps<T>) => {
  /* -------------------------------- All States ------------------------------ */
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(
    preview || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Drag Enter ─────────────────────────────────────────
  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // ── Handle Drag Leave ─────────────────────────────────────────
  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // ── Handle Drag Over ─────────────────────────────────────────
  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // ── Handle Drop ─────────────────────────────────────────
  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      processFile(droppedFiles[0]);
      onFilesSelected(multiple ? droppedFiles : [droppedFiles[0]]);
    }
  };

  // ── Handle File Input ─────────────────────────────────────────
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
      onFilesSelected(multiple ? Array.from(e.target.files) : [file]);
    }
  };

  // ── Process File ─────────────────────────────────────────
  const processFile = (file: File): void => {
    const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const isValidType = validImageTypes.includes(file.type);

    if (file.size <= maxFileSize) {
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
      setSelectedFileName(file.name);

      // Only set the form value for supported types (jpeg/png/webp)
      if (setValue && fileName && isValidType) {
        setValue(
          fileName as Path<T>,
          file as unknown as PathValue<T, Path<T>>,
          { shouldValidate: true },
        );
      }
    }
  };

  // ── Handle File Box Click ─────────────────────────────────────────
  const handleFileBoxClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ── Remove File ─────────────────────────────────────────
  const removeFile = (): void => {
    setFilePreview(null);
    setSelectedFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    onFilesSelected([]);
    if (setValue && fileName) {
      setValue(fileName as Path<T>, null as unknown as PathValue<T, Path<T>>, {
        shouldValidate: true,
      });
    }
  };

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  useEffect(() => {
    if (preview && preview !== filePreview) {
      setFilePreview(preview);
    }
  }, [preview]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={`w-full h-60 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-5 text-center cursor-pointer relative ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-muted-foreground"
      } ${className} h-64`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleFileBoxClick}
    >
      {/* Hidden File Input Section */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden"
        accept={acceptedFileTypes}
        multiple={multiple}
      />

      {/* File Preview Section */}
      {filePreview ? (
        <div className="absolute top-0 right-0 left-0 bottom-0">
          <LucideCircleX
            strokeWidth="1.5px"
            className="absolute top-2 left-2 text-primary"
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
          />
          <Image
            src={filePreview}
            alt={selectedFileName || "Preview"}
            width={0}
            height={0}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3">
          {icon &&
            React.createElement(icon, {
              className: "text-muted-foreground size-20",
              strokeWidth: "1px",
            })}
          <TypographyMuted>{boxText}</TypographyMuted>
          <TypographyMuted>{boxSubText}</TypographyMuted>
        </div>
      )}
    </div>
  );
};
