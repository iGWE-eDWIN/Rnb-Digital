'use client';

import React, { useState, useRef } from 'react';
import { uploadImage, validateImageFile } from '@/lib/supabase/storage';

interface ImageUploaderProps {
  currentUrl?: string | null;
  onImageUploaded: (url: string, storagePath?: string) => void;
  folder?: 'hero' | 'services' | 'portfolio' | 'products' | 'testimonials' | 'logos' | 'general';
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
}

export default function ImageUploader({
  currentUrl,
  onImageUploaded,
  folder = 'general',
  label = 'Upload Image',
  helperText = 'PNG, JPG, WEBP or SVG (Max 5MB)',
  aspectRatio = 'auto',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview if currentUrl changes externally
  React.useEffect(() => {
    setPreview(currentUrl || null);
  }, [currentUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      setUploading(true);
      // Instant local preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Perform upload
      const result = await uploadImage(file, folder);
      setPreview(result.publicUrl);
      onImageUploaded(result.publicUrl, result.storagePath);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onImageUploaded('', '');
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square max-w-[200px]';
      case 'video':
        return 'aspect-video w-full max-w-[360px]';
      case 'banner':
        return 'aspect-[21/9] w-full max-w-[480px]';
      default:
        return 'h-44 w-full';
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
          {label}
        </label>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-4 text-center ${
          error
            ? 'border-error bg-error/5'
            : preview
            ? 'border-secondary-container/60 bg-surface-container-lowest hover:border-secondary-container'
            : 'border-outline-variant/60 bg-surface-container-low hover:bg-surface-container hover:border-primary-container/40'
        } ${getAspectClass()}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        {preview ? (
          <div className="relative w-full h-full group flex items-center justify-center">
            <img
              src={preview}
              alt="Uploaded preview"
              className="w-full h-full object-cover rounded-xl"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex flex-col items-center justify-center gap-2 p-2 text-on-primary">
              <span className="material-symbols-outlined text-2xl text-secondary-container">
                cloud_upload
              </span>
              <span className="text-xs font-semibold">Click to Replace Image</span>
              <button
                type="button"
                onClick={handleClear}
                className="mt-1 px-2.5 py-1 bg-error text-on-error rounded-md text-[11px] font-bold hover:bg-error/90 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">delete</span>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4 text-on-surface-variant">
            <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-2xl text-secondary-container">
                add_photo_alternate
              </span>
            </div>
            <div className="text-xs font-bold text-primary-container">
              Click to choose an image
            </div>
            <div className="text-[11px] text-on-surface-variant/80">{helperText}</div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-xs flex flex-col items-center justify-center text-on-primary gap-2 z-10">
            <div className="w-7 h-7 border-3 border-secondary-container border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Uploading to Supabase...</span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-error font-medium mt-1.5 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
    </div>
  );
}
