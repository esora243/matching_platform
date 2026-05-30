'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { ChatRequest } from '@/types/database';

export default function ChatRequestButton({ obOgId, existing }: { obOgId: string; existing: ChatRequest | null }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (existing?.status === 'pending') {
    return <span className="badge bg-amber-100 text-amber-700">申請中</span>;
  }
  if (existing?.status === 'accepted') {
    return <a href="/chat" className="btn-primary text-xs">チャットを開く</a>;
  }

  const submit = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from('chat_requests')
      .insert({ student_id: user.id, ob_og_id: obOgId, message });
    setLoading(false);
    if (!error) {
      setOpen(false);
      router.refresh();
    } else {
      alert(error.message);
    }
  };

  return (
    <div>
      <button onClick={() => setOpen(true)} className="btn-primary text-xs">
        個別チャット相談を申請
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h3 className="font-semibold mb-3">チャット相談を申請</h3>
            <textarea
              className="input min-h-[100px]"
              placeholder="自己紹介と、相談したい内容を簡単に書いてください"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex gap-2 mt-3 justify-end">
              <button className="btn-secondary" onClick={() => setOpen(false)}>キャンセル</button>
              <button className="btn-primary" disabled={loading} onClick={submit}>
                {loading ? '送信中…' : '申請する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
