import { getSupabaseClient, isSupabaseConfigured } from './client';

export const BUCKET_NAME = 'rnb-media';
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

export interface UploadResult {
  publicUrl: string;
  storagePath: string;
  filename: string;
  fileSize: number;
  mimeType: string;
}

/**
 * Validates file size and type
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format (${file.type}). Allowed formats: JPEG, PNG, WEBP, SVG, GIF.`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB).`,
    };
  }

  return { valid: true };
};

/**
 * Upload an image to Supabase Storage with fallback
 */
export async function uploadImage(
  file: File,
  folder: 'hero' | 'services' | 'portfolio' | 'products' | 'testimonials' | 'logos' | 'general' = 'general'
): Promise<UploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const supabase = getSupabaseClient();
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const storagePath = `${folder}/${uniqueId}_${cleanName}`;

  if (supabase && isSupabaseConfigured()) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    // Also register in media_assets table
    await supabase.from('media_assets').insert({
      filename: file.name,
      storage_path: data.path,
      public_url: urlData.publicUrl,
      file_size: file.size,
      mime_type: file.type,
    });

    return {
      publicUrl: urlData.publicUrl,
      storagePath: data.path,
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
    };
  }

  // Fallback demo mode (when Supabase credentials are not yet configured)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      const demoResult: UploadResult = {
        publicUrl: base64Url,
        storagePath: `local_${storagePath}`,
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
      };

      // Save to local media registry in localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('rnb_local_media') || '[]');
        existing.unshift({
          id: uniqueId,
          ...demoResult,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('rnb_local_media', JSON.stringify(existing));
      } catch (e) {
        console.warn('LocalStorage save warning:', e);
      }

      resolve(demoResult);
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(storagePath: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured()) {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (!error) {
      await supabase.from('media_assets').delete().eq('storage_path', storagePath);
      return true;
    }
    console.error('Failed to delete image from Supabase Storage:', error);
    return false;
  }

  // Local demo fallback
  try {
    const existing = JSON.parse(localStorage.getItem('rnb_local_media') || '[]');
    const filtered = existing.filter((item: any) => item.storagePath !== storagePath);
    localStorage.setItem('rnb_local_media', JSON.stringify(filtered));
    return true;
  } catch {
    return true;
  }
}
