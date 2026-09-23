import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { eventType, productId, sessionId, userId, metadata } = await req.json();

    if (!eventType) {
      return NextResponse.json({ error: 'eventType is required' }, { status: 400 });
    }

    await prisma.analyticsEvent.create({
      data: {
        eventType,
        productId: productId || null,
        sessionId: sessionId || null,
        userId: userId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    // Silently fail analytics — never block the user
    return NextResponse.json({ success: true });
  }
}
