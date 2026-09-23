import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
      await prisma.newsletterSubscriber.upsert({
        where: { email: email.toLowerCase().trim() },
        update: { status: 'SUBSCRIBED' },
        create: {
          email: email.toLowerCase().trim(),
          name,
          status: 'SUBSCRIBED',
        },
      });
    } catch {
      // Graceful local mode
    }

    return NextResponse.json({ success: true, promoCode: 'ENDLESSLOOKS' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
