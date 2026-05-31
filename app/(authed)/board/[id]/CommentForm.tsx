'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CommentForm({ topicId: _topicId }: { topicId: string }) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false); setSuccess(true); setBody('');
    setTimeout(() => { setSuccess(false); router.refresh(); }, 1500);
  };
  return (
    <form onSubmit={submit} className="card-pop space-y-3">
      <h3 className="font-bold text-slate-900 flex items-center gap-1.5"><span>✍️</span> 回答を投稿する</h3>
      <textarea className="input min-h-[120px]" required value={body} onChange={(e) => setBody(e.target.value)} placeholder="経験に基づくアドバイスを書いてください…後輩の力になる温かいコメントを 💚" />
      {success && (<p className="text-sm text-mint-600 inline-flex items-center gap-1 animate-fade-in">🎉 回答を投稿しました！</p>)}
      <div className="flex justify-end"><button className="btn-primary" disabled={loading}>{loading ? '投稿中…' : '💚 回答を送る'}</button></div>
    </form>
  );
}
