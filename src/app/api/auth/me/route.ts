import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ user: null });
    }

    // Attempt to load rich user details from DB
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              addresses: true,
            },
          },
        },
      });

      if (dbUser) {
        return NextResponse.json({
          user: {
            userId: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            phone: dbUser.phone || '',
            role: dbUser.role,
            createdAt: dbUser.createdAt,
            ordersCount: dbUser._count.orders,
            addressesCount: dbUser._count.addresses,
          },
        });
      }
    } catch {
      // Database offline or query failed, fall back to session data
    }

    return NextResponse.json({
      user: {
        userId: session.userId,
        name: session.name,
        email: session.email,
        phone: '',
        role: session.role,
        ordersCount: 0,
        addressesCount: 0,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
