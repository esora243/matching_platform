'use client';
import { useState } from 'react';
import type { ChatRequest } from '@/types/database';

export default function ChatRequestButton({ obOgId: _obOgId, existing }: { obOgId: string; existing: ChatRequest | null }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending'>(existing?.status === 'pending' ? 'pending' : 'idle');
  if (existing?.status === 'accepted') return (<a href="/chat" className="btn-mint text-xs">💬 チャットを開く</a>);
  if (status === 'pending') return (<span className="badge-sunny">⏳ 申請中</span>);
  const submit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false); setOpen(false); setStatus('pending');
  };
  return (
    <div>
      <button onClick={() => setOpen(true)} className="btn-coral text-xs">🤝 1on1チャットを申請</button>
      {open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card-pop max-w-md w-full animate-pop-in">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="font-bold text-lg text-slate-900 mb-1">チャット相談を申請する</h3>
            <p className="text-xs text-slate-500 mb-4">自己紹介と、相談したい内容を簡単に伝えましょう ✨</p>
            <textarea className="input min-h-[120px]" placeholder="例: はじめまして！医療AI領域で起業を考えている学生です。創業初期のチーム作りについて15分ほどお話を伺えませんか？" value={message} onChange={(e) => setMessage(e.target.value)} />
            <div className="flex gap-2 mt-4 justify-end">
              <button className="btn-secondary" onClick={() => setOpen(false)}>やめる</button>
              <button className="btn-coral" disabled={loading || !message.trim()} onClick={submit}>{loading ? '送信中…' : '🚀 申請を送る'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
