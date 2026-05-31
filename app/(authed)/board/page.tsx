import { requireAuth } from '@/lib/auth';
import { ROLE_LABEL, ROLE_EMOJI } from '@/lib/roles';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { dummyTopics } from '@/lib/dummyData';

export default async function BoardPage() {
  const me = await requireAuth();
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title"><span>💬</span> 起業よろず相談</h1>
          <p className="section-subtitle">悩みを投げかけて、先輩や先生からのアドバイスをもらおう ✨</p>
        </div>
        {me.role === 'student' && (<Link href="/board/new" className="btn-primary">✨ 気軽に相談してみる</Link>)}
      </div>
      <div className="space-y-3">
        {dummyTopics.map((t) => (
          <Link key={t.id} href={`/board/${t.id}`} className="card-hover block group">
            <div className="flex items-start gap-4">
              <div className="text-3xl shrink-0 group-hover:animate-wiggle">💭</div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg text-slate-900 group-hover:text-brand-700 transition-colors">{t.title}</h2>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">{t.body}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">{t.tags.map((tag) => (<span key={tag} className="chip">#{tag}</span>))}</div>
              </div>
              <div className="text-right text-xs text-slate-500 shrink-0 space-y-1">
                <div className="font-semibold text-slate-700 inline-flex items-center gap-1">{ROLE_EMOJI[t.author.role]} {t.author.full_name}</div>
                <div className="text-[10px]">({ROLE_LABEL[t.author.role]})</div>
                <div>{formatDistanceToNow(new Date(t.created_at), { addSuffix: true, locale: ja })}</div>
                <div className="badge-brand mt-2">💬 {t.commentCount}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
