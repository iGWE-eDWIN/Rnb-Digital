'use client';

import React, { useState, useEffect } from 'react';
import { getMediaAssets } from '@/lib/cms-data';
import { MediaAsset } from '@/types/cms';
import { uploadImage, deleteImage, BUCKET_NAME } from '@/lib/supabase/storage';
import { useAuth } from '@/context/AuthContext';
import ImageUploader from '@/components/admin/ImageUploader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast, { ToastMessage } from '@/components/admin/Toast';

export default function AdminMediaPage() {
  const { isSupabaseLive } = useAuth();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [deletingAsset, setDeletingAsset] = useState<MediaAsset | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<
    'all' | 'hero' | 'services' | 'portfolio' | 'products' | 'testimonials' | 'logos' | 'general'
  >('all');

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}`, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadMedia = async () => {
    try {
      const data = await getMediaAssets();
      setAssets(data);
    } catch {
      addToast('error', 'Failed to load media assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addToast('info', 'Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deletingAsset) return;
    try {
      await deleteImage(deletingAsset.storage_path);
      setAssets((prev) => prev.filter((a) => a.id !== deletingAsset.id));
      setDeletingAsset(null);
      addToast('success', 'File deleted from Supabase Storage.');
    } catch {
      addToast('error', 'Failed to delete file');
    }
  };

  const filteredAssets =
    selectedFolder === 'all'
      ? assets
      : assets.filter((a) => a.storage_path.startsWith(selectedFolder));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary-container">
        <div className="w-8 h-8 border-3 border-secondary-container border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading Media Library...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Header Bar */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-secondary-container/20 text-on-secondary-container text-[11px] font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-xs text-secondary-container">cloud</span>
            Supabase Storage
          </div>
          <h2 className="text-lg font-bold text-primary-container font-display">
            Media & Asset Management Library
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Upload, preview, copy URLs, and manage storage assets stored securely in the{' '}
            <code className="font-mono bg-surface-container px-1 rounded">{BUCKET_NAME}</code> bucket.
          </p>
        </div>

        <div className="text-xs font-semibold text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-xl border border-outline-variant/30">
          Total Uploaded: <span className="font-bold text-primary-container">{assets.length}</span>{' '}
          files
        </div>
      </div>

      {/* Direct Uploader Card */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-primary-container uppercase tracking-wider mb-3">
          Quick Upload to Storage
        </h3>
        <div className="max-w-md">
          <ImageUploader
            label=""
            folder="general"
            helperText="Directly upload an image to your Supabase media bucket"
            onImageUploaded={async () => {
              addToast('success', 'Image uploaded to Supabase Storage!');
              await loadMedia();
            }}
          />
        </div>
      </div>

      {/* Media Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: 'all', label: 'All Files' },
            { id: 'hero', label: 'Hero Slides' },
            { id: 'services', label: 'Services' },
            { id: 'portfolio', label: 'Portfolio' },
            { id: 'products', label: 'Products' },
            { id: 'testimonials', label: 'Testimonials' },
            { id: 'logos', label: 'Logos' },
          ] as const
        ).map((tab) => {
          const isSelected = selectedFolder === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedFolder(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-primary-container text-secondary-container shadow-xs'
                  : 'bg-surface text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Assets Gallery Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant bg-surface rounded-2xl border border-outline-variant/30">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">
            photo_library
          </span>
          <p className="text-xs font-semibold">No media files found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-ambient transition-all"
            >
              <div className="relative h-44 w-full bg-surface-container overflow-hidden">
                <img
                  src={asset.public_url}
                  alt={asset.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(asset.public_url, asset.id)}
                    className="p-2 bg-secondary-container text-on-secondary-container rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md hover:scale-105 transition-transform"
                    title="Copy Public URL"
                  >
                    <span className="material-symbols-outlined text-base">
                      {copiedId === asset.id ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedId === asset.id ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3">
                <div className="text-xs font-bold text-primary-container truncate" title={asset.filename}>
                  {asset.filename}
                </div>
                <div className="flex items-center justify-between text-[10px] text-on-surface-variant mt-1 font-mono">
                  <span>{(asset.file_size / 1024).toFixed(0)} KB</span>
                  <span className="truncate max-w-[120px]">{asset.storage_path}</span>
                </div>
              </div>

              <div className="px-3 py-2 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <a
                  href={asset.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-primary-container hover:underline flex items-center gap-1"
                >
                  <span>Preview</span>
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
                <button
                  type="button"
                  onClick={() => setDeletingAsset(asset)}
                  className="text-on-surface-variant hover:text-error p-1 rounded transition-colors cursor-pointer"
                  title="Delete from storage"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingAsset}
        title="Delete Media File"
        message={`Are you sure you want to permanently delete "${deletingAsset?.filename}" from Supabase Storage? Sections referencing this image will need to be updated.`}
        confirmText="Delete File"
        onConfirm={handleDelete}
        onCancel={() => setDeletingAsset(null)}
      />
    </div>
  );
}
