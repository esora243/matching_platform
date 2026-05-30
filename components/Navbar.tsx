'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';
import { ROLE_LABEL } from '@/lib/auth';

export default function Navbar({ profile }: { profile: Profile }) {
  const path = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const links = [
    { href: '/dashboard', label: 'ホーム' },
    { href: '/board', label: '掲示板' },
    { href: '/events', label: 'イベント' },
    { href: '/programs', label: '支援プログラム' },
    { href: '/profile', label: 'メンバー' },
    { href: '/chat', label: 'チャット' },
  ];
  if (profile.role === 'admin') links.push({ href: '/admin', label: '管理' });

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-brand-700">
          浜松医大 起業支援
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded text-sm ${
                path.startsWith(l.href)
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium">{profile.full_name}</div>
            <div className="text-xs text-slate-500">{ROLE_LABEL[profile.role]}</div>
          </div>
          <button onClick={logout} className="btn-secondary text-xs">
            ログアウト
          </button>
        </div>
      </div>
    </nav>
  );
}
