'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DUMMY_ROLE_COOKIE, VALID_ROLES } from '@/lib/roles';
import type { UserRole } from '@/types/database';

export async function loginAsRole(role: UserRole) {
  if (!VALID_ROLES.includes(role)) throw new Error('Invalid role');
  const store = await cookies();
  store.set(DUMMY_ROLE_COOKIE, role, {
    httpOnly: false, sameSite: 'lax', path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect('/dashboard');
}

export async function logout() {
  const store = await cookies();
  store.delete(DUMMY_ROLE_COOKIE);
  redirect('/login');
}
