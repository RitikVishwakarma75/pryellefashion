import { NextResponse } from 'next/server';
import { mediaService } from '@/services/mediaService';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const media = await mediaService.uploadMedia(buffer, {
      filename: file.name,
      altText: altText || file.name,
      folder: 'prayele/products',
    });

    return NextResponse.json({
      success: true,
      url: media.url,
      mediaId: media.id,
      publicId: media.publicId,
      fileName: media.fileName,
      altText: media.altText,
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
