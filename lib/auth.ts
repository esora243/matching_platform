import type { Profile, UserRole } from '@/types/database';

const dummyProfile: Profile = {
  id: 'dummy-user-id',
  email: 'test@example.com',
  full_name: '浜松 太郎（テスト）',
  role: 'student',
  approval_status: 'approved',
  avatar_url: null,
  bio: 'これはデプロイテスト用の仮データです。',
  graduation_year: null,
  founding_experience: null,
  expertise: [],
  department: null,
  enrollment_year: 2024,
  accepts_chat_requests: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function getCurrentProfile(): Promise<Profile | null> {
  return dummyProfile;
}

export async function requireAuth(): Promise<Profile> {
  return dummyProfile;
}

export async function requireRole(roles: UserRole[]): Promise<Profile> {
  return dummyProfile;
}

export const ROLE_LABEL: Record<UserRole, string> = {
  student: '学生',
  ob_og: 'OB・OG',
  faculty: '教職員',
  admin: '管理者',
};