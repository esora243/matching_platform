// サーバー専用：next/headers を使うため Client/Edge には import しないこと
// （middleware/クライアントからは @/lib/roles の方を使うこと）
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Profile, UserRole } from '@/types/database';
import { DUMMY_ROLE_COOKIE, VALID_ROLES } from './roles';

export { DUMMY_ROLE_COOKIE, VALID_ROLES, ROLE_LABEL, ROLE_EMOJI } from './roles';

const dummyProfiles: Record<UserRole, Profile> = {
  student: {
    id: 'dummy-student-id', email: 'student@hama-med.example.jp',
    full_name: '医大 はなこ', role: 'student', approval_status: 'approved',
    avatar_url: null,
    bio: '医学部4年生です。在学中にヘルステック領域での起業に挑戦したいと考えています ✨',
    graduation_year: null, founding_experience: null,
    expertise: ['ヘルステック', 'AI診断'], department: null,
    enrollment_year: 2022, accepts_chat_requests: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  ob_og: {
    id: 'dummy-ob-og-id', email: 'obog@hama-med.example.jp',
    full_name: '起業 たろう', role: 'ob_og', approval_status: 'approved',
    avatar_url: null,
    bio: '2015年卒。医療AIスタートアップを共同創業し、シリーズBまでCEOを務めました 🚀',
    graduation_year: 2015,
    founding_experience: '2018年に医療AI企業を共同創業、シリーズBまでCEO',
    expertise: ['医療機器', '資金調達', '薬事申請'], department: null,
    enrollment_year: null, accepts_chat_requests: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  faculty: {
    id: 'dummy-faculty-id', email: 'faculty@hama-med.example.jp',
    full_name: '浜松 けんいち 先生', role: 'faculty', approval_status: 'approved',
    avatar_url: null,
    bio: '医学部 産学連携推進室。学生の起業相談・支援プログラム情報の発信を担当しています 📚',
    graduation_year: null, founding_experience: null,
    expertise: ['産学連携', '知財', '研究シーズ'], department: '産学連携推進室',
    enrollment_year: null, accepts_chat_requests: false,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  admin: {
    id: 'dummy-admin-id', email: 'admin@hama-med.example.jp',
    full_name: '管理者 さくら', role: 'admin', approval_status: 'approved',
    avatar_url: null, bio: 'プラットフォーム運営事務局です 🛡️',
    graduation_year: null, founding_experience: null,
    expertise: [], department: '事務局',
    enrollment_year: null, accepts_chat_requests: false,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
};

export async function getCurrentRole(): Promise<UserRole | null> {
  const store = await cookies();
  const val = store.get(DUMMY_ROLE_COOKIE)?.value as UserRole | undefined;
  if (val && (VALID_ROLES as string[]).includes(val)) return val;
  return null;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const role = await getCurrentRole();
  return role ? dummyProfiles[role] : null;
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
