import { createClient } from '@/lib/supabase/server';
import { requireAuth, ROLE_LABEL } from '@/lib/auth';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function BoardPage() {
  const me = await requireAuth();
  const supabase = createClient();
  const { data: topics } = await supabase
    .from('topics')
    .select('*, author:profiles!topics_author_id_fkey(full_name, role), comments(count)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">起業相談 掲示板</h1>
        {me.role === 'student' && (
          <Link href="/board/new" className="btn-primary">＋ 相談を投稿</Link>
        )}
      </div>
      <div className="space-y-3">
        {(topics ?? []).map((t: any) => (
          <Link key={t.id} href={`/board/${t.id}`} className="card hover:shadow-md transition block">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-lg">{t.title}</h2>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{t.body}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(t.tags ?? []).map((tag: string) => (
                    <span key={tag} className="badge bg-brand-50 text-brand-700">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="text-right text-xs text-slate-500 shrink-0 ml-4">
                <div>{t.author?.full_name} ({ROLE_LABEL[t.author?.role as keyof typeof ROLE_LABEL] ?? '-'})</div>
                <div>{formatDistanceToNow(new Date(t.created_at), { addSuffix: true, locale: ja })}</div>
                <div className="mt-1 text-brand-600">💬 {t.comments?.[0]?.count ?? 0}</div>
              </div>
            </div>
          </Link>
        ))}
        {(!topics || topics.length === 0) && (
          <p className="text-center text-slate-500 py-12">まだ相談はありません</p>
        )}
      </div>
    </div>
  );
}
