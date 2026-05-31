import { requireAuth } from '@/lib/auth';
import Link from 'next/link';
import { format } from 'date-fns';
import { dummyPrograms } from '@/lib/dummyData';

export default async function ProgramsPage() {
  const me = await requireAuth();
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title"><span>💰</span> 支援制度・補助金</h1>
          <p className="section-subtitle">起業の追い風になる、補助金やアクセラレータ情報をチェック ✨</p>
        </div>
        {me.role === 'faculty' && (<Link href="/programs/new" className="btn-mint">💰 新しい制度を登録する</Link>)}
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {dummyPrograms.map((p) => (
          <div key={p.id} className="card-hover">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h2 className="font-bold text-slate-900">{p.title}</h2>
                {p.category && (<span className="badge-mint mt-2">{p.category}</span>)}
              </div>
              {p.deadline && (<div className="text-right text-xs text-coral-600 font-semibold shrink-0 bg-coral-50 px-3 py-1.5 rounded-full">⏰ {format(new Date(p.deadline), 'M/d')} 締切</div>)}
            </div>
            <p className="text-sm text-slate-700 mt-3 whitespace-pre-wrap leading-relaxed">{p.description}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500">登録: {p.author?.full_name}</div>
              {p.url && (<a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors inline-flex items-center gap-0.5">詳細を見る →</a>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
