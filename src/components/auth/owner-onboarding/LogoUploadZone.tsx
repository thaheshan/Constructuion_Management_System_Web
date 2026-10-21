'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface LogoUploadZoneProps {
  logoBase64?: string;
  logoFileName?: string;
  onFileSelect: (base64: string, fileName: string) => void;
  onFileRemove: () => void;
  disabled?: boolean;
}

export const LogoUploadZone: React.FC<LogoUploadZoneProps> = ({
  logoBase64,
  logoFileName,
  onFileSelect,
  onFileRemove,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

  const handleFile = (file: File) => {
    setUploadError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Invalid file format. Please upload PNG, JPG, or SVG.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError('File exceeds 2MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onFileSelect(result, file.name);
    };
    reader.onerror = () => {
      setUploadError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />

      {logoBase64 ? (
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
              <Image
                src={logoBase64}
                alt="Company Logo Preview"
                width={56}
                height={56}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {logoFileName || 'Company Logo'}
              </p>
              <p className="text-xs text-emerald-600 font-medium">Ready to upload</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onFileRemove}
            disabled={disabled}
            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white transition"
            title="Remove logo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition cursor-pointer flex flex-col items-center justify-center ${
            isDragging
              ? 'border-futura-500 bg-futura-50/50'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/40'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="w-12 h-12 rounded-full bg-futura-50 border border-futura-100 flex items-center justify-center text-futura-600 mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 mb-1">
            Drag and drop or{' '}
            <span className="text-futura-600 hover:underline">Browse file</span>
          </p>
          <p className="text-xs text-slate-500">
            PNG, JPG, or SVG up to 2MB. Recommended: 500x500px square.
          </p>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 mt-2 text-xs text-red-600 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
