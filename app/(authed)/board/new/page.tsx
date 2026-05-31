'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewTopicPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    alert('🎉 相談を投稿しました！(プロトタイプではダミー動作です)');
    router.push('/board');
  };
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link href="/board" className="inline-flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors">← 掲示板に戻る</Link>
      <form onSubmit={submit} className="card-pop space-y-5">
        <div>
          <div className="text-3xl mb-2">✨</div>
          <h1 className="text-2xl font-bold text-slate-900">気軽に相談してみる</h1>
          <p className="text-sm text-slate-500 mt-1">悩みを書くだけで、先輩や先生がヒントをくれるかも 🌱</p>
        </div>
        <div><label className="label">タイトル</label><input className="input" required placeholder="例: シード期の資金調達について悩んでいます" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><label className="label">本文</label><textarea className="input min-h-[180px]" required placeholder="状況や悩みを自由に書いてください ✍️" value={body} onChange={(e) => setBody(e.target.value)} /></div>
        <div><label className="label">タグ（カンマ区切り）</label><input className="input" placeholder="医療機器, バイオ, 資金調達" value={tags} onChange={(e) => setTags(e.target.value)} /><p className="text-xs text-slate-500 mt-1.5">💡 関連するキーワードを入れると見つけてもらいやすくなります</p></div>
        <div className="flex gap-2 justify-end pt-2">
          <Link href="/board" className="btn-secondary">キャンセル</Link>
          <button className="btn-primary" disabled={loading}>{loading ? '投稿中…' : '🚀 投稿する'}</button>
        </div>
      </form>
    </div>
  );
}
