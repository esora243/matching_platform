import { createClient } from '@/lib/supabase/server';
import { requireAuth, ROLE_LABEL } from '@/lib/auth';
import { notFound } from 'next/navigation';
import CommentForm from './CommentForm';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function TopicPage({ params }: { params: { id: string } }) {
  const me = await requireAuth();
  const supabase = createClient();
  const { data: topic } = await supabase
    .from('topics')
    .select('*, author:profiles!topics_author_id_fkey(*)')
    .eq('id', params.id)
    .single();
  if (!topic) notFound();

  const { data: comments } = await supabase
    .from('comments')
    .select('*, author:profiles!comments_author_id_fkey(*)')
    .eq('topic_id', params.id)
    .order('created_at', { ascending: true });

  const canComment = (me.role === 'ob_og' || me.role === 'faculty') && me.approval_status === 'approved';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <article className="card">
        <h1 className="text-2xl font-bold">{topic.title}</h1>
        <div className="text-sm text-slate-500 mt-2">
          {topic.author?.full_name}（{ROLE_LABEL[topic.author?.role as keyof typeof ROLE_LABEL]}）·
          {' '}{format(new Date(topic.created_at), 'yyyy/MM/dd HH:mm')}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {(topic.tags ?? []).map((tag: string) => (
            <span key={tag} className="badge bg-brand-50 text-brand-700">#{tag}</span>
          ))}
        </div>
        <p className="mt-4 whitespace-pre-wrap text-slate-800">{topic.body}</p>
      </article>

      <h2 className="text-lg font-semibold">回答（{comments?.length ?? 0}）</h2>
      <div className="space-y-3">
        {(comments ?? []).map((c: any) => (
          <div key={c.id} className="card">
            <div className="flex items-center justify-between text-sm">
              <div className="font-medium">
                {c.author?.full_name}
                <span className="badge bg-slate-100 text-slate-600 ml-2">
                  {ROLE_LABEL[c.author?.role as keyof typeof ROLE_LABEL]}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                {format(new Date(c.created_at), 'yyyy/MM/dd HH:mm')}
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-slate-800">{c.body}</p>
          </div>
        ))}
        {(!comments || comments.length === 0) && (
          <p className="text-sm text-slate-500">まだ回答はありません</p>
        )}
      </div>

      {canComment ? (
        <CommentForm topicId={topic.id} />
      ) : (
        <p className="text-xs text-slate-500">※ 回答は OB・OG / 教職員のみ投稿できます</p>
      )}
    </div>
  );
}
