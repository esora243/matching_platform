import { requireAuth } from '@/lib/auth';
import { ROLE_LABEL, ROLE_EMOJI } from '@/lib/roles';
import { notFound } from 'next/navigation';
import CommentForm from './CommentForm';
import { format } from 'date-fns';
import Link from 'next/link';
import { getTopicById, getCommentsByTopicId } from '@/lib/dummyData';

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await requireAuth();
  const topic = getTopicById(id);
  if (!topic) notFound();
  const comments = getCommentsByTopicId(id);
  const canComment = (me.role === 'ob_og' || me.role === 'faculty') && me.approval_status === 'approved';
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/board" className="inline-flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors">← 掲示板に戻る</Link>
      <article className="card-pop">
        <div className="flex items-start gap-3">
          <div className="text-4xl">💭</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{topic.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mt-3">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700">{ROLE_EMOJI[topic.author.role]} {topic.author.full_name}</span>
              <span className="badge-slate">{ROLE_LABEL[topic.author.role]}</span>
              <span>·</span><span>{format(new Date(topic.created_at), 'yyyy/MM/dd HH:mm')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">{topic.tags.map((tag) => (<span key={tag} className="chip">#{tag}</span>))}</div>
            <p className="mt-5 whitespace-pre-wrap text-slate-800 leading-relaxed">{topic.body}</p>
          </div>
        </div>
      </article>
      <div>
        <h2 className="section-title"><span>💬</span> 回答（{comments.length}）</h2>
        <div className="space-y-3 mt-4">
          {comments.map((c) => (
            <div key={c.id} className="card">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold shrink-0">{c.author.full_name.charAt(0)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-sm">
                    <div className="font-semibold text-slate-900 inline-flex items-center gap-2">{c.author.full_name}<span className="badge-mint">{ROLE_EMOJI[c.author.role]} {ROLE_LABEL[c.author.role]}</span></div>
                    <div className="text-xs text-slate-500">{format(new Date(c.created_at), 'yyyy/MM/dd HH:mm')}</div>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-slate-800 leading-relaxed">{c.body}</p>
                </div>
              </div>
            </div>
          ))}
          {comments.length === 0 && (<div className="card text-center py-10"><div className="text-4xl mb-2">🌱</div><p className="text-sm text-slate-500">まだ回答はありません。最初の回答者になろう！</p></div>)}
        </div>
      </div>
      {canComment ? <CommentForm topicId={topic.id} /> : (<div className="card bg-slate-50 border-slate-200 text-center py-6"><p className="text-sm text-slate-500">✍️ 回答は OB・OG / 教職員のみ投稿できます</p></div>)}
    </div>
  );
}
