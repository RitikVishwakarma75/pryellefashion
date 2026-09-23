import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

const AUTH_COOKIE = 'prayele_session';
const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'prayele-secret-key-32-chars-long-development-token';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

/**
 * Hash plain password with salt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Compare password with hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create HMAC SHA256 signed session token
 */
export function signSessionToken(payload: AuthSession): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('base64url');
  return `${data}.${signature}`;
}

/**
 * Verify HMAC SHA256 session token
 */
export function verifySessionToken(token: string): AuthSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('base64url');
    if (signature !== expectedSig) return null;
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    return parsed as AuthSession;
  } catch {
    return null;
  }
}

/**
 * Retrieve current user from cookies (Server Components / Server Actions)
 */
export async function getCurrentUser(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Guard that enforces ADMIN or STAFF access
 */
export async function requireAdmin(): Promise<AuthSession> {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
    throw new Error('Unauthorized: Admin access required');
  }
  return user;
}

/**
 * Set session cookie
 */
export async function setAuthCookie(session: AuthSession): Promise<void> {
  const token = signSessionToken(session);
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear session cookie
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}
