import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, setAuthCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Attempt to find in database
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
    } catch {
      // If DB offline, check admin fallback credentials
    }

    // Default emergency fallback credentials for admin if database is being migrated
    if (!user && email.toLowerCase() === 'admin@prayele.com' && password === 'Admin@Prayele2026!') {
      user = {
        id: 'admin-seed-id',
        name: 'Prayele Atelier Admin',
        email: 'admin@prayele.com',
        role: 'ADMIN' as const,
        password: '',
      };
    } else if (user) {
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    await setAuthCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
