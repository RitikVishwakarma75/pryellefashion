import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'prayele-boutique',
  api_key: process.env.CLOUDINARY_API_KEY || 'test_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'test_secret',
  secure: true,
});

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Upload image buffer to Cloudinary with luxury optimization preset
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder = 'prayele/products'
): Promise<UploadResult> {
  // If no live Cloudinary credentials are set up yet in local dev, provide safe mock/fallback
  if (
    !process.env.CLOUDINARY_API_KEY ||
    process.env.CLOUDINARY_API_KEY === 'test_key' ||
    process.env.CLOUDINARY_API_KEY === 'your-cloudinary-api-key'
  ) {
    const mockId = `prayele_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return {
      url: `/images/products/claw-clip.jpg`,
      publicId: `mock/${mockId}`,
      format: 'jpg',
      width: 1200,
      height: 1200,
      bytes: fileBuffer.length,
    };
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [{ quality: 'auto:best', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload failed'));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        }
      )
      .end(fileBuffer);
  });
}

/**
 * Delete asset from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (publicId.startsWith('mock/')) return true;
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === 'ok';
  } catch (error) {
    console.error('Cloudinary destroy error:', error);
    return false;
  }
}

export default cloudinary;
