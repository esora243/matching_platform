'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function NewTopicPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setErr('ログインが必要です');
    const tagArray = tags.split(',').map((s) => s.trim()).filter(Boolean);
    const { data, error } = await supabase
      .from('topics')
      .insert({ author_id: user.id, title, body, tags: tagArray })
      .select()
      .single();
    setLoading(false);
    if (error) return setErr(error.message);
    router.push(`/board/${data.id}`);
  };

  return (
    <form onSubmit={submit} className="card max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">新しい相談を投稿</h1>
      <div>
        <label className="label">タイトル</label>
        <input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="label">本文</label>
        <textarea className="input min-h-[160px]" required value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <div>
        <label className="label">タグ（カンマ区切り）</label>
        <input className="input" placeholder="医療機器, バイオ, 資金調達" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="btn-primary" disabled={loading}>{loading ? '投稿中…' : '投稿する'}</button>
    </form>
  );
}
