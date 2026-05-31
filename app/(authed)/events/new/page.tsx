'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewEventPage() {
  const [title, setTitle] = useState(''); const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState(''); const [endsAt, setEndsAt] = useState('');
  const [location, setLocation] = useState(''); const [capacity, setCapacity] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    alert('🎉 イベントを企画しました！(プロトタイプのダミー動作です)');
    router.push('/events');
  };
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link href="/events" className="inline-flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors">← イベント一覧に戻る</Link>
      <form onSubmit={submit} className="card-pop space-y-5">
        <div>
          <div className="text-3xl mb-2">📅</div>
          <h1 className="text-2xl font-bold text-slate-900">新しいイベントを企画する</h1>
          <p className="text-sm text-slate-500 mt-1">学生・OB/OG・先生がつながる、楽しい時間を作ろう 🎉</p>
        </div>
        <div><label className="label">タイトル</label><input className="input" required placeholder="例: 🚀 医療スタートアップ・ピッチナイト" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><label className="label">説明</label><textarea className="input min-h-[100px]" placeholder="どんなイベント？" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">開始日時</label><input className="input" type="datetime-local" required value={startsAt} onChange={(e) => setStartsAt(e.target.value)} /></div>
          <div><label className="label">終了日時</label><input className="input" type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} /></div>
        </div>
        <div><label className="label">開催場所</label><input className="input" placeholder="例: 講堂、オンライン(Zoom)など" value={location} onChange={(e) => setLocation(e.target.value)} /></div>
        <div><label className="label">定員（任意）</label><input className="input" type="number" placeholder="例: 50" value={capacity} onChange={(e) => setCapacity(e.target.value)} /></div>
        <div className="flex gap-2 justify-end pt-2">
          <Link href="/events" className="btn-secondary">キャンセル</Link>
          <button className="btn-mint" disabled={loading}>{loading ? '登録中…' : '🎉 イベントを公開する'}</button>
        </div>
      </form>
    </div>
  );
}
