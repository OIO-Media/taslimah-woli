/**
 * Client-Side Image Resizing & WebP Optimization Pipeline
 * Allows the site owner to drop high-res camera photos (20MB+) directly.
 * Automatically downscales to maximum 2400px dimensions at 85% WebP quality,
 * yielding fast, sharp 200KB - 500KB assets without requiring manual editing.
 */

export interface OptimizedImageResult {
  dataUrl: string;
  originalSize: number;
  optimizedSize: number;
  width: number;
  height: number;
  format: string;
  filename: string;
}

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/webp' | 'image/jpeg';
}

const DEFAULT_OPTIONS: ImageProcessingOptions = {
  maxWidth: 2400,
  maxHeight: 2400,
  quality: 0.86,
  format: 'image/webp',
};

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
];

/**
 * Validates file format and size
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const isAllowedType = ALLOWED_MIME_TYPES.some((type) =>
    file.type.toLowerCase().includes(type.replace('image/', ''))
  ) || file.type.startsWith('image/');

  if (!isAllowedType) {
    return {
      valid: false,
      error: `Invalid file format (${file.type || 'unknown'}). Please upload a JPEG, PNG, WebP, or AVIF image.`,
    };
  }

  // Max 50MB before compression
  const maxBytes = 50 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: 'File is larger than 50MB. Please select an image under 50MB.',
    };
  }

  return { valid: true };
}

/**
 * Compresses and optimizes an image file using browser Canvas API
 */
export async function optimizeImageFile(
  file: File,
  customOptions: ImageProcessingOptions = {}
): Promise<OptimizedImageResult> {
  const options = { ...DEFAULT_OPTIONS, ...customOptions };

  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        reject(new Error('Failed to load image for processing.'));
      };

      img.onload = () => {
        try {
          let { width, height } = img;
          const maxW = options.maxWidth || 2400;
          const maxH = options.maxHeight || 2400;

          // Compute aspect ratio scaling
          if (width > maxW || height > maxH) {
            const ratio = Math.min(maxW / width, maxH / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas 2D context not supported.');
          }

          // Enable high-quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw scaled image
          ctx.drawImage(img, 0, 0, width, height);

          // Test WebP capability or fallback to JPEG
          let targetFormat = options.format || 'image/webp';
          let outputDataUrl = canvas.toDataURL(targetFormat, options.quality);

          // If browser doesn't output webp, fallback to jpeg
          if (!outputDataUrl.startsWith('data:image/webp') && targetFormat === 'image/webp') {
            targetFormat = 'image/jpeg';
            outputDataUrl = canvas.toDataURL('image/jpeg', options.quality);
          }

          // Estimate byte size from Base64
          const base64Length = outputDataUrl.length - (outputDataUrl.indexOf(',') + 1);
          const optimizedByteSize = Math.round((base64Length * 3) / 4);

          resolve({
            dataUrl: outputDataUrl,
            originalSize: file.size,
            optimizedSize: optimizedByteSize,
            width,
            height,
            format: targetFormat,
            filename: file.name.replace(/\.[^/.]+$/, '') + (targetFormat === 'image/webp' ? '.webp' : '.jpg'),
          });
        } catch (err: unknown) {
          reject(err instanceof Error ? err : new Error('Image optimization failed.'));
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes into human-readable string (e.g. 2.4 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
