import { NextResponse } from 'next/server';
import { clearAuthCookie, getCurrentUser } from '@/lib/auth';

import { cookies } from 'next/headers';

export async function POST() {
  await clearAuthCookie();
  const cookieStore = await cookies();
  cookieStore.delete('prayele_cart_session');
  return NextResponse.json({ success: true });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user });
}
