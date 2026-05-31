'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProgramPage() {
  const [title, setTitle] = useState(''); const [description, setDescription] = useState('');
  const [category, setCategory] = useState('補助金'); const [deadline, setDeadline] = useState('');
  const [url, setUrl] = useState(''); const [loading, setLoading] = useState(false);
  const router = useRouter();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    alert('🎉 支援制度を登録しました！(プロトタイプのダミー動作です)');
    router.push('/programs');
  };
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link href="/programs" className="inline-flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors">← 支援制度一覧に戻る</Link>
      <form onSubmit={submit} className="card-pop space-y-5">
        <div>
          <div className="text-3xl mb-2">💰</div>
          <h1 className="text-2xl font-bold text-slate-900">新しい支援制度を登録する</h1>
          <p className="text-sm text-slate-500 mt-1">補助金・アクセラレータ・メンタリング情報を学生に届けよう</p>
        </div>
        <div><label className="label">タイトル</label><input className="input" required placeholder="例: 大学発スタートアップ創出支援" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><label className="label">カテゴリ</label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>補助金</option><option>アクセラレータ</option><option>メンタリング</option><option>その他</option>
          </select>
        </div>
        <div><label className="label">説明</label><textarea className="input min-h-[120px]" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="制度の概要、対象、メリットなど" /></div>
        <div><label className="label">締切日</label><input className="input" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></div>
        <div><label className="label">詳細ページのURL</label><input className="input" type="url" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} /></div>
        <div className="flex gap-2 justify-end pt-2">
          <Link href="/programs" className="btn-secondary">キャンセル</Link>
          <button className="btn-mint" disabled={loading}>{loading ? '登録中…' : '🎉 公開する'}</button>
        </div>
      </form>
    </div>
  );
}
