import { requireAuth } from '@/lib/auth';
import { ROLE_LABEL, ROLE_EMOJI } from '@/lib/roles';
import Link from 'next/link';
import RequestActions from './RequestActions';
import { dummyChatRooms, dummyChatRequests } from '@/lib/dummyData';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

export default async function ChatHubPage() {
  const me = await requireAuth();
  const myRooms = me.role === 'student' || me.role === 'ob_og' ? dummyChatRooms : [];
  const pendingRequests = me.role === 'ob_og' ? dummyChatRequests : [];
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="section-title"><span>✉️</span> チャット</h1>
        <p className="section-subtitle">1on1でじっくり相談しよう ✨</p>
      </div>
      {me.role === 'ob_og' && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3"><span>📬</span> 承諾待ちの申請{pendingRequests.length > 0 && (<span className="badge-coral">{pendingRequests.length} 件</span>)}</h2>
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="card-pop bg-gradient-to-br from-coral-50 to-white border-coral-100">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-coral flex items-center justify-center text-white font-bold shrink-0">{req.student?.full_name.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 inline-flex items-center gap-1">🎓 {req.student?.full_name} さん</div>
                    <div className="text-xs text-slate-500">{formatDistanceToNow(new Date(req.created_at), { addSuffix: true, locale: ja })}</div>
                    {req.message && (<p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap leading-relaxed bg-white rounded-2xl p-3 border border-slate-100">{req.message}</p>)}
                  </div>
                </div>
                <div className="mt-4 flex justify-end"><RequestActions requestId={req.id} /></div>
              </div>
            ))}
            {pendingRequests.length === 0 && (<div className="card text-center py-8"><div className="text-4xl mb-2">📭</div><p className="text-sm text-slate-500">新しい申請はありません</p></div>)}
          </div>
        </section>
      )}
      <section>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3"><span>💬</span> チャットルーム</h2>
        <div className="space-y-3">
          {myRooms.map((r) => {
            const displayOther = me.role === 'ob_og' ? r.student : r.ob_og;
            return (
              <Link key={r.id} href={`/chat/${r.id}`} className="card-hover block group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-hero flex items-center justify-center text-white font-bold shrink-0 group-hover:scale-110 transition-transform">{displayOther?.full_name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="font-bold text-slate-900">{displayOther?.full_name}</div>
                      <span className="badge-slate text-[10px]">{displayOther && ROLE_EMOJI[displayOther.role]} {displayOther && ROLE_LABEL[displayOther.role]}</span>
                    </div>
                    {r.lastMessage && (<div className="text-xs text-slate-500 mt-1 truncate">{r.lastMessage}</div>)}
                  </div>
                  <div className="text-slate-400 group-hover:text-brand-500 transition-colors text-lg">→</div>
                </div>
              </Link>
            );
          })}
          {myRooms.length === 0 && (
            <div className="card text-center py-8">
              <div className="text-4xl mb-2">💌</div>
              <p className="text-sm text-slate-500">まだチャットルームはありません</p>
              {me.role === 'student' && (<Link href="/profile" className="btn-coral text-xs mt-4 inline-flex">🤝 メンバーから相談相手を探す</Link>)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
