import { createClient } from './supabase/server';
import { redirect } from 'next/navigation';
import type { Profile, UserRole } from '@/types/database';

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return data as Profile | null;
}

export async function requireAuth(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  return profile;
}

export async function requireRole(roles: UserRole[]): Promise<Profile> {
  const profile = await requireAuth();
  if (!roles.includes(profile.role)) redirect('/dashboard');
  return profile;
}

export const ROLE_LABEL: Record<UserRole, string> = {
  student: '学生',
  ob_og: 'OB・OG',
  faculty: '教職員',
  admin: '管理者',
};
