'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function NewProgramPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('補助金');
  const [deadline, setDeadline] = useState('');
  const [url, setUrl] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('programs').insert({
      author_id: user.id,
      title, description, category,
      deadline: deadline || null,
      url: url || null,
    });
    setLoading(false);
    if (error) return setErr(error.message);
    router.push('/programs');
  };

  return (
    <form onSubmit={submit} className="card max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">支援プログラムを登録</h1>
      <div><label className="label">タイトル</label>
        <input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div><label className="label">カテゴリ</label>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>補助金</option><option>アクセラレータ</option><option>メンタリング</option><option>その他</option>
        </select></div>
      <div><label className="label">説明</label>
        <textarea className="input min-h-[120px]" required value={description} onChange={(e) => setDescription(e.target.value)} /></div>
      <div><label className="label">締切日</label>
        <input className="input" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></div>
      <div><label className="label">URL（詳細ページ）</label>
        <input className="input" type="url" value={url} onChange={(e) => setUrl(e.target.value)} /></div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="btn-primary" disabled={loading}>{loading ? '登録中…' : '登録'}</button>
    </form>
  );
}
