import { requireAuth } from '@/lib/auth';
import { ROLE_LABEL, ROLE_EMOJI } from '@/lib/roles';
import { notFound } from 'next/navigation';
import ChatRequestButton from './ChatRequestButton';
import Link from 'next/link';
import { getProfileById } from '@/lib/dummyData';

export default async function ProfileDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await requireAuth();
  const p = getProfileById(id);
  if (!p) notFound();
  const canRequestChat = me.role === 'student' && p.role === 'ob_og' && p.accepts_chat_requests;
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link href="/profile" className="inline-flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors">← メンバー一覧に戻る</Link>
      <div className="card-pop">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-20 h-20 rounded-3xl bg-gradient-hero flex items-center justify-center text-white font-bold text-3xl shadow-soft shrink-0">{p.full_name.charAt(0)}</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{p.full_name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={p.role === 'ob_og' ? 'badge-coral' : 'badge-mint'}>{ROLE_EMOJI[p.role]} {ROLE_LABEL[p.role]}</span>
              {p.role === 'ob_og' && p.graduation_year && (<span className="badge-slate">🎓 {p.graduation_year} 年卒</span>)}
              {p.role === 'faculty' && p.department && (<span className="badge-slate">🏛️ {p.department}</span>)}
            </div>
          </div>
          {canRequestChat && <ChatRequestButton obOgId={p.id} existing={null} />}
        </div>
        {p.bio && (<section className="mt-6"><h3 className="font-bold text-sm text-slate-700 mb-1 flex items-center gap-1"><span>💡</span> 自己紹介</h3><p className="whitespace-pre-wrap text-slate-800 leading-relaxed">{p.bio}</p></section>)}
        {p.founding_experience && (<section className="mt-6"><h3 className="font-bold text-sm text-slate-700 mb-1 flex items-center gap-1"><span>🚀</span> 創業経験</h3><p className="whitespace-pre-wrap text-slate-800 leading-relaxed">{p.founding_experience}</p></section>)}
        {p.expertise && p.expertise.length > 0 && (
          <section className="mt-6">
            <h3 className="font-bold text-sm text-slate-700 mb-2 flex items-center gap-1"><span>✨</span> 得意領域</h3>
            <div className="flex flex-wrap gap-1.5">{p.expertise.map((tag) => (<span key={tag} className="chip">#{tag}</span>))}</div>
          </section>
        )}
      </div>
    </div>
  );
}
