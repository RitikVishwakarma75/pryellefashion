// PRAYELLE • Haute Hairwear — Storage Abstraction Types
// Designed to support Cloudinary, AWS S3, Cloudflare R2, Supabase Storage, and Local Disk

export interface UploadOptions {
  folder?: string;
  filename?: string;
  tags?: string[];
  altText?: string;
}

export interface UploadResult {
  url: string;
  storageKey?: string;
  publicId?: string;
  fileName: string;
  mimeType: string;
  width?: number;
  height?: number;
  size: number;
}

export interface StorageProvider {
  name: string;
  upload(buffer: Buffer, options: UploadOptions): Promise<UploadResult>;
  delete(publicIdOrKey: string): Promise<boolean>;
  getOptimizedUrl(url: string, width?: number, quality?: number): string;
}
