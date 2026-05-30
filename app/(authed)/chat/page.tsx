import { createClient } from '@/lib/supabase/server';
import { requireAuth, ROLE_LABEL } from '@/lib/auth';
import Link from 'next/link';
import RequestActions from './RequestActions';

export const dynamic = 'force-dynamic';

export default async function ChatHubPage() {
  const me = await requireAuth();
  const supabase = createClient();

  // 自分が参加するチャットルーム
  const { data: rooms } = await supabase
    .from('chat_rooms')
    .select('*, student:profiles!chat_rooms_student_id_fkey(full_name, role), ob_og:profiles!chat_rooms_ob_og_id_fkey(full_name, role)')
    .or(`student_id.eq.${me.id},ob_og_id.eq.${me.id}`)
    .order('created_at', { ascending: false });

  // OB/OG: 自分宛の pending 申請
  let pendingRequests: any[] = [];
  if (me.role === 'ob_og') {
    const { data } = await supabase
      .from('chat_requests')
      .select('*, student:profiles!chat_requests_student_id_fkey(full_name)')
      .eq('ob_og_id', me.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    pendingRequests = data ?? [];
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">チャット</h1>

      {me.role === 'ob_og' && (
        <section>
          <h2 className="font-semibold mb-2">承諾待ちの申請（{pendingRequests.length}）</h2>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div key={req.id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{req.student?.full_name} さん</div>
                    {req.message && (
                      <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{req.message}</p>
                    )}
                  </div>
                  <RequestActions requestId={req.id} />
                </div>
              </div>
            ))}
            {pendingRequests.length === 0 && (
              <p className="text-sm text-slate-500">新しい申請はありません</p>
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-semibold mb-2">チャットルーム</h2>
        <div className="space-y-2">
          {(rooms ?? []).map((r: any) => {
            const other = r.student_id === me.id ? r.ob_og : r.student;
            return (
              <Link key={r.id} href={`/chat/${r.id}`} className="card hover:shadow-md transition block">
                <div className="font-medium">{other?.full_name}</div>
                <div className="text-xs text-slate-500">
                  {ROLE_LABEL[other?.role as keyof typeof ROLE_LABEL]}
                </div>
              </Link>
            );
          })}
          {(!rooms || rooms.length === 0) && (
            <p className="text-sm text-slate-500">まだチャットルームはありません</p>
          )}
        </div>
      </section>
    </div>
  );
}
