import { requireAuth, ROLE_LABEL } from '@/lib/auth';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function BoardPage() {
  const me = await requireAuth();

  const topics = [
    {
      id: '1',
      title: '医療機器の薬事承認についての相談',
      body: '新しいデバイスの開発を進めていますが、PMDAへの相談タイミングで迷っています...',
      tags: ['医療機器', '薬事'],
      created_at: new Date().toISOString(),
      author: { full_name: '医大 花子', role: 'student' },
      comments: [{ count: 2 }]
    },
    {
      id: '2',
      title: 'シード期の資金調達について',
      body: 'VCからの調達か、補助金を活用するかで悩んでいます。',
      tags: ['資金調達', 'VC'],
      created_at: new Date(Date.now() - 86400000).toISOString(),
      author: { full_name: '起業 太郎', role: 'ob_og' },
      comments: [{ count: 5 }]
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">起業相談 掲示板</h1>
        {me.role === 'student' && (
          <Link href="/board/new" className="btn-primary">＋ 相談を投稿</Link>
        )}
      </div>
      <div className="space-y-3">
        {topics.map((t) => (
          <div key={t.id} className="card block">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-lg">{t.title}</h2>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{t.body}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.tags.map((tag) => (
                    <span key={tag} className="badge bg-brand-50 text-brand-700">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="text-right text-xs text-slate-500 shrink-0 ml-4">
                <div>{t.author.full_name} ({ROLE_LABEL[t.author.role as keyof typeof ROLE_LABEL]})</div>
                <div>{formatDistanceToNow(new Date(t.created_at), { addSuffix: true, locale: ja })}</div>
                <div className="mt-1 text-brand-600">💬 {t.comments[0].count}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}