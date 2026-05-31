'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { Profile } from '@/types/database';
import { ROLE_LABEL, ROLE_EMOJI } from '@/lib/roles';
import { logout } from '@/app/login/actions';

export default function Navbar({ profile }: { profile: Profile }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/dashboard', label: 'ホーム', emoji: '🏠' },
    { href: '/board', label: '掲示板', emoji: '💬' },
    { href: '/events', label: 'イベント', emoji: '📅' },
    { href: '/programs', label: '支援制度', emoji: '💰' },
    { href: '/profile', label: 'メンバー', emoji: '👥' },
    { href: '/chat', label: 'チャット', emoji: '✉️' },
  ];
  if (profile.role === 'admin') links.push({ href: '/admin', label: '管理', emoji: '🛡️' });

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-slate-900 hover:opacity-80 transition-opacity shrink-0">
          <span className="text-2xl">🚀</span>
          <span className="hidden sm:inline bg-gradient-hero bg-clip-text text-transparent">はままつ医大スタートアップ</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = path === l.href || (l.href !== '/dashboard' && path.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href}
                className={`px-3.5 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1.5 transition-all duration-300 ease-in-out active:scale-95 ${
                  active ? 'bg-brand-50 text-brand-700 shadow-soft' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                <span className="text-base">{l.emoji}</span><span>{l.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <div className="text-sm font-semibold text-slate-900">{profile.full_name}</div>
            <div className="text-[10px] font-bold inline-flex items-center gap-1 text-brand-600">
              {ROLE_EMOJI[profile.role]} {ROLE_LABEL[profile.role]}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-hero flex items-center justify-center text-white text-base font-bold shadow-soft">
            {profile.full_name.charAt(0)}
          </div>
          <form action={logout}>
            <button type="submit" className="hidden md:inline-flex btn-ghost text-xs">ログアウト</button>
          </form>
          <button type="button" onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="メニュー">
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => {
              const active = path === l.href || (l.href !== '/dashboard' && path.startsWith(l.href));
              return (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                    active ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  <span>{l.emoji}</span> {l.label}
                </Link>
              );
            })}
            <form action={logout}>
              <button type="submit" className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-semibold text-coral-600 hover:bg-coral-50 transition-colors">
                👋 ログアウト
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
