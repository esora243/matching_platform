import { createClient } from '@/lib/supabase/server';
import { requireAuth, ROLE_LABEL } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MembersPage() {
  const me = await requireAuth();
  const supabase = createClient();

  // OB/OG と教職員のみ一覧
  const { data: members } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['ob_og', 'faculty'])
    .eq('approval_status', 'approved')
    .order('full_name');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">メンバー一覧</h1>
        <Link href="/profile/me" className="btn-secondary">マイプロフィール</Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {(members ?? []).map((m: any) => (
          <Link key={m.id} href={`/profile/${m.id}`} className="card hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{m.full_name}</h2>
              <span className="badge bg-brand-50 text-brand-700">{ROLE_LABEL[m.role as keyof typeof ROLE_LABEL]}</span>
            </div>
            {m.role === 'ob_og' && m.graduation_year && (
              <div className="text-xs text-slate-500 mt-1">{m.graduation_year} 年卒</div>
            )}
            {m.role === 'faculty' && m.department && (
              <div className="text-xs text-slate-500 mt-1">{m.department}</div>
            )}
            {m.bio && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{m.bio}</p>}
            <div className="flex flex-wrap gap-1 mt-2">
              {(m.expertise ?? []).map((tag: string) => (
                <span key={tag} className="badge bg-slate-100 text-slate-700">{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
