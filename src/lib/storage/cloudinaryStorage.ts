// PRAYELLE • Haute Hairwear — Cloudinary Storage Provider

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { StorageProvider, UploadOptions, UploadResult } from './types';
import { LocalStorageProvider } from './localStorage';

export class CloudinaryStorageProvider implements StorageProvider {
  name = 'cloudinary';
  private localFallback = new LocalStorageProvider();
  private isConfigured: boolean;

  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    this.isConfigured = Boolean(
      cloudName &&
      apiKey &&
      apiSecret &&
      apiKey !== 'test_cloudinary_key' &&
      !apiKey.startsWith('test_')
    );

    if (this.isConfigured) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
    }
  }

  async upload(buffer: Buffer, options: UploadOptions): Promise<UploadResult> {
    if (!this.isConfigured) {
      return this.localFallback.upload(buffer, options);
    }

    try {
      const res = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: options.folder || 'prayele/products',
              resource_type: 'image',
              tags: options.tags || ['prayele'],
            },
            (error, result) => {
              if (error || !result) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      return {
        url: res.secure_url,
        publicId: res.public_id,
        storageKey: `cloudinary://${res.public_id}`,
        fileName: options.filename || `${res.public_id}.jpg`,
        mimeType: res.format ? `image/${res.format}` : 'image/jpeg',
        width: res.width,
        height: res.height,
        size: res.bytes,
      };
    } catch {
      // If Cloudinary fails (e.g. invalid key in production), fall back to local disk
      return this.localFallback.upload(buffer, options);
    }
  }

  async delete(publicIdOrKey: string): Promise<boolean> {
    if (!this.isConfigured) {
      return this.localFallback.delete(publicIdOrKey);
    }

    try {
      const publicId = publicIdOrKey.replace('cloudinary://', '');
      const res = await cloudinary.uploader.destroy(publicId);
      return res.result === 'ok';
    } catch {
      return false;
    }
  }

  getOptimizedUrl(url: string, width?: number, quality = 80): string {
    if (!this.isConfigured || !url.includes('cloudinary.com')) {
      return url;
    }
    const params = [`q_${quality}`, 'f_auto'];
    if (width) params.push(`w_${width}`);
    return url.replace('/upload/', `/upload/${params.join(',')}/`);
  }
}
