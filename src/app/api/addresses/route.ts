import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET — List user's addresses
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST — Create new address
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, addressLine1, addressLine2, city, state, postalCode, country, type, isDefault } = body;

    if (!name || !phone || !addressLine1 || !city || !state || !postalCode) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    // If setting as default, unset all others
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.userId,
        name,
        phone,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        postalCode,
        country: country || 'India',
        type: type || 'SHIPPING',
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({ success: true, address });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// PUT — Update address
export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, address });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE — Remove address
export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await req.json();

    const existing = await prisma.address.findFirst({
      where: { id, userId: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
