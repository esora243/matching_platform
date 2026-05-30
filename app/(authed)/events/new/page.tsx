'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function NewEventPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('events').insert({
      organizer_id: user.id,
      title,
      description: description || null,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      location: location || null,
      capacity: capacity ? Number(capacity) : null,
    });
    setLoading(false);
    if (error) return setErr(error.message);
    router.push('/events');
  };

  return (
    <form onSubmit={submit} className="card max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">イベントを登録</h1>
      <div><label className="label">タイトル</label>
        <input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div><label className="label">説明</label>
        <textarea className="input min-h-[100px]" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="label">開始日時</label>
          <input className="input" type="datetime-local" required value={startsAt} onChange={(e) => setStartsAt(e.target.value)} /></div>
        <div><label className="label">終了日時</label>
          <input className="input" type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} /></div>
      </div>
      <div><label className="label">開催場所</label>
        <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} /></div>
      <div><label className="label">定員（任意）</label>
        <input className="input" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} /></div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="btn-primary" disabled={loading}>{loading ? '登録中…' : '登録'}</button>
    </form>
  );
}
