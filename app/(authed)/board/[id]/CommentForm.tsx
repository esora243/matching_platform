'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function CommentForm({ topicId }: { topicId: string }) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setErr('ログインが必要です');
    const { error } = await supabase
      .from('comments')
      .insert({ topic_id: topicId, author_id: user.id, body });
    setLoading(false);
    if (error) return setErr(error.message);
    setBody('');
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h3 className="font-semibold">回答を投稿</h3>
      <textarea
        className="input min-h-[120px]"
        required
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="経験に基づくアドバイスを書いてください…"
      />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="btn-primary" disabled={loading}>{loading ? '投稿中…' : '投稿'}</button>
    </form>
  );
}
