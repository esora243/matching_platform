// Client/Server/Edge どこからも import 安全な定数
import type { UserRole } from '@/types/database';

export const DUMMY_ROLE_COOKIE = 'dummy_role';
export const VALID_ROLES: UserRole[] = ['student', 'ob_og', 'faculty', 'admin'];

export const ROLE_LABEL: Record<UserRole, string> = {
  student: '学生', ob_og: 'OB・OG', faculty: '教職員', admin: '管理者',
};

export const ROLE_EMOJI: Record<UserRole, string> = {
  student: '🎓', ob_og: '🚀', faculty: '👨‍🏫', admin: '🛡️',
};
