// PRAYELLE • Haute Hairwear — Local Storage Provider
// Stores files in public/uploads/ for local zero-dependency development

import fs from 'fs';
import path from 'path';
import { StorageProvider, UploadOptions, UploadResult } from './types';

export class LocalStorageProvider implements StorageProvider {
  name = 'local';
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async upload(buffer: Buffer, options: UploadOptions): Promise<UploadResult> {
    const timestamp = Date.now();
    const cleanFilename = (options.filename || `asset-${timestamp}.jpg`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const finalFilename = `${timestamp}-${cleanFilename}`;
    const filePath = path.join(this.uploadsDir, finalFilename);

    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${finalFilename}`;

    return {
      url: publicUrl,
      storageKey: `local://${finalFilename}`,
      publicId: finalFilename,
      fileName: cleanFilename,
      mimeType: this.guessMimeType(cleanFilename),
      size: buffer.length,
      width: 1200,
      height: 1500,
    };
  }

  async delete(publicIdOrKey: string): Promise<boolean> {
    try {
      const filename = path.basename(publicIdOrKey.replace('local://', ''));
      const filePath = path.join(this.uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  getOptimizedUrl(url: string): string {
    return url;
  }

  private guessMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
      case '.png': return 'image/png';
      case '.webp': return 'image/webp';
      case '.svg': return 'image/svg+xml';
      case '.gif': return 'image/gif';
      default: return 'image/jpeg';
    }
  }
}
