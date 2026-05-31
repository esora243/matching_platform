import { requireAuth } from '@/lib/auth';
import { ROLE_LABEL, ROLE_EMOJI } from '@/lib/roles';
import Link from 'next/link';
import { dummyMembers } from '@/lib/dummyData';

export default async function MembersPage() {
  await requireAuth();
  const members = dummyMembers.filter((m) => m.approval_status === 'approved');
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title"><span>👥</span> 仲間を探す</h1>
          <p className="section-subtitle">OB・OG、教職員のメンバーから、相談したい人を見つけよう ✨</p>
        </div>
        <Link href="/profile/me" className="btn-secondary">🪪 マイプロフィール</Link>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {members.map((m) => (
          <Link key={m.id} href={`/profile/${m.id}`} className="card-hover group">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-hero flex items-center justify-center text-white font-bold text-lg shrink-0 group-hover:scale-110 transition-transform">{m.full_name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h2 className="font-bold text-slate-900">{m.full_name}</h2>
                  <span className={m.role === 'ob_og' ? 'badge-coral' : 'badge-mint'}>{ROLE_EMOJI[m.role]} {ROLE_LABEL[m.role]}</span>
                </div>
                {m.role === 'ob_og' && m.graduation_year && (<div className="text-xs text-slate-500 mt-1">🎓 {m.graduation_year} 年卒</div>)}
                {m.role === 'faculty' && m.department && (<div className="text-xs text-slate-500 mt-1">🏛️ {m.department}</div>)}
                {m.bio && (<p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">{m.bio}</p>)}
                <div className="flex flex-wrap gap-1.5 mt-3">{(m.expertise ?? []).map((tag) => (<span key={tag} className="chip">{tag}</span>))}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
