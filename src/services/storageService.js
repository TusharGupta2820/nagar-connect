import { supabase, isSupabaseConfigured } from './supabaseClient';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Validate image file format and size
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed formats: JPG, PNG, WEBP.`,
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 10MB limit.`,
    };
  }
  return { valid: true };
};

/**
 * Upload an image file to a designated Supabase Storage bucket
 */
export const uploadEvidenceFile = async (bucket, file, folder = 'general') => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // If Supabase credentials are not configured yet, generate a local object URL for instant UI preview
  if (!isSupabaseConfigured()) {
    console.warn(`[Supabase Storage] Running in preview mode. Created local preview URL for ${file.name}`);
    const localUrl = URL.createObjectURL(file);
    return {
      path: `preview/${folder}/${Date.now()}_${file.name}`,
      url: localUrl,
      publicUrl: localUrl,
      fileName: file.name,
      fileSizeBytes: file.size,
      mediaType: file.type,
    };
  }

  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const sanitizedFileName = `${timestamp}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${folder}/${sanitizedFileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error(`Error uploading to ${bucket}:`, error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    path: data.path,
    url: publicUrlData.publicUrl,
    publicUrl: publicUrlData.publicUrl,
    fileName: file.name,
    fileSizeBytes: file.size,
    mediaType: file.type,
  };
};

export const uploadComplaintEvidence = async (file, complaintRef = 'temp') => {
  return uploadEvidenceFile('complaint-evidence', file, complaintRef);
};

export const uploadInspectionEvidence = async (file, complaintRef = 'inspections') => {
  return uploadEvidenceFile('inspection-evidence', file, complaintRef);
};

export const uploadResolutionEvidence = async (file, complaintRef = 'resolutions') => {
  return uploadEvidenceFile('resolution-evidence', file, complaintRef);
};

export const getEvidencePublicUrl = (bucket, path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || '';
};

