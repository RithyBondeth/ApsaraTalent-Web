import React, { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import Image from 'next/image';
import { LucideCircleX, LucideUserCircle } from 'lucide-react';
import { TypographyMuted } from './typography/typography-muted';
import { IDragDropFileProps } from '@/utils/interfaces/drag-drop-file.interface';

export const DragDropFile = ({
  onFilesSelected,
  acceptedFileTypes = "image/*",
  maxFileSize = 10485760,
  multiple = false,
  className = "",
  boxText = "Drag and drop image here, or click to select",
  boxSubText = "JPG, PNG or GIF files up to 10MB"
}: IDragDropFileProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      processFile(droppedFiles[0]); // Process only the first file for inline preview
      onFilesSelected(multiple ? droppedFiles : [droppedFiles[0]]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
      onFilesSelected(multiple ? Array.from(e.target.files) : [file]);
    }
  };

  const processFile = (file: File): void => {
    // Check if file is an image
    if (file.type.startsWith('image/') && file.size <= maxFileSize) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setSelectedFileName(file.name);
    }
  };

  const handleFileBoxClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (): void => {
    setPreview(null);
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFilesSelected([]);
  };

  // Clean up object URL when component unmounts or when preview changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div
      className={`w-full h-60 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-5 text-center cursor-pointer relative ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-muted-foreground'
      } ${className} h-64`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleFileBoxClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden"
        accept={acceptedFileTypes}
        multiple={multiple}
      />
      
      {preview ? (
        <div className='absolute top-0 right-0 left-0 bottom-0'>
          <LucideCircleX 
            strokeWidth='1.5px'
            className='absolute top-2 left-2 text-primary' 
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
          />
          <Image
            src={preview}
            alt={selectedFileName || "Preview"}
            width={0}
            height={0}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center gap-3'> 
          <LucideUserCircle className='text-muted-foreground size-20' strokeWidth='0.5px'/>
          <TypographyMuted>{boxText}</TypographyMuted>
          <TypographyMuted>{boxSubText}</TypographyMuted>
        </div>
      )}
    </div>
  );
};